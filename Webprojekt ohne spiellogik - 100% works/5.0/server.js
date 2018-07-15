
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var bodyParser = require('body-parser');
var path = require("path");
var urlencodedParser = bodyParser.urlencoded({extended : false});
var fs = require('fs');
conf = require('./config.json');
server.listen(conf.port);

var highscoreslist = require('./highscores.json');
var currentID=1;
var filedata= new Array();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/' ,function(req,res){
  res.render('home',{qs : req.query});
})

app.get('/wortview' ,function(req,res){
  res.render('wortview',{qs : req.query});
})

app.get('/highscores' ,function(req,res){
  res.render('highscores',{qs : highscoreslist});
})

app.get('/skribll' ,function(req,res){
  res.render('skribll',{qs : req.query});
})

app.get('/home' ,function(req,res){
  res.render('home',{qs : req.query});
})

app.post('/wortview',urlencodedParser,function(req,res){
    const file = "words.json";
    fs.readFile(file, (err, data) => {
    if (err && err.code === "ENOENT") {
        return fs.writeFile(file, JSON.stringify([obj]), error => console.error);
    }
    else {
        try {
            var wordName=req.body.Wort;
            currentID++;

            filedata.push({
                        id: currentID,
                        name: wordName
              });


            return fs.writeFile(file, JSON.stringify(filedata), error => console.error)
        } catch(exception) {
            console.error(exception);
        }
        finally{
          res.render('wortview-sccess',{data : req.body});
        }
    }
});
})

var line_history = [];
let wordsList = [];
let highscoreTable=[{name : "default" , Score : 0}];
let score=5;

io.on('connection', function (socket) {

    fs.readFile('words.json', (err, data) => {  
        if (err) throw err;
        wordsList = JSON.parse(data);
        })

  socket.emit('chat', { zeit: new Date(), text: 'Du bist jetzt mit dem Server verbunden!' });
  var gef=false;
  socket.on('chat', function (data) {
  io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });

    for (var i = wordsList.length - 1; i >= 0; i--) {
    if(wordsList[i].name==data.text){
      io.sockets.emit('winner', { name: data.name , text: 'hat richtig gertaen !' , word : wordsList[i].name });
      
      for (var j = highscoreslist.length - 1; j >= 0; j--) {
      if(highscoreslist[j].name==data.name){gef=true;break;}
      else {gef = false;}
      }
      if(gef==true){console.log("gefunden");highscoreslist[j].Score+=5;}
      if(gef==false){console.log("nicht gefunden");highscoreslist.push({name : data.name , Score : score});}

      

      	ListSort = function (a,b) {
    	return b.Score - a.Score ;
		};

		highscoreslist.sort(ListSort);

      console.log(highscoreslist);
      fs.writeFile('highscores.json', JSON.stringify(highscoreslist), error => console.error);

    }};

  });


    socket.on('typingmsg', function (data) {
   		 io.sockets.emit('typingmsg', { name: data.name , text: "  tippt gerade" });
   		 socket.on('notypingmsg', function (data) {
   		 io.sockets.emit('clearttp', {});
 		 });
  });


  for (var i in line_history) {
   socket.emit('draw_line', { line: line_history[i] } );
  }
  socket.on('draw_line', function (data) {
  line_history.push(data.line);
  io.emit('draw_line', { line: data.line });
  });

});
