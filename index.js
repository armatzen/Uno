var fs=require("fs");
var express=require("express");
var app=express();
var http=require("http").Server(app);
var { Server } = require("socket.io");
var io = new Server(http);
var bodyParser = require("body-parser");
var passport =require("passport");
var LocalStrategy=require("passport-local").Strategy;
var cookieSession = require("cookie-session");

require("./servidor/passport-setup.js");

var modelo=require("./servidor/modelo.js");
var ssrv = require("./servidor/servidorWS.js");

var juego=new modelo.Juego(false);
var servidorWS=new ssrv.ServidorWS();

app.set('port',process.env.PORT || 5000);

app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieSession({
	name:'juego--uno',
	keys:['key1','key2']
}));

passport.use(new LocalStrategy({usernameField:"email",passwordField:"clave"},
	function(email,clave,done){
		juego.loginUsuario(email,clave,function(err,user){
			if(err){
				return done(err)
			}
			else{
				return done(null,user);
			}
		})
	}
))

app.use(passport.initialize());
app.use(passport.session());



const haIniciado=function(request,response,next){
	if (request.user){
		next();
	}
	else{
		response.redirect('/');
	}
}

app.get("/",function(request,response){
	var contenido=fs.readFileSync(__dirname+"/cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

//Rutas a definir para validar a usuarios con OAuth2.0
// /auth/google -> preguntamos a Google para validarse
// /auth/instagram -> "" a Instagram
// ...

app.get("/auth/google", passport.authenticate('google',{scope:['profile','email']}));
// /google/callback -> aqui llega la respuesta de google
// /good -> en caso de usuario valido
// /fail -> en caso de usuario no valido

app.get("/good",function(request,response){
	//definir el nick como el email del usuario de Google
	//agregarJugador(nick)
	var nick = request.user.emails[0].value;
	juego.agregarJugador(nick);
	response.cookie('nick',nick);
	response.redirect("/");
});

app.get("/fallo",function(request,response){
	response.send({nick:"nook"});
});

app.get("/google/callback",passport.authenticate('google',{failureRedirect:'/fallo'}),function(request,response){
	response.redirect("/good");
});



// app.get("/agregarJugador/:nombre",function(request,response){
// 	var nick=request.params.nombre;
// 	var res=juego.agregarJugador(nick);
// 	response.send(res);
// });

app.post('/registrarUsuario',function(request,response){
	var email=request.body.email;
	var clave=request.body.clave;

	juego.registrarUsuario(email,clave,function(data){
		response.send(data);
	})
});

// app.post('/loginUsuario',function(request,response){
// 	var email=request.body.email;
// 	var clave=request.body.clave;

// 	juego.registrarUsuario(email,clave,function(data){
// 		response.send(data);
// 	})
// });

app.post("/loginUsuario",passport.authenticate("local",
	{failureRedirect:"/fallo",successRedirect:"/ok"}));

app.get("/ok",haIniciado,function(request,response){
	response.send({nick:request.user.nick});
})

app.get("/crearPartida/:num/:nick",haIniciado,function(request,response){
	var nick=request.params.nick;
	var num=request.params.num;
	var ju1=juego.usuarios[nick];
	var res={codigo:-1};
	if (ju1){
		var partida=ju1.crearPartida(num);
		console.log("Nueva partida de "+nick +" codigo: "+ju1.codigoPartida);
		res.codigo=ju1.codigoPartida;
	}
	response.send(res);
});

//unir a partida
app.get("/unirAPartida/:codigo/:nick",function(request,response){
	var nick=request.params.nick;
	var codigo=request.params.codigo;
	var ju1=juego.usuarios[nick];
	var res={nick:-1};
	if (ju1){
		ju1.unirAPartida(codigo);
		console.log("Jugador: "+nick +"se ha unido a la partida: "+ju1.codigoPartida);
	}
});

//obtener lista de partidas
app.get("/obtenerListaPartidas",haIniciado,function(request,response){

	if (juego){
		var lista=juego.obtenerTodasPartidas();
		response.send(lista);
	}
});

app.get("/obtenerPartidasDisponibles",function(request,response){

	if (juego){
		var lista=juego.obtenerPartidasDisponibles();
		response.send(lista);
	}
});

app.get("/obtenerTodosResultados",function(request,response){
	if (juego){
			juego.obtenerTodosResultados(function(lista){
			response.send(lista)
		});
	}
});

app.get("/obtenerResultados/:nick",function(request,response){
	var nick=request.params.nick;
	if (juego){
		juego.obtenerTodosResultados({ganador:nick},function(lista){
			response.send(lista);
		})
	
	}
});

app.get("/cerrarSesion/:nick",function(request,response){
	var nick=request.params.nick;
	var ju1=juego.usuarios[nick];

	if (ju1){
		ju1.cerrarSesion();
			response.send({res:"ok"});
	}
})

http.listen(app.get('port'),function(){
	console.log("La app NodeJS se está ejecutando en el puerto ",app.get("port"));

});


//lanzar el servidorWS
servidorWS.lanzarServidorWS(io,juego);
