DROP PROCEDURE IF EXISTS sp_tbl_CustomerAddressMapping;
DELIMITER $$
CREATE PROCEDURE sp_tbl_CustomerAddressMapping()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_CustomerAddressMapping'
        ) THEN
        create table tbl_CustomerAddressMapping
        (
            id          int primary key auto_increment,
            customer_id int          default null,
            address1    varchar(100) default null,
            address2    varchar(100) default null,
            city_id     int          default null,
            pincode     int          default null,
            is_default  bool         default null,
            is_active   bool         default 1,
            created_by  int          default null,
            created     datetime     default current_timestamp(),
            modified_by int          default null,
            modified    datetime     default null
        );
    end if;
end$$

DELIMITER ;
CALL sp_tbl_CustomerAddressMapping();
DROP PROCEDURE IF EXISTS sp_tbl_CustomerAddressMapping;