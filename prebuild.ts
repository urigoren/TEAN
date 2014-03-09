/// <reference path=".d.ts/node.d.ts" />
import fs  =   require("fs");

/*--------------------------------------------------------------
------------- Typescript related --------------
-------------------------------------------------------------
*/
// Move compiled javascript from app_ts to app_js
fs.readdirSync("./app_ts").forEach(function(file) {
        if (file.indexOf('.js')>=0)
            fs.renameSync("./app_ts/"+file, "./public/app_js/"+file);
});

/*
--------------------------------------------------------------
------------- API function routing --------------
-------------------------------------------------------------
*/
//generate Angular routing
var routes_js = '';
    //config router
    routes_js+= ("app.config(function ($routeProvider) {")+"\n";
    fs.readdirSync('./public/app_views/').forEach(function(file) {
        var view=file.replace(".html","");
        if ((view=='index')||(view=='default')||(view=='home'))
			routes_js+= ("$routeProvider.when('/', {")+"\n";
		else
			routes_js+= ("$routeProvider.when('/"+view+"', {")+"\n";
		routes_js+= ("templateUrl: 'app_views/"+view+".html',")+"\n";
		routes_js+= ("controller: '"+view+"'")+"\n";
		routes_js+= ("});")+"\n";
    });
    routes_js+= ("$routeProvider.otherwise({ redirectTo: '/' });")+"\n";
    routes_js+= ("});")+"\n";

    //config api access service
    var api_d_ts = ('/// <reference path="angular.d.ts" />')+"\n";
    var api_d_ts_callback =': (model: any, callback: (data:any)=>void)=>ng.IHttpService;';
    api_d_ts +=('declare var app:ng.IModule;')+"\n";
    api_d_ts +=('interface i_api {')+"\n"
    routes_js +=("app.service( 'api', function($http) {")+"\n";
    fs.readdirSync("./server_ajax").forEach(function(file) {
        if (file.indexOf('.js')>=0)
        {
            var api_module=require("./server_ajax/" + file);
            var file_no_js=file.replace('.js','');
            routes_js+= ("this."+file_no_js+"={};")+"\n";
            api_d_ts+= "\t"+(file_no_js +': {') + "\n";
            for (var api_func in api_module) {
              if (typeof api_module[api_func] == 'function')
              {
                var func=file_no_js+'.'+api_func;
                		routes_js+= ("this."+func+"=function (js_data,success_fn) {")+"\n";
				        routes_js+= ("return $http({")+"\n";
				        routes_js+= ("url: '/"+func+"?rand='+(''+Math.random()).replace('0.',''),")+"\n";
				        routes_js+= ("method: \"POST\",")+"\n";
				        routes_js+= ("data: json=js_data,")+"\n";
				        routes_js+= ("headers: {'Content-Type': 'application/json'}")+"\n";
			            routes_js+= ("}).success(function (json) {var data=angular.fromJson(json);success_fn(data);});")+"\n";
			            routes_js+= ("};")+"\n";
                        api_d_ts +="\t\t"+(api_func+api_d_ts_callback)+"\n"
              }
            }
            api_d_ts+= "\t"+('}') + "\n";
        }
    });
    routes_js+= ("});")+"\n";
    api_d_ts +=('}')+"\n"

    //Write routes.js
    fs.writeFile("./public/app_js/routes.js", routes_js, function(err) {
    if(err) {
        console.log('routes.js: '+err);
    } else {
        console.log("Angular's routing was created!");
    }
    });
//------------------------------SOCKETS IO---------------------------------------//
var sockets_js =("app.service( 'socket', function($rootScope) {")+"\n";
sockets_js+= ("var socket=io.connect();") +"\n";

sockets_js+= ("this.on= function (eventName, callback) {")+"\n";
sockets_js+= ("socket.on(eventName, function () {  ")+"\n";
sockets_js+= ("var args = arguments;")+"\n";
sockets_js+= ("$rootScope.$apply(function () {")+"\n";
sockets_js+= ("callback.apply(socket, args);")+"\n";
sockets_js+= ("});")+"\n";
sockets_js+= ("});")+"\n";

sockets_js+= ("socket.emit(eventName, data, function () {")+"\n";
sockets_js+= ("var args = arguments;")+"\n";
sockets_js+= ("$rootScope.$apply(function () {")+"\n";
sockets_js+= ("if (callback) {")+"\n";
sockets_js+= ("callback.apply(socket, args);")+"\n";
sockets_js+= ("}")+"\n";
sockets_js+= ("});")+"\n";
sockets_js+= ("})")+"\n";


    fs.readdirSync("./server_sockets").forEach(function(file) {
            if (file.indexOf('.js')>=0)
            {
                var socket_module=require("./server_sockets/" + file);
                var socket_message=file.replace('.js','');
                //TODO: write per message functions
                sockets_js+= ("this."+socket_message+"=function (msg,callback) {socket.emit('"+socket_message+"',msg,callback);};") +"\n";
            }
    });
sockets_js+= ("});")+"\n";
    //Write sockets.js
    fs.writeFile("./public/app_js/sockets.js", sockets_js, function(err) {
    if(err) {
        console.log('sockets.js: '+err);
    } else {
        console.log("Angular's sockets service was created!");
    }
    });
//---------------------------WRITE FILES------------------------------------------//
    //merge all js files in app_js
    var app_js =(fs.readFileSync("./public/app_js/app.js")) +"\n";
    app_js +=(fs.readFileSync("./public/app_js/routes.js")) +"\n";
    app_js += (routes_js) +"\n";
    app_js += (sockets_js) +"\n";
    fs.readdirSync("./public/app_js").forEach(function(file) {
        if ((file.indexOf('.js')>=0)&&(file!='app.js')&&(file!='routes.js'))
        {
            app_js+= (fs.readFileSync("./public/app_js/"+file)) +"\n";
        }
    });
    //write app.js
    fs.writeFile("./public/app.js", app_js, function(err) {
    if(err) {
        console.log('app.js: '+err);
    } else {
        console.log("Angular's app.js was created!");
    }
    });

    //write api.d.ts
    fs.writeFile("./.d.ts/api.d.ts", api_d_ts, function(err) {
    if(err) {
        console.log('api.d.ts: '+err);
    } else {
        console.log("Typescript definition for API access file was succesfully autogenerated");
    }
    });