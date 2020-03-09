DROP PROCEDURE IF EXISTS sp_tbl_VendorServiceMapping;
DELIMITER $$
CREATE PROCEDURE sp_tbl_VendorServiceMapping()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_VendorServiceMapping'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_VendorServiceMapping` 
		(
		   `id` int(11) NOT NULL AUTO_INCREMENT,
		   `vendor_id` int(11) DEFAULT NULL,
		   `service_id` int(11) DEFAULT NULL,
		   PRIMARY KEY (`id`)
		);
    end if;
end$$

DELIMITER ;
CALL sp_tbl_VendorServiceMapping();
DROP PROCEDURE IF EXISTS sp_tbl_VendorServiceMapping;