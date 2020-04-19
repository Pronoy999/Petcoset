DROP PROCEDURE IF EXISTS sp_tbl_VendorServiceMapping;
CREATE PROCEDURE sp_tbl_VendorServiceMapping()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_VendorServiceMapping'
        ) THEN
        CREATE TABLE IF NOT EXISTS `tbl_VendorServiceMapping`
        (
            `id`          int(11)   NOT NULL AUTO_INCREMENT,
            `vendor_id`   int(11)        DEFAULT NULL,
            `service_id`  int(11)        DEFAULT NULL,
            `is_active`   tinyint(1)     DEFAULT '1',
            `created_by`  int(11)        DEFAULT '1',
            `modified_by` int(11)        DEFAULT NULL,
            `created`     timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `modified`    timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`)
        );
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'pet_type'
        ) then
        BEGIN
            alter table tbl_VendorServiceMapping
                add column pet_type ENUM ('DOG','CAT') DEFAULT NULL after service_id;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_bathing_provided'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column is_bathing_provided tinyint default 0 after pet_type;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'service_duration_hours'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column service_duration_hours int default 1 after is_bathing_provided;
        end;
    end if;
    if not exists(
        select 1 from information_schema.COLUMNS where TABLE_SCHEMA=currentSchema
        and TABLE_NAME='tbl_VendorServiceMapping' and COLUMN_NAME ='service_charge'
        ) then
        begin
            alter table tbl_VendorServiceMapping add column service_charge decimal(5,2) default 0.0 after service_duration_hours;
        end;
    end if;

end;

CALL sp_tbl_VendorServiceMapping();
DROP PROCEDURE IF EXISTS sp_tbl_VendorServiceMapping;