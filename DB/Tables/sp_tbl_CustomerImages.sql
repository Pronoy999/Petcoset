drop procedure if exists sp_tbl_CustomerImages;
create procedure sp_tbl_CustomerImages()
begin
    declare currentSchema varchar(50) default '';
    select database() into currentSchema;
    if not exists(
            select 1
            from information_schema.TABLES
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_CustomerImages'
        ) then
        begin
            create table tbl_CustomerImages
            (
                id          int auto_increment primary key,
                customer_id int                                 not null,
                image_type  ENUM ('PET','DOCUMENT')             NOT NULL,
                image_key   varchar(255)                        not null,
                base_url    varchar(255)                        not null,
                position    int       default 1,
                is_active   tinyint   default 1                 not null,
                created_by  int                                 not null,
                created     timestamp default current_timestamp not null,
                modified_by int       default null,
                modified    timestamp default null
            );
        end;
    end if;
end;
call sp_tbl_CustomerImages();
drop procedure if exists sp_tbl_CustomerImages;