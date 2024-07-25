DROP DATABASE IF EXISTS EssenZial;

CREATE DATABASE IF NOT EXISTS EssenZial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE EssenZial;

-- Tabla Clientes
CREATE TABLE IF NOT EXISTS tb_clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    apellido_cliente VARCHAR(255) NOT NULL,
    correo_cliente VARCHAR(255) UNIQUE NOT NULL,
    telefono_cliente VARCHAR(20) UNIQUE,
    clave_cliente VARCHAR(300) NOT NULL,
    estado_cliente BOOLEAN DEFAULT TRUE
) ENGINE=INNODB;

-- Tabla Direcciones
CREATE TABLE IF NOT EXISTS tb_direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_direccion VARCHAR(255) NOT NULL,
    direccion_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20) UNIQUE,
    codigo_postal VARCHAR(5) NOT NULL,
    instrucciones_entrega VARCHAR(100) NOT NULL,
    id_cliente INT NOT NULL,
    CONSTRAINT FK_tb_direcciones_clientes
    FOREIGN KEY (id_cliente) REFERENCES tb_clientes(id_cliente)
) ENGINE=INNODB;

-- Tabla Administradores
CREATE TABLE IF NOT EXISTS tb_admins (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre_admin VARCHAR(255) NOT NULL,
    apellido_admin VARCHAR(255) NOT NULL,
    correo_admin VARCHAR(300) UNIQUE NOT NULL,
    clave_admin TEXT NOT NULL
) ENGINE=InnoDB;

-- Tabla Categorías
CREATE TABLE IF NOT EXISTS tb_categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(255) NOT NULL,
    imagen_categoria VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Tabla Marcas
CREATE TABLE IF NOT EXISTS tb_marcas (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre_marca VARCHAR(255) UNIQUE NOT NULL,
    imagen_marca VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Tabla Olores
CREATE TABLE IF NOT EXISTS tb_olores (
    id_olor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_olor VARCHAR(255) UNIQUE,
    imagen_olor VARCHAR(100) NOT NULL
) ENGINE=INNODB;

-- Tabla Descuentos
CREATE TABLE IF NOT EXISTS tb_descuentos (
    id_descuento INT AUTO_INCREMENT PRIMARY KEY,
    cantidad_descuento DECIMAL(10, 2) NOT NULL DEFAULT '0.15',
    descripcion_descuento TEXT,
    fecha_inicio_descuento DATE DEFAULT (CURRENT_DATE),
    estado_descuento BOOLEAN DEFAULT TRUE,
    fecha_fin_descuento DATE
) ENGINE=InnoDB;

-- Tabla Inventarios
CREATE TABLE IF NOT EXISTS tb_inventarios (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_inventario VARCHAR(255) NOT NULL,
    cantidad_inventario INT NOT NULL CHECK(cantidad_inventario > 0),
    descripcion_inventario TEXT NOT NULL,
    precio_inventario DECIMAL(10, 2) NOT NULL CHECK(precio_inventario > 0),
    id_olor INT NOT NULL,
    id_categoria INT NOT NULL,
    id_marca INT NOT NULL,
    id_descuento INT NOT NULL,
    CONSTRAINT FK_inventario_descuento FOREIGN KEY (id_descuento) REFERENCES tb_descuentos(id_descuento),
    CONSTRAINT FK_inventario_olor FOREIGN KEY (id_olor) REFERENCES tb_olores(id_olor),
    CONSTRAINT FK_inventario_categoria FOREIGN KEY (id_categoria) REFERENCES tb_categorias(id_categoria),
    CONSTRAINT FK_inventario_marca FOREIGN KEY (id_marca) REFERENCES tb_marcas(id_marca)
) ENGINE=InnoDB;



-- Tabla Imagenes
CREATE TABLE IF NOT EXISTS tb_imagenes (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    ruta_imagen VARCHAR(100) NOT NULL,
    id_inventario INT NOT NULL,
    CONSTRAINT FK_imagen_inventario FOREIGN KEY (id_inventario) REFERENCES tb_inventarios(id_inventario)
) ENGINE=InnoDB;

-- Tabla Pedidos
CREATE TABLE IF NOT EXISTS tb_pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    total_pago DECIMAL(10,2) NOT NULL DEFAULT '0.00',
    fecha_pedido DATE DEFAULT (CURRENT_DATE),
    tipo_pago BOOLEAN DEFAULT TRUE,
    estado_pedido ENUM('Preparandose', 'Enviando', 'Finalizado') DEFAULT ('Preparandose'),
    estado_carrito ENUM('Carrito', 'Realizado') DEFAULT ('Carrito'),
    id_direccion INT ,
    id_cliente INT NOT NULL, 
    CONSTRAINT FK_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES tb_clientes(id_cliente), 
    CONSTRAINT FK_pedido_direccion FOREIGN KEY (id_direccion) REFERENCES tb_direcciones(id_direccion)
) ENGINE=InnoDB;

