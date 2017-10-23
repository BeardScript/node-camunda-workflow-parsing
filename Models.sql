SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

CREATE DATABASE IF NOT EXISTS `Models` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `Models`;

CREATE TABLE `attribute` (
  `id` int(11) NOT NULL,
  `objectId` varchar(100) NOT NULL,
  `processId` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `component` (
  `id` varchar(100) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text,
  `type` varchar(50) NOT NULL,
  `processId` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `connection` (
  `id` varchar(100) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text,
  `fromObject` varchar(100) NOT NULL,
  `toObject` varchar(100) NOT NULL,
  `processId` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `process` (
  `id` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `isExecutable` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `variable` (
  `id` int(32) NOT NULL,
  `name` varchar(50) NOT NULL,
  `value` varchar(200) DEFAULT NULL,
  `isConstant` tinyint(1) NOT NULL,
  `type` varchar(50) NOT NULL,
  `objectId` varchar(100) NOT NULL,
  `processId` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `attribute`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attribute_ibfk_3` (`objectId`),
  ADD KEY `attribute_ibfk_1` (`processId`);

ALTER TABLE `component`
  ADD PRIMARY KEY (`id`),
  ADD KEY `component_ibfk_1` (`processId`);

ALTER TABLE `connection`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `connection_ibfk_1` (`processId`);

ALTER TABLE `process`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `variable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `processId` (`processId`);


ALTER TABLE `attribute`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `variable`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=295;


ALTER TABLE `attribute`
  ADD CONSTRAINT `attribute_ibfk_1` FOREIGN KEY (`processId`) REFERENCES `process` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attribute_ibfk_2` FOREIGN KEY (`objectId`) REFERENCES `component` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `component`
  ADD CONSTRAINT `component_ibfk_1` FOREIGN KEY (`processId`) REFERENCES `process` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `connection`
  ADD CONSTRAINT `connection_ibfk_1` FOREIGN KEY (`processId`) REFERENCES `process` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `variable`
  ADD CONSTRAINT `variable_ibfk_1` FOREIGN KEY (`processId`) REFERENCES `process` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
