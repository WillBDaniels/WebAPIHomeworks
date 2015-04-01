/*
 * William Daniels
 * Web API HW3 node.js server
 * This server makes a web endpoint that can respons to a variety of different types of requests, and respond accordingly
 * It can currently parse up queries, request type, as well as a general echo of headers sent to the server. 
 */
var sys = require("sys");
var my_http = require("http");
var url = require("url");
var usergrid = require("usergrid");
var client = new usergrid.client({
    orgName: 'wdaniels',
    appName: 'hw4movies',
    authType: usergrid.AUTH_CLIENT_ID,
    clientId: 'b3U6VlMSqrehEeSNpF3UKt4xCg',
    clientSecret: 'b3U62VBLBLr0UZV-MUvBjE2bIRdqTr8',
    logging: true, //optional - turn on logging, off by default
});
var callback;
var responseSomething;
var currentQueryString;


my_http.createServer(function(request, response) {
    //Chrome likes to send two requests every time, one looking for the favicon. I don't want to waste cycles on a favicon, so I check for
    //this specific case. 
    if (request.url === '/favicon.ico') {
        response.end();
    } else {
        var responseText = "";
        var method = request.method;
        var urlStuff = url.parse(request.url, true);
        var deniedRequest = "ERROR: This server location doesn't accept the request you attempted, please try again.";
        var cb = function(err, data, response2) {
            response2.write(data.toString());
            response2.end();
        };
        callback = cb;
        switch (method) {
            case "GET":
                if (urlStuff.pathname == '/get') {
                    responseText = "GET request accepted, information about request: ";
                    responseText += "\n" + buildResponeToClient(request);
                } else if (urlStuff.pathname == '/github') {

                    testGitHub(request, cb, response);
                    return;
                } else if (urlStuff.pathname == '/getMovie') {
                    getMovie(request, cb, response);
                    return;
                } else {
                    responseText = deniedRequest;
                }
                break;
            case "POST":
                if (urlStuff.pathname == '/post') {
                    responseText = "I suppose POST requests are ok too...accepted";
                    responseText += "\n" + buildResponeToClient(request);
                } else if (urlStuff.pathname == '/createMovie') {
                    createMovie(request, cb, response);
                    return;
                } else {
                    responseText = deniedRequest;
                }
                break;
            case "PUT":
                if (urlStuff.pathname == '/put') {
                    responseText = "Alright, seriously, who even uses PUT anymore???... Fine. Accepted";
                    responseText += "\n" + buildResponeToClient(request);
                } else {
                    responseText = deniedRequest;
                }
                break;
            case "DELETE":
                if (urlStuff.pathname == '/delete') {
                    responseText = "Ok. I don't know why I'm accepting DELETE, but whatever, accepted.";
                    responseText += "\n" + buildResponeToClient(request);
                } else if (urlStuff.pathname == '/deleteMovie') {
                    deleteMovie(request, cb, response);
                    return;
                } else {
                    responseText = deniedRequest;
                }
                break;
            default:
                responseText = deniedRequest;
        };
        response.write(responseText);
        response.end();
    };
}).listen(80, function() {
    console.log('the server is listening on port 80');
});

function innerCallback(body) {
    callback(null, body, responseSomething);
};


function createMovie(request, cb, response2) {
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    currentQueryString = query;
    responseSomething = response2;
    if (typeof query.title === 'undefined') {
        innerCallback("I'm sorry, you must specify a title to create", cb);
        return;
    }
    if (typeof query.actor1 === 'undefined' || typeof query.actor2 === 'undefined' || typeof query.actor3 === 'undefined') {
        innerCallback("I'm sorry, you must specify 3 actors in order to create", cb);
    }

    queryString = "select * where Title='" + query.title + "'";

    var options = {
        qs: {
            ql: queryString
        },
        method: 'GET',
        endpoint: 'movies'
    };
    client.request(options, function(err, data) {
        if (err) {
            innerCallback("There was an error trying to create the movie, sorry.", cb); //error - GET failed
        } else {
            console.log("I'm here.. currentQueryString: " + currentQueryString.title);
            console.log("this is the count: " + data.count);
            if (data.count != 0) {
                innerCallback("This movie already exists in the database! Please try again.", cb); //Movie already exists.. we don't care about this!
            } else {
                var optionsInner = {
                    method: 'POST',
                    endpoint: 'movies/',
                    body: {
                        title: currentQueryString.title,
                        date: currentQueryString.date,
                        actors: [{
                            name: currentQueryString.actor1
                        }, {
                            name: currentQueryString.actor2
                        }, {
                            name: currentQueryString.actor3
                        }]
                    }
                };
                client.request(optionsInner, function(err, data2) {
                    console.log("I'm in the post of getMovie");
                    if (err) {
                        innerCallback("There was an error: " + err, cb); //error - GET failed
                    } else {
                        innerCallback("Create successful: \n" + JSON.stringify(data2, null, 4), cb);
                    }
                });
            }
        }
    });

}


