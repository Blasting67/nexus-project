# Cleverkor Web Backend (PHP)

Backend REST en PHP para la gestion de usuarios y servicios web de Cleverkor. Disenado para ejecutarse en entornos locales con XAMPP (Apache y MariaDB/MySQL).

---

## 1. Requisitos Previos

- **PHP**: v8.2 o superior
- **XAMPP**: Modulos Apache y MySQL iniciados en el panel de control
- **Composer**: Opcional (incluye autoloader nativo PSR-4 de respaldo)

---

## 2. Configuracion del Entorno

1. Copiar el archivo de plantilla a `.env`:

```bash
cp .env.example .env
```

En Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

2. Validar que las credenciales apunten a tu instalacion local de XAMPP:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cleverkor_db
DB_USER=root
DB_PASSWORD=
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080
```

---

## 3. Implementacion de la Base de Datos (cleverkor_db)

### Opcion A: Migracion Automatizada via CLI

El proyecto cuenta con el script `migrate.php`, el cual se conecta a MySQL local, crea la base de datos `cleverkor_db` si no existe, ejecuta el esquema inicial, aplica las actualizaciones pendientes de `db/updates/` y registra su estado:

```bash
php migrate.php
```

Para inicializar tambien los datos de prueba (`db/seed.sql`):
```bash
php migrate.php --seed
```

Para recrear la base de datos desde cero:
```bash
php migrate.php --fresh --seed
```

### Opcion B: Importacion Manual via phpMyAdmin

1. Abrir el panel de control de XAMPP y presionar **Admin** en el modulo MySQL (o ingresar a `http://localhost/phpmyadmin`).
2. En la pestana **SQL**, crear la base de datos si no existe:
```sql
CREATE DATABASE IF NOT EXISTS cleverkor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. Seleccionar `cleverkor_db`.
4. Ir a la pestana **Importar**, seleccionar `clever_backend/db/schema.sql` y presionar **Continuar**.
5. (Opcional) Importar `clever_backend/db/seed.sql` para cargar el usuario administrador inicial.

---

## 4. Como Funciona la Carpeta `updates/`

La carpeta `clever_backend/db/updates/` implementa un sistema de migraciones incrementales y control de versiones del esquema de base de datos.

### Estructura de Archivos

```
clever_backend/db/
├── schema.sql                           Esquema base consolidado
├── seed.sql                             Datos semilla iniciales
└── updates/                             Migraciones incrementales
    ├── 001_create_users_table.sql       Creacion inicial de la tabla users
    └── 002_add_user_profile_fields.sql  Actualizacion de columnas complementarias
```

### Principio de Funcionamiento

1. **Tabla de Control (`schema_migrations`)**:
   La base de datos contiene una tabla encargada de registrar cada script ejecutado:
   ```sql
   CREATE TABLE IF NOT EXISTS schema_migrations (
       version VARCHAR(64) PRIMARY KEY,
       applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Orden de Ejecucion**:
   Los archivos dentro de `updates/` se ordenan alfanumericamente por su prefijo numerico (`001_`, `002_`, `003_`, etc.).

3. **Idempotencia**:
   Al ejecutar `php migrate.php`:
   - El script consulta las versiones ya registradas en `schema_migrations`.
   - Si un archivo `.sql` ya fue aplicado previamente, se omite de forma automatica.
   - Si se detecta un nuevo archivo, se ejecuta dentro de una transaccion SQL.
   - Tras ejecutarse sin errores, su nombre se inserta en `schema_migrations`.
   - Si ocurre una falla, se efectua un rollback para proteger la integridad de los datos.

### Como Crear una Nueva Actualizacion

1. Crear un nuevo archivo en `clever_backend/db/updates/` con el siguiente correlativo numerico:
   Ejemplo: `003_add_user_sessions.sql`.
2. Escribir las sentencias SQL deseadas (`ALTER TABLE`, `CREATE TABLE`, etc.).
3. Ejecutar el comando:
   ```bash
   php migrate.php
   ```
4. El nuevo script sera detectado y aplicado inmediatamente.

---

## 5. Iniciar el Servidor de Desarrollo

Para iniciar el servidor local en el puerto 8080:

```bash
php -S localhost:8080 -t public
```

---

## 6. Endpoints Disponibles (Modulo de Usuarios)

### Health Check
- `GET /api/health`

### Creacion de Usuario
- `POST /api/users`
  - Body (JSON):
    ```json
    {
      "name": "Alex Mercer",
      "username": "alexmercer",
      "email": "alex@example.com",
      "password": "password123",
      "avatar": null
    }
    ```

### Inicio de Sesion
- `POST /api/users/login`
  - Body (JSON):
    ```json
    {
      "identifier": "alexmercer",
      "password": "password123"
    }
    ```

### Consultar Usuario por ID
- `GET /api/users/{id}`

### Listar Usuarios
- `GET /api/users`
