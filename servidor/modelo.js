var cad=require("./cad.js");
var cf=require("./cifrado.js");
//var moduloEmail=require("./email.js");

function Juego(test){
    this.usuarios={};
    this.partidas={};
    this.test=test;
    this.cad;

    this.registrarUsuario=function(email,clave,cb){
        var ju=this;
        var claveCifrada=cf.encryptStr(clave,"sEcrEtA");
        var nick=email;
        var key=(new Date().valueOf()).toString();

        this.cad.encontrarUsuarioCriterio({email:email},function(usr){
            if (!usr){
                ju.cad.insertarUsuario({email:email,clave:claveCifrada,key:key,nick:nick,confirmada:false},function(usu){
                    cb({email:'ok'});
                });
                //enviar email de confirmacion a la cuenta
                moduloEmail.enviarEmailConfirmacion(email,key);
            }
            else{
                cb({email:"nook"})
            }
        })
    }

    this.loginUsuario=function(email,clave,cb){
        var ju=this;
        var nick=email;
        this.cad.encontrarUsuarioCriterio({email:email},function(usr){
            if (usr){
                var clavedesCifrada=cf.decryptStr(usr.clave,'cLaVeSecrEtA');
                if (clave==clavedesCifrada && usr.confirmada){
                    cb(null,usr);
                    ju.agregarJugador(usr.nick);
                    console.log("Usuario inicia sesión")
                }
                else{
                   cb(null)
                }
            }
            else{
                cb(null)
            }
        })
    }


    this.agregarJugador=function(nick){
        var res={nick:-1}; 
        if (!this.usuarios[nick]){
            var jugador= new Jugador(nick,this);
            this.usuarios[nick]=jugador;
            res={nick:nick};
        }
        else{
            console.log("El nick: "+nick+" está en uso");
            this.cerrarSesion(nick);
        }
        return res;
    }

    this.crearPartida=function(nick,numJug){
        var codigo="-1";
        var jugador=this.usuarios[nick];
        var partida;
        if(2<=numJug && numJug<=10){
            codigo=this.obtenerCodigo();
            while (this.partidas[codigo]){
                codigo=this.obtenerCodigo();
            };
            partida=new Partida(codigo,jugador,numJug);
            this.partidas[codigo]=partida;
        }
        
        return partida;
    }

    this.obtenerTodasPartidas=function(){
        var lista=[];

        for(each in this.partidas){
            var partida=this.partidas[each];
            lista.push({propietario:partida.propietario,codigo:each})
        }

        return lista;
    }
    this.obtenerPartidasDisponibles=function(){
        var lista=[];

        for(each in this.partidas){
            var partida=this.partidas[each];

            lista.push({propietario:partida.propietario,codigo:each})
        }

        return lista;
    }

    this.unirAPartida=function(codigo,nick){
        if (this.partidas[codigo]){
            var jugador=this.usuarios[nick];
            this.partidas[codigo].unirAPartida(jugador);
        }
    }

    this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}

    this.numeroPartidas=function(){
		return Object.keys(this.partidas).length;
	}

    this.obtenerTodosResultados=function(){
        this.cad.encontrarTodosResultados(function(lista){
            callback(lista);
        });
    }

    this.obtenerResultados=function(criterio,callback){
        this.cad.encontrarResultadoCriterio(criterio,callback);
    }

    this.insertarResultado=function(resultado){
        this.cad.insertarResultado(resultado,function(res){
            console.log(res);
        });

    }

    
    if(!test){
        this.cad=new cad.CAD()
        this.cad.conectar(function(){});
    }

    this.borrarUsuario=function(nick){
        delete this.usuarios[nick];
    }
    this.cerrarSesion=function(nick){
        delete this.borrarUsuario(nick);
    }
}//jUEGO



