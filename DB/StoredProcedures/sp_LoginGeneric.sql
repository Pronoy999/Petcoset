drop procedure if exists sp_LoginGeneric;
create procedure sp_LoginGeneric(in par_emailId varchar(200),
                                 in par_password varchar(100))
BEGIN
    SET @role = (select role from tbl_LoginMaster where email_id = par_emailId and password = par_password);
    IF @role IS NOT NULL
    THEN
        select concat(
                       'SELECT ',
                       'R.id,
                       R.first_name,
                       R.last_name,
                       R.email,
                       R.gender,
                       R.phone_number,
                       S.status_name,
                    L.role
                   from ', @role,
                       ' as R
                           inner join tbl_LoginMaster L
                               on L.email_id = R.email
                            left join tbl_StatusMaster S
                                on S.id=R.status_id
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
