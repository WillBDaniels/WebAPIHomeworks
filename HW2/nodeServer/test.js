var sys = require("sys");
var my_http = require("http");
var url = require("url");
my_http.createServer(function(request, response){
    if(request.url === '/favicon.ico') {
        response.end();
    }else{
		var responseText = "";
		var method = request.method;
		var urlStuff = url.parse(request.url, true);
		switch(method){
			case "GET":
				if (urlStuff.pathname == '/get'){
					responseText = "GET request accepted, information about request: ";
					responseText += "\n" + buildResponeToClient(request);
				}else{
					responseText = "This server URL doesn't accept GET requests, I'm sorry.";
				}
				break;
			case "POST":
				if (urlStuff.pathname == '/post'){
			 		responseText = "I suppose POST requests are ok too...accepted";
			 	}else{
			 		responseText = "This server location doesn't accept POST requests, I'm sorry.";
			 	}
			 	break;
		 	case "PUT":
		 		if (urlStuff.pathname == '/put'){
		 			responseText = "Alright, seriously, who even uses PUT anymore???... Fine. Accepted";
		 		}else{
		 			responseText = "This server location doesn't accept PUT requests, I'm sorry.";
		 		}
		 		break;
		 	case "DELETE":
		 		if (urlStuff.pathname == '/delete'){
		 			responseText = "Ok. I don't know why I'm accepting DELETE, but whatever, accepted.";
		 		}else{
		 			responseText = "This server location doesn't accept DELETE requests, I'm sorry.";
		 		}
		 		break;
		 	default:
		 		responseText = "request rejected. I'm pretty lenient, and even I don't know what to do with this. Rejected.";
		}
		//response.writeHeader(200, {"Content-Type": "text/plain"});
		response.write(responseText);
		response.end();
	}
}).listen(80, function(){
	console.log('the server is listening on port 80');
});

function buildResponeToClient(request){
	var outputString = "";
	outputString += "request headers: " + JSON.stringify(request.headers, null, 4) + "\n";
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	outputString += "queries: " + JSON.stringify(query, null, 4) + (JSON.stringify(query, null, 4) === "{}" ? " It doesn't look like there were any queries! ":"") + "\n";


	return outputString;
}