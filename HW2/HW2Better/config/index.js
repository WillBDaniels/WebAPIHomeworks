'use strict';

var secrets = require('./secrets');
exports.apigee = secrets.apigee;


var Management = require('volos-management-apigee');
var OAuth = require('volos-oauth-apigee');

exports.volos = {
  Management: Management,
  OAuth: OAuth
};

exports.devRequest = {
  firstName: 'William',
  lastName: 'Daniels',
  email: 'willbdaniels@gmail.com',
  userName: 'willbdaniels@gmail.com'
};

exports.appRequest = {
  name: 'HW2 Better'
};
