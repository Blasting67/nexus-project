<?php
declare(strict_types=1);

namespace CleverBackend\Controllers;

use CleverBackend\Config\Database;
use CleverBackend\Utils\Response;
use PDO;

class UserController
{
    public function create(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $name = trim($input['name'] ?? '');
        $username = trim($input['username'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';
        $avatar = $input['avatar'] ?? null;
        $role = $input['role'] ?? 'user';

        if ($name === '') {
            Response::error('El nombre es obligatorio.', 422);
            return;
        }

        if ($username === '' || strlen($username) < 3) {
            Response::error('El nombre de usuario debe tener al menos 3 caracteres.', 422);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('El correo electronico no tiene un formato valido.', 422);
            return;
        }

        if (strlen($password) < 6) {
            Response::error('La contrasena debe tener al menos 6 caracteres.', 422);
            return;
        }

        $pdo = Database::getConnection();

        $stmtCheck = $pdo->prepare("SELECT id, username, email FROM users WHERE username = ? OR email = ? LIMIT 1");
        $stmtCheck->execute([$username, $email]);
        $existing = $stmtCheck->fetch();

        if ($existing) {
            if (strcasecmp($existing['username'], $username) === 0) {
                Response::error('El nombre de usuario ya se encuentra registrado.', 409);
                return;
            }
            Response::error('El correo electronico ya se encuentra registrado.', 409);
            return;
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        $stmtInsert = $pdo->prepare("INSERT INTO users (name, username, email, password_hash, role, is_active, avatar) VALUES (?, ?, ?, ?, ?, 1, ?)");
        $stmtInsert->execute([$name, $username, $email, $passwordHash, $role, $avatar]);

        $userId = (int)$pdo->lastInsertId();

        $stmtUser = $pdo->prepare("SELECT id, name, username, email, role, is_active, avatar, created_at, updated_at FROM users WHERE id = ?");
        $stmtUser->execute([$userId]);
        $createdUser = $stmtUser->fetch();

        Response::success($createdUser, 'Usuario creado exitosamente', 201);
    }

    public function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $identifier = trim($input['identifier'] ?? $input['email'] ?? $input['username'] ?? '');
        $password = $input['password'] ?? '';

        if ($identifier === '' || $password === '') {
            Response::error('Identificador y contrasena requeridos.', 422);
            return;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1");
        $stmt->execute([$identifier, $identifier]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::error('Credenciales incorrectas.', 401);
            return;
        }

        if (!(bool)$user['is_active']) {
            Response::error('La cuenta se encuentra inactiva.', 403);
            return;
        }

        unset($user['password_hash']);

        Response::success($user, 'Inicio de sesion exitoso');
    }

    public function getById(array $params): void
    {
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Identificador de usuario invalido', 422);
            return;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, name, username, email, role, is_active, avatar, created_at, updated_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::error('Usuario no encontrado', 404);
            return;
        }

        Response::success($user);
    }

    public function list(): void
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT id, name, username, email, role, is_active, avatar, created_at FROM users ORDER BY id DESC LIMIT 50");
        $users = $stmt->fetchAll();

        Response::success($users);
    }
}
