//TODO figure out a way to allow for pagination in for loops.
//TODO add ability to sup page another page. injeced into the "master" pages context right before it's displayed maybe.
//TODO Add the ability for page to be hidden from display but used as template
//TODO Add ability for multiple "sites"
//TODO add landing page.
//TODO add admin pages.

process.title = "muemenApplication";


var express = require('express');
var app = express.createServer();
var db = require('./lib/muemenDB.js');
var whiskers = require('whiskers');

app.register('.html', require('ejs'));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'html');

app.configure(function(){
    app.use(express.static(__dirname + '/public/includes'));
});

//app.use(express.cookieParser());
//app.use(express.session({ secret: "20111001_j_b_2" }));

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
    '<html><head><title>{title}</title></head><body><h1>{title}</h1><p>{description}</p><ul>{for page in pages}<li><a href="{page.url}">{page.title}</a></li>{/for}</ul></body></html>',
    {
        title: "Hello World!",
        description: "This is a test of the muemen system."
    },
    true
);

db.addPage(
    "jbennett",
    //TODO this should be passed the unique hash, based on, ip or host name, and hashed password (stored in session or cookie)?
    "subpage", 
    '<html><head><title>{title}</title></head><body><h1>{title}</h1><p>{description}</p><ul>{for page in pages}<li><a href="{page.url}">{page.title}</a></li>{/for}</ul></body></html>',
    {
        title: "A really awesome sub page",
        description: "This is how a sub page looks.<br /> although it's not really a sub page, since it's uber aweesoeme!"
    },
    true
);

db.addPage(
    "jbennett",
    //TODO this should be passed the unique hash, based on, ip or host name, and hashed password (stored in session or cookie)?
    "page1", 
    '<html><head><title>{title}</title></head><body><h1>{title}</h1><p>{description}</p><ul>{for page in pages}<li><a href="{page.url}">{page.title}</a></li>{/for}</ul></body></html>',
    {
        title: "Yup another page, aka Page1",
        description: "this page is another page labeld page #1"
    },
    false
);

//-----END OF DUMMY DATA

/*function getClientAddress(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}*/

function loadUserPage(req, res, next) {
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

//USER SITE AREA

app.get('/sites/:user/:page', loadUserPage, function(req, res){
  res.send( whiskers.render(req.output.markup, req.output.context) );
});

app.get('/sites/:user', loadUserPage, function(req, res){
  res.send(req.generatedPage);
});

//SITE PAGES
app.get('/:page', function(req, res){
  res.render(req.params.page, {});
});

//HOME PAGE
app.get('/', function(req, res){
  res.render('index', {  });
});

//LISTEN ON PORT
app.listen(process.env.C9_PORT);