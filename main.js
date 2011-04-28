var app = require('express').createServer();
var db = require('./lib/muemenDB.js');

function getClientAddress(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

//Add DUMMY USER
db.addUser({
        userName: "jbennett",
        password: "testing1",
        firstName: "Josh",
        lastName: "Bennett",
        email: "test@j-ben.com"
    });

db.addPage(
    "jbennett",
    //TODO this should be passed the unique hash, based on, ip or host name, and hashed password (stored in session or cookie)?
    "index", 
    '<html><head>{title}</head><body><h1>{title}</h1></body></html>',
    {
        title: "Hello World!",
        description: "This is a test of the muemen system."
    }
);

db.dumpUser("jbennett");

function loadUser(req, res, next) {
  // You would fetch your user from the db
  var user = req.params.user;
  var page = req.params.page;
  var outpage = db.getPage(user, page);
  
  var outputMarkup = outpage.markup;
  var outputContext = outpage.context;
  
  if (user) {
    req.generatedPage = outputMarkup;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.user));
  }
}

app.get('/pages/:user/:page', loadUser, function(req, res){
  res.send(req.generatedPage);
});

app.listen(process.env.C9_PORT);