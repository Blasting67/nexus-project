<?php
declare(strict_types=1);

namespace CleverBackend\Router;

use CleverBackend\Utils\Response;

class Router
{
    private array $routes = [];

    public function get(string $path, callable|array $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, callable|array $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    public function put(string $path, callable|array $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete(string $path, callable|array $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    public function options(string $path, callable|array $handler): void
    {
        $this->addRoute('OPTIONS', $path, $handler);
    }

    private function addRoute(string $method, string $path, callable|array $handler): void
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
        ];
    }

    public function dispatch(): void
    {
        $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $requestUri = $_SERVER['REQUEST_URI'] ?? '/';
        $parsedUrl = parse_url($requestUri, PHP_URL_PATH);
        $cleanUri = rtrim($parsedUrl, '/');
        if ($cleanUri === '') {
            $cleanUri = '/';
        }

        if ($requestMethod === 'OPTIONS') {
            Response::json(['status' => 'ok'], 200);
            return;
        }

        foreach ($this->routes as $route) {
            if ($route['method'] !== $requestMethod) {
                continue;
            }

            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $route['path']);
            $pattern = '#^' . rtrim($pattern, '/') . '$#';
            if ($pattern === '#^$#') {
                $pattern = '#^/$#';
            }

            if (preg_match($pattern, $cleanUri, $matches)) {
                $params = array_filter($matches, '\is_string', ARRAY_FILTER_USE_KEY);
                $handler = $route['handler'];

                if (is_array($handler)) {
                    [$class, $method] = $handler;
                    $controller = new $class();
                    $controller->$method($params);
                    return;
                }

                if (is_callable($handler)) {
                    call_user_func($handler, $params);
                    return;
                }
            }
        }

        Response::error('Ruta no encontrada', 404);
    }
}
