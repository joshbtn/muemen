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

var Post = {
    postedOn: null,
    lastUpdated: null,
    content: "",
    title: "",
    tags: []
}

var DefaultContext = function(){
    title= "",
    description= ""
}

var PageInfo = function(){
    this.url = "";
    this.title = "";
}

/**
 * @class Page
 */
var Page = function(){
        this.url= "";
        this.markup= "";
        this.context= new DefaultContext();
    }
/**
 * @class UserInfo
 */
 
var UserInfo = function(){
    this.userName= "";
    this.password= "";
    this.lastLogin= null;
    this.hash= "";
    this.firstName= "";
    this.lastName= "";
    this.email= "";
}
/**
 * Base object for all users
 */
 
var User = function (){
    this.info= new UserInfo();
    this.pages= {};
    this.globalContext= new DefaultContext();
    this.globalContext.pages = [];
    this.globalContext.posts = [];
    this.globalContext.test = "THIS TEST WORKED";
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

exports.addUser = function(userInfo, globalContext){
    if(typeof db.users[userInfo.userName] !== 'undefined'){
        throw "User already exists! please try another username";
        return;
    }
    
    if(typeof userInfo !== 'object'){
        throw "Expecting userInfo to be an object. Please try another";
        return;
    }
    
    validateUserInfo(userInfo);
    
    db.users[userInfo.userName] = new User();
    
    for(var varName in userInfo){
        if(userInfo.hasOwnProperty(varName)){
            if( db.users[userInfo.userName].info[varName] !== 'undefined' ){
                db.users[userInfo.userName].info[varName] = userInfo[varName];
            }
        }
    }
}
/**
 * Add a page.
 * @param {String} userName Name of the user to create the page for.
 * @param {String} pageName name of the page.
 * @param {String} markup Containing the markup template.
 * @param {Object} context An object containing the context that the markup template will have access too.
 * @api public
 */
 
exports.addPage = function(userName, pageName, markup, context){
    validateNewPage(userName, pageName, markup, context);
    //TODO: validate User Is logged in and hashed up
    var newPage = new Page();
    newPage.markup = markup;
    newPage.context = Object.create(db.users[userName].globalContext);
    //Override globalContext with provided context
    for(var obj in context){
        newPage.context[obj] = context[obj];
    }
    newPage.url = pageName;
    
    db.users[userName].pages[pageName] = newPage;
    
    //Push onto globacontext page array
    var pageInfo = new PageInfo();
    pageInfo.url = pageName;
    pageInfo.title =  newPage.context.title;
    
    db.users[userName].globalContext.pages.push(pageInfo);
}

exports.dump = function(){
    console.log(db);
}

exports.dumpUser = function(name){
    console.log(db.users[name]);
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
/**
 * Check to make sure the userName is valid, and the user exists in the db.
 * @param {String} userName
 */
 
function checkExistingAndValidUser(userName){
    if(!validate.userName(userName)){
        throw "Invalid user name.";
    }
    if(!db.users[userName]){
        throw 'Coult not find user with the name "' + userName + '"';
    }
}

/**
 * Check to make sure the pageName is valid, and the user exists in the db.
 * @param {String} pageName
 */
 
function validateNewPage(userName, pageName, markup, context){
    checkExistingAndValidUser(userName);
    
    if(!validate.pageName(pageName)){
        throw pageName + "is an invalid page name.";
    }
    
    if(db.users[userName].pages[pageName]){
        throw 'Page already exists for "' + pageName + '"';
    }
    
    if(typeof context !== 'object'){
        throw 'The context must be an object not "' + typeof context + '"';
    }
}