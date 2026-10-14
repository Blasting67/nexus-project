<?php
declare(strict_types=1);

$envPath = __DIR__ . '/.env';
$env = [];
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $env[trim($parts[0])] = trim($parts[1]);
        }
    }
}

$host = $env['DB_HOST'] ?? 'localhost';
$port = (int)($env['DB_PORT'] ?? 3306);
$dbName = $env['DB_NAME'] ?? 'cleverkor_db';
$user = $env['DB_USER'] ?? 'root';
$pass = $env['DB_PASSWORD'] ?? '';

$args = $argv ?? [];
$isFresh = in_array('--fresh', $args, true);
$withSeed = in_array('--seed', $args, true);

try {
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `{$dbName}`");

    if ($isFresh) {
        $schemaSql = file_get_contents(__DIR__ . '/db/schema.sql');
        $pdo->exec($schemaSql);
        echo "[OK] Schema base recreado exitosamente en {$dbName}.\n";
    } else {
        $checkTable = $pdo->query("SHOW TABLES LIKE 'schema_migrations'")->fetch();
        if (!$checkTable) {
            $schemaSql = file_get_contents(__DIR__ . '/db/schema.sql');
            $pdo->exec($schemaSql);
            echo "[OK] Schema base inicializado exitosamente en {$dbName}.\n";
        }
    }

    $pdo->exec("CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(64) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $stmt = $pdo->query("SELECT version FROM schema_migrations");
    $applied = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $updatesDir = __DIR__ . '/db/updates';
    if (is_dir($updatesDir)) {
        $files = glob($updatesDir . '/*.sql');
        sort($files);
        $newCount = 0;

        foreach ($files as $file) {
            $version = basename($file);
            if (!in_array($version, $applied, true)) {
                $sql = file_get_contents($file);
                try {
                    $pdo->exec($sql);
                    $ins = $pdo->prepare("INSERT INTO schema_migrations (version) VALUES (?)");
                    $ins->execute([$version]);
                    echo "[OK] Update aplicado: {$version}\n";
                    $newCount++;
                } catch (Throwable $e) {
                    echo "[ERROR] Fallo al aplicar update {$version}: " . $e->getMessage() . "\n";
                    exit(1);
                }
            }
        }

        if ($newCount === 0) {
            echo "[INFO] Todos los updates de db/updates estan al dia.\n";
        }
    }

    if ($withSeed) {
        $seedFile = __DIR__ . '/db/seed.sql';
        if (file_exists($seedFile)) {
            $seedSql = file_get_contents($seedFile);
            $pdo->exec($seedSql);
            echo "[OK] Datos iniciales de seed.sql aplicados exitosamente.\n";
        }
    }

    echo "[COMPLETADO] Proceso de base de datos finalizado sin errores.\n";
} catch (Throwable $e) {
    echo "[ERROR] Excepcion durante la ejecucion: " . $e->getMessage() . "\n";
    exit(1);
}
