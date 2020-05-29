drop procedure if exists sp_UpdateCustomerDetails;
create procedure sp_UpdateCustomerDetails(parCustomerId int, parPassword varchar(255),
                                          parPhoneNumber varchar(15))
begin
    set @setClaus = '';
    set @isAuthChanged = 0;
    if length(parPassword) > 0 then
        set @isAuthChanged = 1;
    end if;
    if length(parPhoneNumber) > 0 then
        set @setClaus = concat(@setClaus, ' phone_number = ''', parPhoneNumber, ''',');
    end if;
    if @isAuthChanged = 1 then
        set @authSet = '';
        if length(parPassword) > 0 then
            set @authSet = concat(@authSet, ' password = ''', parPassword, ''',');
        end if;
        set @authSet = concat(@authSet, ' modified_by = ', parCustomerId, ', modified = now()');
        set @loginId = 0;
        select l.id
        into @loginId
        from tbl_LoginMaster l,
             tbl_CustomerMaster c
        where l.email_id = c.email
          and c.id = parCustomerId
          and c.is_active = 1
        limit 1;
        if @loginId > 0 then
            select concat('update tbl_LoginMaster set ', @authSet, ' where id = ', @loginId,
                          ' and is_active =1 and role = ''tbl_CustomerMaster''')
            into @stmtSQL;
            #select @stmtSQL;
            prepare stmtExec from @stmtSQL;
            execute stmtExec;
            deallocate prepare stmtExec;
        end if;
    end if;
    select concat('update tbl_CustomerMaster set ', @setClaus, ' modified_by = ', parCustomerId,
                  ', modified=now() where id = ', parCustomerId)
    into @stmtSQL;
    #select @stmtSQL;
    prepare stmtExec from @stmtSQL;
    execute stmtExec;
    deallocate prepare stmtExec;
    select 1 as id;
end;
