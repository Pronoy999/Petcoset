DROP PROCEDURE IF EXISTS sp_tbl_BookingType;
DELIMITER $$
CREATE PROCEDURE sp_tbl_BookingType()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_BookingType'
        ) THEN
        CREATE TABLE `tbl_BookingType`
        (
            `id`           int(11)   NOT NULL AUTO_INCREMENT,
            `booking_type` enum('service_booking','subscription_booking') DEFAULT NULL,
            `is_active`    tinyint(1)     DEFAULT '1',
            `created_by`   int(11)        DEFAULT '1',
            `modified_by`  int(11)        DEFAULT NULL,
            `created`      timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `modified`     timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`)
        );
    end if;
end$$

DELIMITER ;
CALL sp_tbl_BookingType();
DROP PROCEDURE IF EXISTS sp_tbl_BookingType;