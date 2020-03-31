DROP PROCEDURE IF EXISTS sp_tbl_PaymentMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_PaymentMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_PaymentMaster'
        ) THEN
        CREATE TABLE `tbl_PaymentMaster`
        (
            `id`                int(11)   NOT NULL AUTO_INCREMENT,
            `booking_id`        int(11)             DEFAULT NULL,
            `transaction_id`    varchar(100)        DEFAULT NULL,
            `payment_amount`    decimal(18, 2)      DEFAULT NULL,
            `payment_status_id` int(11)             DEFAULT NULL,
            `is_active`         tinyint(1) unsigned DEFAULT '1',
            `created_by`        int(11)   NOT NULL,
            `created`           timestamp NULL      DEFAULT CURRENT_TIMESTAMP,
            `modified_by`       int(11)             DEFAULT NULL,
            `modified`          timestamp NULL      DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY (`transaction_id`)
        );
    end if;
end$$

DELIMITER ;
CALL sp_tbl_PaymentMaster();
DROP PROCEDURE IF EXISTS sp_tbl_PaymentMaster;