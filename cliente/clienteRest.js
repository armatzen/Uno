function ClienteRest(){
    this.registrarUsuario=function(email,clave){
        $.ajax({
            type:'POST',
            url:'/registrarUsuario',
            data:{"email":email,"clave":clave},
            success:function(data){
                if (data.email!="nook"){
                    //mostrarLogin
                    console.log(data.email);
                    ws.nick=data.nick;
                    rest.obtenerListaPartidas();
                }
                else{
                    console.log("No se ha podido registrar")
                }
            },
            //contentType:'application/json',
            dataType:'json'
        });
    }

    this.loginUsuario=function(email,clave){
        $.ajax({
            type:'POST',
            url:'/registrarUsuario',
            data:{"email":email,"clave":clave},
            success:function(data){
                if (data.email!="nook"){
                    //mostrarLogin
                    console.log(data.email);
                    ws.nick=data.nick;
                    rest.obtenerListaPartidas();
                }
                else{
                    iu.modal("Usuario o clave incorrecto")
                }
            },
            //contentType:'application/json',
            dataType:'json'
        });
    }


    this.agregarJugador=function(nick){
        $.getJSON("/agregarJugador/"+nick,function(data){
            //Se ejecuta cuando conteste el servidor
            console.log(data);
            if(data.nick!=-1){
                ws.nick=data.nick;
                //11.11
                $.cookie("nick",data.nick);
                rest.obtenerListaPartidas();
                iu.mostrarCrearPartida(ws.nick);
                
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

    this.obtenerTodosResultados=function(){
		$.getJSON("/obtenerTodosResultados",function(data){
			console.log(data);
            //iu.mostrarListaResultados(data);
		})
	}

    this.obtenerResultados=function(nick){
		$.getJSON("/obtenerResultados/"+nick,function(data){
			console.log(data);
            //iu.mostrarListaResultados(data);
		})
	}


}