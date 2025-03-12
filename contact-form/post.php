<?php
if (ob_get_level()) ob_end_clean();

require_once("../vendor/autoload.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;




$method = $_SERVER['REQUEST_METHOD'];

if ($method == "POST") {

  $json = file_get_contents('php://input');
  $data = json_decode($json);
  $data = (array) $data;

  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->SMTPAuth = true;
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
  $mail->Encoding = 'base64';
  $mail->CharSet = "UTF-8";
  $mail->isHTML(false);

  // identifiant
  $mail->Host = 'ssl0.ovh.net';
  $mail->Port = 465;
  $mail->Username = 'contact@beautyartsmile.ch';
  $mail->Password = 'beautyartsmile';

  // email
  $mail->Subject = "Nouvelle demande de rendez-vous";
  $mail->setFrom("contact@beautyartsmile.ch");
  $mail->addAddress("contact@beautyartsmile.ch");
  $mail->Body =
    "Nom: " . $data["name"]
    . PHP_EOL . "Téléphone: " . $data["dial-code"] . " " . $data["phone"]
    . PHP_EOL . "Email: " . $data["email"]
    . PHP_EOL . "Message: " . PHP_EOL . $data["message"];


  try {
    // Send
    $mail->send();
    http_response_code(200);
    echo 'Message has been sent';
  } catch (Exception $e) {
    http_response_code(500);
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
  }
}
