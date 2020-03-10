DROP PROCEDURE IF EXISTS sp_tbl_CountryMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_CountryMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_CountryMaster'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_CountryMaster` 
		(
		   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
		   `country` varchar(255) NOT NULL,
		   `country_code` varchar(255) DEFAULT NULL,
		   `citizenship` varchar(255) DEFAULT NULL,
		   `country_id_org` int(10) unsigned DEFAULT NULL,
		   `is_active` tinyint(1) unsigned DEFAULT '1',
		   `created_by` int(11) NOT NULL,
		   `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
		   `modified_by` int(11) DEFAULT NULL,
		   `modified` timestamp NULL DEFAULT NULL,
		   PRIMARY KEY (`id`)
		);
    end if;
end$$

DELIMITER ;
CALL sp_tbl_CountryMaster();
DROP PROCEDURE IF EXISTS sp_tbl_CountryMaster;