drop procedure if exists sp_AddVendorServices;
create procedure sp_AddVendorServices(parIsDelete int,
                                      parVendorId int,
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
                                      parPetWeight varchar(20),
                                      parNumOfVisits int,
                                      parBreed varchar(255),
                                      parChildAge int,
                                      parIsFullTime int,
                                      parIsFirstAid int,
                                      parDuration int,
                                      parServicePerWeek int,
                                      parServiceCharge decimal(18, 2))
BEGIN
    if parIsDelete = 1 then
        update tbl_VendorServiceMapping
        set is_active=0
        where vendor_id = parVendorId
          and service_id = parServiceID
          and is_active = 1;
        call sp_DeleteServiceImages(parVendorId, parServiceID);
        select 1 as id;
    else
        set @isExists = 0;
        select id
        into @isExists
        from tbl_VendorServiceMapping
        where vendor_id = parVendorId
          and service_id = parServiceID
          and is_active = 1;
        if @isExists > 0 then
            update tbl_VendorServiceMapping set is_active=0 where vendor_id = parVendorId and service_id = parServiceID;
        end if;
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
                                              child_age,
                                              is_full_time,
                                              is_first_aid,
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
                   parChildAge,
                   parIsFullTime,
                   parIsFirstAid,
                   parDuration,
                   parServicePerWeek,
                   parServiceCharge,
                   parVendorId);
        select last_insert_id() as id;
    end if;
end;

