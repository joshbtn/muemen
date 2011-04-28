var REGEX_USER_NAME = /^[a-zA-Z]+[a-zA-Z0-9_-]{5,16}$/g;

exports.userName = function(userName){
    var isValid = userName ? true : false;
    isValid =  isValid && REGEX_USER_NAME.test(userName);
    return isValid;
}