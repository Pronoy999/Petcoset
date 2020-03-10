DROP PROCEDURE IF EXISTS sp_tbl_ApiToken;
CREATE PROCEDURE sp_tbl_ApiToken()
BEGIN
    DECLARE CurrentSchema varchar(100);
    SELECT DATABASE() INTO CurrentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = CurrentSchema
              AND TABLE_NAME = 'tbl_ApiToken'
        ) THEN
        BEGIN
            CREATE TABLE tbl_ApiToken
            (
                id         INT AUTO_INCREMENT PRIMARY KEY,
                apiKey     VARCHAR(200)            NOT NULL,
                apiToken   VARCHAR(200)            NOT NULL,
                validity   TIMESTAMP               NOT NULL,
                created_by INT                     NOT NULL,
                created    TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_by INT,
                updated    TIMESTAMP
            );
            CREATE UNIQUE INDEX IDX_apiKey ON tbl_ApiToken (apiKey);
        end;
    end if;
end;
CALL sp_tbl_ApiToken();
DROP PROCEDURE IF EXISTS sp_tbl_ApiToken;