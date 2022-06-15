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
                    iu.mostrarLogin();
                }
                else{
                    console.log("No se ha podido registrar");
                    iu.mostrarModal("La cuenta ya existe");
                }
            },
            //contentType:'application/json',
            dataType:'json'
        });
    }
    this.loginUsuario=function(email,clave){
        var cli=this;
        $.ajax({
            type:'POST',
            url:'/loginUsuario',
            data:{"email":email,"clave":clave},
            success:function(data){
                if (data.nick!="nook"){
                    ws.nick=data.nick;
                    $.cookie("nick",ws.nick);
                    $('#sif').remove();
                    iu.mostrarHome(data);
                    cli.obtenerPartidasDisponibles();
                }
                else{
                    //iu.mostrarModal("Usuario o clave incorrectos");
                    //iu.mostrarAgregarJugador();
                    iu.mostrarLogin(true);
                }
            },
            //contentType:'application/json',
            dataType:'json'
        });
    }
    this.agregarJugador=function(nick){
        var cli=this;
        //$.getJSON("/agregarJugador/"+nick,function(data){
        $.getJSON("/auth/google",function(data){            
            //se ejecuta cuando conteste el servidor
            console.log(data);
            if (data.nick!=-1){
                ws.nick=data.nick;
                $.cookie("nick",ws.nick);
                iu.mostrarHome(data);
            }
            else{
                iu.mostrarModal("El nick ya está en uso");
                iu.mostrarAgregarJugador();
            }
        })
    }

    this.crearPartida=function(num,nick){
        $.getJSON("/crearPartida/"+num+"/"+nick,function(data){
            console.log(data);
        })
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
               iu.mostrarListaPartidas(data);
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
    this.cerrarSesion=function(){
        $.getJSON("/cerrarSesion",function(data){
            console.log(data);          
            //iu.mostrarAgregarJugador();
            //iu.mostrarListaResultados(data);
        })
    }
}