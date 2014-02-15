/// <reference path="d.ts/express.d.ts" />
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs=require("fs");
var exec = require('child_process').exec;

var server = express();

// all environments
server.set('port', process.env.PORT || 3000);
server.set('views', path.join(__dirname, 'views'));
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

//ejb routes
server.get('/', routes.index);

//generate Angular routing
var app_js =("var app = angular.module('app',['ngRoute']);")+"\n";
    //config router
    app_js+= ("app.config(function ($routeProvider) {")+"\n";
    var files=fs.readdirSync('./public/app_views/');
    for (var i=0;i<files.length;i++)
    {
        var view=files[i].replace(".html","");
        if ((view=='index')||(view=='default')||(view=='home'))
			app_js+= ("$routeProvider.when('/', {")+"\n";
		else
			app_js+= ("$routeProvider.when('/"+view+"', {")+"\n";
		app_js+= ("templateUrl: 'app_views/"+view+".html',")+"\n";
		app_js+= ("controller: '"+view+"'")+"\n";
		app_js+= ("});")+"\n";
    }
    app_js+= ("$routeProvider.otherwise({ redirectTo: '/' });")+"\n";
    app_js+= ("});")+"\n";

    //config api access service
    app_js +=("app.service( 'api', function($http) {")+"\n";
    fs.readdirSync("./api").forEach(function(file) {
        if (file.indexOf('.js')>=0)
        {
            var mod=require("./api/" + file);
            var file_no_js=file.replace('.js','');
            app_js+= ("this."+file_no_js+"='';")+"\n";
            for (var f in mod) {
              if (typeof mod[f] == 'function')
              {
                server.get('/'+file_no_js+'.'+f, mod[f]);
                var func=file_no_js+'.'+f;
                		app_js+= ("this."+func+"=function (js_data,success_fn) {")+"\n";
				        app_js+= ("$http({")+"\n";
				        app_js+= ("url: '/"+func+"',")+"\n";
				        app_js+= ("method: \"POST\",")+"\n";
				        app_js+= ("data: json=js_data,")+"\n";
				        app_js+= ("headers: {'Content-Type': 'application/json'}")+"\n";
			            app_js+= ("}).success(function (json) {var data=angular.fromJson(json);success_fn(data);});")+"\n";
			            app_js+= ("};")+"\n";
              }
            }
        }
    });
    app_js+= ("});");
    fs.writeFile("./public/app.js", app_js, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Angular's app.js was created!");
    }
    }); 


    //Start the server
http.createServer(server).listen(server.get('port'), function(){
  console.log('Express server listening on port ' + server.get('port'));
});
