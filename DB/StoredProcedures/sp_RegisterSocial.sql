drop procedure if exists sp_RegisterSocial;
create procedure sp_RegisterSocial(parFirstName varchar(255), parLastName varchar(255), parEmail varchar(255),
                                   parPassword varchar(255), parRole varchar(20))
begin
    set @isValidEmail = 0;
    select id into @isValidEmail from tbl_LoginMaster where email_id = parEmail and is_active = 1;
    if @isValidEmail > 0 then
        select -1 as id;
    else
        #Creating the login details.
        insert into tbl_LoginMaster (email_id, password, role, created_by)
            VALUE (parEmail, parPassword, parRole, 1);

        select concat('insert into ', parRole, '(first_name, last_name, email, gender, phone_number, status_id, created_by)
            value (''', parFirstName, ''',''', parLastName, ''',''', parEmail, ''',''', 'M', ''',''', ''',', 1, ',', 1,
                      ')')
        into @stmtSQL;
        #select @stmtSQL;
        prepare stmtExec from @stmtSQL;
        execute stmtExec;
        deallocate prepare stmtExec;
        select last_insert_id() as id;
    end if;
end;