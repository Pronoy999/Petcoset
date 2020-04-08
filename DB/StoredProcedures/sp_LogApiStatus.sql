DROP PROCEDURE IF EXISTS sp_LogApiStatus;
CREATE PROCEDURE sp_LogApiStatus(in requestKey varchar(50), in parPath varchar(50), in apiStatus INT, in responseCode INT,
                                 in apiKey varchar(200))
BEGIN
    INSERT INTO tbl_ApiLogger(request_Key, api_token, path, response_code, api_status, created_by)
    VALUES (requestKey, apiKey, parPath, responseCode, apiStatus, 1);
end;