DROP PROCEDURE IF EXISTS sp_tbl_SubscriptionServiceBooking;
DELIMITER $$
CREATE PROCEDURE sp_tbl_SubscriptionServiceBooking()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_SubscriptionServiceBooking'
        ) THEN
        CREATE TABLE `tbl_SubscriptionServiceBooking`
        (
            `id`                int(11)   NOT NULL AUTO_INCREMENT,
            `booking_type`      enum ('service_booking','subscription_booking','subscription_service_booking') DEFAULT NULL,
            `customer_id`       int(11)                                                                        DEFAULT NULL,
            `subscription_id`   int(11)                                                                        DEFAULT NULL,
            `service_id`        int(11)                                                                        DEFAULT NULL,
            `employee_id`       int(11)                                                                        DEFAULT NULL,
            `vendor_id`         int(11)                                                                        DEFAULT NULL,
            `total_amount`      decimal(18, 2)                                                                 DEFAULT NULL,
            `booking_status_id` int(11)                                                                        DEFAULT NULL,
            `booking_date`      date                                                                           DEFAULT NULL,
            `booking_time`      time                                                                           DEFAULT NULL,
            `address1`          varchar(50)                                                                    DEFAULT NULL,
            `address2`          varchar(50)                                                                    DEFAULT NULL,
            `city_id`           int                                                                            DEFAULT NULL,
            `pincode`           int                                                                            DEFAULT NULL,
            `is_active`         int(11)   NOT NULL                                                             DEFAULT '1',
            `created_by`        int(11)   NOT NULL,
            `modified_by`       int(11)                                                                        DEFAULT NULL,
            `created`           timestamp NOT NULL                                                             DEFAULT CURRENT_TIMESTAMP,
            `modified`          timestamp NULL                                                                 DEFAULT NULL,
            PRIMARY KEY (`id`)
        ) ;
    end if;
end$$

DELIMITER ;
CALL sp_tbl_SubscriptionServiceBooking();
DROP PROCEDURE IF EXISTS sp_tbl_SubscriptionServiceBooking;