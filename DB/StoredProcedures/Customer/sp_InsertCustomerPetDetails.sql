drop procedure if exists sp_InsertCustomerPetDetails;
create procedure sp_InsertCustomerPetDetails(par_customerId int,
                                             par_petType enum ('DOG','CAT'),
                                             par_petName varchar(255),
                                             par_breed int,
                                             par_ageYr int,
                                             par_ageMo int,
                                             par_petGender enum ('M','F'),
                                             par_petWeight varchar(100))
begin
    insert into tbl_CustomerPetDetailsMapping
    (customer_id,
     pet_type,
     pet_name,
     breed_id,
     pet_gender,
     pet_weight,
     pet_age_yr,
     pet_age_mo,
     created_by)
    values (par_customerId,
            par_petType,
            par_petName,
            par_breed,
            par_petGender,
            par_petWeight,
            par_ageYr,
            par_ageMo,
            1);
    select LAST_INSERT_ID() as id;
end;