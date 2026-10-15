<?php
declare(strict_types=1);

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '');
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$composerAutoload = __DIR__ . '/../vendor/autoload.php';
if (file_exists($composerAutoload)) {
    require_once $composerAutoload;
} else {
    spl_autoload_register(function (string $class) {
        $prefix = 'CleverBackend\\';
        $baseDir = __DIR__ . '/../src/';
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            return;
        }
        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    });
}

use CleverBackend\Config\Database;
use CleverBackend\Config\Env;
use CleverBackend\Controllers\UserController;
use CleverBackend\Router\Router;
use CleverBackend\Utils\Response;

Env::load(__DIR__ . '/../.env');

$router = new Router();

$router->get('/api/health', function () {
    $dbStatus = 'disconnected';
    try {
        $pdo = Database::getConnection();
        $pdo->query("SELECT 1");
        $dbStatus = 'connected';
    } catch (Throwable $e) {
        $dbStatus = 'error: ' . $e->getMessage();
    }

    Response::json([
        'status' => 'operational',
        'service' => 'clever_backend',
        'environment' => Env::get('APP_ENV', 'local'),
        'database' => $dbStatus,
        'timestamp' => time(),
    ]);
});

$router->post('/api/users', [UserController::class, 'create']);
$router->post('/api/users/login', [UserController::class, 'login']);
$router->get('/api/users/{id}', [UserController::class, 'getById']);
$router->get('/api/users', [UserController::class, 'list']);

$router->put('/api/users/{id}', [UserController::class, 'update']);
$router->post('/api/users/{id}/image', [UserController::class, 'uploadImage']);

$router->dispatch();
