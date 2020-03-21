DROP PROCEDURE IF EXISTS sp_tbl_CustomerServiceBooking;
DELIMITER $$
CREATE PROCEDURE sp_tbl_CustomerServiceBooking()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_CustomerServiceBooking'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_CustomerServiceBooking` 
		(
		   `id` int(11) NOT NULL AUTO_INCREMENT,
		  `customer_id` int(11) NOT NULL,
		  `subscription_id` int(11) NOT NULL,
		  `service_provider_name` varchar(200) NOT NULL,
		  `service_provider_id` int(11) NOT NULL,
		  `service_rating` int(5) DEFAULT NULL,
		  `booking_amount` decimal(18,2) NOT NULL,
		  `is_active` tinyint(4) DEFAULT '1',
		  `created_by` int(11) NOT NULL,
		  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
		  `modified_by` int(11) DEFAULT NULL,
		  `modified` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		);
    end if;
end$$

DELIMITER ;
CALL sp_tbl_CustomerServiceBooking();
DROP PROCEDURE IF EXISTS sp_tbl_CustomerServiceBooking;