-- Tabla Detalle Pedido
CREATE TABLE IF NOT EXISTS tb_detalle_pedido (
    id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
    cantidad_producto INT NOT NULL CHECK(cantidad_producto > 0),
    costo_actual DECIMAL(10, 2) NOT NULL CHECK(costo_actual > 0),
    id_pedido INT NOT NULL,
    id_inventario INT NOT NULL,
    CONSTRAINT FK_detalle_pedido_pedido FOREIGN KEY (id_pedido) REFERENCES tb_pedidos(id_pedido),
    CONSTRAINT FK_detalle_pedido_inventario FOREIGN KEY (id_inventario) REFERENCES tb_inventarios(id_inventario)
) ENGINE=INNODB;

-- Tabla Valoraciones
CREATE TABLE IF NOT EXISTS tb_valoraciones (
    id_valoracion INT AUTO_INCREMENT PRIMARY KEY,
    calificacion_producto INT NOT NULL CHECK(calificacion_producto >= 0 AND calificacion_producto <= 5),
    comentario_producto VARCHAR(250) NOT NULL,
    fecha_valoracion DATE DEFAULT (CURRENT_DATE),
    estado_comentario BOOLEAN DEFAULT TRUE,
    id_detalle_pedido INT NOT NULL,
    CONSTRAINT FK_valoracion_Detalle_pedido FOREIGN KEY (id_detalle_pedido) REFERENCES tb_detalle_pedido(id_detalle_pedido)
) ENGINE=InNODB;

DROP VIEW IF EXISTS marcas_mas_vendidas;

CREATE VIEW `marcas_mas_vendidas` AS 
SELECT 
    `m`.`nombre_marca` AS `nombre_marca`,
    COUNT(0) AS `numero_ventas`,
    COUNT(DISTINCT `p`.`id_pedido`) AS `total_ventas`
FROM 
    `tb_marcas` `m`
JOIN 
    `tb_inventarios` `i` ON (`m`.`id_marca` = `i`.`id_marca`)
JOIN 
    `tb_detalle_pedido` `dp` ON (`i`.`id_inventario` = `dp`.`id_inventario`)
JOIN 
    `tb_pedidos` `p` ON (`dp`.`id_pedido` = `p`.`id_pedido`)
WHERE 
    `p`.`estado_pedido` = 'Finalizado'
GROUP BY 
    `m`.`nombre_marca`
ORDER BY 
    `numero_ventas` DESC
LIMIT 5;

DROP VIEW IF EXISTS perfumes_mas_vendidos;

CREATE VIEW `perfumes_mas_vendidos` AS 
SELECT 
    `i`.`nombre_inventario` AS `nombre_producto`,
    SUM(`dp`.`cantidad_producto`) AS `total_ventas`
FROM 
    `tb_detalle_pedido` `dp`
JOIN 
    `tb_inventarios` `i` ON (`dp`.`id_inventario` = `i`.`id_inventario`)
GROUP BY 
    `i`.`nombre_inventario`
ORDER BY 
    SUM(`dp`.`cantidad_producto`) DESC
LIMIT 5;

DROP VIEW IF EXISTS ultimos_pedidos;

CREATE VIEW `ultimos_pedidos` AS 
SELECT 
    `p`.`fecha_pedido` AS `fecha`,
    `i`.`nombre_inventario` AS `nombre_producto`,
    `im`.`ruta_imagen` AS `imagen_producto`,
    `d`.`cantidad_producto` AS `cantidad`
FROM 
    `tb_pedidos` `p`
JOIN 
    `tb_detalle_pedido` `d` ON (`p`.`id_pedido` = `d`.`id_pedido`)
JOIN 
    `tb_inventarios` `i` ON (`d`.`id_inventario` = `i`.`id_inventario`)
JOIN 
    `tb_imagenes` `im` ON (`i`.`id_inventario` = `im`.`id_inventario`)
ORDER BY 
    `p`.`fecha_pedido` DESC
LIMIT 5;

DROP VIEW IF EXISTS valoraciones_producto;

CREATE VIEW `valoraciones_producto` AS 
SELECT 
    i.id_inventario AS id_producto,
    ROUND(COALESCE(AVG(v.calificacion_producto), 0), 1) AS valoracion_calculada
