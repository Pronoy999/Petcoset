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
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'service_charge'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column service_charge decimal(5, 2) default 0.0 after service_duration_hours;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_massage_provided'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column is_massage_provided int default 0 after is_bathing_provided;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_cleaning_provided'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column is_cleaning_provided int default 0 after is_massage_provided;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_fur_trimming_provided'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column is_fur_trimming_provided int default 0 after is_cleaning_provided;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'pet_sex'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column pet_sex ENUM ('M','F') default null after is_fur_trimming_provided;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'pet_age'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column pet_age decimal(4, 2) default null after pet_sex;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_pedigree_certificate'
        ) then
        begin
            alter table tbl_VendorServiceMapping
                add column is_pedigree_certificate int default null after pet_age;
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_written_medical_certificate'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_written_medical_certificate int default null after is_pedigree_certificate;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_immunization_certificate'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_immunization_certificate int default null after is_written_medical_certificate;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_behavioural_modification'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_behavioural_modification int default null after is_immunization_certificate;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_obedience_training'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_obedience_training int default null after is_behavioural_modification;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_scientific_training'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_scientific_training int default null after is_obedience_training;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_agility_training'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_agility_training int default null after is_scientific_training;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_therapy_training'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_therapy_training int default null after is_agility_training;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'service_per_week'
        ) then
        alter table tbl_VendorServiceMapping
            add column service_per_week int default null after service_duration_hours;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'number_dogs_trained_at_a_time'
        ) then
        alter table tbl_VendorServiceMapping
            add column number_dogs_trained_at_a_time int default null after is_therapy_training;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'has_house'
        ) then
        alter table tbl_VendorServiceMapping
            add column has_house int default null after number_dogs_trained_at_a_time;
    end if;

    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'has_fenced_garden'
        ) then
        alter table tbl_VendorServiceMapping
            add column has_fenced_garden int default null after has_house;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_pets_allowed_on_furniture'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_pets_allowed_on_furniture int default null after has_fenced_garden;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_pets_allowed_on_bed'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_pets_allowed_on_bed int default null after is_pets_allowed_on_furniture;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'is_non_smoking'
        ) then
        alter table tbl_VendorServiceMapping
            add column is_non_smoking int default null after is_pets_allowed_on_bed;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'does_own_dog'
        ) then
        alter table tbl_VendorServiceMapping
            add column does_own_dog int default null after is_non_smoking;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'does_own_cat'
        ) then
        alter table tbl_VendorServiceMapping
            add column does_own_cat int default null after does_own_dog;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'does_own_caged_animals'
        ) then
        alter table tbl_VendorServiceMapping
            add column does_own_caged_animals int default null after does_own_cat;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'only_one_booking'
        ) then
        alter table tbl_VendorServiceMapping
            add column only_one_booking int default null after does_own_caged_animals;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'pet_weight'
        ) then
        alter table tbl_VendorServiceMapping
            add column pet_weight int default null after only_one_booking;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorServiceMapping'
              and COLUMN_NAME = 'number_of_visits'
        ) then
        alter table tbl_VendorServiceMapping
            add column number_of_visits int default null after pet_weight;
    end if;
end;

CALL sp_tbl_VendorServiceMapping();
DROP PROCEDURE IF EXISTS sp_tbl_VendorServiceMapping;