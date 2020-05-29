DROP PROCEDURE IF EXISTS sp_tbl_CustomerPetDetailsMapping;
DELIMITER $$
CREATE PROCEDURE sp_tbl_CustomerPetDetailsMapping()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_CustomerPetDetailsMapping'
        ) THEN
        CREATE TABLE `tbl_CustomerPetDetailsMapping`
        (
            `id`          int(11)   NOT NULL AUTO_INCREMENT,
            `customer_id` int(11)            DEFAULT NULL,
            `pet_type`    enum ('DOG','CAT') DEFAULT NULL,
            `pet_name`    varchar(250)       DEFAULT NULL,
            `breed_id`    int                DEFAULT NULL,
            `pet_gender`  enum ('M','F')     DEFAULT NULL,
            `pet_weight`  varchar(100)       DEFAULT NULL,
            `pet_age_yr`  int(11)            DEFAULT NULL,
            `pet_age_mo`  int(11)            DEFAULT NULL,
            `is_active`   tinyint(4)         DEFAULT '1',
            `created_by`  int(11)   NOT NULL,
            `created`     timestamp NULL     DEFAULT CURRENT_TIMESTAMP,
            `modified_by` int(11)            DEFAULT NULL,
            `modified`    timestamp NULL     DEFAULT NULL,
            PRIMARY KEY (`id`)
        );
    end if;
end$$

DELIMITER ;
CALL sp_tbl_CustomerPetDetailsMapping();
DROP PROCEDURE IF EXISTS sp_tbl_CustomerPetDetailsMapping;