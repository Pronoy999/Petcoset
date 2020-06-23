drop procedure if exists sp_UpdateCustomerPetDetails;
create procedure sp_UpdateCustomerPetDetails(parCustomerId int, parPetDetailsId int, parPetType enum ('DOG','CAT',''),
                                             parPetName varchar(255), parBreedId int, parPetGender enum ('M','F',''),
                                             parWeight varchar(100),
                                             parPetAgeYr int,
                                             parPetAgeMonth int)
begin
    set @setClaus = '';
    set @isExists = 0;
    select id
    into @isExists
    from tbl_CustomerPetDetailsMapping
    where id = parPetDetailsId
      and customer_id = parCustomerId
      and is_active = 1;
    if @isExists > 0 then
        if length(parPetType) > 0 then
            set @setClaus = concat(@setClaus, ' pet_type = ''', parPetType, ''',');
        end if;
        if length(parPetName) > 0 then
            set @setClaus = concat(@setClaus, ' pet_name = ''',parPetName, ''',');
        end if;
        if parBreedId > 0 then
            set @setClaus = concat(@setClaus, ' breed_id = ', parBreedId, ',');
        end if;
        if length(parPetGender) > 0 then
            set @setClaus = concat(@setClaus, ' pet_gender = ''', parPetGender, ''',');
        end if;
        if length(parWeight) > 0 then
            set @setClaus = concat(@setClaus, ' pet_weight = ''', parWeight, ''',');
        end if;
        if parPetAgeYr > 0 then
            set @setClaus = concat(@setClaus, ' pet_age_yr = ', parPetAgeYr, ',');
        end if;
        if parPetAgeMonth > 0 then
            set @setClaus = concat(@setClaus, ' pet_age_mo = ', parPetAgeMonth, ',');
        end if;
        if length(@setClaus) > 0 then
            set @setClaus = concat(@setClaus,' modified_by = ', parCustomerId, ',modified = now()');
            select concat('update tbl_CustomerPetDetailsMapping set ', @setClaus, ' where id = ', parPetDetailsId,
                          ' and customer_id = ', parCustomerId, ' and is_active = 1')
            into @stmtSQL;
            #select @stmtSQL;
            prepare stmtExec from @stmtSQL;
            execute stmtExec;
            deallocate prepare stmtExec;
            select 1 as id;
        else
            select -1 as id;
        end if;
    else
        select -1 as id;
    end if;
end;