function getMovie(request, cb, response2) {
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;

    responseSomething = response2;
    var queryString = "select *";
    if (typeof query.title != 'undefined') {
        var JSONObject = query;
        var i = 0;
        for (var key in JSONObject) {
            if (i === 0) {
                queryString += " where title='" + JSONObject[key] + "'";
            } else {
                if (JSONObject.hasOwnProperty(key)) {
                    queryString = queryString + " or title='" + JSONObject[key] + "'";
                }
            }

            i++;
        }
    }
    var options = {
        qs: {
            ql: queryString
        },
        method: 'GET',
        endpoint: 'movies'
    };
    client.request(options, function(err, data) {
        console.log("I'm in the get of getMovie");
        if (err) {
            innerCallback("There was an error: " + err, cb); //error - GET failed
        } else {
            innerCallback("Here is the requested data: \n" + JSON.stringify(data, null, 4), cb);
        }
    });
}


function deleteMovie(request, cb, response2) {
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    currentQueryString = query;
    responseSomething = response2;
    if (typeof query.title === 'undefined') {
        innerCallback("I'm sorry, you must specify a title to delete", cb);
        return;
    }

    queryString = "select * where Title='" + query.title + "'";

    var options = {
        qs: {
            ql: queryString
        },
        method: 'GET',
        endpoint: 'movies'
    };
    client.request(options, function(err, data) {
        if (err) {
            innerCallback("There was an error trying to delete the movie, sorry.", cb); //error - GET failed
        } else {
            console.log("I'm here.. currentQueryString: " + currentQueryString.title);
            console.log("this is the count: " + data.count);
            if (data.count == 0) {
                innerCallback("This movie doesn't exist in the database! Please try again.", cb); //Movie already exists.. we don't care about this!
            } else {
                var optionsInner = {
                    method: 'DELETE',
                    endpoint: 'movies/' + data.entities[0].uuid,
                };
                client.request(optionsInner, function(err, data2) {
                    console.log("I'm in the post of getMovie");
                    if (err) {
                        innerCallback("There was an error: " + err, cb); //error - GET failed
                    } else {
                        innerCallback("Delete successful: \n" + JSON.stringify(data2, null, 4), cb);
                    }
                });
            }
        }
    });
}

function testGitHub(request, cb, response2) {
    responseSomething = response2;
    var requestNew = require('request');

    console.log("here! In the github request");
    returnText = "";
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;

    console.log("this was the request we got: " + query.request);
    if (JSON.stringify(query, null, 4) === "{}") {
        response2.write("I'm sorry, no request found, please add a query parameter such as: ?request=/users/willbdaniels/repos in order to access the data, below you will find (from github) a number of different types fo requests you can make. Thank you.\n");
    }


    var headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'
    };

    var options = {
        headers: headers,
        'url': 'https://api.github.com' + (JSON.stringify(query, null, 4) === "{}" ? "" : query.request)
    };
    requestNew(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // from within the callback, write data to response, essentially returning it.
            innerCallback(body, cb)
        }
    })



};

function buildResponeToClient(request) {
    var outputString = "";
    outputString += "request headers: " + JSON.stringify(request.headers, null, 4) + "\n";
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    outputString += "queries: " + JSON.stringify(query, null, 4) + (JSON.stringify(query, null, 4) === "{}" ? " It doesn't look like there were any queries! " : "") + "\n";


    return outputString;
};