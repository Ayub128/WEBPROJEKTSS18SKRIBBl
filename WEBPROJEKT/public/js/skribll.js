var socket = io.connect();
document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('myCanvas');
   var context = canvas.getContext('2d');
   var width   = 500;
   var height  = 500;
   var socket  = io.connect();
   context.clearRect(0, 0, canvas.width, canvas.height);
   context.beginPath();


   var t;
 

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true;
                        var Minutes = 60 * 2,
                        display = document.querySelector('#countSec');
                        startTimer(Minutes, display);
                        t = setTimeout(function(){ alert("Zeit ist um :/ Jetzt beginnt eine neue Runde");
                                                    context.clearRect(0, 0, canvas.width, canvas.height);
                                                    socket.emit('fertig', { text : " jetzt beginnt ene neue Runde " });
                         }, 120000); 

};

   canvas.onmouseup = function(e){ mouse.click = false;context.beginPath(); };

   canvas.onmousemove = function(e) {
  
      mouse.pos.x = e.offsetX / width;
      mouse.pos.y = e.offsetY / height;
      mouse.move = true;
   };

  
  socket.on('draw_line', function (data) {
      var line = data.line;

      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      context.stroke();
      context.closePath();
   });

    socket.on('wait', function (data) {
      alert(data.text + "Anzahl der Spieler in der Warteschlange : " + data.num);
   });

  
var int;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
   int = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
            clearTimeout(t);
            clearInterval(int);
            socket.emit('fertig', { text : " jetzt beginnt ene neue Runde " });
        }
    }, 1000);
}
   

   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   
     socket.on('currentlydrawing', function (data) {
      var currently = data.bool;
      if(currently==false){mainLoop();}
      socket.emit('currentlydrawing', { bool : currently });
   });
      socket.on('now', function (data) {
      alert(data.text);
      mainLoop();
   });

      document.getElementById('clear').addEventListener('click', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
           clearTimeout(t);
           clearInterval(int);
      }, false);

        socket.on('winner', function (data) {
          context.clearRect(0, 0, canvas.width, canvas.height);
           clearTimeout(t);
           clearInterval(int);
    })
      
    //Clear Canvas on Refresh
    window.onbeforeunload = function (e) {
    var e = e || window.event;

    // For IE and Firefox
    if (e) {
        e.returnValue = 'Leaving the page';
      var canvas  = document.getElementById('myCanvas');
     var context = canvas.getContext('2d');
     var width   = 500;
     var height  = 500;
     var socket  = io.connect();
     context.clearRect(0, 0, canvas.width, canvas.height);
     context.beginPath();
    }

    // For Safari
    return 'Leaving the page';
};
});
