function clienteRest(){
    this.agregarJugador=function(nick){
        $.getJSON("/agregarJugador/"+nick,function(data){
            //Se ejecuta cuando conteste el servidor
            console.log(data);
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

    

}