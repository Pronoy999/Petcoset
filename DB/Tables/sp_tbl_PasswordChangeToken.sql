drop procedure if exists sp_tbl_PasswordChangeToken;
create procedure sp_tbl_PasswordChangeToken()
begin
    DECLARE CurrentSchema varchar(100);
    SELECT DATABASE() INTO CurrentSchema;
    if not exists(
            select 1
            from information_schema.TABLES
            where TABLE_SCHEMA = CurrentSchema
              and TABLE_NAME = 'tbl_PasswordChangeToken'
        ) then
        begin
            create table if not exists tbl_PasswordChangeToken
            (
                id          int primary key auto_increment,
                email_id    varchar(255) not null,
                token       varchar(8)   not null,
                is_active   tinyint   default 1,
                created_by  int          not null,
                created     timestamp default current_timestamp,
                modified_by int       default null,
                modified    timestamp default null
            );
        end;
    end if;
end;
call sp_tbl_PasswordChangeToken();
drop procedure if exists sp_tbl_PasswordChangeToken;