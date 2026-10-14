# CLEVER — Plataforma Integral de Aprendizaje y Exchange Financiero

CLEVER es una plataforma integral que combina un universo formativo y gamificado junto con un mercado financiero practico (Exchange Spot) para operar activos de la industria del entretenimiento y los videojuegos en tiempo real.

---

## Arquitectura del Proyecto

```
clever/
├── clever_backend/      Backend REST en PHP para la web y modulo de usuarios
├── clever_api/          Backend REST en Python (FastAPI) para el Exchange bursatil
├── clever_web/          Frontend SPA con React 19, TypeScript, Tailwind CSS y Vite
├── prototipo/           Esqueleto funcional inicial y banco de preguntas de referencia
├── .gitignore           Ignorado global de dependencias y artefactos
└── README.md            Guia de inicio y puesta en marcha
```

---

## Requisitos Previos

- **PHP**: v8.2 o superior
- **XAMPP**: Apache y MySQL / MariaDB en ejecucion local
- **Node.js**: v18.0.0 o superior (se recomienda v20+)
- **pnpm**: v8.0.0 o superior
- **Python**: v3.10 o superior (para clever_api)

---

## 1. Puesta en Marcha del Backend Web (clever_backend en PHP)

El backend web gestiona la creacion de usuarios, validaciones y persistencia en la base de datos local `cleverkor_db`.

### Pasos:

1. Abrir una terminal en la carpeta `clever_backend`:
```bash
cd clever_backend
```

2. Configurar las variables de entorno:
En Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```
En Linux / macOS / Bash:
```bash
cp .env.example .env
```

3. Verificar que `.env` apunte a tu base de datos local de XAMPP:
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

4. Iniciar el servidor local en el puerto 8080:
```bash
php -S localhost:8080 -t public
```

---

## 2. Base de Datos (cleverkor_db) y Sistema de Updates

La base de datos web se denomina `cleverkor_db` y funciona de manera independiente sobre XAMPP MySQL.

### Implementacion de la Base de Datos

#### Metodo 1: Ejecucion Directa via CLI con migrate.php (Recomendado)

El archivo `clever_backend/migrate.php` automatiza la creacion de la base de datos `cleverkor_db`, la ejecucion del esquema base, la aplicacion de actualizaciones pendientes y la carga de datos de prueba:

```bash
cd clever_backend
php migrate.php
```

Para cargar adicionalmente el usuario inicial de prueba (`seed.sql`):
```bash
php migrate.php --seed
```

Para reiniciar la base de datos desde cero:
```bash
php migrate.php --fresh --seed
```

#### Metodo 2: Implementacion Manual con phpMyAdmin

1. Abrir el panel de control de XAMPP y presionar **Admin** en la fila de **MySQL** (o acceder a `http://localhost/phpmyadmin`).
2. En la pestana **SQL**, crear la base de datos:
```sql
CREATE DATABASE IF NOT EXISTS cleverkor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. Seleccionar `cleverkor_db` en el arbol lateral izquierdo.
4. Ir a la pestana **Importar**, seleccionar el archivo `clever_backend/db/schema.sql` y presionar **Continuar**.
5. Opcionalmente, importar `clever_backend/db/seed.sql` para registrar el usuario administrador inicial.

---

### Como Funciona la Carpeta `updates/`

La carpeta `clever_backend/db/updates/` implementa un flujo de migraciones incrementales versionadas.

```
clever_backend/db/
├── schema.sql                           Esquema DDL base consolidado
├── seed.sql                             Inserciones iniciales
└── updates/                             Scripts de actualizacion incremental
    ├── 001_create_users_table.sql       Definicion de tabla users
    └── 002_add_user_profile_fields.sql  Adicion de bio y theme a users
```

#### Mecanica de Control:

1. **Tabla de Control `schema_migrations`**:
   Al iniciar, se crea la tabla que lleva el historial de actualizaciones aplicadas:
   ```sql
   CREATE TABLE IF NOT EXISTS schema_migrations (
       version VARCHAR(64) PRIMARY KEY,
       applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Orden Correlativo**:
   Los archivos `.sql` dentro de `updates/` se nombran con un prefijo numerico secuencial (`001_`, `002_`, `003_`, etc.) y se procesan en estricto orden ascendente.

3. **Garantia de Idempotencia**:
   - `migrate.php` compara los archivos fisicos de `db/updates/` contra los registros en `schema_migrations`.
   - Si un archivo ya figura en la tabla, se omite.
   - Si no figura, se ejecuta dentro de una transaccion SQL protegida con commit y rollback.
   - Una vez ejecutado exitosamente, se inserta su nombre en `schema_migrations`.

#### Como Anadir una Nueva Actualizacion en el Futuro:

1. Crear un archivo en `clever_backend/db/updates/` con el siguiente numero secuencial, por ejemplo:
   `003_create_user_tokens.sql`
2. Escribir las sentencias SQL deseadas (`CREATE TABLE`, `ALTER TABLE`, etc.).
3. Ejecutar en terminal:
   ```bash
   php migrate.php
   ```
4. El script detectara unicamente el nuevo archivo y lo aplicara a `cleverkor_db`.

---

## 3. Puesta en Marcha de clever_api (Exchange Bursatil)

API REST independiente en FastAPI dedicada exclusivamente a la simulacion de mercado y cotizaciones.

```bash
cd clever_api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 4. Puesta en Marcha del Frontend (clever_web)

```bash
cd clever_web
pnpm install
Copy-Item .env.example .env
pnpm dev
```

Abrir en el navegador: `http://localhost:5173`
