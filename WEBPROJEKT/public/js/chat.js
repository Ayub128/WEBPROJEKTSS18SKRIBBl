$(document).ready(function(){
    // WebSocket
    var socket = io.connect();
    // neue Nachricht
    socket.on('chat', function (data) {
        var zeit = new Date(data.zeit);
        $('#content').append(
            $('<li></li>').append(
                // Uhrzeit
                $('<span>').text('[' +
                    (zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours())
                    + ':' +
                    (zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes())
                    + '] '
                ),
                // Name
                $('<b>').text(typeof(data.name) != 'undefined' ? data.name + ': ' : ''),
                // Text
                $('<span>').text(data.text))
        );
        // nach unten scrollen
        $('#chat').scrollTop($('body')[0].scrollHeight);
    });
    //we have a winner
    // Nachricht senden
    function senden(){
        // Eingabefelder auslesen
        var name = $('#name').val();
        var text = $('#text').val();
        // Socket senden
        if(name==""){alert("Username muss eingegeben werden !")}
        else{
        socket.emit('chat', { name: name, text: text });
        // Text-Eingabe leeren
        $('#text').val('');}
    }
    // bei einem Klick
    $('#senden').click(senden);
    // oder mit der Enter-Taste
    $('#text').keypress(function (e) {
        if (e.which == 13) {
            senden();
        }
    });
    var highscores = new Array();

    socket.on('winner', function (data) {
        var thewinner = data.name;
        var winnerscore=0;
        winnerscore=+10;
        alert(thewinner + " hat gewonnen !!  Glückwunsch. " + " Das Wort war : " + data.word);
        var canvas  = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    })

});
