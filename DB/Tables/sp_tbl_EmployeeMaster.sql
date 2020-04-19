DROP PROCEDURE IF EXISTS sp_tbl_EmployeeMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_EmployeeMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_EmployeeMaster'
        ) THEN
        CREATE TABLE `tbl_EmployeeMaster`
        (
            `id`            int(11)        NOT NULL AUTO_INCREMENT,
            `first_name`    varchar(255)   NOT NULL,
            `last_name`     varchar(255)              DEFAULT NULL,
            `employee_role` enum ('Employee','Admin') DEFAULT NULL,
            `email`         varchar(255)   NOT NULL,
            `phone_number`  varchar(13)    NOT NULL,
            `gender`        enum ('M','F') NOT NULL,
            `address_1`     varchar(255)   NOT NULL,
            `address_2`     varchar(255)              DEFAULT NULL,
            `city`          int(11)        NOT NULL,
            `state`         int(11)        NOT NULL,
            `country`       int(11)        NOT NULL,
            `pincode`       int(11)                   DEFAULT NULL,
            `status_id`     int(11)                   DEFAULT NULL,
            `modify_access` enum ('1','0')            DEFAULT NULL,
            `is_active`     tinyint(4)                DEFAULT '1',
            `created_by`    int(11)        NOT NULL,
            `created`       timestamp      NULL       DEFAULT CURRENT_TIMESTAMP,
            `modified_by`   int(11)                   DEFAULT NULL,
            `modified`      timestamp      NULL       DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `email` (`email`),
            KEY `idx_email_employee` (`email`)
        ) ;
    end if;
end$$

DELIMITER ;
CALL sp_tbl_EmployeeMaster();
DROP PROCEDURE IF EXISTS sp_tbl_EmployeeMaster;