/*
* William Daniels
* Web API HW2 node.js server
* This server makes a web endpoint that can respons to a variety of different types of requests, and respond accordingly
* It can currently parse up queries, request type, as well as a general echo of headers sent to the server. 
*/
var sys = require("sys");
var my_http = require("http");
var url = require("url");
var a127 = require('a127-magic');
var express = require('express');

var PORT = process.env.PORT || 8889;

function startExpress(){
	var app = express();
	a127.init(function(config) { 
		app.use(a127.middleware(config));
		app.listen(PORT);
		//printHelp();
		startServer();
	});
}

startExpress();

function startServer(){
	console.log("starting server...");
	my_http.createServer(function(request, response){
    	if(request.url === '/favicon.ico') {
        	response.end();
    	}else{
		var responseText = "";
		var method = request.method;
		var urlStuff = url.parse(request.url, true);
		var deniedRequest = "ERROR: This server location doesn't accept the request you attempted, please try again.";
		switch(method){
			case "GET":
				if (urlStuff.pathname == '/get'){
					responseText = "GET request accepted, information about request: ";
					responseText += "\n" + buildResponeToClient(request);
				}else{
					responseText = deniedRequest;
				}
				break;
			case "POST":
				if (urlStuff.pathname == '/post'){
			 		responseText = "I suppose POST requests are ok too...accepted";
                  	responseText += "\n" + buildResponeToClient(request);
			 	}else{
			 		responseText = deniedRequest;
			 	}
			 	break;
		 	case "PUT":
		 		if (urlStuff.pathname == '/put'){
		 			responseText = "Alright, seriously, who even uses PUT anymore???... Fine. Accepted";
                  	responseText += "\n" + buildResponeToClient(request);
		 		}else{
		 			responseText = deniedRequest;
		 		}
		 		break;
		 	case "DELETE":
		 		if (urlStuff.pathname == '/delete'){
		 			responseText = "Ok. I don't know why I'm accepting DELETE, but whatever, accepted.";
                  	responseText += "\n" + buildResponeToClient(request);
		 		}else{
		 			responseText = deniedRequest;
		 		}
		 		break;
		 	default:
		 		responseText = deniedRequest;
		}
		//response.writeHeader(200, {"Content-Type": "text/plain"});
		response.write(responseText);
		response.end();
	}
	}).listen(8888);
}
function buildResponeToClient(request){
	var outputString = "";
	outputString += "request headers: " + JSON.stringify(request.headers, null, 4) + "\n";
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	outputString += "queries: " + JSON.stringify(query, null, 4) + (JSON.stringify(query, null, 4) === "{}" ? " It doesn't look like there were any queries! ":"") + "\n";


	return outputString;
}
