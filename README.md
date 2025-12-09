# Plataforma de Reporte de Servicios (Laravel + React)

Este proyecto es una plataforma completa para el **reporte, gestión y
seguimiento de incidentes** relacionados con fallas en servicios como
electricidad, agua e internet.\
Incluye una **vista pública**, un **panel administrativo** y un **panel
técnico**, todo integrado mediante **Laravel 10 + React + Vite**.

------------------------------------------------------------------------

## 🚀 Características principales

### **✔ Vista pública**

-   Listado de reportes recientes.
-   Mapa interactivo con ubicación de los incidentes.
-   Formulario para crear nuevos reportes.
-   Datos cargados mediante API REST.

------------------------------------------------------------------------

### **✔ Autenticación**

-   Inicio de sesión para **administradores** y **técnicos**.
-   Redirección automática según rol.
-   Cierre de sesión seguro.
-   Manejo de sesiones con Laravel.

------------------------------------------------------------------------

### **✔ Panel Administrativo**

-   Ver todos los reportes.
-   Asignar técnicos a reportes.
-   Cambiar estado de reportes.
-   Filtrar por tipo de servicio.
-   Ver fichas de técnicos con:
    -   Reportes asignados
    -   Pendientes
    -   Asignados hoy (control de máximo 5)

------------------------------------------------------------------------

### **✔ Panel Técnico**

-   Ver únicamente reportes asignados al técnico autenticado.
-   Actualizar estado a **"En proceso"** o **"Resuelto"**.
-   Interfaz moderna y optimizada para dispositivos móviles.

------------------------------------------------------------------------

## 🗂 Tecnologías usadas

  Tecnología         Uso
  ------------------ -----------------------------------
  **Laravel 10**     Backend, APIs REST, autenticación
  **React + Vite**   Frontend SPA
  **Leaflet**        Mapa interactivo
  **MySQL**          Base de datos
  **CSS puro**       Estilos personalizados

------------------------------------------------------------------------

## 📁 Estructura relevante del proyecto

    /app
        /Http/Controllers
            /API
            /Admin
            /Tecnico
    /resources
        /js (React)
        /views (Laravel blade)
    /public
        favicon.png

------------------------------------------------------------------------

## 🔐 Rutas del sistema

### **Rutas públicas (sin autenticación)**

  Método   Ruta                                   Descripción
  -------- -------------------------------------- -------------------------
  GET      `/api/reportes`                        Lista de reportes
  POST     `/api/reportes`                        Crear nuevo reporte
  GET      `/api/reportes/estado/{estado}`        Filtrar por estado
  GET      `/api/reportes/tipo/{tipo}`            Filtrar por tipo
  GET      `/api/reportes/buscar`                 Búsquedas avanzadas
  GET      `/api/reportes/estadisticas/resumen`   Resumen para dashboards
  GET      `/login`                               Vista de login
  POST     `/login`                               Iniciar sesión

------------------------------------------------------------------------

### **Rutas de Administrador**

  Método   Ruta                                   Descripción
  -------- -------------------------------------- ----------------------------------
  GET      `/admin`                               Panel admin
  GET      `/api/admin/reportes`                  Lista paginada
  GET      `/api/admin/tecnicos`                  Lista de técnicos + estadísticas
  PUT      `/api/admin/reportes/{id}/asignar`     Asignar técnico
  PUT      `/api/admin/reportes/{id}/finalizar`   Marcar como resuelto

------------------------------------------------------------------------

### **Rutas de Técnico**

  Método   Ruta                                  Descripción
  -------- ------------------------------------- -------------------------------
  GET      `/tecnico`                            Panel del técnico
  GET      `/api/tecnico/reportes`               Reportes asignados al técnico
  PUT      `/api/tecnico/reportes/{id}/estado`   Actualizar estado

------------------------------------------------------------------------

### **Rutas de cierre de sesión**

  Método   Ruta        Descripción
  -------- ----------- ---------------
  POST     `/logout`   Cerrar sesión

------------------------------------------------------------------------

## ▶ Instalación

``` bash
git clone <repo>
cd proyecto
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
```

Backend:

``` bash
php artisan serve
```

Frontend:

``` bash
npm run dev
```

------------------------------------------------------------------------
## ▶ Usuarios

### Admin: adming@demo.com
Password: 12345678

### Tecnico: tec1@demo.com
Password: tec12345


------------------------------------------------------------------------

## 📌 Notas finales

-   Usa el archivo `.env` para definir tu base de datos.
-   El sistema reconoce automáticamente el rol (`admin` o `tecnico`) al
    iniciar sesión.
-   Todo el frontend funciona con React y se integra mediante Vite en el
    layout de Laravel.

    #Hay que correr PHP ARTISAN SERVE y NPM RUN DEV en diferentes terminales.

------------------------------------------------------------------------

## 📄 Licencia

Este proyecto es totalmente libre para uso educativo o como base para
implementaciones reales.

------------------------------------------------------------------------

**Desarrollado por Cristian  Hernandez**
