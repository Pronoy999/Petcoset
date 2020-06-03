drop procedure if exists sp_SearchVendorServices;
create procedure sp_SearchVendorServices(parServiceId int,
                                         parBookingDate date, parBookingTime time)
begin
    select v.id  as VendorId,
           v.first_name,
           v.last_name,
           v.email,
           v.phone_number,
           v.gender,
           v.address_1,
           v.address_2,
           v.city,
           cm.city_name,
           v.pincode,
           v.profile_image,
           v.rating,
           v.status_id,
           s.status_name,
           vs.id as VendorServiceId,
           vs.service_id,
           service_name,
           service_type,
           vs.pet_type,
           vs.is_bathing_provided,
           vs.is_massage_provided,
           vs.is_cleaning_provided,
           vs.is_fur_trimming_provided,
           vs.pet_sex,
           vs.pet_age,
           vs.is_pedigree_certificate,
           vs.is_written_medical_certificate,
           vs.is_immunization_certificate,
           vs.is_behavioural_modification,
           vs.is_obedience_training,
           vs.is_scientific_training,
           vs.is_agility_training,
           vs.is_therapy_training,
           vs.number_dogs_trained_at_a_time,
           vs.has_house,
           vs.has_fenced_garden,
           vs.is_pets_allowed_on_furniture,
           vs.is_pets_allowed_on_bed,
           vs.is_non_smoking,
           vs.does_own_dog,
           vs.does_own_cat,
           vs.does_own_caged_animals,
           vs.only_one_booking,
           vs.pet_weight,
           vs.number_of_visits,
           vs.breed,
           vs.child_age,
           vs.is_full_time,
           vs.is_first_aid,
           vs.service_duration_hours,
           vs.service_charge,
           vs.service_per_week
    from tbl_VendorMaster v
             inner join tbl_VendorServiceMapping vs
                        on vs.vendor_id = v.id
             left join tbl_ServiceMaster sm
                       on sm.id = vs.service_id
             left join tbl_StatusMaster s
                       on s.id = v.status_id
             left join tbl_CityMaster cm
                       on v.city = cm.id
    where v.id NOT IN (select vendor_id
                       from tbl_BookingMaster
                       where booking_status_id = 4
                         and booking_date = parBookingDate
                         and booking_time = parBookingTime)
      and vs.service_id = parServiceId
      and sm.is_active = 1
      and v.is_active = 1;
end;