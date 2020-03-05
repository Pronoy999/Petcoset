DROP PROCEDURE IF EXISTS sp_checkApiToken;
CREATE PROCEDURE sp_checkApiToken(in par_apiToken varchar(200))
BEGIN
    DECLARE isValid INT DEFAULT -1;
    SELECT 1 INTO isValid FROM tbl_ApiToken WHERE apiToken=par_apiToken AND validity>now();
    SELECT isValid;
end;