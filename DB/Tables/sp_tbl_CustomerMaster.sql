DROP PROCEDURE IF EXISTS sp_tbl_CustomerMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_CustomerMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_CustomerMaster'
        ) THEN
        CREATE TABLE `tbl_CustomerMaster`
        (
            `id`                 int(11)        NOT NULL AUTO_INCREMENT,
            `first_name`         varchar(255)   NOT NULL,
            `last_name`          varchar(255)        DEFAULT NULL,
            `email`              varchar(255)   NOT NULL,
            `phone_number`       varchar(13)    NOT NULL,
            `gender`             enum ('M','F') NOT NULL,
            `address_1`          varchar(255)        DEFAULT NULL,
            `address_2`          varchar(255)        DEFAULT NULL,
            `city`               int(11)             DEFAULT NULL,
            `state`              int(11)             DEFAULT NULL,
            `country`            int(11)             DEFAULT NULL,
            `pincode`            int(11)             DEFAULT NULL,
            `referral_code`      varchar(50)         DEFAULT NULL,
            `used_referral_code` varchar(50)         DEFAULT NULL,
            `status_id`          int(11)             DEFAULT NULL,
            `is_active`          tinyint(4)          DEFAULT '1',
            `created_by`         int(11)        NOT NULL,
            `created`            timestamp      NULL DEFAULT CURRENT_TIMESTAMP,
            `modified_by`        int(11)             DEFAULT NULL,
            `modified`           timestamp      NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `email` (`email`),
            UNIQUE KEY `referral_code` (`referral_code`),
            KEY `Email_customer` (`email`)
        ) ;
    end if;
end$$

DELIMITER ;
CALL sp_tbl_CustomerMaster();
DROP PROCEDURE IF EXISTS sp_tbl_CustomerMaster;