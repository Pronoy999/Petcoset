drop procedure if exists sp_VendorRegistration;
delimiter $$
create procedure sp_VendorRegistration(par_firstName varchar(255),
                                       par_lastName varchar(255),
                                       par_emailId varchar(255),
                                       par_password varchar(200),
                                       par_phoneNo varchar(13),
                                       par_gender enum ('M','F'),
                                       par_address1 varchar(255),
                                       par_address2 varchar(255),
                                       par_city int,
                                       par_pincode int,
                                       par_services varchar(100),
                                       par_documentType varchar(255),
                                       par_documentId varchar(255))
BEGIN
    SET @EmailId = 0;
    SET @PhoneNo = 0;
    SET @documentId = 0;
    select 1 into @EmailId from tbl_VendorMaster where email = par_emailId;
    select 1 into @PhoneNo from tbl_VendorMaster where phone_number = par_phoneNo;
    SELECT 1 into @documentId from tbl_IdentificationDocumentMaster WHERE document_id_number = par_documentId;

    drop temporary table if exists Temp_tblSubscriptionList;
    call spSplitString(par_services, ',', 'Temp_tblSubscriptionList');

    SELECT AUTO_INCREMENT
    INTO @vendorId
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = (SELECT DATABASE())
      AND TABLE_NAME = 'tbl_VendorMaster';
    IF (@EmailId = 1 OR @PhoneNo = 1 OR @documentId = 1)
    THEN
        Select -1 as id;
    ELSE
        insert into tbl_VendorMaster
        (first_name,
         last_name,
         email,
         phone_number,
         gender,
         address_1,
         address_2,
         city,
         pincode,
         created_by)
        values (par_firstName,
                par_lastName,
                par_emailId,
                par_phoneNo,
                par_gender,
                par_address1,
                par_address2,
                par_city,
                par_pincode,
                @vendorId);

        insert into tbl_VendorServiceMapping
            (vendor_id, service_id)
        select @vendorId,
               StrVal
        from Temp_tblSubscriptionList;


        INSERT INTO tbl_IdentificationDocumentMaster(document_holder_id, document_holder_type, document_type,
                                                     document_id_number, is_active, created_by)
        VALUES (@vendorId, 'tbl_VendorMaster', par_documentType, par_documentId, 1, @vendorId);
        SELECT @vendorId as id;

        INSERT INTO tbl_LoginMaster(email_id, password, role, created_by)
        VALUES (par_emailId, par_password, 'tbl_VendorMaster', @vendorId);
    END IF;
END$$
delimiter ;