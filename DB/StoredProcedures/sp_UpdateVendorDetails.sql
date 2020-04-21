drop procedure if exists sp_UpdateVendorDetails;
create procedure sp_UpdateVendorDetails(parVendorID int, parEmail varchar(255),
                                        parPhone varchar(13), parAddress1 varchar(255), parAddress2 varchar(2),
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
    #If the email id is changed then the login will also change.
    if @isLoginChanged = 1 THEN
        select email into @originalEmail from tbl_VendorMaster where id = parVendorID;
        select concat('update tbl_LoginMaster set email_id= ''', parEmail, ''' where email_id = ''', @originalEmail,
                      '''')
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