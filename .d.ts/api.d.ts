interface i_api_request {model: any; callback: (data:any)=>void;}
interface i_api {
	sample: {
		echo: i_api_request;
		add: i_api_request;
	}
}