function Jugador(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.mano=[];
    this.codigoPartida;
    this.puntos=0;
    this.estado=new Normal();

    this.crearPartida=function(numJug){
        return this.juego.crearPartida(nick,numJug);
    }
    this.unirAPartida=function(codigo){
        this.juego.unirAPartida(codigo,nick);
    }
    this.robar=function(num){
        var partida=this.obtenerPartida(this.codigoPartida);
        if (partida.mazo.length < num){
            partida.crearMazo();
        }
        if(partida.turno.nick==this.nick || num > 1){
            var robadas=partida.dameCartas(num);
            this.mano=this.mano.concat(robadas);
        }

            
    }
    this.manoInicial=function(){
        var partida=this.obtenerPartida(this.codigoPartida);
        console.log(this.codigoPartida);
        this.mano=partida.dameCartas(3);
    }
    this.obtenerPartida=function(codigo){
        return this.juego.partidas[codigo];
    }
    this.pasarTurno=function(){
        var partida=this.obtenerPartida(this.codigoPartida);
        console.log('hola');
        partida.pasarTurno(this.nick);
        this.robar(1);
    }
    this.jugarCarta=function(num){
        var carta=this.mano[num];
        if (carta){
            var partida=this.obtenerPartida(this.codigoPartida);
            partida.jugarCarta(carta,this.nick);
        }
    }
    this.quitarCarta=function(carta){
        var partida=this.obtenerPartida(this.codigoPartida);
        var indice=this.mano.indexOf(carta);
        this.mano.splice(indice,1);
        if (this.mano.length<=0){
            partida.finPartida();
        }
    }
    this.recibeTurno=function(partida){
        this.estado.recibeTurno(partida,this);
    }
    this.bloquear=function(){
        this.estado=new Bloqueado();
    }
    this.abandonarPartida=function(){
        var partida=this.obtenerPartida(this.codigoPartida);
        if(partida){
            //partida.jugadorAbandona();
            partida.fase=new Final();
        }

    }
    this.cerrarSesion=function(nick){
        delete this.juego.borrarUsuario(nick);
    }
    this.insertarResultado=function(prop,numJug){
        var resultado=new Resultado(prop,this.nick,this.puntos,numJug);
        this.juego.insertarResultado(resultado);
    }
    
}
//Estado
function Normal(){
    this.nombre="normal";
    this.recibeTurno=function(partida,jugador){
        partida.jugadorPuedeJugar(jugador); 
        //jugador.pasarTurno();
    }
}
function Bloqueado(){
    this.nombre="bloqueado";
    this.recibeTurno=function(partida,jugador){
        jugador.pasarTurno();
        jugador.estado=new Normal();
    }
}


