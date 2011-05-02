//TODO figure out a way to allow for pagination in for loops.
//TODO add ability to sup page another page. injeced into the "master" pages context right before it's displayed maybe.
//TODO Add the ability for page to be hidden from display but used as template
//TODO Add ability for multiple "sites"

process.title = "muemenApplication";

var app = require('express').createServer();
var db = require('./lib/muemenDB.js');
var whiskers = require('whiskers');

/*function getClientAddress(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}*/

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
    '<html><head>{title}</head><body><h1>{title}</h1><p>{description}</p><ul>{for page in pages}<li><a href="{page.url}">{page.title}</a></li>{/for}</ul></body></html>',
    {
        title: "Hello World!",
        description: "This is a test of the muemen system."
    }
);

db.addPage(
    "jbennett",
    //TODO this should be passed the unique hash, based on, ip or host name, and hashed password (stored in session or cookie)?
    "subpage", 
    '<html><head>{title}</head><body><h1>{title}</h1><p>{description}</p><ul>{for page in pages}<li><a href="{page.url}">{page.title}</a></li>{/for}</ul></body></html>',
    {
        title: "A really awesome sub page",
        description: "This is how a sub page looks.<br /> although it's not really a sub page, since it's uber aweesoeme!"
    }
);

db.addPage(
    "jbennett",
    //TODO this should be passed the unique hash, based on, ip or host name, and hashed password (stored in session or cookie)?
    "page1", 
    '<html><head>{title}</head><body><h1>{title}</h1><p>{description}</p><ul>{for page in pages}<li><a href="{page.url}">{page.title}</a></li>{/for}</ul></body></html>',
    {
        title: "Yup another page, aka Page1",
        description: "this page is another page labeld page #1"
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