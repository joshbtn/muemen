/*!
 * muemenDB
 * db layer for muemenDB. this is simple in memory storage for now.
 * @Copywrite(c) 2011 Josh Bennett <josh@j-ben.com>
 * MIT Licensed
 */
 
var create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
};

/**
 * Base object for all pages
 */
var Page = {
        url: "",
        context: {
            title: "",
            description: "",
        }
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

var User = {
    info: Object.create(UserInfo),
    pages: Object.create(Pages)
}

var db = {
    users = {}
}

/**
 * @param {String} userName
 * @return {Object}
 * @api public
 */
 
exports.getUserSite = function(user){
}

exports.addUser(