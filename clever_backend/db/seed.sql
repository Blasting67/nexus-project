USE cleverkor_db;

INSERT INTO users (id, name, username, email, password_hash, role, is_active) VALUES
(1, 'Administrador Cleverkor', 'admin', 'admin@cleverkor.local', '$2y$10$F4OIF31shqZlcLZf7tzLi.TD1d5ZRzeI6i/gep2qguCeMKRK3UwUC', 'admin', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);
