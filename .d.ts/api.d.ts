/// <reference path="angular.d.ts" />
interface i_api {
	sample: {
		echo: (model: any, callback: (data:any)=>void)=>ng.IHttpService;
		add: (model: any, callback: (data:any)=>void)=>ng.IHttpService;
	}
}
