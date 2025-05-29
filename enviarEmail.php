<?php
//1 – Definimos Para quem vai ser enviado o email
$para = "adm.sitio.doremi@gmail.com";

//2 - resgatar o que foi digitado no formulário e  grava nas variaveis locais
$nome = $_POST['first_name'];
$sobrenome = $_POST['last_name'];
$telefone = $_POST['telephone'];
$assunto = $_POST['assunto'];
$remetente = $_POST['email'];

 //4 – Agora definimos a  mensagem que vai ser enviado no e-mail
$mensagem = "<strong>Nome:  </strong>".$nome + " " + .$sobrenome;
$mensagem .= "<br>  <strong>Telefone : </strong>".$telefone;
$mensagem .= "<br>  <strong>Email : </strong>".$remetente;
$mensagem .= "<br>  <strong>Assunto : </strong>".$assunto;
$mensagem .= "<br>  <strong>Mensagem: </strong>".$_POST['message'];

//5 – agora inserimos as codificações corretas e  tudo mais.
$headers =  "Content-Type:text/html; charset=UTF-8\n";
$headers .= "From:  Formulario do DO-RE-MI<adm.sitio.doremi@gmail.com>\n"; //Vai ser //mostrado que  o email partiu deste email e seguido do nome
$headers .= "X-Sender:  <adm.sitio.doremi@gmail.com>\n"; //email do servidor //que enviou
$headers .= "X-Mailer: PHP  v".phpversion()."\n";
$headers .= "X-IP:  ".$_SERVER['REMOTE_ADDR']."\n";
$headers .= "Return-Path:  <adm.sitio.doremi@gmail.com>\n"; //caso a msg //seja respondida vai para  este email.
$headers .= "MIME-Version: 1.0\n";

mail($para, $assunto, $mensagem, $headers);  //função que faz o envio do email.
?>
