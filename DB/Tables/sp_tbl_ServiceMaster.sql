DROP PROCEDURE IF EXISTS sp_tbl_ServiceMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_ServiceMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_ServiceMaster'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_ServiceMaster` (
		   `id` int(11) NOT NULL AUTO_INCREMENT,
		   `service_name` varchar(100) NOT NULL,
		   `service_type` varchar(100) NOT NULL,
		   `is_active` tinyint(4) DEFAULT NULL,
		   `created_by` int(11) NOT NULL,
		   `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
		   `modified_by` int(11) DEFAULT NULL,
		   `modified` timestamp NULL DEFAULT NULL,
		   PRIMARY KEY (`id`)
		);
    end if;
end$$

DELIMITER ;
CALL sp_tbl_ServiceMaster();
DROP PROCEDURE IF EXISTS sp_tbl_ServiceMaster;