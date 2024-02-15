DROP DATABASE IF EXISTS EssenZial;

CREATE DATABASE IF NOT EXISTS EssenZial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


USE EssenZial;

-- Tabla Clientes
CREATE TABLE IF NOT EXISTS tb_clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    apellido_cliente VARCHAR(255) NOT NULL,
    correo_cliente VARCHAR(255) UNIQUE,
    telefono_cliente VARCHAR(20) UNIQUE,
    clave_cliente VARCHAR(255) NOT NULL ,
    estado_cliente BOOLEAN DEFAULT TRUE ,
    INDEX(correo_cliente, telefono_cliente) 
) ENGINE=INNODB;



CREATE TABLE IF NOT EXISTS tb_direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_direccion VARCHAR(255) NOT NULL,
    direccion_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20) UNIQUE,
    codigo_postal VARCHAR(5) NOT NULL,
    instrucciones_entrega VARCHAR(100) NOT NULL,
    id_cliente INT NOT NULL,
     FOREIGN KEY (id_cliente) REFERENCES tb_clientes(id_cliente),
    INDEX(direccion_cliente, nombre_direccion) 
) ENGINE=INNODB;


-- Tabla Administradores
CREATE TABLE IF NOT EXISTS tb_admins (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre_admin VARCHAR(255 )NOT NULL,
    apellido_admin VARCHAR(255) NOT NULL,
    correo_admin VARCHAR(255) UNIQUE,
    clave_admin VARCHAR(255) NOT NULL
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


-- Tabla Inventarios
CREATE TABLE IF NOT EXISTS tb_inventarios (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_inventario VARCHAR(255) NOT NULL,
    cantidad_inventario INT NOT NULL,
    descripcion_inventario TEXT NOT NULL,
    precio_inventario DECIMAL(10, 2) NOT NULL,
    imagen_producto VARCHAR(100) NOT NULL,
    cantidad_descuento FLOAT NOT NULL,
    descripcion_descuento TEXT,
    fecha_inicio_descuento DATE,
    estado_descuento BOOLEAN ,
    fecha_fin_descuento DATE,
    id_olor INT NOT NULL,
    id_categoria INT NOT NULL,
    id_marca INT NOT NULL,
    FOREIGN KEY (id_olor) REFERENCES tb_olores(id_olor),
    FOREIGN KEY (id_categoria) REFERENCES tb_categorias(id_categoria),
    FOREIGN KEY (id_marca) REFERENCES tb_marcas(id_marca)
) ENGINE=InnoDB;

-- Tabla Imagenes
CREATE TABLE IF NOT EXISTS tb_imagenes (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    ruta_imagen VARCHAR(100) NOT NULL, 
    id_inventario INT NOT NULL,
   FOREIGN KEY (id_inventario) REFERENCES tb_inventarios(id_inventario)
) ENGINE=InnoDB;

-- Tabla Pedidos
CREATE TABLE IF NOT EXISTS tb_pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    total_pago DECIMAL(10,2),
    numero_pedido VARCHAR(10) NOT NULL UNIQUE,
    fecha_pedido DATE NOT NULL, 
    estado_pedido VARCHAR(250),
    tipo_pago BOOLEAN DEFAULT TRUE,
    id_direccion INT NOT NULL, 
    FOREIGN KEY (id_direccion) REFERENCES tb_direcciones(id_direccion)
) ENGINE=InnoDB;

-- Tabla Detalle Pedido
CREATE TABLE IF NOT EXISTS tb_detalle_pedido (
    id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
    cantidad_producto INT NOT NULL,
    costo_actual DECIMAL(10, 2) NOT NULL, 
    id_pedido INT NOT NULL, 
    id_inventario INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES tb_pedidos(id_pedido),
    FOREIGN KEY (id_inventario) REFERENCES tb_inventarios(id_inventario)
) ENGINE=INNODB;

-- Tabla Valoraciones
CREATE TABLE IF NOT EXISTS tb_valoraciones (
    id_valoracion INT AUTO_INCREMENT PRIMARY KEY,
    calificacion_producto INT NOT NULL,
    comentario_producto VARCHAR(250) NOT NULL,
    fecha_valoracion DATE NOT NULL,
    estado_comentario BOOLEAN DEFAULT TRUE,
    id_detalle_pedido INT NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES tb_clientes(id_cliente),
    FOREIGN KEY (id_detalle_pedido) REFERENCES tb_detalle_pedido(id_detalle_pedido)
) ENGINE=INNODB;



DELIMITER //

CREATE TRIGGER actualizar_inventario_despues_de_pedido
AFTER INSERT ON tb_detalle_pedido
FOR EACH ROW
BEGIN
    DECLARE cantidad_pedido INT;
    DECLARE id_producto INT;
    SELECT cantidad_producto, id_inventario INTO cantidad_pedido, id_producto
    FROM tb_detalle_pedido
    WHERE id_detalle_pedido = NEW.id_detalle_pedido;
    UPDATE tb_inventarios
    SET cantidad_inventario = cantidad_inventario - cantidad_pedido
    WHERE id_inventario = id_producto;
END;
//

DELIMITER ;


DELIMITER //

CREATE PROCEDURE agregar_cliente(
    IN p_nombre_cliente VARCHAR(255),
    IN p_apellido_cliente VARCHAR(255),
    IN p_correo_cliente VARCHAR(255),
    IN p_telefono_cliente VARCHAR(20),
    IN p_clave_cliente VARCHAR(255)
)
BEGIN
    INSERT INTO tb_clientes(nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, clave_cliente)
    VALUES(p_nombre_cliente, p_apellido_cliente, p_correo_cliente, p_telefono_cliente, p_clave_cliente);
END //

DELIMITER ;

