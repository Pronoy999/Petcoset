drop procedure if exists sp_UpdateVendorDetails;
create procedure sp_UpdateVendorDetails(parVendorID int, parEmail varchar(255), parPassword varchar(255),
                                        parPhone varchar(13), parAddress1 varchar(255), parAddress2 varchar(255),
                                        parCityId int, parPincode int)
BEGIN
    set @setClaus = ' set ';
    set @isLoginChanged = 0;
    #Checking the Email.
    if (length(parEmail) > 0) THEN
        set @setClaus = concat(@setClaus, ' email = ''', parEmail, ''',');
        set @isLoginChanged = 1;
    end if;
    #checking the phone number.
    if (length(parPhone) > 0) then
        set @setClaus = concat(@setClaus, ' phone_number = ''', parPhone, ''',');
    end if;
    #checking the address1.
    if (length(parAddress1) > 0) THEN
        set @setClaus = concat(@setClaus, ' address_1 = ''', parAddress1, ''',');
    end if;
    #Checking the address2.
    if (length(parAddress2) > 0) then
        set @setClaus = concat(@setClaus, ' address_2 =''', parAddress2, ''',');
    end if;
    #Checking city.
    if (parCityId > 0) then
        set @setClaus = concat(@setClaus, ' city = ', parCityId, ',');
    end if;
    #Checking the pincode.
    if (parPincode > 0) THEN
        set @setClaus = concat(@setClaus, ' pincode = ', parPincode, ',');
    end if;
    set @setClaus = concat(@setClaus, ' modified_by = ', parVendorID, ', modified = now()');
    #Checking for login information change.
    if @isLoginChanged = 1 or length(parPassword) > 0 THEN
        select email into @originalEmail from tbl_VendorMaster where id = parVendorID;
        #Checking for Email change.
        set @emailChange = '';
        if (length(parEmail) > 0) then
            set @emailChange = concat(' email_id = ''', parEmail, ''',');
        end if;
        #Checking for password change.
        set @passwordChange = '';
        if (length(parPassword) > 0) then
            set @passwordChange = concat(' password = ''', parPassword, ''',');
        end if;
        set @loginSetClaus =
                concat(' set ', @emailChange, @passwordChange, ' modified_by = ', parVendorID, ', modified= now()');
        select concat('update tbl_LoginMaster ', @loginSetClaus, ' where email_id = ''', @originalEmail, '''')
        into @stmtSQL;
        #select @stmtSQL;
        prepare stmtExec from @stmtSQL;
        EXECUTE stmtExec;
        deallocate prepare stmtExec;
    end if;
    select concat('update tbl_VendorMaster ', @setClaus, ' where id = ', parVendorID) into @stmtSQL;
    #select @stmtSQL;
    prepare stmtExec from @stmtSQL;
    EXECUTE stmtExec;
    deallocate prepare stmtExec;
    select 1 as id;
end;