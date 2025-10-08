import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default transporter;


/*Este archivo se encarga de conectar con Gmail usando tus datos del .env.
Solo lo configuramos una vez y lo importamos en los controladores que necesiten enviar mails.*/