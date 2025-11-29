<?php
$to = "hello@lalchimiste-studio.fr";
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : "New message from website";
$from = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : "no-reply@yourdomain.tld";
$fields = $_POST;
$body = "New message received:\n\n";
foreach ($fields as $k=>$v) { if (is_array($v)) $v = implode(", ", $v); $body .= ucfirst($k).": ".trim($v)."\n"; }
$headers = "From: ".$from."\r\n"."Reply-To: ".$from."\r\n"."Content-Type: text/plain; charset=utf-8\r\n";
$ok = @mail($to, $subject, $body, $headers);
$redirect = isset($_POST['redirect']) ? $_POST['redirect'] : (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "/");
$sep = (strpos($redirect,'?')===false)?'?':'&';
header("Location: ".$redirect.$sep.($ok?'mail=ok':'mail=fail')); exit;