FROM 
    tb_inventarios i
LEFT JOIN 
    tb_detalle_pedido dp ON i.id_inventario = dp.id_inventario
LEFT JOIN 
    tb_valoraciones v ON dp.id_detalle_pedido = v.id_detalle_pedido
GROUP BY 
    i.id_inventario;
    
DROP VIEW IF EXISTS ventas_ultimos_meses;

CREATE VIEW `ventas_ultimos_meses` AS 
SELECT 
    CASE 
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'January' THEN 'Enero'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'February' THEN 'Febrero'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'March' THEN 'Marzo'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'April' THEN 'Abril'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'May' THEN 'Mayo'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'June' THEN 'Junio'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'July' THEN 'Julio'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'August' THEN 'Agosto'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'September' THEN 'Septiembre'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'October' THEN 'Octubre'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'November' THEN 'Noviembre'
        WHEN DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M') = 'December' THEN 'Diciembre'
    END AS `mes`,
    COUNT(`tb_pedidos`.`id_pedido`) AS `total_pedidos`
FROM 
    `tb_pedidos`
WHERE 
    `tb_pedidos`.`fecha_pedido` >= DATE_FORMAT(current_timestamp(), '%Y-01-01')
    AND `tb_pedidos`.`fecha_pedido` <= current_timestamp()
GROUP BY 
    DATE_FORMAT(`tb_pedidos`.`fecha_pedido`, '%M')
ORDER BY 
    MONTH(`tb_pedidos`.`fecha_pedido`) ASC;
    
DROP VIEW IF EXISTS vista_pedidos;
    
CREATE VIEW `vista_pedidos` AS 
SELECT 
    row_number() OVER (ORDER BY `p`.`id_pedido`) AS `id_correlativo`,
    `c`.`nombre_cliente` AS `nombre_cliente`,
    `p`.`fecha_pedido` AS `fecha_pedido`,
    CASE 
        WHEN `p`.`tipo_pago` = 1 THEN 'Efectivo' 
        ELSE 'Tarjeta' 
    END AS `tipo_pago`,
    `i`.`nombre_inventario` AS `perfume`,
    `img`.`ruta_imagen` AS `imagen`,
    SUM(`dp`.`costo_actual` * `dp`.`cantidad_producto`) AS `total_precio`
FROM 
    `tb_pedidos` `p`
JOIN 
    `tb_direcciones` `d` ON (`p`.`id_direccion` = `d`.`id_direccion`)
JOIN 
    `tb_clientes` `c` ON (`d`.`id_cliente` = `c`.`id_cliente`)
JOIN 
    `tb_detalle_pedido` `dp` ON (`p`.`id_pedido` = `dp`.`id_pedido`)
JOIN 
    `tb_inventarios` `i` ON (`dp`.`id_inventario` = `i`.`id_inventario`)
JOIN 
    `tb_imagenes` `img` ON (`i`.`id_inventario` = `img`.`id_inventario`)
GROUP BY 
    `p`.`id_pedido`;

DROP VIEW IF EXISTS vista_ultimos_5_pedidos;

CREATE VIEW `vista_ultimos_5_pedidos` AS 
SELECT 
    `p`.`fecha_pedido` AS `Fecha_Pedido`,
    `i`.`nombre_inventario` AS `Nombre_Producto`,
    `img`.`ruta_imagen` AS `Imagen`,
    `dp`.`cantidad_producto` AS `Cantidad`
FROM 
    `tb_pedidos` `p`
JOIN 
    `tb_detalle_pedido` `dp` ON (`p`.`id_pedido` = `dp`.`id_pedido`)
JOIN 
    `tb_inventarios` `i` ON (`dp`.`id_inventario` = `i`.`id_inventario`)
JOIN 
    `tb_imagenes` `img` ON (`i`.`id_inventario` = `img`.`id_inventario`)
WHERE 
    `p`.`fecha_pedido` >= CURDATE() - INTERVAL 5 DAY
ORDER BY 
    `p`.`fecha_pedido` DESC;

DROP VIEW IF EXISTS vw_carrito;

CREATE VIEW `vw_carrito` AS 
SELECT 
    `p`.`id_cliente` AS `id_cliente`,
    `dp`.`id_pedido` AS `id_pedido`,
    `dp`.`id_detalle_pedido` AS `id_detalle_pedido`,
    `i`.`nombre_inventario` AS `producto`,
    `i`.`precio_inventario` AS `precio`,
    `dp`.`cantidad_producto` AS `cantidad`,
    `m`.`nombre_marca` AS `marca`,
    `img`.`ruta_imagen` AS `imagen_produc`,
    `i`.`precio_inventario` * `dp`.`cantidad_producto` AS `total`
