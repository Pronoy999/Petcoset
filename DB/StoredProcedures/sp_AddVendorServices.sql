drop procedure if exists sp_AddVendorServices;
create procedure sp_AddVendorServices(parVendorId int, parServiceID int, parPetType ENUM ('DOG','CAT',''),
                                      parIsBathing int, parDuration int, parServiceCharge decimal(5, 2))
BEGIN
    set @isExists = 0;
    select id into @isExists from tbl_VendorServiceMapping where vendor_id = parVendorId and service_id = parServiceID;
    if @isExists > 0 then
        set @whereClaus = ' set ';
        /*set @petTypeWhere = '';
        set @isBathing = '';
        set @duration = '';
        set @serviceCharge = '';*/
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
        /*set @len = length(@whereClaus) - 1;
        set @whereClaus = substring(@whereClaus, 1, @len);*/
        set @whereClaus = concat(@whereClaus, ' modified_by = ', parVendorId, ', modified = now()');
        select concat('update tbl_VendorServiceMapping ', @whereClaus, ' where vendor_id = ', parVendorId,
                      ' and service_id = ', parServiceID)
        into @stmtSQL;
        #select @stmtSQL;
        PREPARE stmtExec from @stmtSQL;
        EXECUTE stmtExec;
        DEALLOCATE PREPARE stmtExec;
        select 1 as id;

    else
        INSERT into tbl_VendorServiceMapping (vendor_id,
                                              service_id,
                                              pet_type,
                                              is_bathing_provided,
                                              service_duration_hours,
                                              service_charge,
                                              created_by)
            VALUE (parVendorId,
                   parServiceID,
                   parPetType,
                   parIsBathing,
                   parDuration,
                   parServiceCharge,
                   parVendorId);
        select last_insert_id() as id;
    end if;

end;

