-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: backecommercepro
-- ------------------------------------------------------
-- Server version	9.0.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `idRol` int NOT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idRol` (`idRol`),
  CONSTRAINT `administradores_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (1,'Admin Test','Admin','admin@test.com','$2b$10$1qmkdpqFZe/KfjpyiZtFZuOQ0bLGux6YRvXeQK9t6WDuryxLv5wGG',1,1,1,'2025-09-15 12:48:40','2025-11-01 17:48:48'),(2,'Juan','Godoy','juan.godoy@example.com','$2b$10$Fu/PVtOdQH9KADwhbX9.fu3RqJdKpl5yCAzIAlt/ENH7C5AtUD0ga',0,2,1,'2025-11-01 20:32:15','2025-11-01 21:03:55'),(3,'Ana','Gomez','ana.gomez@example.com','$2b$10$kiOCGe2j9Hy7EJ0STzizh./00/K/8RHTm7CwUNrn4H0H9zwLchNqa',1,2,0,'2025-11-01 20:45:03','2025-11-01 17:48:48'),(4,'Luis','Garcia','luis.garcia@example.com','$2b$10$72OqmDTsP5fQNnake5wv8u9DxAJ6830gk.QQ9ToZhcrsdKHm4lJoS',1,2,0,'2025-11-01 20:45:47','2025-11-01 17:48:48'),(5,'Jorge','Torres','jorge.torres@example.com','$2b$10$rOj/MPQQ8Nj5khoVt5eewun2wYaC3TRi9NIICu.y54s0WOFhdY7pO',0,2,1,'2025-11-01 20:47:09','2025-11-01 21:03:58'),(6,'Matias','Gonzalez','pablo.gonzalez@example.com','$2b$10$fzKncP4Vk6wCLSIC6VWToucrKm/DHAMh00JzKHKIIlNNKmkSQEYRm',1,2,0,'2025-11-01 20:48:04','2025-11-01 17:48:48'),(7,'Martin','Pesci','martin.pesci@example.com','$2b$10$zh1My2qt5ab85oovhnNTlOCbNihpA3aNLleiMoS95X8etBxcJQhf2',1,2,0,'2025-11-01 20:51:30','2025-11-01 17:54:47'),(8,'Ana','Ferrero','ana.ferrero@example.com','$2b$10$D7FEMzYtF9vSXXGJqu2NIOkWAKTOk.Ht6Aqgb4hYcawEuFAKdSSWe',1,2,0,'2025-11-01 20:52:02','2025-11-01 17:54:47'),(9,'Virginia','Pesci','virginia.pesci@example.com','$2b$10$yTbOZRGDh8adfjmnh05sJOwPE5NNN6xCMLavPPczdzbhOLlHYDxW.',1,2,0,'2025-11-01 20:52:39','2025-11-01 17:54:47'),(10,'Patricia','Perez','patricia.perez@example.com','$2b$10$iVBf9l1K/Qjkq2hap6AFPeO6FQMwZpzrECFKm9VfCd3f0dUbuDwwG',1,2,0,'2025-11-01 20:53:35','2025-11-01 17:54:47');
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogarticulos`
--

DROP TABLE IF EXISTS `blogarticulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogarticulos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(300) NOT NULL,
  `contenido` longtext NOT NULL,
  `resumen` text NOT NULL,
  `fechaPublicacion` datetime NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `imagenUrl` varchar(500) NOT NULL,
  `categoriablog` enum('fitness','nutricion','bienestar','general') NOT NULL,
  `idUsuario` int NOT NULL,
  `idAdministrador` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idAdministrador` (`idAdministrador`),
  CONSTRAINT `blogarticulos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `blogarticulos_ibfk_2` FOREIGN KEY (`idAdministrador`) REFERENCES `administradores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogarticulos`
--

