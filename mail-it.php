<?php
// mail-it.php
// Unified handler for 4 forms. Sends email to hello@lalchimiste-studio.fr
// Shows success/failure by redirecting back with ?status=ok|error&ft=...

$to = "hello@lalchimiste-studio.fr";
$fixed_from_email = "hello@lalchimiste-studio.fr"; // toujours cette adresse
$allowed_forms = array("book_download", "create_account", "contact", "phone_request");

// --- Fonction de nettoyage ---
function sanitize($v) {
  return trim(filter_var($v, FILTER_SANITIZE_STRING)); // compat, ok même si déprécié en 8.1+
}

// --- Lire form_type tel que reçu ---
$form_type = isset($_POST['form_type']) ? $_POST['form_type'] : '';

// --- Normaliser et sécuriser les champs ---
$email   = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : null;
$name    = isset($_POST['name']) ? sanitize($_POST['name']) : null;
$company = isset($_POST['company']) ? sanitize($_POST['company']) : null;

// Prendre en charge plusieurs alias pour "phone"
$phone_aliases = array('phone','telephone','tel','phone_number','numero','numero_telephone','mobile','gsm');
$phone = null;
foreach ($phone_aliases as $alias) {
  if (isset($_POST[$alias]) && is_string($_POST[$alias]) && trim($_POST[$alias]) !== '') {
    $phone = sanitize($_POST[$alias]);
    break;
  }
}

$message = isset($_POST['message']) ? sanitize($_POST['message']) : null;

// --- Si form_type non reconnu, essayer de le déduire ---
if (!in_array($form_type, $allowed_forms)) {
  // 1) Cas “formulaire téléphone” (souvent juste un champ numéro)
  if ($phone && !$name && !$message && !$company) {
    $form_type = 'phone_request';
  } else {
    $form_type = 'unknown';
  }
}

// --- Limitation par adresse IP ---
// Récupérer l'adresse IP
$ip = $_SERVER['REMOTE_ADDR'];
$log_file = 'logs/ip_log.txt';

// Vérifier le nombre d'envois effectués aujourd'hui
$max_attempts_per_day = 4;
$current_date = date('Y-m-d');
$log_entries = file($log_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$attempts_today = 0;

// Parcourir le fichier des logs pour compter les tentatives d'envoi pour cette IP aujourd'hui
foreach ($log_entries as $log_entry) {
  list($log_ip, $log_date) = explode(" ", $log_entry);
  if ($log_ip === $ip && strpos($log_date, $current_date) === 0) {
    $attempts_today++;
  }
}

// Si l'IP a atteint la limite d'envois, on bloque l'envoi
if ($attempts_today >= $max_attempts_per_day) {
  $status = 'error';
  $ft = urlencode($form_type);
  $ref = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '/';
  $separator = (strpos($ref, '?') === false) ? '?' : '&';
  header("Location: ".$ref.$separator."status=".$status."&ft=".$ft);
  exit;
}

// --- Sujet & corps ---
$subject_map = array(
  "book_download"  => "Paris Book 2024 — Demande de téléchargement",
  "create_account" => "Paris Créer un compte client — Nouvelle demande",
  "contact"        => "Paris Contact — Nouveau message",
  "phone_request"  => "Paris Demande d'appel — Nouveau numéro",
  "unknown"        => "Paris Formulaire inconnu"
);
$subject = isset($subject_map[$form_type]) ? $subject_map[$form_type] : "Nouveau formulaire";

$body  = "Formulaire: $form_type\n";
$body .= "Date/Heure: " . date('Y-m-d H:i:s') . "\n";
$body .= "IP: " . $ip . "\n\n";

// Ajoutez les détails de l'email
if ($form_type === "book_download" || $form_type === "create_account") {
  if ($email) { $body .= "Email: $email\n"; }
} elseif ($form_type === "contact") {
  if ($name)    { $body .= "Nom: $name\n"; }
  if ($email)   { $body .= "Email: $email\n"; }
  if ($company) { $body .= "Société: $company\n"; }
  if ($phone)   { $body .= "Téléphone: $phone\n"; }
  if ($message) { $body .= "\nMessage:\n$message\n"; }
} elseif ($form_type === "phone_request") {
  if ($phone) { $body .= "Téléphone: $phone\n"; }
} else {
  // fallback: tout remonter (sauf fichiers)
  foreach ($_POST as $k => $v) {
    if ($k === 'form_type') continue;
    if (is_string($v) && trim($v) !== '') {
      $body .= "$k: " . sanitize($v) . "\n";
    }
  }
}

// --- Entêtes: toujours depuis hello@ ---
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: L'Alchimiste Studio <{$fixed_from_email}>\r\n";
$headers .= "Sender: {$fixed_from_email}\r\n";
$headers .= "Return-Path: {$fixed_from_email}\r\n";
$headers .= "Reply-To: " . ($email ? $email : $fixed_from_email) . "\r\n";

// Forcer l’enveloppe expéditeur (Return-Path) pour la délivrabilité
$envelope_param = "-f{$fixed_from_email}";
$ok = @mail($to, $subject, $body, $headers, $envelope_param);

// --- Enregistrer l'envoi dans le fichier des logs ---
if ($ok) {
  file_put_contents($log_file, $ip . " " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
}

// --- Redirection ---
$ref = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '/';
$separator = (strpos($ref, '?') === false) ? '?' : '&';
$status = $ok ? 'ok' : 'error';
$ft = urlencode($form_type);
header("Location: ".$ref.$separator."status=".$status."&ft=".$ft);
exit;
?>