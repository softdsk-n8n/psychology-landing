<?php
// Скрипт для збереження контенту в content.json

// Встановлюємо заголовки для JSON-відповіді
header('Content-Type: application/json');

// Перевіряємо метод запиту
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Отримуємо сирі дані з тіла запиту
$json_data = file_get_contents('php://input');

// Перевіряємо чи валідний JSON ми отримали
$decode_test = json_decode($json_data);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Шлях до файлу з контентом
// (оскільки скрипт лежить у папці admin/, файл лежить у ../content/content.json)
$file_path = __DIR__ . '/../content/content.json';

// Спробуємо записати дані у файл
$result = file_put_contents($file_path, $json_data);

if ($result !== false) {
    echo json_encode(['success' => true, 'message' => 'Дані успішно збережено']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write file. Перевірте права доступу до папки content (має бути 755 або 777).']);
}
?>
