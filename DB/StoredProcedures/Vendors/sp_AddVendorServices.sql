drop procedure if exists sp_AddVendorServices;
create procedure sp_AddVendorServices(parVendorId int,
                                      parServiceID int,
                                      parPetType ENUM ('DOG','CAT',''),
                                      parIsBathing int,
                                      parIsMassage int,
                                      parIsCleaning int,
                                      parIsFur int,
                                      parPetSex ENUM ('M','F'),
                                      parPetAge decimal(4, 2),
                                      parIsPedigreeCert int,
                                      parIsMedicalCert int,
                                      parIsImmuneCert int,
                                      parIsBehaveModification int,
                                      parIsObedienceTrain int,
                                      parIsScientificTrain int,
                                      parIsAgilityTrain int,
                                      parIsTherapyTrain int,
                                      parNumOfDogsTrain int,
                                      parHasHouse int,
                                      parHasFencedGarden int,
                                      parIsPetsOnFurniture int,
                                      parIsPetsOnBed int,
                                      parIsNoSmoking int,
                                      parDoesOwnDog int,
                                      parDoesOwnCat int,
                                      parDoesOwnCagedAnimals int,
                                      parISOneBooking int,
                                      parPetWeight int,
                                      parNumOfVisits int,
                                      parBreed varchar(255),
                                      parDuration int,
                                      parServicePerWeek int,
                                      parServiceCharge decimal(5, 2))
BEGIN
    set @isExists = 0;
    select id into @isExists from tbl_VendorServiceMapping where vendor_id = parVendorId and service_id = parServiceID;
    if @isExists > 0 then
        update tbl_VendorServiceMapping set is_active=0 where vendor_id = parVendorId and service_id = parServiceID;
        INSERT into tbl_VendorServiceMapping (vendor_id,
                                              service_id,
                                              pet_type,
                                              is_bathing_provided,
                                              is_massage_provided,
                                              is_cleaning_provided,
                                              is_fur_trimming_provided,
                                              pet_sex,
                                              pet_age,
                                              is_pedigree_certificate,
                                              is_written_medical_certificate,
                                              is_immunization_certificate,
                                              is_behavioural_modification,
                                              is_obedience_training,
                                              is_scientific_training,
                                              is_agility_training,
                                              is_therapy_training,
                                              number_dogs_trained_at_a_time,
                                              has_house,
                                              has_fenced_garden,
                                              is_pets_allowed_on_furniture,
                                              is_pets_allowed_on_bed,
                                              is_non_smoking,
                                              does_own_dog,
                                              does_own_cat,
                                              does_own_caged_animals,
                                              only_one_booking,
                                              pet_weight,
                                              number_of_visits,
                                              breed,
                                              service_duration_hours,
                                              service_per_week,
                                              service_charge,
                                              created_by, modified_by, modified)
            VALUE (parVendorId,
                   parServiceID,
                   parPetType,
                   parIsBathing,
                   parIsMassage,
                   parIsCleaning,
                   parIsFur,
                   parPetSex,
                   parPetAge,
                   parIsPedigreeCert,
                   parIsMedicalCert,
                   parIsImmuneCert,
                   parIsBehaveModification,
                   parIsObedienceTrain,
                   parIsScientificTrain,
                   parIsAgilityTrain,
                   parIsTherapyTrain,
                   parNumOfDogsTrain,
                   parHasHouse,
                   parHasFencedGarden,
                   parIsPetsOnFurniture,
                   parIsPetsOnBed,
                   parIsNoSmoking,
                   parDoesOwnDog,
                   parDoesOwnCat,
                   parDoesOwnCagedAnimals,
                   parISOneBooking,
                   parPetWeight,
                   parNumOfVisits,
                   parBreed,
                   parDuration,
                   parServicePerWeek,
                   parServiceCharge,
                   parVendorId, parVendorId, now());
        select last_insert_id() as id;
        /*set @whereClaus = ' set ';
        if parPetType = 'DOG' OR parPetType = 'CAT' THEN
            set @whereClaus = concat(@whereClaus, ' pet_type = ''', parPetType, ''',');
        end if;
        if parIsBathing > -1 THEN
            set @whereClaus = concat(@whereClaus, ' is_bathing_provided = ', parIsBathing, ',');
        end if;
        if parDuration > 1 THEN
            set @whereClaus = concat(@whereClaus, ' service_duration_hours = ', parDuration, ',');
        end if;
        if parServiceCharge > 0 THEN
            set @whereClaus = concat(@whereClaus, ' service_charge = ', parServiceCharge, ',');
        end if;
        #Adding the default change columns.
        set @whereClaus = concat(@whereClaus, ' modified_by = ', parVendorId, ', modified = now()');
        select concat('update tbl_VendorServiceMapping ', @whereClaus, ' where vendor_id = ', parVendorId,
                      ' and service_id = ', parServiceID)
        into @stmtSQL;
        #select @stmtSQL;
        PREPARE stmtExec from @stmtSQL;
        EXECUTE stmtExec;
        DEALLOCATE PREPARE stmtExec;
        select 1 as id;*/

    else
        INSERT into tbl_VendorServiceMapping (vendor_id,
                                              service_id,
                                              pet_type,
                                              is_bathing_provided,
                                              is_massage_provided,
                                              is_cleaning_provided,
                                              is_fur_trimming_provided,
                                              pet_sex,
                                              pet_age,
                                              is_pedigree_certificate,
                                              is_written_medical_certificate,
                                              is_immunization_certificate,
                                              is_behavioural_modification,
                                              is_obedience_training,
                                              is_scientific_training,
                                              is_agility_training,
                                              is_therapy_training,
                                              number_dogs_trained_at_a_time,
                                              has_house,
                                              has_fenced_garden,
                                              is_pets_allowed_on_furniture,
                                              is_pets_allowed_on_bed,
                                              is_non_smoking,
                                              does_own_dog,
                                              does_own_cat,
                                              does_own_caged_animals,
                                              only_one_booking,
                                              pet_weight,
                                              number_of_visits,
                                              breed,
                                              service_duration_hours,
                                              service_per_week,
                                              service_charge,
                                              created_by)
            VALUE (parVendorId,
                   parServiceID,
                   parPetType,
                   parIsBathing,
                   parIsMassage,
                   parIsCleaning,
                   parIsFur,
                   parPetSex,
                   parPetAge,
                   parIsPedigreeCert,
                   parIsMedicalCert,
                   parIsImmuneCert,
                   parIsBehaveModification,
                   parIsObedienceTrain,
                   parIsScientificTrain,
                   parIsAgilityTrain,
                   parIsTherapyTrain,
                   parNumOfDogsTrain,
                   parHasHouse,
                   parHasFencedGarden,
                   parIsPetsOnFurniture,
                   parIsPetsOnBed,
                   parIsNoSmoking,
                   parDoesOwnDog,
                   parDoesOwnCat,
                   parDoesOwnCagedAnimals,
                   parISOneBooking,
                   parPetWeight,
                   parNumOfVisits,
                   parBreed,
                   parDuration,
                   parServicePerWeek,
                   parServiceCharge,
                   parVendorId);
        select last_insert_id() as id;
    end if;

end;

