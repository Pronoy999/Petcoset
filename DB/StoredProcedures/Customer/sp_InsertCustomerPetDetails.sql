drop procedure if exists sp_InsertCustomerPetDetails;
create procedure sp_InsertCustomerPetDetails(
    par_customerId int,
    par_petType enum('DOG','CAT'),
    par_petName varchar(255),
    par_breedName varchar(250),
    par_ageYr int,
    par_ageMo int,
    par_petGender enum('M','F'),
    par_petWeight varchar(100)
)
begin
    /*call sp_InsertCustomerPetDetails(1, 'DOG', 'Tyson', 'Labrador Retriever', 2, 5, 'M', '45+ kg');*/
    insert into tbl_CustomerPetDetailsMapping
    (
        customer_id,
        pet_type,
        pet_name,
        breed_name,
        pet_gender,
        pet_weight,
        pet_age_yr,
        pet_age_mo,
        created_by
    )
    values
    (
        par_customerId,
        par_petType,
        par_petName,
        par_breedName,
        par_petGender,
        par_petWeight,
        par_ageYr,
        par_ageMo,
        1
    );

    select LAST_INSERT_ID() as id;
end;