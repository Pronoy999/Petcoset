DROP PROCEDURE IF EXISTS sp_tbl_StatusMaster;
CREATE PROCEDURE sp_tbl_StatusMaster()
BEGIN
    DECLARE currentSchema varchar(100);
    SELECT DATABASE() INTO currentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = currentSchema
              AND TABLE_NAME = 'tbl_StatusMaster'
        ) THEN
        BEGIN
            CREATE TABLE tbl_StatusMaster
            (
                id          INT primary key auto_increment,
                status_name varchar(100)        NOT NULL,
                is_active   tinyint   DEFAULT 1 NOT NULL,
                created_by  INT                 NOT NULL,
                created     timestamp DEFAULT CURRENT_TIMESTAMP(),
                updated_by  int,
                updated     timestamp
            );
        end;
    end if;
end;
CALL sp_tbl_StatusMaster();
DROP PROCEDURE IF EXISTS sp_tbl_StatusMaster;