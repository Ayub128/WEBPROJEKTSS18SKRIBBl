
var line_history = [];
let wordsList = [];
let highscoreTable=[{name : "default" , Score : 0}];
let score=5;

let currentPlayers= [];
let isDrawing = false;
let waitList = [];
let plr="";

io.on('connection', function (socket) {

    fs.readFile('words.json', (err, data) => {  
        if (err) throw err;
        wordsList = JSON.parse(data);
        })

  socket.emit('chat', { zeit: new Date(), text: 'Du bist jetzt mit dem Server verbunden!' });
  var gef=false;
  var gef2=false;
  socket.on('chat', function (data) {
  io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });

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

    for (var i = wordsList.length - 1; i >= 0; i--) {
    if(wordsList[i].name==data.text){
      io.sockets.emit('winner', { name: data.name , text: 'hat richtig geraten !' , word : wordsList[i].name });
      
      for (var j = highscoreslist.length - 1; j >= 0; j--) {

      if(highscoreslist[j].name==data.name){gef=true;break;}
      else {gef = false;}
      }
      if(highscoreslist[j].name==plr){gef2=true;break;}
      else {gef2 = false;}
      }

  


      	ListSort = function (a,b) {
    	return b.Score - a.Score ;
		};

		highscoreslist.sort(ListSort);

      console.log(highscoreslist);
      fs.writeFile('highscores.json', JSON.stringify(highscoreslist), error => console.error);

    }

  });


    socket.on('typingmsg', function (data) {
   		 io.sockets.emit('typingmsg', { name: data.name , text: "  tippt gerade" });
   		 socket.on('notypingmsg', function (data) {
   		 io.sockets.emit('clearttp', {});
 		 });
  });

  



});

