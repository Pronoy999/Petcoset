DROP PROCEDURE IF EXISTS sp_tbl_CustomerMaster;
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
        CREATE TABLE `tbl_CustomerMaster`
        (
            `id`                 int(11)        NOT NULL AUTO_INCREMENT,
            `first_name`         varchar(255)   NOT NULL,
            `last_name`          varchar(255)        DEFAULT NULL,
            `email`              varchar(255)   NOT NULL,
            `phone_number`       varchar(13)    NOT NULL,
            `gender`             enum ('M','F') NOT NULL,
            `referral_code`      varchar(50)         DEFAULT NULL,
            `used_referral_code` varchar(50)         DEFAULT NULL,
            `status_id`          int(11)             DEFAULT NULL,
            `is_active`          tinyint(4)          DEFAULT '1',
            `created_by`         int(11)        NOT NULL,
            `created`            timestamp      NULL DEFAULT CURRENT_TIMESTAMP,
            `modified_by`        int(11)             DEFAULT NULL,
            `modified`           timestamp      NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `email` (`email`),
            UNIQUE KEY `referral_code` (`referral_code`),
            KEY `Email_customer` (`email`)
        ) ;
    end if;
    if exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_CustomerMaster'
              and COLUMN_NAME = 'address_1'
        ) then
        begin
            alter table tbl_CustomerMaster
                drop column address_1;
        end;
    end if;
    if exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_CustomerMaster'
              and COLUMN_NAME = 'address_2'
        ) then
        begin
            alter table tbl_CustomerMaster
                drop column address_2;
        end;
    end if;
    if exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_CustomerMaster'
              and COLUMN_NAME = 'city'
        ) then
        begin
            alter table tbl_CustomerMaster
                drop column city;
        end;
    end if;
    if exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_CustomerMaster'
              and COLUMN_NAME = 'pincode'
        ) then
        begin
            alter table tbl_CustomerMaster
                drop column pincode;
        end;
    end if;
end;

CALL sp_tbl_CustomerMaster();
DROP PROCEDURE IF EXISTS sp_tbl_CustomerMaster;