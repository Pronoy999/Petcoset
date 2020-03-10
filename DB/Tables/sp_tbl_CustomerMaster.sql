DROP PROCEDURE IF EXISTS sp_tbl_CustomerMaster;
DELIMITER $$
CREATE PROCEDURE sp_tbl_CustomerMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_CustomerMaster'
        ) THEN
        CREATE TABLE tbl_CustomerMaster
        (
            id                 INT PRIMARY KEY AUTO_INCREMENT,
            first_name         varchar(255)        NOT NULL,
            last_name          varchar(255),
            email              varchar(255) UNIQUE NOT NULL,
            phone_number       varchar(13)         NOT NULL,
            gender             ENUM ('M','F')      NOT NULL,
            address_1          varchar(255)        NOT NULL,
            address_2          varchar(255),
            city               INT                 NOT NULL,
            state              INT                 NOT NULL,
            country            INT                 NOT NULL,
            pincode            INT,
            referral_code      varchar(50) UNIQUE,
            used_referral_code varchar(50),
            is_active          tinyint   DEFAULT 1,
            created_by         int                 NOT NULL,
            created            timestamp DEFAULT CURRENT_TIMESTAMP,
            modified_by        INT,
            modified           timestamp,
            INDEX Email_customer (email)
        );
    end if;
end$$

DELIMITER ;
CALL sp_tbl_CustomerMaster();
DROP PROCEDURE IF EXISTS sp_tbl_CustomerMaster;