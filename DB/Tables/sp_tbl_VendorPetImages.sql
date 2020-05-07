drop procedure if exists sp_tbl_VendorPetImages;
create procedure sp_tbl_VendorPetImages()
begin
    declare currentSchema varchar(100) default '';
    select database() into currentSchema;
    if not exists(
            select 1
            from information_schema.TABLES
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_VendorPetImages'
        ) then
        begin
            create table tbl_VendorPetImages
            (
                id          int primary key auto_increment not null,
                vendor_id   int                            not null,
                image_type  enum ('DOCUMENT','PET')        not null,
                image_key   varchar(255)                   not null,
                base_url    varchar(255)                   not null,
                is_active   tinyint   default 1            not null,
                created_by  int                            not null,
                created     timestamp default current_timestamp,
                modified_by int       default null,
                modified    timestamp default null
            );
        end;
    end if;
end;
call sp_tbl_VendorPetImages();
drop procedure if exists sp_tbl_VendorPetImages;