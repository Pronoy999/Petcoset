DROP PROCEDURE IF EXISTS sp_CustomerRegistration;
DELIMITER $$
CREATE PROCEDURE `sp_CustomerRegistration`(IN par_firstName varchar(255),
                                           IN par_lastName varchar(255),
                                           in par_emailId varchar(255),
                                           in par_password varchar(200),
                                           in par_phoneNo varchar(13),
                                           in par_gender varchar(1),
                                           in ownReferralCode varchar(50),
                                           in referralCode varchar(50))
BEGIN
    SET @EmailId = 0;
    SET @PhoneNo = 0;
    set @userId = 0;
    select 1 into @EmailId from tbl_CustomerMaster where email = par_emailId;
    select 1 into @PhoneNo from tbl_CustomerMaster where phone_number = par_phoneNo;
    select 1 into @EmailId from tbl_LoginMaster where email_id = par_emailId;

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
         status_id,
         created_by)
        VALUES (par_firstName,
                par_lastName,
                par_emailId,
                par_phoneNo,
                par_gender,
                ownReferralCode,
                referralCode,
                12,
                1);

        SELECT last_insert_id() into @userId;
        insert into tbl_LoginMaster (email_id, password, role, created_by)
            value (par_emailId, par_password, 'tbl_CustomerMaster', @userId);
        select @userId as id;
    end if;
end$$
DELIMITER ;
