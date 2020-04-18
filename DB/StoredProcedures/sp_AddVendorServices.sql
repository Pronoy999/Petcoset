drop procedure if exists sp_AddVendorServices;
create procedure sp_AddVendorServices(parVendorId int, parServiceID int, parPetType ENUM ('DOG','CAT',''),
                                      parIsBathing int, parDuration int, parServiceCharge decimal(5, 2))
BEGIN
    set @isExists = 0;
    select id into @isExists from tbl_VendorServiceMapping where vendor_id = parVendorId and service_id = parServiceID;
    if @isExists > 0 then
        set @whereClaus = ' set ';
        set @petTypeWhere = '';
        set @isBathing = '';
        set @duration = '';
        set @serviceCharge = '';
        if parPetType = 'DOG' OR parPetType = 'CAT' THEN
            set @petTypeWhere = concat(' pet_type = ''', parPetType, '''');
        end if;
        if parIsBathing > -1 THEN
            set @isBathing = concat(' ,is_bathing_provided = ', parIsBathing) ;
        end if;
        if parDuration > 0 THEN
            set @duration = concat(' ,service_duration_hours = ', parDuration);
        end if;
        if parServiceCharge > 0 THEN
            set @serviceCharge = concat(' ,service_charge = ', parServiceCharge);
        end if;
        select concat('update tbl_VendorServiceMapping ', @whereClaus, @petTypeWhere, @isBathing, @duration,
                      @serviceCharge, ' where vendor_id = ', parVendorId, ' and service_id = ', parServiceID)
        into @stmtSQL;
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