FROM 
    `tb_pedidos` `p`
JOIN 
    `tb_detalle_pedido` `dp` ON (`p`.`id_pedido` = `dp`.`id_pedido`)
JOIN 
    `tb_inventarios` `i` ON (`dp`.`id_inventario` = `i`.`id_inventario`)
JOIN 
    `tb_marcas` `m` ON (`i`.`id_marca` = `m`.`id_marca`)
JOIN 
    (SELECT 
        `tb_imagenes`.`id_inventario` AS `id_inventario`,
        MIN(`tb_imagenes`.`id_imagen`) AS `id_imagen`
     FROM 
        `tb_imagenes` 
     GROUP BY 
        `tb_imagenes`.`id_inventario`
    ) `img_grp` ON (`i`.`id_inventario` = `img_grp`.`id_inventario`)
JOIN 
    `tb_imagenes` `img` ON (`img_grp`.`id_imagen` = `img`.`id_imagen`)
WHERE 
    `p`.`estado_carrito` = 'Carrito';

DROP VIEW IF EXISTS vw_clientes_frecuentes;

CREATE VIEW `vw_clientes_frecuentes` AS 
SELECT 
    `c`.`id_cliente` AS `id_cliente`,
    `c`.`nombre_cliente` AS `nombre_cliente`,
    `c`.`apellido_cliente` AS `apellido_cliente`,
    `c`.`correo_cliente` AS `correo_cliente`,
    `c`.`telefono_cliente` AS `telefono_cliente`,
    `c`.`clave_cliente` AS `clave_cliente`,
    `c`.`estado_cliente` AS `estado_cliente`
FROM 
    `tb_clientes` `c`
JOIN 
    (SELECT 
        `tb_pedidos`.`id_cliente` AS `id_cliente`,
        COUNT(0) AS `numero_pedidos`
     FROM 
        `tb_pedidos`
     GROUP BY 
        `tb_pedidos`.`id_cliente`
     HAVING 
        COUNT(0) >= 5
    ) `p` ON (`c`.`id_cliente` = `p`.`id_cliente`);
    
DROP VIEW IF EXISTS vw_descuentos;

CREATE VIEW `vw_descuentos` AS 
SELECT 
    `tb_descuentos`.`id_descuento` AS `id_descuento`,
    CONCAT(ROUND(`tb_descuentos`.`cantidad_descuento`, 0), '%') AS `descuento`,
    DATE_FORMAT(`tb_descuentos`.`fecha_inicio_descuento`, '%d-%m-%Y') AS `fecha_inicio_descuento`,
    IFNULL(DATE_FORMAT(`tb_descuentos`.`fecha_fin_descuento`, '%d-%m-%Y'), 'Sin fecha de finalización') AS `fecha_fin_descuento`,
    `tb_descuentos`.`descripcion_descuento` AS `descripcion_descuento`
FROM 
    `tb_descuentos`
WHERE 
    `tb_descuentos`.`estado_descuento` = 1
    AND `tb_descuentos`.`fecha_fin_descuento` >= CURDATE()
ORDER BY 
    IFNULL(`tb_descuentos`.`fecha_fin_descuento`, CURDATE() + INTERVAL 1 DAY) ASC
LIMIT 5;

DROP VIEW IF EXISTS vw_descuentos_proximos_finalizar;

CREATE VIEW `vw_descuentos_proximos_finalizar` AS 
SELECT 
    `tb_descuentos`.`id_descuento` AS `id_descuento`,
    `tb_descuentos`.`cantidad_descuento` AS `cantidad_descuento`,
    `tb_descuentos`.`fecha_inicio_descuento` AS `fecha_inicio_descuento`,
    `tb_descuentos`.`fecha_fin_descuento` AS `fecha_fin_descuento`,
    `tb_descuentos`.`descripcion_descuento` AS `descripcion_descuento`
FROM 
    `tb_descuentos`
WHERE 
    `tb_descuentos`.`estado_descuento` = 1
    AND `tb_descuentos`.`fecha_fin_descuento` IS NOT NULL
    AND `tb_descuentos`.`fecha_fin_descuento` >= CURDATE()
ORDER BY 
    `tb_descuentos`.`fecha_fin_descuento`
LIMIT 5;

DROP VIEW IF EXISTS vw_detalle_pedido_con_info;

