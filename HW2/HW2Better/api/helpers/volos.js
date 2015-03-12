'use strict';

module.exports = {
  cacheKey: cacheKey, 
  passwordCheck: passwordCheck
};

function cacheKey(req){
  return 'someKey'
}

function passwordCheck(username, password, cb){
  
  var passwordOk = (username === 'william' && password === 'password');
  
  cb(null, passwordOk);
}
