var REGEX_USER_NAME = /^[A-Za-z][a-zA-Z0-9]{5,16}$/;
var REGEX_PAGE_NAME = /^[A-Za-z][a-zA-Z0-9_\.]{1,255}$/;
exports.userName = function(userName){
    var isValid = userName ? true : false;
    isValid =  isValid && REGEX_USER_NAME.test(userName);
    return isValid;
}

exports.pageName = function(pageName){
    var isValid = pageName ? true : false;
    isValid =  isValid && REGEX_PAGE_NAME.test(pageName);
    return isValid;
}