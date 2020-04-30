DROP PROCEDURE IF EXISTS sp_tbl_BankDetailsMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_BankDetailsMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_BankDetailsMaster'
        ) THEN
        CREATE TABLE `tbl_BankDetailsMaster`
        (
            `id`                         int(11)   NOT NULL AUTO_INCREMENT,
            `holder_id`                  int(11)        DEFAULT NULL,
            `holder_type`                varchar(50)    DEFAULT NULL,
            `holder_name`                varchar(1000)  DEFAULT NULL,
            `account_number`             varchar(1000)  DEFAULT NULL,
            `bank_name`                  varchar(250)   DEFAULT NULL,
            `ifsc_code`                  varchar(1000)  DEFAULT NULL,
            `contact_number`             varchar(50)    DEFAULT NULL,
            `payment_gateway_account_id` varchar(1000)  DEFAULT NULL,
            `is_active`                  tinyint(4)     DEFAULT '1',
            `created_by`                 int(11)   NOT NULL,
            `created`                    timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `modified_by`                int(11)        DEFAULT NULL,
            `modified`                   timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`)
        ) ;
    end if;
end$$

DELIMITER ;
CALL sp_tbl_BankDetailsMaster();
DROP PROCEDURE IF EXISTS sp_tbl_BankDetailsMaster;