drop procedure if exists sp_GetCustomerPetDetails;
create procedure sp_GetCustomerPetDetails(parCustomerId int)
begin
    select p.id,
           p.customer_id,
           p.pet_type,
           p.pet_name,
           p.breed_id,
           p.pet_gender,
           p.pet_weight,
           p.pet_age_yr,
           p.pet_age_mo,
           breed_name,
           breed_description
    from tbl_CustomerPetDetailsMapping p
             left join tbl_PetBreedMaster b
                       on p.breed_id = b.id
    where p.customer_id = parCustomerId
      and p.is_active = 1;
end;