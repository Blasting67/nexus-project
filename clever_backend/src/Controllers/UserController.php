<?php
declare(strict_types=1);

namespace CleverBackend\Controllers;

use CleverBackend\Config\Database;
use CleverBackend\Utils\Response;
use PDO;

class UserController
{
    private const PUBLIC_FIELDS = 'id, name, username, email, role, is_active, avatar, cover, bio, featured_achievement, theme, accent_color, created_at, updated_at';
    private const ALLOWED_THEMES = ['default', 'light', 'minimal', 'dark'];
    private const IMAGE_TYPES = ['avatar', 'cover'];
    private const IMAGE_MIMES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    private const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
    private const UPLOAD_PATH_PATTERN = '#^/uploads/[A-Za-z0-9_\-\.]+$#';

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

        Response::success($this->findUser($pdo, $userId), 'Usuario creado exitosamente', 201);
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
        $user = $this->findUser($pdo, $id);

        if (!$user) {
            Response::error('Usuario no encontrado', 404);
            return;
        }

        Response::success($user);
    }

    public function list(): void
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT id, name, username, email, role, is_active, avatar, cover, bio, featured_achievement, created_at FROM users ORDER BY id DESC LIMIT 50");
        $users = $stmt->fetchAll();

        Response::success($users);
    }

    /**
     * PUT /api/users/{id}
     * Body (JSON), todos los campos son opcionales:
     *   name, bio, featuredAchievement, theme, accentColor, avatar, cover
     * avatar y cover solo aceptan null (quitar imagen) o una ruta /uploads/...
     * Las imagenes nuevas se suben con POST /api/users/{id}/image.
     */
    public function update(array $params): void
    {
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Identificador de usuario invalido', 422);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            Response::error('El cuerpo de la peticion no es un JSON valido.', 422);
            return;
        }

        $pdo = Database::getConnection();
        $current = $this->findUser($pdo, $id);
        if (!$current) {
            Response::error('Usuario no encontrado', 404);
            return;
        }

        $sets = [];
        $values = [];

        if (array_key_exists('name', $input)) {
            $name = trim((string)$input['name']);
            if ($name === '' || mb_strlen($name) > 120) {
                Response::error('El nombre es obligatorio y debe tener maximo 120 caracteres.', 422);
                return;
            }
            $sets[] = 'name = ?';
            $values[] = $name;
        }

        if (array_key_exists('bio', $input)) {
            $bio = trim((string)($input['bio'] ?? ''));
            if (mb_strlen($bio) > 160) {
                Response::error('La bio debe tener maximo 160 caracteres.', 422);
                return;
            }
            $sets[] = 'bio = ?';
            $values[] = $bio === '' ? null : $bio;
        }

        if (array_key_exists('featuredAchievement', $input)) {
            $featured = $input['featuredAchievement'];
            if ($featured !== null && (!is_string($featured) || !preg_match('/^[A-Za-z0-9_\-]{1,64}$/', $featured))) {
                Response::error('El titulo destacado no es valido.', 422);
                return;
            }
            $sets[] = 'featured_achievement = ?';
            $values[] = $featured;
        }

        if (array_key_exists('theme', $input)) {
            if (!in_array($input['theme'], self::ALLOWED_THEMES, true)) {
                Response::error('El tema no es valido.', 422);
                return;
            }
            $sets[] = 'theme = ?';
            $values[] = $input['theme'];
        }

        if (array_key_exists('accentColor', $input)) {
            $accent = $input['accentColor'];
            if ($accent !== null && (!is_string($accent) || !preg_match('/^#[0-9A-Fa-f]{6}$/', $accent))) {
                Response::error('El color de acento no es valido (formato #RRGGBB).', 422);
                return;
            }
            $sets[] = 'accent_color = ?';
            $values[] = $accent;
        }

        foreach (self::IMAGE_TYPES as $imageField) {
            if (!array_key_exists($imageField, $input)) {
                continue;
            }
            $path = $input[$imageField];
            if ($path !== null && (!is_string($path) || !preg_match(self::UPLOAD_PATH_PATTERN, $path))) {
                Response::error("El campo {$imageField} solo acepta null o una ruta /uploads/...", 422);
                return;
            }
            $sets[] = "{$imageField} = ?";
            $values[] = $path;
        }

        if (!$sets) {
            Response::error('No hay campos validos para actualizar.', 422);
            return;
        }

        $values[] = $id;
        $stmt = $pdo->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?');
        $stmt->execute($values);

        // Si se quito una imagen, borra el archivo anterior del disco
        foreach (self::IMAGE_TYPES as $imageField) {
            if (array_key_exists($imageField, $input) && $input[$imageField] === null) {
                $this->deleteUploadedFile($current[$imageField] ?? null);
            }
        }

        Response::success($this->findUser($pdo, $id), 'Perfil actualizado');
    }

    /**
     * POST /api/users/{id}/image  (multipart/form-data)
     * Campos: type = avatar | cover, file = imagen (jpg, png o webp, max 2 MB)
     * Guarda el archivo en public/uploads y almacena solo la ruta en la base de datos.
     */
    public function uploadImage(array $params): void
    {
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::error('Identificador de usuario invalido', 422);
            return;
        }

        $type = $_POST['type'] ?? '';
        if (!in_array($type, self::IMAGE_TYPES, true)) {
            Response::error("El campo type debe ser 'avatar' o 'cover'.", 422);
            return;
        }

        $file = $_FILES['file'] ?? null;
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            Response::error('No se recibio una imagen valida.', 422);
            return;
        }

        if ($file['size'] > self::MAX_IMAGE_BYTES) {
            Response::error('La imagen supera el maximo de 2 MB.', 422);
            return;
        }

        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        if (!isset(self::IMAGE_MIMES[$mime])) {
            Response::error('Formato no permitido. Usa JPG, PNG o WEBP.', 422);
            return;
        }

        $pdo = Database::getConnection();
        $current = $this->findUser($pdo, $id);
        if (!$current) {
            Response::error('Usuario no encontrado', 404);
            return;
        }

        $uploadDir = $this->uploadDir();
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
            Response::error('No se pudo crear la carpeta de subidas.', 500);
            return;
        }

        $filename = sprintf('%s_%d_%s.%s', $type, $id, bin2hex(random_bytes(6)), self::IMAGE_MIMES[$mime]);
        if (!move_uploaded_file($file['tmp_name'], $uploadDir . '/' . $filename)) {
            Response::error('No se pudo guardar la imagen.', 500);
            return;
        }

        $stmt = $pdo->prepare("UPDATE users SET {$type} = ? WHERE id = ?");
        $stmt->execute(['/uploads/' . $filename, $id]);

        $this->deleteUploadedFile($current[$type] ?? null);

        Response::success($this->findUser($pdo, $id), 'Imagen actualizada');
    }

    private function findUser(PDO $pdo, int $id): array|false
    {
        $stmt = $pdo->prepare('SELECT ' . self::PUBLIC_FIELDS . ' FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    private function uploadDir(): string
    {
        return dirname(__DIR__, 2) . '/public/uploads';
    }

    private function deleteUploadedFile(?string $path): void
    {
        if (!$path || !preg_match(self::UPLOAD_PATH_PATTERN, $path)) {
            return;
        }
        $full = $this->uploadDir() . '/' . basename($path);
        if (is_file($full)) {
            @unlink($full);
        }
    }
}