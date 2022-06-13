function ControlWeb(){
    //11.11
    this.comprobarUsuario=function(){
        if ($.cookie("nick")){
            ws.nick=$.cookie("nick");
            iu.mostrarHome({nick:ws.nick});
            iu.mostrarCrearPartida(ws.nick);
        }
        else{
            iu.mostrarAgregarJugador();
        }

    }
    this.mostrarAgregarJugador=function(){
        $("#mAJ").remove();
        $("#mC").remove();
        //Comillas simples si detro se utilizan dobles
        var cadena= '<div id="mAJ"><label for="usr">Inicia Sesion</label>';
        //cadena += '<input type="text" class="form-control" id="usr" placeholder="Introduce tu Nick">';
        //cadena += '<button type="button" id="btnAJ" class="btn btn-primary">Entrar</button>'
        cadena+='<a href="/auth/google" class="btn btn-primary" >Acceder a google</a>'
        cadena += '</div>';

        //Busca en todo el index.html un id igual
        //para id $
        //para clase .
        //para html nada

        $("#agregarJugador").append(cadena);

        $("#btnAJ").on("click",function(){
            var nick=$('#usr').val();
            if(nick==""){
                iu.mostrarModal("Falta introducir tu nick");
            }
            else{
                $("#mAJ").remove();
                rest.agregarJugador(nick);

            }
		})
    }

    

    this.mostrarCrearPartida=function(nick){
        var cadena= '<div id="mCP"><lab for="usr">Numero de Jugadores:</label>';
        cadena += '<input type="text" class="form-control" id="usr">';
        cadena += '<button type="button" id="btnCP" class="btn btn-primary">CrearPartida</button>'
        cadena += '</div>';


        $("#crearPartida").append(cadena);

        $("#btnCP").on("click",function(){
            var numJug =$('#usr').val();
            if (2<=numJug && numJug<=10){
                $("#mCP").remove();
                ws.crearPartida(numJug, nick);
            }
            else{
                $("#mCP").remove();
                iu.mostrarModal("Introduce un valor entre 2 y 8");
                iu.mostrarCrearPartida(nick);
            }

		})
    }

    this.mostrarPartidasDisponibles=function(lista){
        $('mPD').remove();
        
        var cadena= '<div id="mPD"><lab for="usr">Lista de Partidas:</label>';
        cadena+= '<id="mLP"><div class="list-group">'

        for(i=0;i<lista.length;i++){
            var codigo=lista[i].codigo;
            cadena += '<a href="#" class="list-group-item list-group-item-action">+codigo+</a>'
        }
        cadena += '</div>';

        $("#listaPartidas").append(cadena)

        $(".list-group a").click(function(){
            codigo=$(this).attr("value");
            var nick=ws.nick;
            console.log(codigo+" "+nick);
            if (codigo && nick){
                $('mLP').remove();
                $('mCP').remove();
                ws.unirAPartida(codigo,nick);
            }
        })

    }

    this.limpiar=function(){
        //todos los remove
    }

    this.mostrarEsperando=function(){

    }

    this.quitarEsperando=function(){

    }

    this.mostrarHome=function(data){
        iu.mostrarControl();
        //iu.mostrarCrearPartida();
        iu.mostrarPartidasDisponibles(data);
    }
    
    this.unirPartidaPrivada=function(){

    }

    this.mostrarControl=function(){
        $('#mC').remove();
        var cadena="Nick: "+ws.nick;
        if (ws.nick.codigo){
        cadena += '<p><button type="button" id="btnAbandonar" class="btn btn-primary">Abandonar partida</button>'
        cadena += '<p><button type="button" id="btnCerrar" class="btn btn-primary">Cerrar Sesion</button>'
        }
        cadena += '</div>'

        $('#control').append(cadena);
        $("#btnAbandonar").on("click",function(){
            ws.abandonarPartida();
		})

        $("#btnCerrar").on("click",function(){
            // ws.nick="";
            // ws.codigo="";
            // iu.limpiar();
            // iu.mostrarAgregarJugador();
            ws.cerrarSesion();
		})
    
    }

    this.mostrarModal=function(msg){
        //meter el mensaje del modal
        $('#cM').remove();
        var cadena="<p id='cM'>"+msg+"</p>";
        $('#contenidoModal').append(cadena);
        $('#miModal').modal('show');
    }

    this.mostrarMano=function(lista){
        $('#mM').remove();
        var cadena = '<div id="mM" class="card-columns">';
        for(i=0;i<lista.length;i++){
            cadena+='<div class="card bg-light">';
            cadena+='<div class="card-body text-center">';
            cadena+='<img class="card-img-top" src="cliente/img/'+lista[i].nombre+'.png" alt="Card image">';
            cadena+='<p class="card-text">'+lista[i].tipo+' '+lista[i].valor+' '+lista[i].color+'</p>';
            cadena+='</div></div>';
        }
        cadena+='</div>';
        $('#mano').append(cadena);
    }
    this.mostrarCartaActual=function(carta){
        $('#mCA').remove();
        var cadena = '<div id="mCA" class="card-columns">';
        cadena+='<div class="card bg-light">';
        cadena+='<div class="card-body text-center">';
        cadena+='<img class="card-img-top" src="cliente/img/'+lista[i].nombre+'.png" alt="Card image">';
        cadena+='<p class="card-text">'+carta.tipo+' '+carta.valor+' '+carta.color+'</p>';
        cadena+='</div></div>';
        cadena+='</div>';
        $('#actual').append(cadena);
    }

    this.mostrarRegistro=function(){
        $('mR').remove();
        var cadena= '<div id="mR"><lab for="usr">Email:</label>';
        cadena += '<input type="text" class="form-control" id="usr">';
        cadena += '<label for="usr">Contraseña</label>';
        cadena += '<input type="text" class="form-control" id="usr">';
        cadena += '<button type="button" id="btnMR" class="btn btn-primary">Registrar</button>'
        cadena += '</div>';
        $('#mostrarRegistro').append(cadena);
    }
}