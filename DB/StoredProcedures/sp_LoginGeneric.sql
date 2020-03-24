drop procedure if exists sp_LoginGeneric;
create procedure sp_LoginGeneric(in par_emailId varchar(200),
                                 in par_password varchar(100))
BEGIN
    SET @role = (select role from tbl_LoginMaster where email_id = par_emailId and password = par_password);

    IF @role IS NOT NULL
    THEN
        select concat(
                       'SELECT
                           R.id,
                           R.first_name,
                           R.last_name,
                           R.email,
                           R.gender,
                           R.phone_number,
                           R.address_1,
                           R.address_2,
                           C.city_name,
                           R.pincode
                       from ', @role,
                       ' as R

                           inner join tbl_LoginMaster L
                               on L.email_id = R.email
                           inner join tbl_CityMaster C
                               on C.id = R.city
                           where R.email = ''', par_emailId, '''
                    and L.password = ''', par_password, ''' AND R.is_active = 1;'
                   )
        into @dySQL;
        #select @dySQL;
        PREPARE stmt_Growth FROM @dySQL;
        EXECUTE stmt_Growth;
        DEALLOCATE PREPARE stmt_Growth;
    ELSE
        select -1 as id;
    end if;

end;
