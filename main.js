var app = require('express').createServer();
var db = require('./lib/muemenDB.js');
var whiskers = require('whiskers');

function getClientAddress(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

//-----DUMMY DATA
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
    '<html><head>{title}</head><body><h1>{title}</h1><p>{description}</p></body></html>',
    {
        title: "Hello World!",
        description: "This is a test of the muemen system.",
    }
);

//-----END OF DUMMY DATA

function loadUser(req, res, next) {
  // You would fetch your user from the db
  var user = req.params.user;
  var page = req.params.page || "index";
  var outpage = db.getPage(user, page);
  
  var outputMarkup = outpage.markup;
  var outputContext = outpage.context;
  
  if (user) {
    req.output = {markup: outputMarkup, context:outputContext};
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.user));
  }
}

app.get('/:user/:page', loadUser, function(req, res){
  res.send( whiskers.render(req.output.markup, req.output.context) );
});

app.get('/:user', loadUser, function(req, res){
  res.send(req.generatedPage);
});

app.listen(process.env.C9_PORT);