var express = require('express')
var sqlite3 = require('sqlite3').verbose()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var session = require('express-session')
var app = express()

var codepath = '/Users/chetan kar/TeleGramStats/'
var dbpath = '/Users/chetan kar/sqlite-tools-win32-x86-3230100/responsesDB'

app.use(morgan('combined'))
app.use(bodyParser.json())

/*
Session
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30},
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
*/

app.get('/', function (req, res) {
  res.sendFile(codepath + 'index.html')
})

app.get('/event', function (req, res) {
  res.sendFile(codepath + 'event.html')
})

app.get('/phonegap', function (req, res) {
  res.sendFile(codepath + 'phonegap.html')
})

app.get('/chart', function (req, res) {
  res.sendFile(codepath + 'chart.html')
})

app.get('/main', function (req, res) {
  res.sendFile(codepath + 'main.js')
})

app.get('/hourgif', function (req, res) {
  res.sendFile(codepath + 'hour.gif')
})

app.get('/img', function (req, res) {
  res.sendFile(codepath + 'images.png')
})

app.get('/script', function (req, res) {
  res.sendFile(codepath + 'script.js')
})
/*
app.post('create-user',function(req,res){
  var db = new sqlite3.Database(dbpath, (err) => {
  db.serialize(function() {
    if (err) {
      return console.error(err.message)
    } 
    var sql = 'INSERT INTO users (username,tokenid) values ($1,$2)'
    db.run(sql, [username,token_id], function (err) {
      if (err) {
        res.status(500).send(err.toString())
      } else {
        console.log("Inserted question!")
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
*/

app.get('/select', function (req, res) {
  var db = new sqlite3.Database(dbpath)

  var sql = 'SELECT count(*) AS YesCount FROM Responses where Response="Yes"'
  db.serialize(function() {

  db.all(sql, (err, rows) => {
    if (err) throw err
    var YesCount = rows[0].YesCount
    var sql1 = 'SELECT count(*) AS NoCount FROM Responses where Response="No"'

    db.all(sql1, (err, rows) => {
      if (err) throw err
      var NoCount = rows[0].NoCount
      res.send(JSON.stringify({YesCount: YesCount, NoCount: NoCount}))
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

app.post('/submitQuestion', function (req, res) {
  var QuestionTxt = req.body.QuestionTxt
  var db = new sqlite3.Database(dbpath, (err) => {
  db.serialize(function() {
    if (err) {
      return console.error(err.message)
    }
    
    db.run("DELETE FROM Questions",function(err) {
    if (err) {
        return console.error(err.message);
      }
        console.log("Deleted data!")
    });
 
    var sql = 'INSERT INTO Questions (Qtxt,ChartType) values ($1,$2)'
    db.run(sql, [QuestionTxt,'bar'], function (err) {
      if (err) {
        res.status(500).send(err.toString())
      } else {
        console.log("Inserted question!")
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

app.post('/submitAnswerYes', function (req, res) {
  var Yes = req.body.Yes
  var db = new sqlite3.Database(dbpath, (err) => {
  db.serialize(function() {
    if (err) {
      return console.error(err.message)
    }
    var sql = 'INSERT INTO Responses (Response) values ($1)'
    db.run(sql, [Yes], function (err) {
      if (err) {
        res.status(500).send(err.toString())
      } else {
        res.send("Great response!")
        console.log("Inserted response!")
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



app.post('/submitAnswerNo', function (req, res) {
  var No = req.body.No
  var db = new sqlite3.Database(dbpath, (err) => {
  db.serialize(function() {
    if (err) {
      return console.error(err.message)
    }
    var sql = 'INSERT INTO Responses (Response) values ($1)'
    db.run(sql, [No], function (err) {
      if (err) {
        res.status(500).send(err.toString())
      } else {
        res.send("Great response!")
        console.log("Inserted response!")
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



app.get('/deleteResponses', function (req, res) {
  var db = new sqlite3.Database(dbpath)
  db.all("Delete from Responses", (err, rows) => {
    if (err) throw err
    res.send("Deleted all responses!")
  })
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
})


app.get('/getQuestions', function (req, res) {
  var db = new sqlite3.Database(dbpath)
  var sql = 'SELECT * FROM Questions'
  db.all(sql, (err, rows) => {
    if (err) throw err
    res.send(rows)
  })
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
});
})

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})