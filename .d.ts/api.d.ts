/// <reference path="angular.d.ts" />
declare var app:ng.IModule;
interface i_api {
	sample: {
		echo: (model: any, callback: (data:any)=>void)=>ng.IHttpService;
		add: (model: any, callback: (data:any)=>void)=>ng.IHttpService;
	}
}
