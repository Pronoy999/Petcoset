drop procedure if exists sp_OtpCreateCheck;
create procedure sp_OtpCreateCheck(parMobileNumber varchar(13), parOtp int, isCheck tinyint)
BEGIN
    IF isCheck = 1 then
        SET @isValid = 0;
        select id
        into @isValid
        from tbl_OTPMaster
        where phone_number = parMobileNumber
          and OTP = parOtp
          and is_active = 1;
        #select @isValid;
        if @isValid > 0 THEN
            delete from tbl_OTPMaster WHERE phone_number = parMobileNumber and OTP = parOtp;
            select 1 as id;
        else
            select -1 as id;
        end if;
    else
        SET @isExists = 0;
        select id into @isExists from tbl_OTPMaster where phone_number = parMobileNumber;
        if @isExists > 0 THEN
            UPDATE tbl_OTPMaster set OTP=parOtp, modified=now(), modified_by=1 where phone_number = parMobileNumber;
        else
            insert into tbl_OTPMaster (phone_number, OTP, created_by) values (parMobileNumber, parOtp, 1);
        end if;
        select 1 as id;
    end if;
end;
