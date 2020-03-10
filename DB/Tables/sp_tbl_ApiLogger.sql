DROP PROCEDURE IF EXISTS sp_tbl_ApiLogger;
CREATE PROCEDURE sp_tbl_ApiLogger()
BEGIN
    DECLARE CurrentSchema varchar(100);
    SELECT DATABASE() INTO CurrentSchema;
    IF NOT EXISTS(
            SELECT 1
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = CurrentSchema
              AND TABLE_NAME = 'tbl_ApiLogger'
        ) THEN
        BEGIN
            CREATE TABLE tbl_ApiLogger
            (
                id            INT PRIMARY KEY auto_increment,
                request_Key   varchar(50)  NOT NULL,
                api_token     varchar(200) NOT NULL,
                path          varchar(50)  NOT NULL,
                response_code INT          NOT NULL,
                api_status    INT          NOT NULL,
                created_by    INT          NOT NULL,
                created       timestamp DEFAULT CURRENT_TIMESTAMP(),
                updated_by    INT,
                updated       timestamp,
                constraint FOREIGN KEY (api_status) REFERENCES tbl_StatusMaster (id),
                constraint FOREIGN KEY (api_token) REFERENCES tbl_ApiToken (apiToken)
            );
        end;
    end if;
end;
CALL sp_tbl_ApiLogger();
DROP PROCEDURE IF EXISTS sp_tbl_ApiLogger;