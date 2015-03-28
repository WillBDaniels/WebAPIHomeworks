'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 http://www.w3schools.com/js/js_strict.asp
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var usergrid = require('usergrid');
var client = new usergrid.client({
    URI: 'http://localhost:10010',
    orgName:'wdaniels',
    appName:'HW3',
    authType:usergrid.AUTH_CLIENT_ID,
    clientId: 'iVfJ6zqaPiBO6qldopEGwFeMR3yvGUQq',
    clientSecret: 'cTJPmdqCiZjdn5Gd',
    logging: true, //optional - turn on logging, off by default
});


/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  hello: hello
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function hello(req, res) {
    var GitHubApi = require("github");

    var github = new GitHubApi({
        // required
        version: "3.0.0"
    });

    //github.authenticate({
    //    type: "basic",
    //    username: "shawnmccarthy",
    //    password: "password"
    //});

    var token = "985a204cbce3ff50726717bdfc8f6e9b27525c41 ";

    github.authenticate({
        type: "oauth",
        token: token
    });

    github.user.get({ user: 'shawnmccarthy'} , function(err, res) {
        console.log("GOT ERR?", err);
        console.log("GOT RES?", res);

        github.repos.getAll({}, function(err, res) {
            console.log("GOT ERR?", err);
            console.log("GOT RES?", res);
        });
    });

}


function testGET( ) {
    var options = {
        method:'GET',
        endpoint:'users'
    };
    client.request(options, function (err, data) {
        if (err) {
            console.log('GET failed');
        } else {
            //data will contain raw results from API call
            console.log('GET worked');
            console.log(data);
        }
    });
}

function testGitHub( ) {
    var GitHubApi = require("github");

    var github = new GitHubApi({
        // required
        version: "3.0.0"
    });

    //github.authenticate({
    //    type: "basic",
    //    username: "shawnmccarthy",
    //    password: "password"
    //});

    var token = "985a204cbce3ff50726717bdfc8f6e9b27525c41 ";

    github.authenticate({
        type: "oauth",
        token: token
    });

    github.user.get({ user: 'shawnmccarthy'} , function(err, res) {
        console.log("GOT ERR?", err);
        console.log("GOT RES?", res);

        github.repos.getAll({}, function(err, res) {
            console.log("GOT ERR?", err);
            console.log("GOT RES?", res);
        });
    });
}

function createVault() {
    var vault = require('avault').createVault(__dirname);
    var keyName = 'key1';
    vault.generateKey(keyName).then(
        function (keyResponse) {
            vault.store(keyName, '{"username": "cuuser", "password": "gobuffs", "host": "nsa.rds.amazonaws.com", "database": "prism"}', 'cuvault').then(
                function (storeResponse) {
                    console.log('Ok', storeResponse);
                },
                function (err) {
                    console.log('Error', err);
                });
        },
        function (err) {
            console.log('Error', err);
        });
}

function getVault( ) {
    console.log('test' + __dirname);
    var vault = require('avault').createVault(__dirname);
    vault.get('cuvault', function (profileString) {
        if (!profileString) {
            console.log('Error: required vault not found.');
        } else {
            var profile = JSON.parse(profileString);
            console.log(profile);
        }
    });
}
