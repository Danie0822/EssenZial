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
    clave_cliente VARCHAR(255) NOT NULL,
    estado_cliente BOOLEAN DEFAULT TRUE,
    INDEX(correo_cliente, telefono_cliente)
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
    FOREIGN KEY (id_cliente) REFERENCES tb_clientes(id_cliente),
    INDEX(direccion_cliente, nombre_direccion)
) ENGINE=INNODB;

-- Tabla Administradores
CREATE TABLE IF NOT EXISTS tb_admins (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre_admin VARCHAR(255) NOT NULL,
    apellido_admin VARCHAR(255) NOT NULL,
    correo_admin VARCHAR(255) UNIQUE NOT NULL,
    clave_admin VARCHAR(255) NOT NULL,
    INDEX(correo_admin)
) ENGINE=InnoDB;

-- Tabla Categorías
CREATE TABLE IF NOT EXISTS tb_categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(255) NOT NULL,
    imagen_categoria VARCHAR(100) NOT NULL,
    INDEX(nombre_categoria)
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
    imagen_olor VARCHAR(100) NOT NULL,
    INDEX(nombre_olor)
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
    imagen_producto VARCHAR(100) NOT NULL,
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
    CONSTRAINT FK_imagen_inventario FOREIGN KEY (id_inventario) REFERENCES tb_inventarios(id_inventario),
    INDEX(ruta_imagen, id_inventario)
) ENGINE=InnoDB;

-- Tabla Pedidos
CREATE TABLE IF NOT EXISTS tb_pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    total_pago DECIMAL(10,2) NOT NULL DEFAULT '0.00',
    numero_pedido VARCHAR(10) NOT NULL UNIQUE,
    fecha_pedido DATE DEFAULT (CURRENT_DATE),
    estado_pedido VARCHAR(250),
    tipo_pago BOOLEAN DEFAULT TRUE,
    id_direccion INT NOT NULL,
    CONSTRAINT FK_pedido_direccion FOREIGN KEY (id_direccion) REFERENCES tb_direcciones(id_direccion),
    INDEX(numero_pedido, estado_pedido)
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