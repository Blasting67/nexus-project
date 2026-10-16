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

$router->get('/api/assets', function () {
    Response::json([]);
});
$router->get('/api/assets/top10/compare', function () {
    Response::json([]);
});
$router->get('/api/assets/{id}', function (array $params) {
    Response::error('Asset no encontrado', 404);
});
$router->get('/api/assets/{id}/history', function () {
    Response::json([]);
});
$router->post('/api/assets/sync', function () {
    Response::json([]);
});
$router->post('/api/assets/sync-massive', function () {
    Response::json([]);
});

$router->get('/api/market/overview', function () {
    Response::json([
        'total_assets' => 0,
        'total_market_cap' => 0,
        'total_24h_volume' => 0,
        'average_sentiment' => 50,
        'top_gainers' => [],
        'top_losers' => [],
        'most_active' => [],
    ]);
});
$router->post('/api/market/tick', function () {
    Response::json(['updated_assets_count' => 0, 'snapshots_created' => 0]);
});

$router->get('/api/portfolio', function () {
    Response::json([
        'id' => 'default_user',
        'cash_balance' => 10000.0,
        'holdings_value' => 0.0,
        'total_net_worth' => 10000.0,
        'total_pnl' => 0.0,
        'total_pnl_percent' => 0.0,
        'holdings' => [],
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s'),
    ]);
});

$router->post('/api/trading/order', function () {
    Response::json([
        'cash_balance' => 10000.0,
        'holdings_value' => 0.0,
        'total_net_worth' => 10000.0,
        'new_asset_price' => 100.0,
        'transaction' => [
            'id' => 1,
            'portfolio_id' => 'default_user',
            'asset_id' => 1,
            'transaction_type' => 'BUY',
            'quantity' => 1,
            'price_per_unit' => 100.0,
            'total_amount' => 100.0,
            'timestamp' => date('Y-m-d H:i:s'),
        ],
    ]);
});
$router->get('/api/trading/transactions', function () {
    Response::json([]);
});

$router->get('/api/events', function () {
    Response::json([]);
});
$router->get('/api/events/presets', function () {
    Response::json([]);
});
$router->post('/api/events/trigger', function () {
    Response::json(['status' => 'ok']);
});
$router->get('/api/events/asset/{id}', function () {
    Response::json([]);
});

$router->dispatch();
