drop procedure if exists sp_GenerateAndValidatePasswordChangeToken;
create procedure sp_GenerateAndValidatePasswordChangeToken(parEmailId varchar(255), parToken varchar(8), parIsValid int)
begin
    set @isExists = 0;
    if parIsValid = 0 then
        select id into @isExists from tbl_LoginMaster where email_id = parEmailId and is_active = 1;
        if @isExists > 0 then
            insert into tbl_PasswordChangeToken(email_id, token, created_by) value (parEmailId, parToken, 1);
            select last_insert_id() as id;
        else
            select -1 as id;
        end if;
    elseif parIsValid = 1 then
        #Checking the validity of the token.
        set @isExists = 0;
        select id
        into @isExists
        from tbl_PasswordChangeToken
        where email_id = parEmailId
          and token = parToken
          and is_active = 1;
        if @isExists > 0 then
            delete from tbl_PasswordChangeToken where id = @isExists;
            select 1 as id;
        else
            select -1 as id;
        end if;
    end if;
end;