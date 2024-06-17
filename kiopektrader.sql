-- MariaDB dump 10.19  Distrib 10.4.24-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: kiopektrader
-- ------------------------------------------------------
-- Server version	10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `prices`
--

DROP TABLE IF EXISTS `prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prices` (
  `crypto_id` int(12) NOT NULL AUTO_INCREMENT,
  `crypto_name` varchar(12) NOT NULL,
  `value_usdt` double NOT NULL,
  PRIMARY KEY (`crypto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prices`
--

LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
INSERT INTO `prices` VALUES (1,'BTC',29780),(2,'ETH',1951.61),(3,'ADA',0.41),(4,'USDT',1),(5,'DOGE',0.05);
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `crypto_id` int(11) NOT NULL,
  `public_address_sender` varchar(16) NOT NULL,
  `public_address_reciever` varchar(16) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (16,10,3,'63693d4349706a4a','eac5c96f20069238','2024-06-13 02:29:15'),(17,10,3,'63693d4349706a4a','eac5c96f20069238','2024-06-13 02:33:48'),(18,0.008,1,'63693d4349706a4a','eac5c96f20069238','2024-06-13 20:49:18'),(19,0.001,1,'63693d4349706a4a','eac5c96f20069238','2024-06-13 20:50:20'),(20,1.5,2,'63693d4349706a4a','eac5c96f20069238','2024-06-13 20:58:39'),(21,500,5,'63693d4349706a4a','eac5c96f20069238','2024-06-14 01:32:14'),(22,500,5,'63693d4349706a4a','63693d4349706a4a','2024-06-14 04:03:57'),(23,50,3,'63693d4349706a4a','eac5c96f20069238','2024-06-14 04:07:14'),(24,15,5,'63693d4349706a4a','eac5c96f20069238','2024-06-14 04:18:24'),(25,50,5,'63693d4349706a4a','eac5c96f20069238','2024-06-14 04:18:49');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(26) NOT NULL,
  `public_address` varchar(16) NOT NULL,
  `email` varchar(64) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `user_wallet_fk` (`public_address`),
  CONSTRAINT `user_wallet_fk` FOREIGN KEY (`public_address`) REFERENCES `wallets` (`public_address`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (35,'nikich','123','1b1367355fccee28','fdds'),(36,'Yavor Cherepa','1234','eac5c96f20069238','starshi@abv.bg'),(37,'buba','123456','63693d4349706a4a','rodi_23@abv.bg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet_contents`
--

DROP TABLE IF EXISTS `wallet_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallet_contents` (
  `public_address` varchar(16) NOT NULL,
  `crypto_id` int(12) NOT NULL,
  `amount` float NOT NULL,
  KEY `content_wallet_fk` (`public_address`),
  KEY `crypto_id_fk` (`crypto_id`),
  CONSTRAINT `content_wallet_fk` FOREIGN KEY (`public_address`) REFERENCES `wallets` (`public_address`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `crypto_id_fk` FOREIGN KEY (`crypto_id`) REFERENCES `prices` (`crypto_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_contents`
--

LOCK TABLES `wallet_contents` WRITE;
/*!40000 ALTER TABLE `wallet_contents` DISABLE KEYS */;
INSERT INTO `wallet_contents` VALUES ('eac5c96f20069238',4,235.968),('eac5c96f20069238',1,0.019),('eac5c96f20069238',3,330),('eac5c96f20069238',2,1.52),('63693d4349706a4a',4,1463.71),('63693d4349706a4a',3,0),('63693d4349706a4a',1,0.26153),('63693d4349706a4a',2,0.00621998),('63693d4349706a4a',5,454),('eac5c96f20069238',5,565);
/*!40000 ALTER TABLE `wallet_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallets` (
  `public_address` varchar(16) NOT NULL,
  `private_key` varchar(32) NOT NULL,
  PRIMARY KEY (`public_address`),
  UNIQUE KEY `private_key` (`private_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
INSERT INTO `wallets` VALUES ('63693d4349706a4a','125f91b2c3ff4b018f393d10e6513b1c'),('eac5c96f20069238','8b958264947e10252774aee35a1a75f4'),('1b1367355fccee28','ffe22b8e11a9a47ebdf3ea3d3b6dac43');
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-18  2:23:34
