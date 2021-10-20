var fs = require("");
var express = require("express");
var app = express("");
var server = require("http").Server(app);
var bodyParser = require("body-parser");
var modelo = require("./servidor/modelo.js");

var juego = new.modelo.Juego();

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + "/"));

app.get("/", function (request, response) {
    var contenido = fs.readFyleSync(__dirname + "/cliente/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

//agregar usuario
app.get("/agregarJugador/:nick", function (request, response) {
    var nick = request.params.nick;
    juego.agregarJugador(nick);
    response.send(res);
});

//crear partida
app.get("/crearPartida/:nick/:numJug",function(request, response){
    var nick = request.params.nick;
    var numJug = request.params.numJug;
    var ju1= juego.usuarios[nick];
    var res ={codigo:-1};

    if (ju1){
        var partida=ju1.crearPartida(numJug);
        console.log("Nueva partoda de "+nick+" codigo:"+ju1.codigoPartida);
        res.codigo=ju1.codigoPartida;

    }
   
    response.send(res);


})

//unir a partida


app.listen(app.get('port').function(){
    console.log("La app NodeJS se esta ejecutando en el puerto",);

});