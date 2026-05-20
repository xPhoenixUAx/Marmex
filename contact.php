<?php
declare(strict_types=1);

const RECIPIENT_EMAIL = 'support@marmexdigital.com';
const SITE_NAME = 'Marmex';

function clean_input(string $value): string
{
    $value = trim($value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return filter_var($value, FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

if (!empty($_POST['website'] ?? '')) {
    header('Location: contact.html?status=sent');
    exit;
}

$name = clean_input((string)($_POST['name'] ?? ''));
$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$company = clean_input((string)($_POST['company'] ?? ''));
$service = clean_input((string)($_POST['service'] ?? ''));
$budget = clean_input((string)($_POST['budget'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$consent = (string)($_POST['consent'] ?? '');
$source = clean_input((string)($_POST['form_source'] ?? 'Website form'));

if ($name === '' || $email === false || $company === '' || $service === '' || $budget === '' || $message === '' || $consent !== 'yes') {
    header('Location: contact.html?status=error');
    exit;
}

$safeMessage = strip_tags($message);
$subject = 'New project request from ' . SITE_NAME;
$body = implode("\n", [
    'New website request',
    '-------------------',
    'Name: ' . $name,
    'Email: ' . $email,
    'Company: ' . $company,
    'Service: ' . $service,
    'Budget: ' . $budget,
    'Source: ' . $source,
    '',
    'Message:',
    $safeMessage,
]);

$headers = [
    'From: ' . SITE_NAME . ' <' . RECIPIENT_EMAIL . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(RECIPIENT_EMAIL, $subject, $body, implode("\r\n", $headers));

header('Location: contact.html?status=' . ($sent ? 'sent' : 'error'));
exit;