CREATE VIEW `vw_detalle_pedido_con_info` AS 
SELECT 
    `dp`.`id_detalle_pedido` AS `id_detalle_pedido`,
    `i`.`nombre_inventario` AS `nombre_producto`,
    `p`.`id_cliente` AS `id_cliente`,
    `img`.`ruta_imagen` AS `primera_imagen`
FROM 
    `tb_detalle_pedido` `dp`
JOIN 
    `tb_pedidos` `pe` ON (`dp`.`id_pedido` = `pe`.`id_pedido`)
JOIN 
    `tb_inventarios` `i` ON (`dp`.`id_inventario` = `i`.`id_inventario`)
JOIN 
    `tb_clientes` `p` ON (`pe`.`id_cliente` = `p`.`id_cliente`)
LEFT JOIN 
    (SELECT 
        `tb_imagenes`.`id_inventario` AS `id_inventario`,
        MIN(`tb_imagenes`.`id_imagen`) AS `id_imagen`
     FROM 
        `tb_imagenes`
     GROUP BY 
        `tb_imagenes`.`id_inventario`
    ) `first_img` ON (`i`.`id_inventario` = `first_img`.`id_inventario`)
LEFT JOIN 
    `tb_imagenes` `img` ON (`first_img`.`id_imagen` = `img`.`id_imagen`)
WHERE 
    `pe`.`estado_pedido` = 'Finalizado';

DROP VIEW IF EXISTS vw_direcciones_cliente;

CREATE VIEW `vw_direcciones_cliente` AS 
SELECT 
    `d`.`id_direccion` AS `id_direccion`,
    `d`.`nombre_direccion` AS `nombre_direccion`,
    `d`.`direccion_cliente` AS `direccion_cliente`,
    `d`.`telefono_cliente` AS `telefono_direccion`,
    `d`.`codigo_postal` AS `codigo_postal`,
    `d`.`instrucciones_entrega` AS `instrucciones_entrega`,
    `d`.`id_cliente` AS `id_cliente`
FROM 
    `tb_direcciones` `d`;

DROP VIEW IF EXISTS vw_factura_pedido;

CREATE VIEW `vw_factura_pedido` AS 
SELECT 
    o.id_pedido, 
    o.fecha_pedido, 
    o.total_pago, 
    s.nombre_cliente,
    i.nombre_inventario, 
    i.precio_inventario, 
    p.cantidad_producto,
    (p.cantidad_producto * i.precio_inventario) AS subtotal
FROM 
    tb_detalle_pedido p
INNER JOIN 
    tb_pedidos o ON p.id_pedido = o.id_pedido
INNER JOIN 
    tb_clientes s ON o.id_cliente = s.id_cliente
INNER JOIN 
    tb_inventarios i ON p.id_inventario = i.id_inventario
INNER JOIN 
    tb_marcas a ON i.id_marca = a.id_marca;

DROP VIEW IF EXISTS vw_imagenes_detalle;

CREATE VIEW `vw_imagenes_detalle` AS 
SELECT 
    i.id_inventario AS `id_inventario`,
    GROUP_CONCAT(img.ruta_imagen SEPARATOR ', ') AS `imagenes`
FROM 
    tb_inventarios i
LEFT JOIN 
    tb_imagenes img ON i.id_inventario = img.id_inventario
GROUP BY 
    i.id_inventario;

DROP VIEW IF EXISTS vw_inventario_detalles;

CREATE VIEW `vw_inventario_detalles` AS 
SELECT 
    i.id_inventario AS `identificador`,
    img.ruta_imagen AS `imagen`,
    i.nombre_inventario AS `nombre`,
    m.nombre_marca AS `marca`,
    c.nombre_categoria AS `categoria`,
    o.nombre_olor AS `olor`,
    i.descripcion_inventario AS `descripcion`,
    i.precio_inventario AS `precio`,
    i.cantidad_inventario AS `cantidad`
FROM 
    tb_inventarios i
JOIN 
    (SELECT 
        tb_imagenes.id_inventario AS `id_inventario`,
        MIN(tb_imagenes.id_imagen) AS `id_imagen`
     FROM 
        tb_imagenes
     GROUP BY 
        tb_imagenes.id_inventario
    ) img_min ON i.id_inventario = img_min.id_inventario
JOIN 
    tb_imagenes img ON img_min.id_imagen = img.id_imagen
JOIN 
    tb_marcas m ON i.id_marca = m.id_marca
JOIN 
    tb_categorias c ON i.id_categoria = c.id_categoria
