drop procedure if exists sp_GetBreedDetails;
create procedure sp_GetBreedDetails(parPetType ENUM ('DOG','CAT'))
begin
    select id, breed_name, breed_description, pet_type
    from tbl_PetBreedMaster
    where pet_type = parPetType
      and is_active = 1;
end;