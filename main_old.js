var app = require('express').createServer();

app.register('.html', require('whiskers_express'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'html');

app.get('/', function(req, res, next){
  res.render('default', {context:
    {title: "Title Here",
     description: "Woot eveything is working great"
    }
  }) ;
});

app.listen(process.env.C9_PORT);