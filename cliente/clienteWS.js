const { Juego } = require("../servidor/modelo");

function ClienteWS(){
    this.socket;
    this.nick;
    this.codigo;

    this.conectar=function(){
        this.socket=io();
        this.servidorWSCliente();
    }

    this.crearPartida=function(num, nick){
        this.nick=nick;
        this.socket.emit("crearPartida",num,nick);

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

    this.meToca=function(){
        
    }

    //Servidor ws del cliente
    this.servidorWSCliente=function(){
        var cli= this;
        this.socket.on("connect",function(){
            console.log("conectado al servidor WS");
        })
        this.socket.on("partidaCreada",function(data){
            console.log(data);
            cli.codigo=data.codigo;
        })
        this.socket.on("unidoAPartida",function(data){
            console.log(data);
            cli.codigo=data.codigo;
        })
        this.socket.on("pedirCartas",function(data){
            cli.manoInicial();
        })
        this.socket.on("mano",function(data){
            console.log(data);
            //cli.meToca();
        })
        this.socket.on("turno",function(data){
            console.log(data);
            cli.asignarTurno();
        })
        this.socket.on("cartajug")
    }
    
    this.conectar();
}