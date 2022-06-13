//var sendgrid = require("sendgrid")("xxxxx","xxxxx");

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("xxxxxxxxx")//process.env.SENDGRID_API_KEY)

var url="http://127.0.0.1:5000/";
var urld="";//Direccion de la aplicacion en heroku

module.exports.enviarEmailConfirmacion=function(direccion,key,msg){

	const msg = {
	  to: direccion, // Change to your recipient
	  from: 'juegocartas@exmaple', //Cuenta profesional del juego uno Change to your verified sender
	  subject: 'JuegoUno: confirmacion de correo',
	  text: 'Haga click para confirmar su cuenta',
	  html: '<p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Haz click aqui en este enlace para confirmar tu cuenta</a></p>',
	}

	sgMail
	  .send(msg)
	  .then((response) => {
	    console.log(response[0].statusCode)
	    console.log(response[0].headers)
	  })
	  .catch((error) => {
	    console.error(error)
	  })
  }