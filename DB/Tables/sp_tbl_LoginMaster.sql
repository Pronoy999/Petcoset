DROP PROCEDURE IF EXISTS sp_tbl_LoginMaster;
CREATE PROCEDURE sp_tbl_LoginMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT database() into currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_LoginMaster'
        ) THEN
        create table tbl_LoginMaster
        (
            id            int primary key auto_increment,
            email_id      varchar(200) NOT NULL,
            password      varchar(200) NOT NULL,
            role          varchar(100) NOT NULL,
            is_active     tinyint           default 1,
            `created_by`  int(11)      NOT NULL,
            `created`     timestamp    NULL DEFAULT CURRENT_TIMESTAMP,
            `modified_by` int(11)           DEFAULT NULL,
            `modified`    timestamp    NULL DEFAULT NULL,
            UNIQUE KEY `email` (`email_id`)
        );
    end if;
    if exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_LoginMaster'
              and COLUMN_NAME = 'password'
        ) then
        begin
            alter table tbl_LoginMaster
                modify password varchar(255) not null;
        end;
    end if;
end;
CALL sp_tbl_LoginMaster();
DROP PROCEDURE IF EXISTS sp_tbl_LoginMaster;