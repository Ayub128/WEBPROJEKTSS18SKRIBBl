
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

//get and post requests

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

let currentPlayers= [];
let isDrawing = false;
let waitList = [];
let plr="";

<<<<<<< HEAD
//Socket events
io.on('connect', function (socket) {

    currentPlayers[currentPlayers.length]=socket;

     function userdraw (data) {

    	console.log("user with socket id requested drawing  " + socket.id);
    	
      
        if(isDrawing == false){
            
            socket.emit('jetzt', { text: "Jetzt sind Sie daran, Sie haben 2 Minuten Zeit zum Malen"});
         	console.log("emitted to this id  " + socket.id);
            plr = data.name;
            isDrawing=true;

          }
        else{

        	plr = data.name;
            waitList.push(data.name);
            var msg = "Bitte warten, "+ plr +" ist schon am Malen ";
            socket.emit('warten', {  text: msg , num :  waitList.length });
            console.log("emitted to this id wait event  " + socket.id);
            
        }

        socket.on('fertig', function (data) {
        isDrawing=false;
        currentPlayers.push(waitList.pop(data.name));
        socket.emit('jetzt', { text: "Jetzt sind Sie daran, Sie haben 2 Minuten Zeit zum Malen"});
        console.log("emitted to this id fertig event " + socket.id);
         
        plr = data.name;
        });
};
=======
io.on('connection', function (socket) {
>>>>>>> c4a5647fdaaf28917b62c6eb7a770e9b915d777c


  socket.emit('chat', { zeit: new Date(), text: 'Du bist jetzt mit dem Server verbunden!' });
  socket.on('userwanttodraw', userdraw);
  var gef=false;
  var gef2=false;
  socket.on('chat', function (data) {
  io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });

<<<<<<< HEAD


    fs.readFile('words.json', (err, data) => {  
        if (err) throw err;
        wordsList = JSON.parse(data);
        })

=======
    if(data.text=="malen"){

      socket.emit('currentlydrawing', { bool: isDrawing } );
      socket.on('chat', function (data) {isDrawing=data.bool;});
      
        if(isDrawing == false){
            
              for (var i in line_history) {
               socket.emit('draw_line', { line: line_history[i] } );
              }
              socket.on('draw_line', function (data) {
              line_history.push(data.line);
              io.emit('draw_line', { line: data.line });
              });

            currentPlayers.push(data.name);
            plr = data.name;
            isDrawing=true;
          }
        else{
            var msg = "Bitte warten, "+ plr +" ist schon am Malen ";
            socket.emit('wait', {  text: msg , num :  waitList.length });
            waitList.push(data.name);
        }

        socket.on('fertig', function (data) {
        isDrawing=false;
        currentPlayers.push(waitList.pop(data.name));
        socket.emit('now', { text: "Jetzt sind Sie daran, Sie haben 2 Minuten Zeit zum Malen"});
         
          for (var i in line_history) {
           socket.emit('draw_line', { line: line_history[i] } );
          }
          socket.on('draw_line', function (data) {
          line_history.push(data.line);
          io.emit('draw_line', { line: data.line });
          });

        plr = data.name;
        });
    }
>>>>>>> c4a5647fdaaf28917b62c6eb7a770e9b915d777c

    for (var i = wordsList.length - 1; i >= 0; i--) {
    if(wordsList[i].name==data.text){
      io.sockets.emit('winner', { name: data.name , text: 'hat richtig geraten !' , word : wordsList[i].name });
      
      //suche bzw. einfuegen der Gewinner
      for (var j = highscoreslist.length - 1; j >= 0; j--) {

      if(highscoreslist[j].name==data.name){gef=true;break;}
      else {gef = false;}
<<<<<<< HEAD

      if(highscoreslist[j].name==plr){gef2=true;break;}
      else {gef2 = false;}

      if(gef==true){console.log("Player gefunden");highscoreslist[j].Score+=5;}
      if(gef==false){console.log("Player nicht gefunden");highscoreslist.push({name : data.name , Score : score});}
      if(gef2==true){console.log("Maler gefunden");highscoreslist[j].Score+=5;}
      if(gef2==false){console.log("Maler nicht gefunden");highscoreslist.push({name : plr , Score : score});}
    }
=======
      }
      if(highscoreslist[j].name==plr){gef2=true;break;}
      else {gef2 = false;}
      }

  

>>>>>>> c4a5647fdaaf28917b62c6eb7a770e9b915d777c

      }
    }
    //sortiere von highscores liste ( absteigend)
      ListSort = function (a,b) {
      return b.Score - a.Score ;
    };

    highscoreslist.sort(ListSort);

      
      fs.writeFile('highscores.json', JSON.stringify(highscoreslist), error => console.error);

<<<<<<< HEAD
    
=======
    }

>>>>>>> c4a5647fdaaf28917b62c6eb7a770e9b915d777c
  });


  	//wenn jemand tippt
    socket.on('typingmsg', function (data) {
       socket.broadcast.emit('typingmsg', { name: data.name , text: "  tippt gerade" });
       socket.on('notypingmsg', function (data) {
       socket.emit('clearttp', {});
     });
  });

<<<<<<< HEAD
    //emit canvas Inhalt

      for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
      }
      socket.on('draw_line', function (data) {
      line_history.push(data.line);
      io.emit('draw_line', { line: data.line });
      });

=======
>>>>>>> c4a5647fdaaf28917b62c6eb7a770e9b915d777c
  



});

