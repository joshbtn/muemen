/*!
 * muemenDB
 * db layer for muemenDB. this is simple in memory storage for now.
 * @Copywrite(c) 2011 Josh Bennett <josh@j-ben.com>
 * MIT Licensed
 */
/**
 * Module imports
 */

var validate = require('./validationRules');
var crypto = require('crypto');

/**
 * Object creation based on http://javascript.crockford.com/prototypal.html
 */
 
var create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
};

var Post = {
    postedOn: null,
    lastUpdated: null,
    content: "",
    title: "",
    tags: []
}

/**
 * Base Context, all context will inherit from here.
 */
var BaseContext = {
    title: "",
    description: "",
    posts: []
}

/**
 * Base object for all pages
 */
var Page = {
        url: "",
        markup: "",
        context: Object.create(BaseContext)
    }
/**
 * Base object for all user info
 */
 
var UserInfo = {
        userName: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    }
/**
 * Base object for all users
 */
 
var User = {
    info: Object.create(UserInfo),
    pages: Object.create(Page)
}
/**
 * In mem storage
 */
 
var db = {
    users: {},
}

/**
 * @param {String} userName
 * @return {Object}
 * @api public
 */

exports.getPage = function(userName, pageName){
    
    if(!db.users[userName]){
        throw 'User "' + userName + '" not found.';
        return;
    }
    
    if(!db.users[userName].pages[pageName]){
        throw 'Page "' + pageName + '" not found.';
        return;
    }
    
    var page = db.users[userName].pages[pageName];
    
    return {markup:page.markup, context:page.context}
}
/**
 * Add a new user. Expects to see
 *  userInfo = {
 *       userName: "",
 *       password: "",
 *       firstName: "",
 *       lastName: "",
 *       email: ""
 *   }
 * @param {Object} userInfo
 * @return {Object}
 * @api public
 */

exports.addUser = function(userInfo){
    console.log(userInfo);
    if(typeof db.users[userInfo.userName] !== 'undefined'){
        throw "User already exists! please try another username";
        return;
    }
    
    if(typeof userInfo !== 'object'){
        throw "Expecting userInfo to be an object. Please try another";
        return;
    }
    
    validateUserInfo(userInfo);
    
    db.users[userInfo.userName] = Object.create(UserInfo);
    
    for(var varName in userInfo){
        if(userInfo.hasOwnProperty(varName)){
            if( typeof UserInfo[varName] !== 'undefined' ){
                db.users[userInfo.userName][varName] = userInfo[varName];
            }
        }
    }
}
/**
 * 
 */
exports.addPage = function(userInfo, passwordHash){
    
}

/**
 * Run user info validation. This throws an error if there were any problems.
 */
function validateUserInfo(userInfo){
    var userName = userInfo.userName;
    var validUserName = validate.userName(userInfo.userName);
    if(!validUserName){
        throw "Invalid user name. User names must start with a letter, and may only contain alphanumeric characters including _ and -.";
        return;
    }
}