JOIN 
    tb_olores o ON i.id_olor = o.id_olor;

DROP VIEW IF EXISTS vw_pedidos_clientes;

CREATE VIEW `vw_pedidos_clientes` AS 
SELECT 
    p.id_pedido AS `id_pedido`,
    p.total_pago AS `total_pago`,
    DATE_FORMAT(p.fecha_pedido, '%d/%m/%Y') AS `fecha_pedido`,
    p.tipo_pago AS `tipo_pago`,
    p.estado_pedido AS `estado_pedido`,
    p.estado_carrito AS `estado_carrito`,
    p.id_direccion AS `id_direccion`,
    c.id_cliente AS `id_cliente`,
    CONCAT(c.nombre_cliente, ' ', c.apellido_cliente) AS `nombre_completo_cliente`,
    c.correo_cliente AS `correo_cliente`,
    c.telefono_cliente AS `telefono_cliente`
FROM 
    tb_pedidos p
JOIN 
    tb_clientes c ON p.id_cliente = c.id_cliente;
    
DROP VIEW IF EXISTS vw_pedidos_estados;

CREATE VIEW `vw_pedidos_estados` AS 
SELECT 
    p.id_pedido AS `id_pedido`,
    p.fecha_pedido AS `fecha_pedido`,
    p.estado_pedido AS `estado_pedido`,
    c.id_cliente AS `id_cliente`
FROM 
    tb_pedidos p
JOIN 
    tb_clientes c ON p.id_cliente = c.id_cliente;

DROP VIEW IF EXISTS vw_perfume_info;

CREATE VIEW `vw_perfume_info` AS 
SELECT 
    i.id_inventario AS `id_producto`,
    i.nombre_inventario AS `titulo_perfume`,
    ROUND(COALESCE(AVG(v.calificacion_producto), 0), 1) AS `valoracion_calculada`,
    i.precio_inventario AS `precio`,
    i.cantidad_inventario AS `unidades_disponibles`,
    (SELECT img.ruta_imagen 
     FROM tb_imagenes img 
     WHERE img.id_inventario = i.id_inventario 
     LIMIT 1) AS `primera_imagen`
FROM 
    tb_inventarios i
LEFT JOIN 
    tb_detalle_pedido dp ON i.id_inventario = dp.id_inventario
LEFT JOIN 
    tb_valoraciones v ON dp.id_detalle_pedido = v.id_detalle_pedido
GROUP BY 
    i.id_inventario;

DROP VIEW IF EXISTS vw_productos;

CREATE VIEW `vw_productos` AS 
SELECT 
    e.id_imagen AS `id_imagen`,
    e.ruta_imagen AS `ruta_imagen`,
    i.id_inventario AS `id_inventario`,
    i.nombre_inventario AS `nombre_inventario`,
    i.precio_inventario AS `precio_inventario`,
    m.nombre_marca AS `nombre_marca`,
    m.id_marca AS `id_marca`,
    g.id_categoria AS `id_categoria`,
    g.nombre_categoria AS `nombre_categoria`
FROM 
    tb_imagenes e
JOIN 
    tb_inventarios i ON e.id_inventario = i.id_inventario
JOIN 
    tb_marcas m ON i.id_marca = m.id_marca
JOIN 
    tb_categorias g ON i.id_categoria = g.id_categoria
WHERE 
    e.id_imagen IN (
        SELECT MIN(tb_imagenes.id_imagen) 
        FROM tb_imagenes 
        GROUP BY tb_imagenes.id_inventario
    );
    
DROP VIEW IF EXISTS vw_productos_detalle;

CREATE VIEW `vw_productos_detalle` AS 
SELECT 
    i.id_inventario AS `id_producto`,
    i.descripcion_inventario AS `descripcion_producto`,
    m.nombre_marca AS `marca`,
    c.nombre_categoria AS `categoria`,
    o.nombre_olor AS `aroma`
FROM 
    tb_inventarios i
JOIN 
    tb_marcas m ON i.id_marca = m.id_marca
JOIN 
    tb_categorias c ON i.id_categoria = c.id_categoria
JOIN 
    tb_olores o ON i.id_olor = o.id_olor;

DROP VIEW IF EXISTS vw_top_5_categorias;

CREATE VIEW `vw_top_5_categorias` AS 
SELECT 
    c.nombre_categoria AS `nombre_categoria`,
    SUM(dp.cantidad_producto) AS `total_vendido`
FROM 
    tb_detalle_pedido dp
JOIN 
    tb_inventarios i ON dp.id_inventario = i.id_inventario
