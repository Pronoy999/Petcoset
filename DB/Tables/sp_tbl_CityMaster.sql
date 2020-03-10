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
              AND TABLE_NAME = 'tbl_CityMaster'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_CityMaster` 
		(
		   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
		   `country_id` int(11) unsigned NOT NULL DEFAULT '1',
		   `state_id` int(11) unsigned DEFAULT NULL,
		   `city_name` varchar(255) DEFAULT NULL,
		   `city_org_id` int(11) unsigned DEFAULT NULL,
		   `is_active` tinyint(1) DEFAULT '1',
		   `created_by` int(11) DEFAULT '1',
		   `modified_by` int(11) DEFAULT NULL,
		   `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
		   `modified` timestamp NULL DEFAULT NULL,
		   PRIMARY KEY (`id`),
		   UNIQUE KEY `state_city` (`state_id`,`city_org_id`)
		);
    end if;
end$$

DELIMITER ;
CALL sp_tbl_CountryMaster();
DROP PROCEDURE IF EXISTS sp_tbl_CountryMaster;