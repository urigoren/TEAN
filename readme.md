TEAN
=======
TEAN is an acronym for Typescript Express Angular NodeJS.
The goal of this code is to be a quickstart project for any NodeJS pioneers.
TEAN's folder structure conventions are a time saver for anyone starting a new NodeJS project.

TEAN takes care of both server-side routing (e.g view, web api) and client-side routing (partial views, angular routes).
The project is meant to lean, bloat-free, and therefore has no DB/auth/templating related code.

Naming convention
---------------------
* The Angular spa name is "app", the app file name is "app.js", and all of the folders referring to it has a "app_" prefix
* The ExpressJS startup file is "server.js", and all ExpressJS/NodeJS foders have the "server_" prefix

Folder Structure
--------------
* server_api/ - routes for ajax request made by angular, resulting with a json object
* server_routes/ -all other routes (usually rendering ejb/jade)
* server_views/ -server generated views
* app_ts/ - typescript files that are a part of the angular app
* public/ - public files
* public/app_views - angular's partial views
* public/app_js - angular's scripts for the app (controllers,services,etc...)
* .d.ts/ - typescript definition files (see: https://github.com/borisyankov/DefinitelyTyped)

HTTP Requests
-------------
* GET requests are handled as to a view.
* POST requests are handled as an API call.

Credits
--------------
Made by Uri Goren