function Partida(codigo,jugador,numJug){
    this.codigo=codigo;
    this.mazo=[];
    this.propietario=jugador.nick;
    this.numJug=numJug;
    this.jugadores={};
    this.fase=new Inicial();
    this.ordenTurno=[];
    this.direccion=new Derecha();
    this.turno;
    this.mesa=[];
    this.cartaActual;
    this.monto=0;

    this.unirAPartida=function(jugador){
        this.fase.unirAPartida(this,jugador);
    }
    this.puedeUnirAPartida=function(jugador){
        this.jugadores[jugador.nick]=jugador;
        jugador.codigoPartida=this.codigo;
        this.ordenTurno.push(jugador.nick);
    }
    this.numeroJugadores=function(){
		return Object.keys(this.jugadores).length;
	}
    this.crearMazo=function(){
        var colores=["azul","amarillo","verde","rojo"];
        for (i=0;i<colores.length;i++){
            this.mazo.push(new Numero(0,colores[i]));
        }
        for(j=0;j<colores.length;j++){
            for (i=1;i<5;i++){
                this.mazo.push(new Numero(i,colores[j]));
                //this.mazo.push(new Numero(i,colores[j]));
            }
        }
        for(j=0;j<colores.length;j++){
            this.mazo.push(new Cambio(17,colores[j]));
            //this.mazo.push(new Cambio(20,colores[j]));
        }
        for(j=0;j<colores.length;j++){
            this.mazo.push(new Bloqueo(18,colores[j]));
            //this.mazo.push(new Bloqueo(18,colores[j]));
        }
        for(j=0;j<colores.length;j++){
            this.mazo.push(new Mas2(19,colores[j]));
        //     this.mazo.push(new Mas2(19,colores[j]));
        }
        for (i=1;i<5;i++){
            this.mazo.push(new Comodin(20));
            this.mazo.push(new Comodin4(21));
        }
    };

    this.asignarUnaCarta=function(){
        var maxCartas=this.mazo.length;
        var res;
        if (maxCartas>0){
            var indice=randomInt(1,maxCartas)-1;
            var carta=this.mazo.splice(indice,1);
            res=carta[0];
        }
        return res;
    }
    this.dameCartas=function(num){
        var cartas=[];
        for(i=0;i<num;i++){
            var carta=this.asignarUnaCarta();
            if (carta){
                cartas.push(carta);
            }
        }
        return cartas;
    }
    this.pasarTurno=function(nick){
        this.fase.pasarTurno(nick,this);
    }
    this.puedePasarTurno=function(nick){
        if (nick==this.turno.nick){
            this.direccion.pasarTurno(this)
        }
    }
    this.asignarTurno=function(){
        var nick=this.ordenTurno[0];
        this.turno=this.jugadores[nick];
    }
    this.jugadorPuedeJugar=function(jugador){
        this.turno=jugador;
    }
    this.jugarCarta=function(carta,nick){
        this.fase.jugarCarta(carta,nick,this);
    }
    this.puedeJugarCarta=function(carta,nick){
        if (nick==this.turno.nick){
            if (this.comprobarCarta(carta)){
                                carta.comprobarEfecto(this);
                this.cambiarCartaActual(carta);
                this.turno.quitarCarta(carta);
                console.log(nick+" ha jugado un:"+carta.nombre);


                this.pasarTurno(nick);                
            }
            else console.log("No puedes jugar esta carta");
        }
    }
    this.cambiarCartaActual=function(carta){
        this.mesa.push(this.cartaActual);
        this.cartaActual=carta;
    }
    this.comprobarCarta=function(carta){
        //comprobar que la carta que se puede jugar la carta, según la que hay en la mesa
        return (this.cartaActual.valor==carta.valor || this.cartaActual.nombre == carta.nombre || this.cartaActual.color==carta.color || this.cartaActual.tipo == "comodin" || this.cartaActual.tipo == "mas4" || carta.tipo == "mas4" || carta.tipo == "comodin");
    }
    this.cartaInicial=function(){
        this.cartaActual=this.asignarUnaCarta();
    }
    this.cambiarDireccion=function(){
        if (this.direccion.nombre=="derecha"){
            this.direccion=new Izquierda();
        }
        else{
            this.direccion=new Derecha();
        }
    }
    this.finPartida=function(){
        this.fase=new Final();
        this.calcularPuntos();
        this.turno.insertarResultado(this.propietario,this.numJug);
    }
    this.calcularPuntos=function(){
        var suma=0;
        for(var jug in this.jugadores){
            for(i=0;i<this.jugadores[jug].mano.length;i++){
                suma=suma+this.jugadores[jug].mano[i].valor;
            }
        }
        this.turno.puntos=suma;
    }

    this.bloquearSiguiente=function(carta){
        //obtener quen es el siguiente jugador
        var jugador=this.direccion.obtenerSiguiente(this);
        jugador.bloquear();
    }


    this.comprobarChupate=function(carta){
        var j1=this.turno;
        var j2=this.direccion.obtenerSiguiente(this);


    }

    this.crearMazo();
    this.unirAPartida(jugador);
} 


//Fases
function Inicial(){
    this.nombre="inicial";
    this.unirAPartida=function(partida,jugador){
        partida.puedeUnirAPartida(jugador);
        if (partida.numeroJugadores()==partida.numJug){
            partida.fase=new Jugando();
            partida.asignarTurno();
            partida.cartaInicial();
        }
    }
    this.jugarCarta=function(carta,nick,partida){
        console.log("La partida no ha comenzado");
    }
    this.pasarTurno=function(nick,partida){
        console.log("La partida no ha comenzado");
    }
}
function Jugando(){
    this.nombre="jugando";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ya ha comenzado");
        jugador.codigoPartida=-1;
    }
    this.jugarCarta=function(carta,nick,partida){

        partida.puedeJugarCarta(carta,nick);
    }
    this.pasarTurno=function(nick,partida){
        partida.puedePasarTurno(nick);
    }
}
function Final(){
    this.nombre="final";
    this.unirAPartida=function(partida,jugador){
        console.log("La partida ha terminado");
        jugador.codigoPartida=-1;
    }
    this.jugarCarta=function(carta,nick,partida){
        console.log("La partida ya ha terminado");
    }
    this.pasarTurno=function(nick,partida){
        console.log("La partida ha terminado");
    }
}

