drop procedure if exists sp_tbl_PetBreedMaster;
create procedure sp_tbl_PetBreedMaster()
begin
    declare currentSchema varchar(100);
    select database() into currentSchema;
    if not exists(
            select 1
            from information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_PetBreedMaster'
        ) then
        begin
            create table tbl_PetBreedMaster
            (
                id                int primary key auto_increment NOT NULL,
                breed_name        varchar(255)                   NOT NULL,
                breed_description varchar(255)                            DEFAULT NULL,
                pet_type          ENUM ('DOG','CAT')             NOT NULL,
                is_active         tinyint                                 DEFAULT 1 NOT NULL,
                created           timestamp                      NOT NULL DEFAULT now(),
                created_by        int                            NOT NULL,
                modified          timestamp                               DEFAULT null,
                modified_by       int                                     DEFAULT NULL
            );
        end;
    end if;
end;
call sp_tbl_PetBreedMaster();
drop procedure if exists sp_tbl_PetBreedMaster;