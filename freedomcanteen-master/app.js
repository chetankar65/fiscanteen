var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var md5 = require('md5')
var date = require('date-and-time');
var Pool = require('pg').Pool
//Node mailer to send emails!
var port = process.env.PORT||3000;
var app = express()

app.use(session({
  secret: 'someRandomSecretValue',
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

var config = {
    user: process.env.user,
    database: process.env.database,
    host: process.env.host,
    port: '5432',
    password: process.env.password,
    ssl:true
}

var pool = new Pool(config);
app.use(bodyParser.json())

app.get('/', function (req, res) {
  if (req.session && req.session.auth && req.session.auth.userid){
    res.sendFile(__dirname + '/index.html');
  } else {
    res.sendFile(__dirname + '/user.html');
  }
})
app.get('/logo', function (req, res) {
  res.sendFile(__dirname + '/logo.png');
})
app.get('/register', function (req, res) {
  res.sendFile(__dirname + '/register.html');
})
app.get('/userlogin', function (req, res) {
  res.sendFile(__dirname + '/user.html');
})
app.get('/adminlogin', function (req, res) {
  res.sendFile(__dirname + '/admin.html');
})

app.get('/2TJB9WCqhOp3kl3wdbbZ43FBno2VDeydujRWRMlAO391dfvFZW5esRd2', function (req, res) {
  res.sendFile(__dirname + '/dashboard.html');
})

app.get('/currentuser', function (req, res){
  res.send(req.session.auth.userid)
})
//Get Items
app.get('/getItems',function (req,res){
  var sql = 'SELECT * FROM items'
  pool.query(sql,[],function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.send(result.rows)
    }
  })
})

app.post('/create-user', function (req, res) {
  var username = req.body.username
  var password = md5(req.body.password)
  var sql = 'INSERT INTO users (username,password) values ($1,$2)'

  pool.query(sql,[username,password],function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.send("Worked!")
    }
  })
})

app.post('/login', function (req, res) {
  var username = req.body.username
  var password = md5(req.body.password)
   
   pool.query('SELECT * FROM users WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              if (password === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].username};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

//Submit Items here
app.post('/submit-item', function (req, res) {
  var name = req.body.name
  var price = req.body.price
  var url = req.body.url
  var sql = 'INSERT INTO items (cost,name,path) values ($1,$2,$3)'
  pool.query(sql,[name,price,url],function (err, result) {
    if (err) {
      res.send(err)
    } else {
      res.send("Worked!")
    }
  })
})

//Add menu here
app.post('/add-menu', function (req, res) {
  var selectproducts = req.body.selectproducts
  var Quantity = req.body.Quantity
  var now = new Date()
  var loggedDate = date.format(now, 'YYYY/MM/DD HH:mm:ss')
  var db = new sqlite3.Database(dbpath, (err) => {
  var select = 'SELECT * from items where name = $1'
  db.all(select,[selectproducts],(err, rows) => {
    if (err) throw err
    cost = rows[0].cost
    ///console.log(cost)
    var sql = 'INSERT INTO Orders (username,product,quantity,cost,date) values ($1,$2,$3,$4,$5)'
    db.run(sql, [req.session.auth.userid,selectproducts,Quantity,cost,loggedDate], function (err) {
      if (err) {
        res.status(500).send(err.toString())
        console.log(err)
      } else {
        console.log("Added")
        res.send("Added to menu!")
      }
    })
    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
          console.log('Close the database connection.');
      });
    })
  })
})
//Delete item
app.post('/delete-item', function (req, res) {
  var display = req.body.display
  var db = new sqlite3.Database(dbpath, (err) => {
  var sql = 'Delete from items where name = $1'
  db.run(sql, [display], function (err) {
    if (err) {
      res.status(500).send(err.toString())
    } else {
      res.send("Deleted this item!")
      //console.log("Inserted response!")
    }
  })
  db.close((err) => {
      if (err) {
        console.error(err.message);
      }
        console.log('Close the database connection.');
    });
  })
})
//Get Orders
app.get('/getOrders',function (req,res){
  var db = new sqlite3.Database(dbpath)
  var sql = 'SELECT * FROM Orders'
  db.all(sql,[],(err, rows) => {
    if (err) throw err
    res.send(rows)
  })
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
      console.log('Close the database connection.');
  })
})
//Check your own menu
app.get('/user-orders', function (req,res){
  var db = new sqlite3.Database(dbpath)
  var sql = 'SELECT * FROM Orders where username = $1'
  db.all(sql,[req.session.auth.userid],(err, rows) => {
    if (err) throw err
    res.send(rows)
  })
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
      console.log('Close the database connection.');
  })
})
//Order taken care of
//Delete all
app.post('/checkout', function (req, res) {
  var checkout = req.body.checkout
  var db = new sqlite3.Database(dbpath, (err) => {
  var sql = 'Delete from orders where id=$1'
  db.run(sql, [checkout], function (err) {
    if (err) {
      res.status(500).send(err.toString())
    } else {
      res.send("Deleted order!")
      //console.log("Inserted response!")
    }
  })
  db.close((err) => {
      if (err) {
        console.error(err.message);
      }
        console.log('Close the database connection.');
    });
  })
})
//Delete all
app.post('/delete-all', function (req, res) {
  var display = req.body.display
  var db = new sqlite3.Database(dbpath, (err) => {
  var sql = 'Delete from orders'
  db.run(sql, [display], function (err) {
    if (err) {
      res.status(500).send(err.toString())
    } else {
      res.send("Deleted orders!")
      //console.log("Inserted response!")
    }
  })
  db.close((err) => {
      if (err) {
        console.error(err.message);
      }
        console.log('Close the database connection.');
    });
  })
})

//server run here
app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});