//Direccion
function Derecha(){
    this.nombre="derecha";
    this.pasarTurno=function(partida){
        var nick=partida.turno.nick;            
        var indice=partida.ordenTurno.indexOf(nick);            
        var siguiente=(indice+1)%(Object.keys(partida.jugadores).length);
        var jugador=partida.jugadores[partida.ordenTurno[siguiente]];
        jugador.recibeTurno(partida);
        console.log("Es el turno de :" +jugador.nick);

    }
    this.obtenerSiguiente=function(partida){
        var nick=partida.turno.nick;            
        var indice=partida.ordenTurno.indexOf(nick);            
        var siguiente=(indice+1)%(Object.keys(partida.jugadores).length); //probar indice +2
        var jugador=partida.jugadores[partida.ordenTurno[siguiente]];
        return jugador;
    }
}

function Izquierda(){
    this.nombre="izquierda";
    this.pasarTurno=function(partida){
        var nick=partida.turno.nick;            
        var indice=partida.ordenTurno.indexOf(nick);            
        var siguiente=(indice-1)%(Object.keys(partida.jugadores).length);
        if (siguiente<0) {siguiente=Object.keys(partida.jugadores).length-1}
        var jugador=partida.jugadores[partida.ordenTurno[siguiente]];
        jugador.recibeTurno(partida);
         console.log("Es el turno de Iz:"+jugador.nick);
    }
    this.obtenerSiguiente=function(partida){
        var nick=partida.turno.nick;            
        var indice=partida.ordenTurno.indexOf(nick);            
        var siguiente=(indice-1)%(Object.keys(partida.jugadores).length);
        if (siguiente<0) {siguiente=Object.keys(partida.jugadores).length-1}
        var jugador=partida.jugadores[partida.ordenTurno[siguiente]];
        return jugador;
    }
}

//Cartas
function Numero(valor,color){
    this.tipo="numero";
    this.color=color;
    this.valor=valor;
    this.nombre=color+valor.toString();
    this.comprobarEfecto=function(partida){
    }
}
function Cambio(valor,color){
    this.tipo="cambio";
    this.color=color;
    this.valor=valor;
    this.nombre=color+this.tipo;
    this.comprobarEfecto=function(partida){
        partida.cambiarDireccion();
    }
}
function Bloqueo(valor,color){
    this.tipo="bloqueo";
    this.color=color;
    this.valor=valor;
    this.nombre=color+this.tipo;
    this.comprobarEfecto=function(partida){
        partida.bloquearSiguiente(this);
    }    
}
function Mas2(valor,color){
    this.tipo="mas2";
    this.color=color;
    this.valor=valor;
    this.nombre=color+this.tipo; 
    this.comprobarEfecto=function(partida){
        var jugador=partida.direccion.obtenerSiguiente(partida);
        jugador.robar(2);
        partida.bloquearSiguiente(this);
        console.log('El jugador '+jugador.nick+' ha robado 2 cartas.');
        
    }
}
function Comodin(valor){
    this.tipo="comodin";
    this.valor=valor;
    this.nombre=this.tipo;
    this.comprobarEfecto=function(partida){
    }
}
function Comodin4(valor){
    this.tipo="mas4";
    this.valor=valor;
    this.nombre=this.tipo;
    this.comprobarEfecto=function(partida){
        //ju2.roba(4)
        //efecto.comodin
        var jugador=partida.direccion.obtenerSiguiente(partida);
            jugador.robar(4);
            partida.bloquearSiguiente(this);
            console.log('El jugador '+jugador.nick+' ha robado 4 cartas.');
        
    }
}
function Resultado(prop,ganador,puntos,numJug){
    this.propietario=prop;
    this.ganador=ganador;
    this.puntos=puntos;
    this.numeroJugadores=numJug;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

module.exports.Juego=Juego;