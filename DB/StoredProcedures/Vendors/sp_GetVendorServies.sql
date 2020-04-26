drop procedure if exists sp_GetVendorServices;
create procedure sp_GetVendorServices(parVendorId int)
begin
    select v.id as vendor_id,
           s.service_id,
           sm.service_name,
           sm.service_type,
           s.pet_type,
           s.is_bathing_provided,
           s.is_massage_provided,
           s.is_cleaning_provided,
           s.is_fur_trimming_provided,
           s.pet_sex,
           s.pet_age,
           s.is_pedigree_certificate,
           s.is_written_medical_certificate,
           s.is_immunization_certificate,
           s.is_behavioural_modification,
           s.is_obedience_training,
           s.is_scientific_training,
           s.is_agility_training,
           s.is_therapy_training,
           s.number_dogs_trained_at_a_time,
           s.has_house,
           s.has_fenced_garden,
           s.is_pets_allowed_on_furniture,
           s.is_pets_allowed_on_bed,
           s.is_non_smoking,
           s.does_own_dog,
           s.does_own_cat,
           s.does_own_caged_animals,
           s.only_one_booking,
           s.pet_weight,
           s.number_of_visits,
           s.breed,
           s.service_duration_hours,
           s.service_per_week,
           s.service_charge
    from tbl_VendorMaster v
             inner join tbl_VendorServiceMapping s
                        on s.vendor_id = v.id
             inner join tbl_ServiceMaster sm
                        on sm.id = s.service_id
    WHERE v.id = parVendorId
      and s.is_active = 1;
end;