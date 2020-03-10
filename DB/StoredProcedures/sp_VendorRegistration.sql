drop procedure if exists sp_VendorRegistration;
delimiter $$
create procedure sp_VendorRegistration(
	par_firstName varchar(255),
    par_lastName varchar(255),
    par_emailId varchar(255),
    par_phoneNo varchar(13),
    par_gender enum('M','F'),
    par_address1 varchar(255),
    par_address2 varchar(255),
    par_city int,
    par_state int,
    par_country int,
    par_pinCode int
    )
	BEGIN
		SET @EmailId = (select 1 from tbl_VendorMaster where email = par_emailId);
        SET @PhoneNo = (select 1 from tbl_VendorMaster where phone_number = par_phoneNo);
        
        IF (@EmailId <> 1 OR @PhoneNo <> 1)
			THEN
				Select 'User Already Exists';
			ELSE
				insert into tbl_VendorMaster
                (
					first_name,
                    last_name,
                    email,
                    phone_number,
                    gender,
                    address_1,
                    address_2,
                    city,
                    state,
                    country,
                    pincode
				)
                values 
                (
					par_firstName,
                    par_lastName,
                    par_emailId,
                    par_phoneNo,
                    par_gender,
                    par_address1,
                    par_address2,
                    par_city,
                    par_state,
                    par_country,
                    par_pinCode
				);
		END IF;
    END$$
delimiter ;