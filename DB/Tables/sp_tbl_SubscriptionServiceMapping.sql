DROP PROCEDURE IF EXISTS sp_tbl_SubscriptionServiceMapping;
DELIMITER $$
CREATE PROCEDURE sp_tbl_SubscriptionServiceMapping()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_SubscriptionServiceMapping'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_SubscriptionServiceMapping` 
		(
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `subscription_id` int(11) DEFAULT NULL,
		  `service_id` int(11) DEFAULT NULL,
		  `services_count` int(11) DEFAULT NULL,
		  `is_active` tinyint(1) DEFAULT '1',
		  `created_by` int(11) DEFAULT '1',
		  `modified_by` int(11) DEFAULT NULL,
		  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
		  `modified` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		);
    end if;
end$$

DELIMITER ;
CALL sp_tbl_SubscriptionServiceMapping();
DROP PROCEDURE IF EXISTS sp_tbl_SubscriptionServiceMapping;