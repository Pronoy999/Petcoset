DROP PROCEDURE IF EXISTS sp_CustomerRegistration;
DELIMITER $$
CREATE PROCEDURE `sp_CustomerRegistration`(IN par_firstName varchar(255),
                                           IN par_lastName varchar(255),
                                           in par_emailId varchar(255),
                                           in par_password varchar(200),
                                           in par_phoneNo varchar(13),
                                           in par_gender varchar(1),
                                           in par_address1 varchar(255),
                                           in par_address2 varchar(255),
                                           in par_cityId INT,
                                           in pin int,
                                           in ownReferralCode varchar(50),
                                           in referralCode varchar(50))
BEGIN
    DECLARE customer_id INT;

    SELECT AUTO_INCREMENT
    INTO customer_id
    FROM information_schema.TABLES
    WHERE TABLE_NAME = 'tbl_CustomerMaster'
      AND TABLE_SCHEMA = (SELECT DATABASE());

    SET @EmailId = 0;
    SET @PhoneNo = 0;

    select 1 into @EmailId from tbl_CustomerMaster where email = par_emailId;
    select 1 into @PhoneNo from tbl_CustomerMaster where phone_number = par_phoneNo;

    if (@EmailId = 1 OR @PhoneNo = 1)
    Then
        select -1 as customer_id;
    else
        INSERT INTO tbl_CustomerMaster
        (first_name,
         last_name,
         email,
         phone_number,
         gender,
         referral_code,
         used_referral_code,
         created_by)
        VALUES (par_firstName,
                par_lastName,
                par_emailId,
                par_phoneNo,
                par_gender,
                ownReferralCode,
                referralCode,
                1);
        SELECT customer_id;

        INSERT INTO tbl_CustomerAddressMapping
        (customer_id,
         address1,
         address2,
         city_id,
         pincode,
         is_default)
        values (LAST_INSERT_ID(),
                par_address1,
                par_address2,
                par_cityId,
                pin,
                1);

        INSERT INTO tbl_LoginMaster(email_id, password, role, created_by)
        VALUES (par_emailId, par_password, 'tbl_CustomerMaster', customer_id);
    end if;
end$$
DELIMITER ;