LOCK TABLES `blogarticulos` WRITE;
/*!40000 ALTER TABLE `blogarticulos` DISABLE KEYS */;
/*!40000 ALTER TABLE `blogarticulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritos`
--

DROP TABLE IF EXISTS `carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `idUsuario` int NOT NULL,
  `fechaCreacion` datetime NOT NULL,
  `fechaModificacion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritos`
--

LOCK TABLES `carritos` WRITE;
/*!40000 ALTER TABLE `carritos` DISABLE KEYS */;
INSERT INTO `carritos` VALUES (3,1,1,'2025-11-01 20:35:45','2025-11-01 20:35:45'),(4,1,10,'2025-11-02 07:02:08','2025-11-02 07:02:08');
/*!40000 ALTER TABLE `carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `imagenUrl` varchar(500) NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Tops','Tops de sujeción media con tecnología Dri-FIT para mantener la piel seca.','http://localhost:3000/uploads/categorias/1761859976757-43491712.jpg',1,'2025-09-11 01:07:33','2025-11-01 18:59:17'),(2,'Musculosas','Remeras sin mangas, ligeras y transpirables, pensadas para ofrecer libertad de movimiento y frescura durante la actividad física.','http://localhost:3000/uploads/categorias/1761934351615-900611782.jpg',1,'2025-09-11 01:07:33','2025-10-31 18:12:31'),(3,'Calzas','Prendas elásticas y cómodas que se adaptan al cuerpo, ofreciendo sujeción y flexibilidad. Ideales para entrenar, practicar yoga o usar en el día a día.','http://localhost:3000/uploads/categorias/1761934420542-788263119.jpg',1,'2025-09-11 01:07:33','2025-10-31 18:13:40'),(4,'Shorts','Pantalones cortos versátiles y livianos, diseñados para mantener frescura y confort en rutinas intensas o días de calor.','http://localhost:3000/uploads/categorias/1761934155906-376432920.jpg',1,'2025-09-30 20:26:31','2025-10-31 18:09:15');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuponesdescuentos`
--

DROP TABLE IF EXISTS `cuponesdescuentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuponesdescuentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreCupon` varchar(255) NOT NULL,
  `codigoCupon` varchar(255) NOT NULL,
  `porcentajeDescuento` int NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigoCupon` (`codigoCupon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuponesdescuentos`
--

LOCK TABLES `cuponesdescuentos` WRITE;
/*!40000 ALTER TABLE `cuponesdescuentos` DISABLE KEYS */;
INSERT INTO `cuponesdescuentos` VALUES (1,'Descuento Bienvenida','BIENVENIDO10',10,1),(2,'Oferta Verano','VERANO2025',20,1),(3,'Oferta Primavera','PRIMAVERA2025',15,1);
/*!40000 ALTER TABLE `cuponesdescuentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallescarritos`
--

DROP TABLE IF EXISTS `detallescarritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallescarritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `idCarrito` int NOT NULL,
  `idProducto` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallescarritos`
--

LOCK TABLES `detallescarritos` WRITE;
/*!40000 ALTER TABLE `detallescarritos` DISABLE KEYS */;
INSERT INTO `detallescarritos` VALUES (277,1,35000.00,4,18,'2025-11-02 07:02:21','2025-11-02 07:02:21'),(292,1,35000.00,3,18,'2025-11-04 19:30:26','2025-11-04 19:30:26');
/*!40000 ALTER TABLE `detallescarritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallesorden`
--

DROP TABLE IF EXISTS `detallesorden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallesorden` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `idOrdenCompra` int NOT NULL,
  `idProducto` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idOrdenCompra_UNIQUE` (`idOrdenCompra`),
  UNIQUE KEY `idProducto_UNIQUE` (`idProducto`),
  CONSTRAINT `detallesorden_ibfk_1` FOREIGN KEY (`idOrdenCompra`) REFERENCES `ordenescompras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detallesorden_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallesorden`
--

LOCK TABLES `detallesorden` WRITE;
/*!40000 ALTER TABLE `detallesorden` DISABLE KEYS */;
/*!40000 ALTER TABLE `detallesorden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `calle` varchar(255) NOT NULL,
  `numero` varchar(255) NOT NULL,
  `barrio` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `provincia` varchar(255) NOT NULL,
  `codigoPostal` varchar(255) NOT NULL,
  `idUsuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
INSERT INTO `direcciones` VALUES (1,'Av. Siempre Viva','742','Springfield','Springfield','Illinois','62704',1),(2,'Calle Falsa','123','Centro','Buenos Aires','Buenos Aires','1001',1),(3,'Boulevard Central','456','Norte','Rosario','Santa Fe','2000',1);
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etiquetas`
--

DROP TABLE IF EXISTS `etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etiquetas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `texto` varchar(255) NOT NULL,
  `idProducto` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `etiquetas_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etiquetas`
--

LOCK TABLES `etiquetas` WRITE;
/*!40000 ALTER TABLE `etiquetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `etiquetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenesproductos`
--

DROP TABLE IF EXISTS `imagenesproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenesproductos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `urlImagen` text NOT NULL,
  `thumbnailUrl` text,
  `idProducto` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `imagenesproductos_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenesproductos`
--

LOCK TABLES `imagenesproductos` WRITE;
/*!40000 ALTER TABLE `imagenesproductos` DISABLE KEYS */;
INSERT INTO `imagenesproductos` VALUES (206,'/uploads/productos/1762042528834-482671846.jpg','/uploads/productos/thumbs/1762042528834-482671846.jpg',1,'2025-11-02 00:15:28','2025-11-02 00:15:28'),(207,'/uploads/productos/1762042528835-34408521.jpg','/uploads/productos/thumbs/1762042528835-34408521.jpg',1,'2025-11-02 00:15:28','2025-11-02 00:15:28'),(208,'/uploads/productos/1762042756019-578681148.jpg','/uploads/productos/thumbs/1762042756019-578681148.jpg',2,'2025-11-02 00:19:16','2025-11-02 00:19:16'),(209,'/uploads/productos/1762042756019-651849494.jpg','/uploads/productos/thumbs/1762042756019-651849494.jpg',2,'2025-11-02 00:19:16','2025-11-02 00:19:16'),(210,'/uploads/productos/1762042955810-456218138.jpg','/uploads/productos/thumbs/1762042955810-456218138.jpg',3,'2025-11-02 00:22:35','2025-11-02 00:22:35'),(211,'/uploads/productos/1762042955811-59306826.jpg','/uploads/productos/thumbs/1762042955811-59306826.jpg',3,'2025-11-02 00:22:35','2025-11-02 00:22:35'),(212,'/uploads/productos/1762043089044-541813684.jpg','/uploads/productos/thumbs/1762043089044-541813684.jpg',4,'2025-11-02 00:24:49','2025-11-02 00:24:49'),(213,'/uploads/productos/1762043089044-623887425.jpg','/uploads/productos/thumbs/1762043089044-623887425.jpg',4,'2025-11-02 00:24:49','2025-11-02 00:24:49'),(216,'/uploads/productos/1762043493425-337267820.jpg','/uploads/productos/thumbs/1762043493425-337267820.jpg',6,'2025-11-02 00:31:33','2025-11-02 00:31:33'),(217,'/uploads/productos/1762043493426-464943428.jpg','/uploads/productos/thumbs/1762043493426-464943428.jpg',6,'2025-11-02 00:31:33','2025-11-02 00:31:33'),(218,'/uploads/productos/1762043644826-704739976.jpg','/uploads/productos/thumbs/1762043644826-704739976.jpg',5,'2025-11-02 00:34:04','2025-11-02 00:34:04'),(219,'/uploads/productos/1762043644827-878642314.jpg','/uploads/productos/thumbs/1762043644827-878642314.jpg',5,'2025-11-02 00:34:04','2025-11-02 00:34:04'),(220,'/uploads/productos/1762044441937-279137126.jpg','/uploads/productos/thumbs/1762044441937-279137126.jpg',7,'2025-11-02 00:47:21','2025-11-02 00:47:21'),(221,'/uploads/productos/1762044441938-206192282.jpg','/uploads/productos/thumbs/1762044441938-206192282.jpg',7,'2025-11-02 00:47:21','2025-11-02 00:47:21'),(222,'/uploads/productos/1762044713656-245479857.jpg','/uploads/productos/thumbs/1762044713656-245479857.jpg',8,'2025-11-02 00:51:53','2025-11-02 00:51:53'),(223,'/uploads/productos/1762044713658-621175871.jpg','/uploads/productos/thumbs/1762044713658-621175871.jpg',8,'2025-11-02 00:51:53','2025-11-02 00:51:53'),(224,'/uploads/productos/1762045017904-847332973.jpg','/uploads/productos/thumbs/1762045017904-847332973.jpg',9,'2025-11-02 00:56:57','2025-11-02 00:56:57'),(225,'/uploads/productos/1762045017904-618933706.jpg','/uploads/productos/thumbs/1762045017904-618933706.jpg',9,'2025-11-02 00:56:57','2025-11-02 00:56:57'),(226,'/uploads/productos/1762052936010-357801591.jpg','/uploads/productos/thumbs/1762052936010-357801591.jpg',10,'2025-11-02 03:08:56','2025-11-02 03:08:56'),(227,'/uploads/productos/1762052936010-851585752.jpg','/uploads/productos/thumbs/1762052936010-851585752.jpg',10,'2025-11-02 03:08:56','2025-11-02 03:08:56'),(228,'/uploads/productos/1762053161640-386609073.jpg','/uploads/productos/thumbs/1762053161640-386609073.jpg',11,'2025-11-02 03:12:41','2025-11-02 03:12:41'),(229,'/uploads/productos/1762053161640-354488204.jpg','/uploads/productos/thumbs/1762053161640-354488204.jpg',11,'2025-11-02 03:12:41','2025-11-02 03:12:41'),(230,'/uploads/productos/1762053270342-153734418.jpg','/uploads/productos/thumbs/1762053270342-153734418.jpg',12,'2025-11-02 03:14:30','2025-11-02 03:14:30'),(231,'/uploads/productos/1762053270344-455103270.jpg','/uploads/productos/thumbs/1762053270344-455103270.jpg',12,'2025-11-02 03:14:30','2025-11-02 03:14:30'),(232,'/uploads/productos/1762054704473-404549641.jpg','/uploads/productos/thumbs/1762054704473-404549641.jpg',13,'2025-11-02 03:38:24','2025-11-02 03:38:24'),(233,'/uploads/productos/1762054704473-804916964.jpg','/uploads/productos/thumbs/1762054704473-804916964.jpg',13,'2025-11-02 03:38:24','2025-11-02 03:38:24'),(234,'/uploads/productos/1762055211562-794952045.jpg','/uploads/productos/thumbs/1762055211562-794952045.jpg',14,'2025-11-02 03:46:51','2025-11-02 03:46:51'),(235,'/uploads/productos/1762055211562-992581862.jpg','/uploads/productos/thumbs/1762055211562-992581862.jpg',14,'2025-11-02 03:46:51','2025-11-02 03:46:51'),(236,'/uploads/productos/1762055763440-669742989.jpg','/uploads/productos/thumbs/1762055763440-669742989.jpg',15,'2025-11-02 03:56:03','2025-11-02 03:56:03'),(237,'/uploads/productos/1762055763441-344421477.jpg','/uploads/productos/thumbs/1762055763441-344421477.jpg',15,'2025-11-02 03:56:03','2025-11-02 03:56:03'),(238,'/uploads/productos/1762056007918-448232514.jpg','/uploads/productos/thumbs/1762056007918-448232514.jpg',16,'2025-11-02 04:00:07','2025-11-02 04:00:07'),(239,'/uploads/productos/1762056007919-10447086.jpg','/uploads/productos/thumbs/1762056007919-10447086.jpg',16,'2025-11-02 04:00:07','2025-11-02 04:00:07'),(240,'/uploads/productos/1762056531966-579580345.jpg','/uploads/productos/thumbs/1762056531966-579580345.jpg',17,'2025-11-02 04:08:51','2025-11-02 04:08:51'),(241,'/uploads/productos/1762056531967-661146431.jpg','/uploads/productos/thumbs/1762056531967-661146431.jpg',17,'2025-11-02 04:08:52','2025-11-02 04:08:52'),(242,'/uploads/productos/1762056990764-429010924.jpg','/uploads/productos/thumbs/1762056990764-429010924.jpg',18,'2025-11-02 04:16:30','2025-11-02 04:16:30'),(243,'/uploads/productos/1762056990765-491430955.jpg','/uploads/productos/thumbs/1762056990765-491430955.jpg',18,'2025-11-02 04:16:30','2025-11-02 04:16:30'),(244,'/uploads/productos/1762057519053-85607961.jpg','/uploads/productos/thumbs/1762057519053-85607961.jpg',19,'2025-11-02 04:25:19','2025-11-02 04:25:19'),(245,'/uploads/productos/1762057519054-444165548.jpg','/uploads/productos/thumbs/1762057519054-444165548.jpg',19,'2025-11-02 04:25:19','2025-11-02 04:25:19'),(246,'/uploads/productos/1762058234026-503292287.jpg','/uploads/productos/thumbs/1762058234026-503292287.jpg',20,'2025-11-02 04:37:14','2025-11-02 04:37:14'),(247,'/uploads/productos/1762058234028-147663940.jpg','/uploads/productos/thumbs/1762058234028-147663940.jpg',20,'2025-11-02 04:37:14','2025-11-02 04:37:14'),(252,'/uploads/productos/1762283492745-950446558.jpg','/uploads/productos/thumbs/1762283492745-950446558.jpg',52,'2025-11-04 19:11:32','2025-11-04 19:11:32'),(253,'/uploads/productos/1762283492745-268471234.jpg','/uploads/productos/thumbs/1762283492745-268471234.jpg',52,'2025-11-04 19:11:32','2025-11-04 19:11:32'),(254,'/uploads/productos/1762283743329-478411788.jpg','/uploads/productos/thumbs/1762283743329-478411788.jpg',53,'2025-11-04 19:15:43','2025-11-04 19:15:43'),(255,'/uploads/productos/1762283743329-801732240.jpg','/uploads/productos/thumbs/1762283743329-801732240.jpg',53,'2025-11-04 19:15:43','2025-11-04 19:15:43');
/*!40000 ALTER TABLE `imagenesproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturablogarticulos`
--

DROP TABLE IF EXISTS `lecturablogarticulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturablogarticulos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaLectura` datetime NOT NULL,
  `tiempoLectura` int DEFAULT NULL,
  `completo` tinyint(1) DEFAULT NULL,
  `idUsuario` int NOT NULL,
  `idBlog` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idBlog` (`idBlog`),
  CONSTRAINT `lecturablogarticulos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lecturablogarticulos_ibfk_2` FOREIGN KEY (`idBlog`) REFERENCES `blogarticulos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturablogarticulos`
--

LOCK TABLES `lecturablogarticulos` WRITE;
/*!40000 ALTER TABLE `lecturablogarticulos` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturablogarticulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `texto` text NOT NULL,
  `idProducto` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientosstock`
--

DROP TABLE IF EXISTS `movimientosstock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientosstock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fechaMovimiento` datetime NOT NULL,
  `tipoMovimiento` enum('entrada','salida','ajuste') NOT NULL,
  `cantidad` int NOT NULL,
  `motivo` varchar(45) DEFAULT NULL,
  `idVarianteProducto` int NOT NULL,
  `idUsuario` int NOT NULL,
  `idOrdenCompra` int DEFAULT NULL,
  `idAdministrador` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idVarianteProducto` (`idVarianteProducto`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idOrdenCompra` (`idOrdenCompra`),
  KEY `idAdministrador` (`idAdministrador`),
  CONSTRAINT `movimientosstock_ibfk_1` FOREIGN KEY (`idVarianteProducto`) REFERENCES `variantesproductos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `movimientosstock_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `movimientosstock_ibfk_3` FOREIGN KEY (`idOrdenCompra`) REFERENCES `ordenescompras` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `movimientosstock_ibfk_4` FOREIGN KEY (`idAdministrador`) REFERENCES `administradores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientosstock`
--

LOCK TABLES `movimientosstock` WRITE;
/*!40000 ALTER TABLE `movimientosstock` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientosstock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenescompras`
--

DROP TABLE IF EXISTS `ordenescompras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenescompras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numeroOrden` varchar(255) NOT NULL,
  `fechaOrden` datetime NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `descuento` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','confirmada','enviada','entregada','cancelada') NOT NULL,
  `idUsuario` int NOT NULL,
  `idDireccion` int NOT NULL,
  `idCarrito` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCarrito` (`idCarrito`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idDireccion` (`idDireccion`),
  CONSTRAINT `ordenescompras_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ordenescompras_ibfk_2` FOREIGN KEY (`idDireccion`) REFERENCES `direcciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ordenescompras_ibfk_3` FOREIGN KEY (`idCarrito`) REFERENCES `carritos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenescompras`
--

LOCK TABLES `ordenescompras` WRITE;
/*!40000 ALTER TABLE `ordenescompras` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenescompras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `monto` decimal(10,2) NOT NULL,
  `metodoPago` enum('tarjeta','efectivo','transferencia') NOT NULL,
  `estadoPago` enum('pendiente','aprobado','rechazado','cancelado') NOT NULL,
  `fechaPago` datetime NOT NULL,
  `referenciaExterna` varchar(100) NOT NULL,
  `idOrdenCompra` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idOrdenCompra` (`idOrdenCompra`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`idOrdenCompra`) REFERENCES `ordenescompras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paises`
--

DROP TABLE IF EXISTS `paises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paises`
--

LOCK TABLES `paises` WRITE;
/*!40000 ALTER TABLE `paises` DISABLE KEYS */;
/*!40000 ALTER TABLE `paises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `actividadDeportiva` varchar(45) NOT NULL,
  `fechaCreacion` datetime NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagenUrl` varchar(500) DEFAULT NULL,
  `thumbnailUrl` varchar(500) DEFAULT NULL,
  `oferta` tinyint(1) NOT NULL DEFAULT '0',
  `descuento` int NOT NULL DEFAULT '0',
  `destacado` tinyint DEFAULT NULL,
  `activo` tinyint NOT NULL DEFAULT '1',
  `idCategoria` int NOT NULL,
  `idAdministrador` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCategoria` (`idCategoria`),
  KEY `idAdministrador` (`idAdministrador`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`idAdministrador`) REFERENCES `administradores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Calza estampada suplex','Calza con Cintura alta UA No-Slip para una protección y una sujeción óptimas que se adapta a todos tus movimientos.\r\nBolsillo lateral profundo.','General','2025-11-02 00:15:28',25000.00,'/uploads/productos/1762042528833-915129907.jpg','/uploads/productos/thumbs/1762042528833-915129907.jpg',1,10,1,0,3,1),(2,'Calza Vitalia W Essentials Mujer','Calza con ajuste ceñido y cintura elástica plana. 90 % algodón, 10 % elastano.','General','2025-11-02 00:19:16',23000.00,'/uploads/productos/1762042756018-826763943.jpg','/uploads/productos/thumbs/1762042756018-826763943.jpg',1,5,0,1,3,1),(3,'Short Head Palermo Mujer','Short de entrenamientos para mujer HEAD Palermo. Material principal: Poliéster. Ideal para Running.','General','2025-11-02 00:22:35',18000.00,'/uploads/productos/1762042955810-802107572.jpg','/uploads/productos/thumbs/1762042955810-802107572.jpg',1,5,0,1,4,1),(4,'Short Vitalia Velocity 3','Bolsillos interiores tipo maletín. Líneas de corte ergonómicas. Largo por encima de la rodilla.','General','2025-11-02 00:24:49',29000.00,'/uploads/productos/1762043089042-123203682.jpg','/uploads/productos/thumbs/1762043089042-123203682.jpg',1,10,1,1,4,1),(5,'Musculosa crossed','Calidad High Fit. Ajuste holgado. Tejido liviano, brinda sensación de frescura y ligereza. Ajuste estándar con detalle en cintura ideal para la práctica de tu deporte favorito.','General','2025-11-02 00:29:17',34000.00,'/uploads/productos/1762043644826-650546137.jpg','/uploads/productos/thumbs/1762043644826-650546137.jpg',1,10,0,1,2,1),(6,'Musculosa Oversize Training','Musculosa con cuello redondo. Espalda innovadora. Calidad Light Flow. Algodón suave brinda sensación de calidad y confortable . ','General','2025-11-02 00:31:33',28000.00,'/uploads/productos/1762043493425-36340917.jpg','/uploads/productos/thumbs/1762043493425-36340917.jpg',0,0,0,1,2,1),(7,'Top kilian','Top con sujeción media. Línea larga. Espalda competición brinda ajuste inamovible. Calidad Net- Z Air. Tejido texturizado, completa tanto tu look de entrenamiento, como tu actividad athleisure preferida.','General','2025-11-02 00:47:21',31000.00,'/uploads/productos/1762044441937-292786970.jpg','/uploads/productos/thumbs/1762044441937-292786970.jpg',1,5,1,1,1,1),(8,'Top Deportivo Vitalia','Top con sujeción alta. Línea larga. Breteles anchos, brindan comodidad durante tu entrenamiento. Calidad Technical Fit. Ideal para entrenamientos funcional y rutinas de gimnasio.','General','2025-11-02 00:51:53',29000.00,'/uploads/productos/1762044713656-254873299.jpg','/uploads/productos/thumbs/1762044713656-254873299.jpg',1,10,1,1,1,1),(9,'Top trana','Top con sujeción media. Línea media. Espalda competición, brinda ajuste inamovible. Calidad Technical Fit. Detalle con tul.','General','2025-11-02 00:56:57',27000.00,'/uploads/productos/1762045017903-481899617.jpg','/uploads/productos/thumbs/1762045017903-481899617.jpg',0,0,1,1,1,1),(10,'Calza lulu','Calza tiro alto. Cintura alta con elástico. Calidad Lycra Sport®. Ajuste entallado, ofrece una mayor seguridad y sujeción. Mix and match. Ideal para entrenamiento funcional y rutinas de gimnasio.','General','2025-11-02 03:08:56',35000.00,'/uploads/productos/1762052936009-561664913.jpg','/uploads/productos/thumbs/1762052936009-561664913.jpg',0,0,0,0,3,1),(11,'Calza Deportiva Vitalia','Calza tiro alto. Cintura alta con elástico. Calidad Lycra Sport®. Bolsillo interno en cintura ideal, para el guardado de tus pertenencias. Completa tanto tu look de entrenamiento, como tu actividad athleisure preferida.','General','2025-11-02 03:12:41',31000.00,'/uploads/productos/1762053161639-681261112.jpg','/uploads/productos/thumbs/1762053161639-681261112.jpg',1,15,1,1,3,1),(12,'Calza Estampada','Calza tiro alto. Cintura alta con detalle. Calidad Supplex. Ajuste entallado, ofrece una mayor seguridad y sujeción. Diseño con recortes y contraste de texturas, suman onda a tu outfit. Perfecto para entrenamientos de media y alto impacto.','General','2025-11-02 03:14:30',33000.00,'/uploads/productos/1762053270342-742967668.jpg','/uploads/productos/thumbs/1762053270342-742967668.jpg',0,0,0,1,3,1),(13,'Musculosa silueta','Musculosa calidad Soft Air. Ajuste estándar, mantiene la comodidad durante tus entrenamientos. Tejido microperforado, brinda sensación de frescura y ligereza. Contraste de color que suma onda a tu outfit. Ideal para todo tipo de actividad deportiva.','General','2025-11-02 03:38:24',23000.00,'/uploads/productos/1762054704472-284436596.jpg','/uploads/productos/thumbs/1762054704472-284436596.jpg',1,15,0,1,2,1),(14,'Musculosa algodón','Calidad Soft Air. Ajuste estándar, mantiene la comodidad durante tus entrenamientos. Tejido microperforado, brinda sensación de frescura y ligereza. Ideal para la práctica de tu deporte favorito.','General','2025-11-02 03:46:51',45000.00,'/uploads/productos/1762055211560-74251858.jpg','/uploads/productos/thumbs/1762055211560-74251858.jpg',1,15,0,1,2,1),(15,'Top kiara','Top con detalle en escote. Sujeción baja. Línea media. Breteles finos brindan mayor adaptabilidad. Calidad Lycra Sport®. Tejido jaquard texturizado, completa tanto tu look de entrenamiento, como tu actividad preferida.','General','2025-11-02 03:56:03',26000.00,'/uploads/productos/1762055763438-191813709.jpg','/uploads/productos/thumbs/1762055763438-191813709.jpg',0,0,1,1,1,1),(16,'Top micky','Top con sujeción media. Línea media. Espalda competición, brinda el ajuste ideal para tus entrenamientos. Calidad Lycra Sport®. Estampado tipo zebra, completa tu look de entrenamiento.','General','2025-11-02 04:00:07',36500.00,'/uploads/productos/1762056007917-949770928.jpg','/uploads/productos/thumbs/1762056007917-949770928.jpg',1,5,1,1,1,1),(17,'Short cotil','Short con elástico, permite el ajuste ideal. Calidad Micro T-Power. Calce estándar. Tejido liviano, brinda sensación de frescura y ligereza. Ideal para todo tipo de actividad deportiva.','General','2025-11-02 04:08:51',25000.00,'/uploads/productos/1762056531965-758892738.jpg','/uploads/productos/thumbs/1762056531965-758892738.jpg',0,0,1,1,4,1),(18,'Short Vitalia Full','Short tiro alto. Cintura alta. Calidad Micro T-Power. Tejido liviano, brinda sensación de frescura y ligereza. Bolsillos laterales para el guardado de tus pertenencias. Perfecto tanto para entrenar, como para obtener un look urbano.','General','2025-11-02 04:16:30',35000.00,'/uploads/productos/1762056990762-700605936.jpg','/uploads/productos/thumbs/1762056990762-700605936.jpg',0,0,1,1,4,1),(19,'Short nosaxa','Short con elástico en cintura. Ajuste interno, brinda el soporte necesario. Tejido liviano, brinda sensación de frescura y ligereza. Ideal para entrenamientos de mediano y alto impacto al aire libre.','General','2025-11-02 04:25:19',36000.00,'/uploads/productos/1762057519051-782329898.jpg','/uploads/productos/thumbs/1762057519051-782329898.jpg',1,5,0,1,4,1),(20,'Musculosa belen','Calidad Action Flex. Mantiene la comodidad durante tus entrenamientos. Tejido liviano, brinda sensación de frescura y ligereza.','General','2025-11-02 04:37:14',23000.00,'/uploads/productos/1762058234026-261045116.jpg','/uploads/productos/thumbs/1762058234026-261045116.jpg',1,5,0,1,2,1),(52,'Calza Deportiva','Cómoda','General','2025-11-04 19:11:32',37000.00,'/uploads/productos/1762283492744-278954724.jpg','/uploads/productos/thumbs/1762283492744-278954724.jpg',1,20,0,1,3,1),(53,'Calza','Cómoda','General','2025-11-04 19:15:43',37000.00,'/uploads/productos/1762283743327-797818003.jpg','/uploads/productos/thumbs/1762283743327-797818003.jpg',1,20,0,1,3,1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `calificacion` int NOT NULL,
  `comentario` text NOT NULL,
  `fechaResena` datetime NOT NULL,
  `idUsuario` int NOT NULL,
  `idProducto` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (28,4,'Excelente Calidad!','2025-11-04 10:57:44',1,5),(29,5,'Muy conforme!','2025-11-04 10:58:49',1,5),(30,5,'Excelente calidad!','2025-11-04 11:22:53',1,11),(31,4,'Muy Satisfecha!','2025-11-04 11:23:07',1,11),(32,2,'Mi pedido se demoro mas de lo esperado','2025-11-04 11:23:27',1,11),(33,4,'Muy lindo!','2025-11-04 17:32:57',1,1),(34,4,'Excelente calidad','2025-11-04 17:45:20',1,1),(35,4,'linda caldad!','2025-11-04 17:47:59',1,1),(36,4,'Muy lindo!','2025-11-04 17:49:49',1,1),(37,4,'Muy lindo!','2025-11-04 17:52:37',1,2);
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `eliminado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'SUPERADMIN','Super Administrador con todos los permisos',1,'2025-09-09 17:56:30','2025-10-03 05:46:38',0),(2,'ADMIN','Administrador con permisos de gestión',1,'2025-09-09 17:56:30','2025-10-10 17:35:28',0),(3,'USER','Usuario estándar de la tienda',1,'2025-09-09 17:56:30','2025-09-30 18:15:35',0),(4,'GUEST','Usuario invitado',0,'2025-09-09 17:56:30','2025-11-01 21:08:20',0);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefonos`
--

DROP TABLE IF EXISTS `telefonos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefonos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(255) NOT NULL,
  `tipo` enum('movil','fijo','trabajo') NOT NULL,
  `idUsuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `telefonos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefonos`
--

LOCK TABLES `telefonos` WRITE;
/*!40000 ALTER TABLE `telefonos` DISABLE KEYS */;
/*!40000 ALTER TABLE `telefonos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `idRol` int NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `proveedor` enum('local','google') NOT NULL DEFAULT 'local',
  `proveedorId` varchar(255) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idRol` (`idRol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Maria','Fulco','fulcomariadaniela@gmail.com','$2b$10$BYDmW4VAVygvLdGPxkyCTeOgdagE0da2cyMNcDj/7oRXLzuiPOrPC',1,3,'2025-09-11 11:21:37','2025-10-24 01:51:56','local','114349971690876054304',NULL),(2,'User Test','Tester','user@test.com','$2b$10$gm6rl8NePw066Sw.Q85c/uFdujyMGpQ/l4/KqYN5kSde25ZjY.Ba2',1,3,'2025-09-15 11:47:59','2025-10-24 01:51:56','local',NULL,NULL),(3,'Carla','Mendez','carlamendez@gmail.com','$2b$10$liC4UfR/s6QwCRjOwASNkez.AwtgYc3kBJ66iadscA4V4/fsjXwDa',1,3,'2025-10-07 17:34:46','2025-10-24 01:51:56','local',NULL,NULL),(4,'María','Cecilia','mariacecilia@gmail.com','$2b$10$8d8YeR6BndNRC8Ns1oKd9OrDBpHfQdPG.0DQKEwvli.Jy5XrobAfu',1,3,'2025-10-07 18:59:41','2025-10-24 01:51:56','local',NULL,NULL),(5,'Paola','gomez','paola@example.com','$2b$10$IX8w8qvKLeid6qrziTJzruTysCnQDHvyFfUQ5u5ZvMLqKIH6nDAba',1,3,'2025-10-07 19:50:09','2025-11-01 17:57:15','local',NULL,NULL),(6,'Jorgelina','Rodriguez','jorgelina.rodriguez@example.com','$2b$10$SkBh5Jgja.LqKfLi6u6Rve3CRQ8n3qSJqH5cOE3Z7dlMj1/hFn1Ta',1,3,'2025-10-07 19:56:08','2025-11-01 17:57:15','local',NULL,NULL),(7,'Cecilia','Piombo','cecipiombo@example.com','$2b$10$7oh7yhU9nIRyALSKFjfD3OjEyPxVX/SrDnOPqeZC5Pei3SFH.eVpa',1,3,'2025-10-07 22:22:11','2025-11-01 17:57:15','local',NULL,NULL),(8,'Graciela','Walfredo','graciela.walfredo@example.com','$2b$10$V9WOltJhsTQMqfSqq5mpEOE.5qymuaIT9VxAY.jgU.IqYhSZhnRGK',1,3,'2025-10-24 07:35:57','2025-11-01 16:10:26','local',NULL,NULL),(9,'Joana','Romay','joanaromay@gmail.com','$2b$10$IdBavElKxci50o8zrwueIeDiFpnLBwUYzG9sx5KrzbgFx7k11D2y.',1,3,'2025-10-29 23:11:00','2025-11-01 16:10:26','local',NULL,NULL),(10,'Zoe','Quinteros','zoe.quinteros@example.com','$2b$10$0xxktKukPQ3gByPIIkpHMOItt.oX1eEtN.P9EL.GJa92X4.TiQXpS',1,3,'2025-10-30 10:48:43','2025-11-01 16:10:26','local',NULL,NULL),(11,'Maria','Postay','maria.postay@example.com','$2b$10$ueaLvzt3Fu9AgqaW4yFHZeOLVNnNug48NGBHU.Up3d13YOwA7h0Le',1,3,'2025-10-30 11:04:04','2025-11-01 16:10:26','local',NULL,NULL),(12,'Camila','Bessone','camila.bessone@example.com','$2b$10$8Z/EN5UpNpVgVPWr8lcs5eJetUybY0aIM53yz8oP/pl1zGYIAO9Gy',1,3,'2025-11-01 20:59:44','2025-11-01 21:04:37','local',NULL,NULL),(13,'Isabella','Pesci','isapesci9@gmail.com','$2b$10$IKmGuPmmUegmZF5ULmyAaeZk8hOgazDS52msem9KBsWd0FB8VdbJ6',1,3,'2025-11-01 21:00:28','2025-11-01 18:03:36','local',NULL,NULL),(14,'Helena','Ferrero','helena.ferrero@example.com','$2b$10$asBeztXwvepIAaGD3JscuuC3lzN8TUZCc9njttNYvNqeCxiqxdMSi',1,3,'2025-11-01 21:01:53','2025-11-01 18:03:36','local',NULL,NULL),(15,'Morena','Roldan','morena.roldan@example.com','$2b$10$kkQ1cP3fYJpCF90GPfqx6.Cugp/GMHAliv8/c9DeP.Ggh2mxR4rEC',1,3,'2025-11-01 21:02:27','2025-11-01 18:03:36','local',NULL,NULL),(55,'Maria','Gomez','maria.gomez@example.com','$2b$10$Gk4fVNCmf0/H1zvNp52AZ.W2EsJJMwEnLnwNRorp6RCnT4VrFFyze',1,3,'2025-11-04 20:04:40','2025-11-04 20:04:40','local',NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variantesproductos`
--

DROP TABLE IF EXISTS `variantesproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variantesproductos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `talla` enum('XS','S','M','L','XL') NOT NULL,
  `color` varchar(45) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `idProducto` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `variantesproductos_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variantesproductos`
--

LOCK TABLES `variantesproductos` WRITE;
/*!40000 ALTER TABLE `variantesproductos` DISABLE KEYS */;
INSERT INTO `variantesproductos` VALUES (1,'S','Negro',25000.00,10,1,20),(2,'M','Verde',21000.00,15,1,20),(3,'L','Blanco',25000.00,8,1,20),(4,'S','Azul',34000.00,12,1,19),(5,'M','Naranja',34000.00,16,1,19),(6,'XL','Verde',31000.00,15,1,19),(7,'M','Negro',35000.00,8,1,18),(8,'L','Verde',32000.00,13,1,18),(9,'XL','Gris',32000.00,13,1,18),(10,'S','Gris',25000.00,17,1,17),(11,'M','Negro',25000.00,11,1,17),(12,'L','Azul',24000.00,15,1,17),(13,'L','Azul',33500.00,16,1,16),(14,'M','Negro',36500.00,9,1,16),(15,'XL','Celeste',33500.00,16,1,16),(16,'S','Negro',36500.00,7,1,15),(17,'M','Violeta',34500.00,15,1,15),(18,'L','Lila',34500.00,15,1,15),(19,'L','Gris',45000.00,8,1,14),(20,'M','Negro',45000.00,7,1,14),(21,'L','Blanco',45000.00,16,1,14),(22,'S','Verde',21000.00,12,1,13),(23,'M','Rosa',21000.00,6,1,13),(24,'L','Blanco',25000.00,9,1,13),(25,'S','Verde',30000.00,13,1,12),(26,'M','Negro',33000.00,5,1,12),(27,'L','Violeta',30000.00,10,1,12),(28,'S','Lila',31000.00,17,1,11),(29,'M','Azul',28000.00,10,1,11),(30,'L','Negro',31000.00,9,1,11),(31,'S','Negra',35000.00,8,1,10),(32,'M','Gris',35000.00,14,1,10),(33,'L','Estampado',31000.00,7,1,10),(34,'S','Lila',25000.00,5,1,9),(35,'M','Rosa',25000.00,11,1,9),(36,'L','Negro',27000.00,16,1,9),(37,'S','Lila',26000.00,12,1,8),(38,'M','Negro',29000.00,19,1,8),(39,'L','Rosa',26000.00,9,1,8),(40,'S','Rosa',29000.00,6,1,7),(41,'M','Verde',29000.00,13,1,7),(42,'L','Lila',31000.00,20,1,7),(43,'S','Lila',26000.00,1,1,6),(44,'M','Rosa',26000.00,10,1,6),(45,'XL','Violeta',28000.00,7,1,6),(46,'S','Violeta',31000.00,15,1,5),(47,'M','Lila',34000.00,18,1,5),(48,'L','Rosa',34000.00,21,1,5),(49,'S','Celeste',29000.00,9,1,4),(50,'M','Negro',26000.00,16,1,4),(51,'L','Rosa',29000.00,25,1,4),(52,'S','Naranja',16000.00,23,1,3),(53,'M','Rosa',18000.00,19,1,3),(54,'L','Fuccia',18000.00,4,1,3),(55,'S','Azul',20000.00,18,1,2),(56,'M','Rosa',23000.00,10,1,2),(57,'XL','Violeta',23000.00,12,1,2),(58,'S','Beige',25000.00,8,1,1),(59,'M','Negro',25000.00,5,1,1),(60,'L','Celeste',23000.00,24,1,1);
/*!40000 ALTER TABLE `variantesproductos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-04 20:27:31