JOIN 
    tb_categorias c ON i.id_categoria = c.id_categoria
GROUP BY 
    c.id_categoria, 
    c.nombre_categoria
ORDER BY 
    SUM(dp.cantidad_producto) DESC
LIMIT 5;

DROP VIEW IF EXISTS vw_top_5_olores;

CREATE VIEW `vw_top_5_olores` AS 
SELECT 
    o.nombre_olor AS `nombre_olor`,
    SUM(dp.cantidad_producto) AS `total_vendido`
FROM 
    tb_detalle_pedido dp
JOIN 
    tb_inventarios i ON dp.id_inventario = i.id_inventario
JOIN 
    tb_olores o ON i.id_olor = o.id_olor
GROUP BY 
    o.id_olor, 
    o.nombre_olor
ORDER BY 
    SUM(dp.cantidad_producto) DESC
LIMIT 5;

DROP VIEW IF EXISTS vw_ultimos_productos;

CREATE VIEW `vw_ultimos_productos` AS 
SELECT 
    sub.nombre_inventario AS `nombre_producto`,
    im.ruta_imagen AS `imagen_producto`
FROM 
    (SELECT 
        i.id_inventario AS `id_inventario`,
        i.nombre_inventario AS `nombre_inventario`
     FROM 
        tb_inventarios i
     ORDER BY 
        i.id_inventario DESC
     LIMIT 5
    ) sub
JOIN 
    tb_imagenes im ON sub.id_inventario = im.id_inventario
GROUP BY 
    sub.id_inventario
ORDER BY 
    sub.id_inventario DESC;

DROP VIEW IF EXISTS vw_valoraciones_producto;

CREATE VIEW `vw_valoraciones_producto` AS 
SELECT 
    v.id_valoracion AS `identificador`,
    CONCAT(c.nombre_cliente, ' ', c.apellido_cliente) AS `nombre_cliente`,
    ROUND(v.calificacion_producto, 1) AS `calificacion_producto`,
    v.comentario_producto AS `comentario_producto`,
    i.id_inventario AS `id_inventario`
FROM 
    tb_valoraciones v
JOIN 
    tb_detalle_pedido dp ON v.id_detalle_pedido = dp.id_detalle_pedido
JOIN 
    tb_pedidos p ON dp.id_pedido = p.id_pedido
JOIN 
    tb_clientes c ON c.id_cliente = p.id_cliente
JOIN 
    tb_inventarios i ON dp.id_inventario = i.id_inventario;

DELIMITER $$

DROP PROCEDURE IF EXISTS `actualizar_pedido`$$
CREATE PROCEDURE `actualizar_pedido` (
    IN `p_id_cliente` INT, 
    IN `p_id_direccion` INT
)
BEGIN
    UPDATE tb_pedidos
    SET fecha_pedido = CURRENT_DATE,
        estado_pedido = 'Preparandose',
        estado_carrito = 'Realizado',
        id_direccion = p_id_direccion
    WHERE id_cliente = p_id_cliente
    AND estado_carrito = 'Carrito';
END$$

DROP PROCEDURE IF EXISTS `eliminar_detalle_pedido`$$
CREATE PROCEDURE `eliminar_detalle_pedido` (
    IN `detalle_id_pedido` INT
)
BEGIN
    DECLARE cantidad_producto_eliminar INT;
    DECLARE costo_producto DECIMAL(10, 2);
    DECLARE total_producto DECIMAL(10, 2);
    DECLARE id_producto_eliminar INT;
    DECLARE id_pedido_a_modificar INT;
    DECLARE cantidad_inventario_actual INT;

    SELECT id_pedido, id_inventario, cantidad_producto, costo_actual
    INTO id_pedido_a_modificar, id_producto_eliminar, cantidad_producto_eliminar, costo_producto
    FROM tb_detalle_pedido
    WHERE id_detalle_pedido = detalle_id_pedido;

    UPDATE tb_inventarios
    SET cantidad_inventario = cantidad_inventario + cantidad_producto_eliminar
    WHERE id_inventario = id_producto_eliminar;

    UPDATE tb_pedidos
    SET total_pago = (
        SELECT SUM(cantidad_producto * costo_actual)
        FROM tb_detalle_pedido
        WHERE id_pedido = id_pedido_a_modificar
    )
    WHERE id_pedido = id_pedido_a_modificar;

    DELETE FROM tb_detalle_pedido
    WHERE id_detalle_pedido = detalle_id_pedido;
END$$

