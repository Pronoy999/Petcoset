DROP PROCEDURE IF EXISTS sp_tbl_OTPMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_OTPMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_OTPMaster'
        ) THEN
        create table tbl_OTPMaster
        (
            id            int primary key auto_increment,
            phone_number  varchar(13)  NOT NULL,
            OTP           varchar(200) NOT NULL,
            is_active     tinyint               default 1,
            `created_by`  int(11)      NOT NULL DEFAULT 1,
            `created`     timestamp    NULL     DEFAULT CURRENT_TIMESTAMP,
            `modified_by` int(11)               DEFAULT NULL,
            `modified`    timestamp    NULL     DEFAULT NULL,
            UNIQUE KEY `email` (`OTP`)
        );
    end if;
end$$

DELIMITER ;
CALL sp_tbl_OTPMaster();
DROP PROCEDURE IF EXISTS sp_tbl_OTPMaster;