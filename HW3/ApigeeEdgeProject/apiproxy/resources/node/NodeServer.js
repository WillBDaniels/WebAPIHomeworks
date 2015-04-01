/*
* William Daniels
* Web API HW3 node.js server
* This server makes a web endpoint that can respons to a variety of different types of requests, and respond accordingly
* It can currently parse up queries, request type, as well as a general echo of headers sent to the server. 
*/
var sys = require("sys");
var my_http = require("http");
var url = require("url");
var callback;
var responseSomething;

my_http.createServer(function(request, response){
	//Chrome likes to send two requests every time, one looking for the favicon. I don't want to waste cycles on a favicon, so I check for
	//this specific case. 
    if(request.url === '/favicon.ico') {
        response.end();
    }else{
		var responseText = "";
		var method = request.method;
		var urlStuff = url.parse(request.url, true);
		var deniedRequest = "ERROR: This server location doesn't accept the request you attempted, please try again.";
      var cb = function(err, data, response2){
      	response2.write(data.toString());  
        response2.end();
      };
      callback = cb;
		switch(method){
			case "GET":
				if (urlStuff.pathname == '/get'){
					responseText = "GET request accepted, information about request: ";
					responseText += "\n" + buildResponeToClient(request);
                }else if (urlStuff.pathname == '/github'){ 
                    
                  	testGitHub(request, cb, response);
                  return;
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
		};
		response.write(responseText);
		response.end();
	};
}).listen(80, function(){
	console.log('the server is listening on port 80');
});

function innerCallback(body){
  callback(null, body, responseSomething);
};

function testGitHub(request, cb, response2) {
  responseSomething = response2;
  var requestNew = require('request');

  console.log("here! In the github request");
  returnText = "";
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  
  console.log("this was the request we got: " + query.request);
  if (JSON.stringify(query, null, 4) === "{}"){
    response2.write("I'm sorry, no request found, please add a query parameter such as: ?request=/users/willbdaniels/repos in order to access the data, below you will find (from github) a number of different types fo requests you can make. Thank you.\n");
  }

  
  var headers = {
    'user-agent':  'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'
  };
  
  var options = {
    headers: headers,
    'url': 'https://api.github.com' + (JSON.stringify(query, null, 4)=== "{}" ? "" : query.request)
  };
  requestNew(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // from within the callback, write data to response, essentially returning it.
      innerCallback(body, cb)
    }
  })
    
 
  
};

function buildResponeToClient(request){
	var outputString = "";
	outputString += "request headers: " + JSON.stringify(request.headers, null, 4) + "\n";
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
	outputString += "queries: " + JSON.stringify(query, null, 4) + (JSON.stringify(query, null, 4) === "{}" ? " It doesn't look like there were any queries! ":"") + "\n";


	return outputString;
};