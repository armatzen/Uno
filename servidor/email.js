var sendgrid = require("sengrid")("clavexxx","paswordxxx");

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("XXXXXXXXXXXXXXX")//process.env.SENDGRID_API_KEY

var url ="http://127.0.0.1:5000/"; //URL donde encadenamos la confirmación de usuario
var urld="https://miUrldelUNOdeHeroku";

module.exports.enviarEmailConfirmacion=function(direccion,key){
    //Construir el Email según quiere sendgrid
    const msg = {
        to: 'test@example.com', // Change to your recipient
        from: 'test@example.com', // Change to your verified sender
        subject: 'Unocartas: confirmación de correo',
        text: 'Haga click en el siguiente enlace para confirmar la cuenta',
        html: '<p><a href="' + url + 'confirmarUsuario/'+direccion+'/'+key+'"> Haz click aquí para confirmar la cuenta</a></p>',}
      
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



