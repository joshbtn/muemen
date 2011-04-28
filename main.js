var app = require('express').createServer();

var users = [
    {name: "josh1"},
    {name: "josh2"},
    {name: "josh3"},
    {name: "josh4"},
    {name: "josh5"},
    {name: "josh6"},
    {name: "josh7"},
    {name: "josh8"}
]

function loadUser(req, res, next) {
  // You would fetch your user from the db
  var user = users[req.params.id];
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
}

app.get('/user/:id', loadUser, function(req, res){
  res.send('Viewing user ' + req.user.name);
});

app.listen(process.env.C9_PORT);