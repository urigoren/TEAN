/// <reference path="angular.d.ts" />
interface i_api_request {model: any; callback: (data:any)=>ng.IHttpService;}
interface i_api {
	sample: {
		echo: i_api_request;
		add: i_api_request;
	}
}
