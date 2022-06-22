function ControlWeb(){
    this.comprobarUsuario=function(){
        if ($.cookie("nick")){
            ws.nick=$.cookie("nick");           
            iu.mostrarHome({nick:ws.nick});
            rest.obtenerPartidasDisponibles();
        }
        else{
            //iu.mostrarLogin();
            iu.mostrarAgregarJugador();
        }
    }

    this.mostrarHome=function(data){
        iu.mostrarControl(data,"1");
        iu.mostrarCrearPartida();
        iu.mostrarUnirConCodigo();
        iu.mostrarSalir();
    }

    this.mostrarRegistro=function(){
        $('#signup').load("/cliente/signup.html",function(){
            $("#btnSU").on("click",function(e){
                if ($('#email').val() === '' || $('#password').val()==='') {
                    e.preventDefault();
                }
                else{
                    var email=$('#email').val();
                    var pass=$('#password').val();
                    rest.registrarUsuario(email,pass);
                }
            })
            $("#si").on("click",function(){
                iu.mostrarLogin();
            })
        });
    }

    this.mostrarLogin=function(aviso){
        $('#signup').load("/cliente/signin.html",function(){
            if (aviso){
                $("#info span").text("Usuario o clave incorrectos");
            }
            $("#btnSI").on("click",function(e){
                if ($('#email').val() === '' || $('#password').val()==='') {
                    e.preventDefault();
                }
                else{
                    var email=$('#email').val();
                    var pass=$('#password').val();
                    rest.loginUsuario(email,pass);
                }
            });
            $("#reg").on("click",function(){
                iu.mostrarRegistro();
            })
        });
    }

    this.mostrarAgregarJugador=function(){
        var cadena='<form class="form-row needs-validation"  id="mAJ">';
        cadena=cadena+'<div class="col">'
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
        cadena=cadena+'</div></form>';

        $("#agregarJugador").append(cadena);     
        $("#nota").append("<div id='aviso' style='text-align:right'>Inicia sesión con Google para jugar</div>");    

        $("#btnAJ").on("click",function(e){
            if ($('#usr').val() === '' || $('#usr').val().length>6) {
                e.preventDefault();
                //alert('introduce un nick');
            }
            else{
                var nick=$('#usr').val();
                $("#mAJ").remove();
                $("#aviso").remove();
                rest.agregarJugador(nick);
            }
        })
    }
    this.limpiar=function(){
        $('#mAJ').remove();
        $('#mC').remove();
        $('#mCP').remove();
        $('#mLP').remove();
        $('#spin').remove();
        $('#cartas').remove();
        $('#carta2').remove();
        $('#cartas2').remove();
        $('#carta').remove();
        $('#mLR').remove();
        $('#miTurno').remove();
        $('#mR').remove();
        $('#mUcC').remove();
        $('#mMQ1').remove();
        $('#abandonar').remove();
        $('#salir').remove();
    }
    this.limpiarAbandonar=function(){
        $('#mAJ').remove();
        $('#mC').remove();
        $('#mCP').remove();
        $('#mLP').remove();
        $('#spin').remove();
        $('#cartas').remove();
        $('#carta2').remove();
        $('#cartas2').remove();
        $('#carta').remove();
        $('#mLR').remove();
        $('#miTurno').remove();
        $('#mR').remove();
        $('#mUcC').remove();
        $('#abandonar').remove();
        $('#mMQ1').remove();
    }
    this.mostrarEsperando=function(){
        $('#spin').remove();
        var cadena='<div class="d-flex justify-content-center" id="spin">';
        cadena=cadena+'<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';
        cadena=cadena+"</div>";
        $('#esperando').append(cadena);
    }
    this.quitarEsperando=function(){
        $('#spin').remove();
    }
    this.mostrarAbandonar=function(){
        $('#abandonar').remove();
        var cadena='<li id="abandonar"><a href="#" onclick="abandonar();">Abandonar</a></li>';
        $('#navbar').append(cadena);
    }
    this.mostrarSalir=function(){
        $('#salir').remove();
        var cadena='<li id="salir"><a href="#" onclick="salir();">Salir</a></li>';
        $('#navbar').append(cadena);
    }
    this.mostrarControl=function(data,num){
        $('#mC').remove();
        var cadena="<div id='mC'><h4>Jugador:</h4>";
        cadena=cadena+"<p>Nick: "+data.nick+"</p>";
        if (data.codigo){
            cadena=cadena+"<p>Código: "+data.codigo+"</p>";
        }
        cadena=cadena+"</div>";
        

        $("#control"+num).append(cadena);
        
    }
    this.cerrar=function(){
            ws.nick="";
            ws.codigo="";
            $.removeCookie("nick");
            iu.limpiar();
            iu.mostrarLogin();
    }   
    this.abandonar=function(){          
            ws.codigo="";
            iu.limpiarAbandonar();
            iu.mostrarControl({nick:ws.nick},"1");
            iu.mostrarCrearPartida();
            iu.mostrarUnirConCodigo();
            rest.obtenerPartidasDisponibles();
    }
    this.mostrarCrearPartida=function(){
        var cadena='<form class="form needs-validation"  id="mCP">';
        cadena=cadena+'<div class="row"><h4>Crear partida:</h4></div>'; 
        cadena=cadena+'<div class="row">';
        cadena=cadena+'<div class="col">'       
        cadena=cadena+'<input type="number" min="2" max="8" class="form-control mb-2 mr-sm-2" id="num" placeholder="2" value="2"></div>';
        cadena=cadena+'</div></div>';
        cadena=cadena+'<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear partida</button>';
        cadena=cadena+'</form>';

        $("#crearPartida").append(cadena);         

        $("#btnCP").on("click",function(){
            var num=$('#num').val();
            $("#mCP").remove();
            $('#mUcC').remove();
            $("#mLP").remove();
            ws.crearPartida(num);
        })
    }
    this.mostrarUnirConCodigo=function(){
        $('#mUcC').remove();
        var cadena='<div id="mUcC"><div class="row"><div class="col"><h4>Únete a una partida:</h4></div></div>';
        cadena=cadena+'<form class="form-row needs-validation">';
        cadena=cadena+'<div class="col">'
        cadena=cadena+'<input type="text" class="form-control mb-2 mr-sm-2" id="codigo" placeholder="Introduce el código" required></div>';
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnUcC" class="btn btn-primary mb-2 mr-sm-2">Unirme</button>';
        cadena=cadena+'</div></form></div>';

        $("#unirConCodigo").append(cadena);     
        $("#nota2").append("<div id='aviso'>Introduce el código de la partida</div>");    

        $("#btnUcC").on("click",function(e){
            if ($('#codigo').val() === '') {
                e.preventDefault();
                //alert('introduce un nick');
            }
            else{
                var codigo=$('#codigo').val();
                $("#mCP").remove();
                $('#mUcC').remove();
                $("#mLP").remove();
                $("#aviso").remove();
                ws.unirAPartida(codigo,ws.nick);
            }
        })      
    }
    this.mostrarListaPartidas=function(lista){
        var ant=undefined;
        $('#mLP').remove();
        var cadena='<div id="mLP" class="panel panel-default"><div class="panel-body"><h4>Elige una partida pública:</h4>';
        cadena=cadena+"<div class='row'><div class='col'>";
        cadena=cadena+'<ul class="list-group" id="lista">';
        for(var i=0;i<lista.length;i++){
            var maximo=lista[i].maximo;
            var numJugadores=maximo-lista[i].huecos;
            cadena=cadena+"<li class='list-group-item row d-flex'>";
            cadena=cadena+'<div class="col-4"><a href="#" name="'+i+'"" value="'+lista[i].codigo+'">'+lista[i].codigo+'</a></div>';
            cadena=cadena+'<div class="col-4">'+lista[i].propietario+'</div>';
            cadena=cadena+'<div class="col-4"><span class="badge badge-primary badge pill">'+numJugadores+'/'+maximo+'</span></div>';
        } 
        cadena=cadena+'</li></ul></div></div>';
        cadena=cadena+'</div>';

        $('#listaPartidas').append(cadena);

        $(".list-group a").click(function(){
            codigo=$(this).attr("value");
            //var nick=$('#nick').val();
            var nick=ws.nick;
            console.log(codigo+" "+nick);
            if (codigo && nick){
                $('#mLP').remove();
                $('#mUcC').remove();
                $('#mCP').remove();
                ws.unirAPartida(codigo,nick);
            }
        });
    }
    this.mostrarTurno=function(meToca){
        $('#miTurno').remove();
        var cadena="";
        if (meToca){
            cadena='<div id="miTurno" class="card bg-success text-white"><div class="card-body">Me toca!</div></div>';
        }
        else{
            cadena='<div id="miTurno" class="card bg-danger text-white"><div class="card-body">No me toca</div></div>';
        }
        $('#turno').append(cadena);
    }
    this.mostrarRivales=function(data){
        $('#mLR').remove();
        var cadena="<div id='mLR'><h3>Rivales:</h3>";
        for(i=0;i<data.length;i++){
            if (data[i]!=ws.nick){
                var name   = data[i].substring(0, data[i].lastIndexOf("@"));
                cadena=cadena+'<div class="columnRival"><div class="card cardRival">';
                cadena=cadena+'<div class="card-body">';
                cadena=cadena+'<p class="card-text"><small>'+name+'</small></p>';
                cadena=cadena+'</div></div></div>';
            }
        }
        $('#rivales').append(cadena);
    }
    this.mostrarCarta=function(carta,id){
        var textColor;
        var valor;
        $('#carta').remove();
        var cadena='<div id="carta"><h3>Carta actual:</h3>';
 
        cadena=cadena+'<div class="column"><div class="card text-center">';
        cadena=cadena+'<div class="card-body">';
        valor=carta.valor;
        color=carta.color;
        if (carta.tipo=="cambio"){
            valor="<>";
        }
        if (carta.tipo=="bloqueo"){
            valor="blq";
        }
        cadena=cadena+'<h3 class="card-text" >'+valor+" "+color+'</h3>';
        if (carta.color=="yellow"){
                textColor="black";
            }
            else{
                textColor="white";
            }
            console.log("La carta es:"+carta.nombre);
            cadena=cadena+'<p style="background-color:'+carta.color+';color:'+textColor+';">num</p>';       
                cadena=cadena+'<img src="cliente\cartas\"+carta.nombre+".png" alt="Elva dressed as a fairy">'
        cadena=cadena+'</div></div></div></div>';
        $('#'+id).append(cadena);
    }
    this.mostrarMano=function(lista){
        var textColor;
        var valor;
        $('#cartas').remove();
        var cadena='<div id="cartas"><h3>Tus cartas:</h3>';
        
        for(i=0;i<lista.length;i++){
            valor=lista[i].valor;
            if (lista[i].tipo=="cambio"){
                valor="<>";
            }
            if (lista[i].tipo=="bloqueo"){
                valor="bloq";
            }
            cadena=cadena+'<div class="column">';
            cadena=cadena+'<div class="card card2 text-center" value="'+i+'">';
            cadena=cadena+'<div class="card-body">';
            cadena=cadena+'<h3 class="card-text">'+valor+'</h3>';
            if (lista[i].color=="yellow"){
                textColor="black";
            }
            else{
                textColor="white";
            }
            cadena=cadena+'<p style="background-color:'+lista[i].color+';color:'+textColor+';">num</p>';
            cadena=cadena+'</div></div></div>';
        }
        cadena=cadena+'</div>';
        $('#tablero').append(cadena);

        $(".card").click(function(){
            if (ws.meToca){
                numero=$(this).attr("value");         
                console.log("numero: "+numero);
                ws.jugarCarta(numero);
            }
        });
    }
    this.mostrarRobar=function(){
        $('#mR').remove();
        var cadena='<div id="mR" style="margin-top:5px">';
        cadena=cadena+'<button id="btnRobar" class="btn btn-warning mb-2 mr-sm-2">Robar</button>';
        cadena=cadena+'</div>';

        $('#robar').append(cadena);
        $("#btnRobar").on("click",function(){           
            ws.robarCarta(1);
        });     

    }
    this.mostrarMeQueda1=function(){
        $('#mMQ1').remove();
        var cadena='<div id="mMQ1" style="margin-top:5px">';
        cadena=cadena+'<button id="btnMQ1" class="btn btn-info mb-2 mr-sm-2">Una carta</button>';
        cadena=cadena+'</div>';

        $('#queda1').append(cadena);
        $("#btnMQ1").on("click",function(){         
            ws.meQuedaUna();
        });     

    }
    this.mostrarModal=function(msg){
        $('#mM').remove();
        var cadena="<p id='mM'>"+msg+"</p>";
        $('#contenidoModal').append(cadena);
        $('#miModal').modal("show");
    }
}

function abandonar(){
    ws.abandonar();
    iu.abandonar();
}

function salir(){
    ws.cerrarSesion();
    iu.cerrar();
}