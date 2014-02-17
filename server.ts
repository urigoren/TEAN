/// <reference path=".d.ts/express.d.ts" />

/*
--------------------------------------------------------------
------------- Module dependencies --------------
-------------------------------------------------------------
*/

var express = require('express');
//var routes = require('./server_routes');
var http = require('http');
var path = require('path');
var fs  =   require("fs");
var exec = require('child_process').exec;

/*
--------------------------------------------------------------
------------- Server Config --------------
-------------------------------------------------------------
*/

var server = express();

// all environments
server.set('port', process.env.PORT || 3000);
server.set('views', path.join(__dirname, 'server_views'));
server.set('view engine', 'ejs');
server.use(express.favicon());
server.use(express.logger('dev'));
server.use(express.json());
server.use(express.urlencoded());
server.use(express.methodOverride());
server.use(server.router);
server.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == server.get('env')) {
  server.use(express.errorHandler());
}
/*
--------------------------------------------------------------
------------- Typescript related --------------
-------------------------------------------------------------
*/
// Move compiled javascript from app_ts to app_js
fs.readdirSync("./app_ts").forEach(function(file) {
        if ((file.indexOf('.js')>=0) && (file!='app.js'))
            fs.renameSync("./app_ts/"+file, "./public/app_js/"+file);
});

/*
--------------------------------------------------------------
------------- Server Pages Routing --------------
-------------------------------------------------------------
*/
fs.readdirSync("./server_routes").forEach(function(file) {
        if (file.indexOf('.js')>=0)
        {
            var route_module=require("./server_routes/" + file);
            var new_route=file.replace('.js','');
            if ('index'==new_route)
                server.get('/', route_module.route);
            else
                server.get('/'+new_route, route_module.route);
        }
});

/*
--------------------------------------------------------------
------------- API function routing --------------
-------------------------------------------------------------
*/
//generate Angular routing
var app_js =(fs.readFileSync("./app_ts/app.js")) +"\n";
    //config router
    app_js+= ("app.config(function ($routeProvider) {")+"\n";
    fs.readdirSync('./public/app_views/').forEach(function(file) {
        var view=file.replace(".html","");
        if ((view=='index')||(view=='default')||(view=='home'))
			app_js+= ("$routeProvider.when('/', {")+"\n";
		else
			app_js+= ("$routeProvider.when('/"+view+"', {")+"\n";
		app_js+= ("templateUrl: 'app_views/"+view+".html',")+"\n";
		app_js+= ("controller: '"+view+"'")+"\n";
		app_js+= ("});")+"\n";
    });
    app_js+= ("$routeProvider.otherwise({ redirectTo: '/' });")+"\n";
    app_js+= ("});")+"\n";

    //config api access service
    var api_d_ts = ('/// <reference path="angular.d.ts" />')+"\n";
    var api_d_ts_callback =': (model: any, callback: (data:any)=>void)=>ng.IHttpService;';
    api_d_ts +=('declare var app:ng.IModule;')+"\n";
    api_d_ts +=('interface i_api {')+"\n"
    app_js +=("app.service( 'api', function($http) {")+"\n";
    fs.readdirSync("./server_api").forEach(function(file) {
        if (file.indexOf('.js')>=0)
        {
            var api_module=require("./server_api/" + file);
            var file_no_js=file.replace('.js','');
            app_js+= ("this."+file_no_js+"={};")+"\n";
            api_d_ts+= "\t"+(file_no_js +': {') + "\n";
            for (var api_func in api_module) {
              if (typeof api_module[api_func] == 'function')
              {
                server.post('/'+file_no_js+'.'+api_func, api_module[api_func]);
                var func=file_no_js+'.'+api_func;
                		app_js+= ("this."+func+"=function (js_data,success_fn) {")+"\n";
				        app_js+= ("return $http({")+"\n";
				        app_js+= ("url: '/"+func+"?rand='+(''+Math.random()).replace('0.',''),")+"\n";
				        app_js+= ("method: \"POST\",")+"\n";
				        app_js+= ("data: json=js_data,")+"\n";
				        app_js+= ("headers: {'Content-Type': 'application/json'}")+"\n";
			            app_js+= ("}).success(function (json) {var data=angular.fromJson(json);success_fn(data);});")+"\n";
			            app_js+= ("};")+"\n";
                        api_d_ts +="\t\t"+(api_func+api_d_ts_callback)+"\n"
              }
            }
            api_d_ts+= "\t"+('}') + "\n";
        }
    });
    app_js+= ("});")+"\n";
    api_d_ts +=('}')+"\n"
    //merge all js files in app_js
    fs.readdirSync("./public/app_js").forEach(function(file) {
        if (file.indexOf('.js')>=0)
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
    if ('development' == server.get('env')) {
        fs.writeFile("./.d.ts/api.d.ts", api_d_ts, function(err) {
        if(err) {
            console.log('api.d.ts: '+err);
        } else {
            console.log("Typescript definition for API access file was succesfully autogenerated");
        }
        });
    }
/*
--------------------------------------------------------------
------------- Start the server --------------
-------------------------------------------------------------
*/

http.createServer(server).listen(server.get('port'), function(){
  console.log('Express server listening on port ' + server.get('port'));
});
