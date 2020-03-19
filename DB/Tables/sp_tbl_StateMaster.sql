DROP PROCEDURE IF EXISTS sp_tbl_StateMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_StateMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_StateMaster'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_StateMaster` 
		(
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `state_name` varchar(255) NOT NULL,
		  `state_code` varchar(10) DEFAULT NULL,
		  `country_id` int(11) DEFAULT NULL,
		  `is_active` tinyint(4) NOT NULL DEFAULT '1',
		  `created_by` int(11) NOT NULL,
		  `modified_by` int(11) DEFAULT NULL,
		  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
		  `modified` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `state_code` (`state_code`)
		);
    end if;
end$$

DELIMITER ;
CALL sp_tbl_StateMaster();
DROP PROCEDURE IF EXISTS sp_tbl_StateMaster;