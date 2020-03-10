DROP PROCEDURE IF EXISTS sp_insertCustomer;
DELIMITER $$
CREATE PROCEDURE `sp_insertCustomer`(IN firstName varchar(255), IN lastName varchar(255),
                                     in emailId varchar(255), in phoneNumber varchar(13), in customerGender varchar(1),
                                     in address1 varchar(255),
                                     in address2 varchar(255), in cityId INT, in stateId INT, in countryId int,
                                     in pin int, in ownReferralCode varchar(50),
                                     in referralCode varchar(50))
BEGIN
    DECLARE customer_id INT;
    DECLARE var_emailValidation tinyint;

    SELECT AUTO_INCREMENT
    INTO customer_id
    FROM information_schema.TABLES
    WHERE TABLE_NAME = 'tbl_CustomerMaster'
      AND TABLE_SCHEMA = (SELECT DATABASE());

    SELECT 1 INTO var_emailValidation from tbl_CustomerMaster where email = emailId;
    if (var_emailValidation = 1)
    Then
        select -1 as customer_id;
    else
        INSERT INTO tbl_CustomerMaster
        (first_name,
         last_name,
         email,
         phone_number,
         gender,
         address_1,
         address_2,
         city,
         state,
         country,
         pincode,
         referral_code,
         used_referral_code,
         created_by)
        VALUES (firstName,
                lastName,
                emailId,
                phoneNumber,
                customerGender,
                address1,
                address2,
                cityId,
                stateId,
                countryId,
                pin,
                ownReferralCode,
                referralCode, 1);
        SELECT customer_id;
    end if;
end$$
DELIMITER ;
