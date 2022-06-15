function ClienteWS(){
    this.socket;
    this.nick;
    this.codigo;
    this.meToca;
    this.conectar=function(){
        this.socket=io();
        this.servidorWSCliente();
    }
    this.crearPartida=function(num){
        //this.nick=nick;
        this.socket.emit("crearPartida",num,this.nick);
    }
    this.unirAPartida=function(codigo,nick){
        this.nick=nick;
        this.socket.emit("unirAPartida",codigo,nick);
    }
    this.manoInicial=function(){
        this.socket.emit("manoInicial",this.nick);
    }
    this.jugarCarta=function(num){
        this.socket.emit("jugarCarta",this.nick,num);
    }
    this.robarCarta=function(num){
        this.socket.emit("robarCarta",this.nick,num);
    }
    this.pasarTurno=function(){
        this.socket.emit("pasarTurno",this.nick);
    }
    this.meQuedaUna=function(){
        this.socket.emit("meQuedaUna",this.nick);
    }
    this.abandonar=function(){
        this.socket.emit("abandonar",this.nick);
    }
    this.cerrarSesion=function(){
        rest.cerrarSesion();
        this.socket.emit("cerrarSesion",this.nick);
        //location.reload();
    }
    this.finalPartida=function(){
        this.socket.emit("finalPartida",this.nick); 
    }
    
    //servidor WS del cliente   
    this.servidorWSCliente=function(){
        var cli=this;
        this.socket.on("connect",function(){
            console.log("conectador al servidor WS");
        });
        this.socket.on("partidaCreada",function(data){
            console.log(data);
            cli.codigo=data.codigo;
            iu.mostrarControl({nick:cli.nick,codigo:cli.codigo},"1");
            iu.mostrarAbandonar();
            iu.mostrarEsperando();
        });
        this.socket.on("nuevaPartida",function(lista){
            if (!cli.codigo && cli.nick){
                iu.mostrarListaPartidas(lista);
            }
        })
        this.socket.on("unidoAPartida",function(data){
            console.log(data);
            cli.codigo=data.codigo;
            iu.mostrarControl({nick:cli.nick,codigo:cli.codigo},"1");
            iu.mostrarAbandonar();
            iu.mostrarEsperando();
        });
        this.socket.on("nuevoJugador",function(lista){
            iu.mostrarRivales(lista);
        })
        this.socket.on("pedirCartas",function(data){
            //console.log("pedirCartas");
            cli.manoInicial();
        });
        this.socket.on("mano",function(data){
            console.log(data);
            iu.quitarEsperando();
            iu.mostrarControl({nick:cli.nick,codigo:cli.codigo},"2");
            iu.mostrarRobar();
            iu.mostrarMeQueda1();
            iu.mostrarMano(data);
        });
        this.socket.on("turno",function(data){
            console.log(data);
            iu.mostrarCarta(data.cartaActual,"actual");
            cli.meToca=data.turno==cli.nick;
            iu.mostrarTurno(cli.meToca);
        });
        this.socket.on("fallo",function(data){
            console.log(data);
            iu.limpiar();
            iu.comprobarUsuario();
        });
        this.socket.on("final",function(data){
            if (data.ganador==cli.nick){
                iu.mostrarModal("FINAAAAL. Enhorabuenaaaa, has ganado!");               
            }
            else{
                iu.mostrarModal("FINAAAAL. Ha ganado: "+data.ganador);                  
            }
            cli.finalPartida();
            iu.abandonar();
        });
        this.socket.on("jugadorAbandona",function(){
            iu.mostrarModal("Un jugador ha abandonado el juego");
            iu.abandonar();
        });
        this.socket.on("leQuedaUna",function(data){
            iu.mostrarModal("Jugador: "+data.nick+" dice: ¡me queda una carta!");
        })
    }

    this.conectar();
}