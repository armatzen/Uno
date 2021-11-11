function ClienteRest(){
    this.agregarJugador=function(nick){
        $.getJSON("/agregarJugador/"+nick,function(data){
            //Se ejecuta cuando conteste el servidor
            console.log(data);
            if(data.nick!=-1){
                ws.nick=data.nick;
                //11.11
                $.cookier("nick",data.nick);

                cli.obtenerPartidasDisponibles();
            }
            else{
                iu.mostrarModal("El nick: "+nick+" esta en uso");
                iu.mostrarAgregarJugador();
            }
        })
        //Sigue la ejecucion sin esperar
        //mostrar una ruleta
    }
    
    this.crearPartida=function(nick,numJug){

        $.getJSON("/crearPartida/"+nick+"/"+numJug,function(data){
            //Se ejecuta cuando conteste el servidor
            console.log(data);
        })
        //Sigue la ejecucion sin esperar
        //mostrar una ruleta
    }

    this.obtenerListaPartidas=function(){
		$.getJSON("/obtenerListaPartidas",function(data){
			console.log(data);
            //iu.mostrarListaPartidas(data);
		})
	}

    this.obtenerPartidasDisponibles=function(){
		$.getJSON("/obtenerPartidasDisponibles",function(data){
			console.log(data);
            iu.mostrarPartidasDisponibles(data);
		})
	}

    

}