DROP PROCEDURE IF EXISTS `InsertarDetallePedido`$$
CREATE PROCEDURE `InsertarDetallePedido` (
    IN `cantidad_producto_param` INT, 
    IN `costo_actual_param` DECIMAL(10,2), 
    IN `id_inventario_param` INT, 
    IN `cliente_id_param` INT
)
BEGIN
    DECLARE pedido_existente INT;
    DECLARE total_costo DECIMAL(10,2);

    -- Buscar un pedido existente en estado 'Carrito' para el cliente
    SELECT id_pedido INTO pedido_existente 
    FROM tb_pedidos 
    WHERE id_cliente = cliente_id_param AND estado_carrito = 'Carrito'
    LIMIT 1;

    IF pedido_existente IS NOT NULL THEN
        -- Obtener el total actual del pedido
        SELECT total_pago INTO total_costo
        FROM tb_pedidos 
        WHERE id_pedido = pedido_existente;

        -- Calcular el nuevo total del pedido
        SET total_costo = total_costo + (cantidad_producto_param * costo_actual_param);

        -- Actualizar el total del pedido existente
        UPDATE tb_pedidos 
        SET total_pago = total_costo 
        WHERE id_pedido = pedido_existente;
    ELSE
        -- Crear un nuevo pedido en estado 'Carrito'
        INSERT INTO tb_pedidos (total_pago, tipo_pago, estado_pedido, estado_carrito, id_cliente) 
        VALUES (cantidad_producto_param * costo_actual_param, TRUE, NULL, 'Carrito', cliente_id_param);

        -- Obtener el ID del nuevo pedido
        SELECT LAST_INSERT_ID() INTO pedido_existente;
    END IF;

    -- Insertar el detalle del pedido
    INSERT INTO tb_detalle_pedido (cantidad_producto, costo_actual, id_pedido, id_inventario) 
    VALUES (cantidad_producto_param, costo_actual_param, pedido_existente, id_inventario_param);

    -- Actualizar el inventario después de insertar el detalle del pedido
    UPDATE tb_inventarios
    SET cantidad_inventario = cantidad_inventario - cantidad_producto_param
    WHERE id_inventario = id_inventario_param;
END$$

DROP PROCEDURE IF EXISTS `obtenerDetallePedido`$$
CREATE PROCEDURE `obtenerDetallePedido` (
    IN `pedido_id` INT
)
BEGIN
    SELECT 
        o.id_pedido, o.fecha_pedido, o.estado_pedido, o.total_pago, 
        g.id_imagen, g.ruta_imagen, i.nombre_inventario, i.precio_inventario, 
        a.nombre_marca, s.nombre_cliente, s.apellido_cliente, s.correo_cliente, 
        s.telefono_cliente, n.nombre_direccion, n.direccion_cliente, 
        n.telefono_cliente, n.codigo_postal, p.cantidad_producto, p.id_detalle_pedido
    FROM tb_detalle_pedido p
    INNER JOIN tb_pedidos o ON p.id_pedido = o.id_pedido
    INNER JOIN tb_clientes s ON o.id_cliente = s.id_cliente
    INNER JOIN tb_direcciones n ON o.id_direccion = n.id_direccion
    INNER JOIN tb_inventarios i ON p.id_inventario = i.id_inventario
    INNER JOIN tb_marcas a ON i.id_marca = a.id_marca
    INNER JOIN tb_imagenes g ON g.id_inventario = i.id_inventario
    WHERE g.id_imagen IN (
        SELECT MIN(id_imagen)
        FROM tb_imagenes
        GROUP BY id_inventario
    )
    AND o.id_pedido = pedido_id;
END$$

DROP PROCEDURE IF EXISTS `sp_productos_relacionados`$$
CREATE PROCEDURE `sp_productos_relacionados` (
    IN `p_id_inventario` INT
)
BEGIN
    SELECT 
        tb_inventarios.nombre_inventario AS nombre_producto,
        (SELECT tb_imagenes.ruta_imagen 
         FROM tb_imagenes 
         WHERE tb_imagenes.id_inventario = tb_inventarios.id_inventario 
         LIMIT 1) AS primera_imagen_producto,
        tb_inventarios.precio_inventario AS precio_producto
    FROM 
        tb_inventarios
    WHERE 
        tb_inventarios.id_categoria = (SELECT id_categoria FROM tb_inventarios WHERE id_inventario = p_id_inventario) 
        AND tb_inventarios.id_olor = (SELECT id_olor FROM tb_inventarios WHERE id_inventario = p_id_inventario)
        AND tb_inventarios.id_inventario != p_id_inventario
    LIMIT 4;
END$$

DELIMITER ;


