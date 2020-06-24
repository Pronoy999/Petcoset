DROP PROCEDURE IF EXISTS sp_tbl_CustomerSubscriptionMapping;
DELIMITER $$
CREATE PROCEDURE sp_tbl_CustomerSubscriptionMapping()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_CustomerSubscriptionMapping'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_CustomerSubscriptionMapping`
        (
            `id`                  int(11)   NOT NULL AUTO_INCREMENT,
            `customer_id`         int(11)        DEFAULT NULL,
            `subscription_id`     int(11)        DEFAULT NULL,
            `subscription_amount` decimal(18, 2) DEFAULT NULL,
            subscription_validity date           default null,
            `is_active`           tinyint(1)     DEFAULT '1',
            `created_by`          int(11)        DEFAULT '1',
            `modified_by`         int(11)        DEFAULT NULL,
            `created`             timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `modified`            timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`)
        );
    end if;
end$$

DELIMITER ;
CALL sp_tbl_CustomerSubscriptionMapping();
DROP PROCEDURE IF EXISTS sp_tbl_CustomerSubscriptionMapping;