drop procedure if exists sp_tbl_ServiceFilter;
create procedure sp_tbl_ServiceFilter()
begin
    declare currentSchema varchar(100) default '';
    select database() into currentSchema;
    if not exists(
            select 1
            from information_schema.TABLES
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_ServiceFilter'
        ) then
        begin
            CREATE TABLE `tbl_ServiceFilter`
            (
                `id`                             int(11)   NOT NULL AUTO_INCREMENT,
                `customer_id`                    int(11)               DEFAULT NULL,
                `service_id`                     int(11)               DEFAULT NULL,
                `pet_type`                       enum ('DOG','CAT','') DEFAULT NULL,
                `is_bathing_provided`            tinyint(4)            DEFAULT '0',
                `is_massage_provided`            int(11)               DEFAULT '0',
                `is_cleaning_provided`           int(11)               DEFAULT '0',
                `is_fur_trimming_provided`       int(11)               DEFAULT '0',
                `pet_sex`                        enum ('M','F')        DEFAULT NULL,
                `pet_age`                        decimal(4, 2)         DEFAULT NULL,
                `is_pedigree_certificate`        int(11)               DEFAULT NULL,
                `is_written_medical_certificate` int(11)               DEFAULT NULL,
                `is_immunization_certificate`    int(11)               DEFAULT NULL,
                `is_behavioural_modification`    int(11)               DEFAULT NULL,
                `is_obedience_training`          int(11)               DEFAULT NULL,
                `is_scientific_training`         int(11)               DEFAULT NULL,
                `is_agility_training`            int(11)               DEFAULT NULL,
                `is_therapy_training`            int(11)               DEFAULT NULL,
                `number_dogs_trained_at_a_time`  int(11)               DEFAULT NULL,
                `has_house`                      int(11)               DEFAULT NULL,
                `has_fenced_garden`              int(11)               DEFAULT NULL,
                `is_pets_allowed_on_furniture`   int(11)               DEFAULT NULL,
                `is_pets_allowed_on_bed`         int(11)               DEFAULT NULL,
                `is_non_smoking`                 int(11)               DEFAULT NULL,
                `does_own_dog`                   int(11)               DEFAULT NULL,
                `does_own_cat`                   int(11)               DEFAULT NULL,
                `does_own_caged_animals`         int(11)               DEFAULT NULL,
                `only_one_booking`               int(11)               DEFAULT NULL,
                `pet_weight`                     int(11)               DEFAULT NULL,
                `number_of_visits`               int(11)               DEFAULT NULL,
                `breed`                          varchar(255)          DEFAULT NULL,
                `child_age`                      int(11)               DEFAULT NULL,
                `is_full_time`                   tinyint(4)            DEFAULT NULL,
                `is_first_aid`                   tinyint(4)            DEFAULT NULL,
                `service_duration_hours`         int(11)               DEFAULT '1',
                `service_per_week`               int(11)               DEFAULT NULL,
                `is_active`                      tinyint(1)            DEFAULT '1',
                `created_by`                     int(11)               DEFAULT '1',
                `modified_by`                    int(11)               DEFAULT NULL,
                `created`                        timestamp NULL        DEFAULT CURRENT_TIMESTAMP,
                `modified`                       timestamp NULL        DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        end;
    end if;
end;
call sp_tbl_ServiceFilter();
drop procedure if exists sp_tbl_ServiceFilter;