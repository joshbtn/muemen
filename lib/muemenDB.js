if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

jbennett.info.email
jbennett.pages.index.context

function UserInfo = new function(){
    
}

var Pages = {
    index: {
        url: {"/index.html"}
        context: {}
    }
}

var User = {
    info: {
        userName: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    }
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