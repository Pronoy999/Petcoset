drop procedure if exists sp_LoginGeneric;
create procedure sp_LoginGeneric(
in par_emailId varchar(200),
in par_password varchar(100),
in par_role varchar(50)
)
BEGIN
    select concat(
            'SELECT R.* from ', par_role,
            ' as R
                inner join tbl_LoginMaster L
                    on L.email_id = R.email
                where R.email = ''', par_emailId, '''
                    and L.password = ''', par_password, ''';'
               )
        into @dySQL;
        -- select @dySQL;
        PREPARE stmt_Growth FROM @dySQL;
        EXECUTE stmt_Growth;
        DEALLOCATE PREPARE stmt_Growth;
end;