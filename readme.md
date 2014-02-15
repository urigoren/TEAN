TEAN
=======
TEAN is an acronym for Typescript Express Angular NodeJS.
The goal of this code is to be a quickstart project for any NodeJS pioneers.
TEAN's folder structure conventions are a time saver for anyone starting a new NodeJS project.

TEAN takes care of both server-side routing (e.g view, web api) and client-side routing (partial views, angular routes).
The project is meant to lean, bloat-free, and therefore has no DB/auth/templating related code.

Folder Structure
--------------
* routes/ -routes resulting in an html document
* views/ -server generated views
* api/ - routes for ajax request made by angular, resulting with a json object
* public/app_view - angular's partial views
* public/app_js - angular's scripts (controllers,services,etc...)
* .d.ts/ - typescript definition files (see: https://github.com/borisyankov/DefinitelyTyped)

HTTP Requests
-------------
* GET requests are handled as to a view.
* POST requests are handled as an API call.

Credits
--------------
Made by Uri Goren