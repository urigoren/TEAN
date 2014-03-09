/// <reference path=".d.ts/node.d.ts" />
/// <reference path=".d.ts/express.d.ts" />
/*
--------------------------------------------------------------
------------- Module dependencies --------------
-------------------------------------------------------------
*/
var express = require('express');

//import routes = require('./server_routes');
var http = require('http');
var path = require('path');
var fs = require("fs");

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
//if ('development' == server.get('env')) {
server.use(express.errorHandler());

//}
/*

/*
--------------------------------------------------------------
------------- Server Pages Routing --------------
-------------------------------------------------------------
*/
fs.readdirSync("./server_routes").forEach(function (file) {
    if (file.indexOf('.js') >= 0) {
        var route_module = require("./server_routes/" + file);
        var new_route = file.replace('.js', '');
        if ('index' == new_route)
            server.get('/', route_module.route);
else
            server.get('/' + new_route, route_module.route);
    }
});

/*
--------------------------------------------------------------
------------- API function routing --------------
-------------------------------------------------------------
*/
fs.readdirSync("./server_ajax").forEach(function (file) {
    if (file.indexOf('.js') >= 0) {
        var api_module = require("./server_ajax/" + file);
        var file_no_js = file.replace('.js', '');
        for (var api_func in api_module) {
            if (typeof api_module[api_func] == 'function') {
                server.post('/' + file_no_js + '.' + api_func, api_module[api_func]);
            }
        }
    }
});

/*
--------------------------------------------------------------
------------- Start the HTTP server --------------
-------------------------------------------------------------
*/
http.createServer(server).listen(server.get('port'), function () {
    console.log('Express server listening on port ' + server.get('port'));
});

/*
--------------------------------------------------------------
------------- Start the SOCKET IO --------------
-------------------------------------------------------------
*/
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    fs.readdirSync("./server_sockets").forEach(function (file) {
        if (file.indexOf('.js') >= 0) {
            var socket_module = require("./server_sockets/" + file);
            var socket_message = file.replace('.js', '');
            if (socket_message = 'connect')
                socket_module.recieved(socket, {});
            if (typeof socket_module['recieved'] == 'function') {
                socket.on(socket_message, function (data, client_callback) {
                    client_callback(socket_module.recieved(socket, data));
                });
            }
        }
    });
});

