-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-11-2025 a las 20:03:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reportes_servicios_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_11_24_164706_add_codigo_to_reportes_table', 2),
(5, '2025_11_24_165616_add_assigned_at_to_reportes_table', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tipo_servicio` enum('electricidad','agua','internet') NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `proveedor` varchar(255) DEFAULT NULL,
  `departamento` varchar(255) DEFAULT NULL,
  `municipio` varchar(255) DEFAULT NULL,
  `zona` varchar(255) DEFAULT NULL,
  `latitud` decimal(10,7) DEFAULT NULL,
  `longitud` decimal(10,7) DEFAULT NULL,
  `estado` enum('pendiente','en_proceso','resuelto','descartado') NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `assignee_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Técnico asignado',
  `assigned_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reportes`
--

INSERT INTO `reportes` (`id`, `codigo`, `user_id`, `tipo_servicio`, `titulo`, `descripcion`, `proveedor`, `departamento`, `municipio`, `zona`, `latitud`, `longitud`, `estado`, `created_at`, `updated_at`, `assignee_id`, `assigned_at`) VALUES
(1, NULL, NULL, 'electricidad', 'Corte de luz en la colonia Escalón', 'No hay energía eléctrica desde las 8:00 PM en varias cuadras.', 'AES', 'San Salvador', 'San Salvador', 'Colonia Escalón', 13.7085670, -89.2191230, 'pendiente', '2025-11-20 10:34:59', '2025-11-25 00:40:03', 2, '2025-11-25 00:40:03'),
(2, NULL, NULL, 'internet', 'INTERNET NO FUNCIONA', 'No sirve el internet desde las 9:00am', 'Tigo', 'La Libertad', 'Colon', 'Colonia Tepeyac', 13.7000000, -89.2100000, 'descartado', '2025-11-20 12:16:38', '2025-11-25 00:40:05', 2, '2025-11-25 00:40:05'),
(3, NULL, NULL, 'agua', 'Corte de agua por muchos días', 'No hemos tenido agua desde el pasado viernes.', 'ANDA', 'La Libertad', 'Colon', 'Colonia Tepeyac', 13.7215790, -89.3623190, 'en_proceso', '2025-11-20 12:31:36', '2025-11-25 00:40:06', 2, '2025-11-25 00:40:06'),
(4, NULL, NULL, 'agua', 'No hay agua', 'Hemos estado sin el servicio de agua por mas de 2 semanas, queremos una solución lo mas pronto posible', 'ANDA', 'San Salvador', 'San Salvador', 'Comunidad la asunción, 35 Avenida Sur', 13.6968920, -89.2099610, 'resuelto', '2025-11-22 13:39:34', '2025-11-25 00:36:02', NULL, NULL),
(5, NULL, NULL, 'electricidad', 'Corte de luz en colonia Escalón', 'Desde las 8:00 PM no hay energía eléctrica en varias cuadras de la colonia.', 'AES CAESS', 'San Salvador', 'San Salvador', 'Colonia Escalón', 13.7085000, -89.2148000, 'en_proceso', '2025-11-21 02:00:00', '2025-11-25 00:36:01', NULL, NULL),
(6, NULL, NULL, 'internet', 'Internet intermitente en Soyapango', 'El servicio se corta cada pocos minutos, afecta a varios vecinos del pasaje.', 'Tigo', 'San Salvador', 'Soyapango', 'Residencial Los Santos', 13.7098000, -89.1512000, 'pendiente', '2025-11-21 15:15:00', '2025-11-21 15:15:00', NULL, NULL),
(7, NULL, NULL, 'agua', 'Falta de agua desde hace tres días', 'No hay suministro de agua potable en la zona, solo llega de madrugada con poca presión.', 'ANDA', 'La Libertad', 'Colón', 'Colonia Tepeyac', 13.7203000, -89.3602000, 'pendiente', '2025-11-19 12:30:00', '2025-11-19 12:30:00', 3, NULL),
(8, NULL, NULL, 'electricidad', 'Variaciones de voltaje en Mejicanos', 'Los aparatos se reinician por bajones de energía frecuentes.', 'AES CLESA', 'San Salvador', 'Mejicanos', 'Colonia Zacamil', 13.7299000, -89.2187000, 'en_proceso', '2025-11-19 00:10:00', '2025-11-25 00:35:25', NULL, NULL),
(9, NULL, NULL, 'agua', 'Agua turbia en el grifo', 'El agua sale con color amarillento y mal olor desde esta mañana.', 'ASA', 'San Salvador', 'San Salvador', 'Barrio San Jacinto', 13.6784000, -89.1875000, 'resuelto', '2025-11-15 13:40:00', '2025-11-15 17:20:00', 3, NULL),
(10, NULL, NULL, 'internet', 'Sin servicio de internet en Lourdes', 'Desde ayer en la noche no hay señal, el router marca sin conexión.', 'Claro', 'La Libertad', 'Colón', 'Lourdes', 13.7442000, -89.3590000, 'en_proceso', '2025-11-21 16:05:00', '2025-11-25 00:35:24', NULL, NULL),
(11, NULL, NULL, 'electricidad', 'Poste caído por choque', 'Un vehículo chocó contra un poste y dejó sin luz a la cuadra completa.', 'AES EEO', 'San Salvador', 'San Salvador', 'Colonia Miramonte', 13.6987000, -89.2140000, 'pendiente', '2025-11-21 04:10:00', '2025-11-21 04:10:00', NULL, NULL),
(12, NULL, NULL, 'agua', 'Fuga de agua en calle principal', 'Tubería rota dejando correr agua todo el día sobre la calle.', 'ANDA', 'San Salvador', 'Apopa', 'Boulevard Constitución', 13.7722000, -89.1863000, 'en_proceso', '2025-11-17 20:25:00', '2025-11-17 21:00:00', 3, NULL),
(13, NULL, NULL, 'internet', 'Baja velocidad de internet', 'El plan es de 50 Mbps pero solo llegan 2–3 Mbps de descarga.', 'Tigo', 'San Salvador', 'Santa Tecla', 'Colonia Quezaltepeque', 13.6748000, -89.2795000, 'descartado', '2025-11-17 01:00:00', '2025-11-25 00:00:35', NULL, NULL),
(14, NULL, NULL, 'electricidad', 'Apagones ocasionales en Antiguo Cuscatlán', 'Cortes de menos de un minuto varias veces al día.', 'AES DEUSEM', 'La Libertad', 'Antiguo Cuscatlán', 'Residencial Costa Rica', 13.6733000, -89.2501000, 'resuelto', '2025-11-14 14:50:00', '2025-11-14 18:30:00', 3, NULL),
(15, NULL, NULL, 'electricidad', 'Corte total en la zona rural de Chalatenango', 'Desde la madrugada no hay energía, afecta a varias comunidades.', 'AES CAESS', 'Chalatenango', 'La Reina', 'Caserío El Rosario', 14.1005000, -89.1652000, 'pendiente', '2025-11-18 11:20:00', '2025-11-18 11:20:00', NULL, NULL),
(16, NULL, NULL, 'agua', 'Agua con mal olor en Sonsonate', 'Vecinos reportan agua turbia y olor fuerte en toda la colonia.', 'ANDA', 'Sonsonate', 'Sonzacate', 'Colonia 14 de Diciembre', 13.7218000, -89.7430000, 'pendiente', '2025-11-19 15:15:00', '2025-11-19 15:15:00', 3, NULL),
(17, NULL, NULL, 'internet', 'Fallas constantes en Ahuachapán', 'El internet se desconecta cada 10 minutos aproximadamente.', 'Claro', 'Ahuachapán', 'Atiquizaya', 'Barrio El Centro', 13.9762000, -89.7520000, 'en_proceso', '2025-11-20 20:30:00', '2025-11-25 00:00:33', NULL, NULL),
(18, NULL, NULL, 'electricidad', 'Bajones de voltaje en San Miguel', 'Variaciones bruscas que dañaron dos refrigeradoras.', 'AES EEO', 'San Miguel', 'San Miguel', 'Colonia Ciudad Jardín', 13.4865000, -88.1873000, 'pendiente', '2025-11-22 00:40:00', '2025-11-25 00:35:22', NULL, NULL),
(19, NULL, NULL, 'agua', 'Fuga masiva en La Unión', 'Gran cantidad de agua corriendo sobre la calle principal.', 'ANDA', 'La Unión', 'La Unión', 'Barrio El Centro', 13.3364000, -87.8421000, 'en_proceso', '2025-11-17 16:15:00', '2025-11-25 00:35:03', NULL, NULL),
(20, NULL, NULL, 'internet', 'Sin servicio en Usulután', 'Zona completa sin conexión desde la madrugada.', 'Tigo', 'Usulután', 'Jiquilisco', 'Cantón La Canoa', 13.3331000, -88.6105000, 'resuelto', '2025-11-14 08:30:00', '2025-11-25 00:35:19', NULL, NULL),
(21, NULL, NULL, 'electricidad', 'Poste dañado por tormenta', 'Fuerte tormenta tumbó líneas eléctricas en la zona costera.', 'AES CAESS', 'La Paz', 'San Luis La Herradura', 'Costa del Sol', 13.3187000, -88.9483000, 'en_proceso', '2025-11-21 05:10:00', '2025-11-25 00:35:18', NULL, NULL),
(22, NULL, NULL, 'agua', 'Cortes intermitentes en Morazán', 'Servicio llega por una hora y luego desaparece.', 'ANDA', 'Morazán', 'San Francisco Gotera', 'Barrio La Cruz', 13.7074000, -88.1002000, 'pendiente', '2025-11-19 14:10:00', '2025-11-25 00:35:17', NULL, NULL),
(23, NULL, NULL, 'internet', 'Lentitud extrema en Santa Rosa de Lima', 'Solo llegan 1–2 Mbps cuando el plan es de 20 Mbps.', 'Claro', 'La Unión', 'Santa Rosa de Lima', 'Colonia Santa Elena', 13.6308000, -87.8935000, 'descartado', '2025-11-16 17:55:00', '2025-11-25 00:35:15', NULL, NULL),
(24, NULL, NULL, 'electricidad', 'Zonas completas sin energía', 'Apagón general en varios cantones de Cabañas.', 'AES CLESA', 'Cabañas', 'Sensuntepeque', 'Cantón Llano de la Hacienda', 13.8732000, -88.6319000, 'resuelto', '2025-11-16 01:50:00', '2025-11-25 00:35:13', NULL, NULL),
(25, 'A00025', NULL, 'internet', 'Internet no funciona', 'No tenemos servicio desde las 6:00 am', 'Tigo', 'La Libertad', 'Colon', 'Colonia Tepeyac, Calle Principal;', 13.7218660, -89.3621170, 'pendiente', '2025-11-24 23:57:19', '2025-11-25 00:35:11', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','tecnico') NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@demo.com', NULL, '$2y$12$uBrZZXdf96qHNBr..F5Kkun6fSJma31/Pm.PzTu2hauy5aUIIMy6i', 'admin', NULL, '2025-11-22 10:13:52', '2025-11-22 10:13:52'),
(2, 'Tecnico 1', 'tec1@demo.com', NULL, '$2y$12$o4i5ulLbYEOqslsciUNwc.1s0.uKInxEDRXXEMVHHJPhCVbxnTANK', 'tecnico', NULL, '2025-11-22 11:38:01', '2025-11-22 11:38:01'),
(4, 'Tecnico 3', 'tec3@demo.com', NULL, '$2y$12$hANeJk.O2239X2tXG3sWhOLBjkhCx6wHjqClE8lWrZJ67.ZwN5RMC', 'tecnico', NULL, '2025-11-22 13:46:52', '2025-11-22 13:46:52'),
(5, 'Tecnico 2', 'tec2@demo.com', NULL, '$2y$12$n3SAwATF7fuZB9MCwn0pG.bdNDMi7T26msTDVNMi5FEIi/chVZFeq', 'tecnico', NULL, '2025-11-22 13:50:54', '2025-11-22 13:50:54');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reportes_codigo_unique` (`codigo`),
  ADD KEY `reportes_user_id_index` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
