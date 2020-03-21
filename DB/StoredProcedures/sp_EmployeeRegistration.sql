drop procedure if exists sp_EmployeeRegistration;
delimiter $$
create procedure sp_EmployeeRegistration(par_firstName varchar(255),
                                       par_lastName varchar(255),
                                       par_emailId varchar(255),
                                       par_password varchar(200),
                                       par_phoneNo varchar(13),
                                       par_role varchar(50),
                                       par_gender enum ('M','F'),
                                       par_address1 varchar(255),
                                       par_address2 varchar(255),
                                       par_city int,
                                       par_state int,
                                       par_country int,
                                       par_pincode int,
                                       par_modAccess enum('1','0'),
                                       par_documentType varchar(255),
                                       par_documentId varchar(255),
                                       par_empId int
                                       )
BEGIN
    SET @EmailId = 0;
    SET @PhoneNo = 0;
    SET @documentId = 0;

    select 1 into @EmailId from tbl_EmployeeMaster where email = par_emailId;
    select 1 into @PhoneNo from tbl_EmployeeMaster where phone_number = par_phoneNo;
    SELECT 1 into @documentId from tbl_IdentificationDocumentMaster WHERE document_id_number = par_documentId;
    SET @empRole = (SELECT employee_role from tbl_EmployeeMaster where id = par_empId);

    SELECT AUTO_INCREMENT
    INTO @empId
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = (SELECT DATABASE())
      AND TABLE_NAME = 'tbl_EmployeeMaster';

    IF (@EmailId = 1 OR @PhoneNo = 1 OR @documentId = 1)
    THEN
        Select -1 as id;
    ELSE
        IF (@empRole = 'Admin')
        THEN
            insert into tbl_EmployeeMaster
            (
                first_name
                ,last_name
                ,employee_role
                ,email
                ,phone_number
                ,gender
                ,address_1
                ,address_2
                ,city
                ,state
                ,country
                ,pincode
                ,modify_access
            )
            values
            (
                par_firstName,
                par_lastName,
                par_role,
                par_emailId,
                par_phoneNo,
                par_gender,
                par_address1,
                par_address2,
                par_city,
                par_state,
                par_country,
                par_pincode,
                par_modAccess
            );
            INSERT INTO tbl_IdentificationDocumentMaster(document_holder_id, document_holder_type, document_type,
                                                         document_id_number, is_active, created_by)
            VALUES (@empId, 'tbl_EmployeeMaster', par_documentType, par_documentId, 1, @empId);
            SELECT @empId as id;

            INSERT INTO tbl_LoginMaster(email_id, password, role, created_by)
            VALUES (par_emailId,par_password,'tbl_EmployeeMaster',@empId);
        ELSE
            select -1 as id;
        end if;
    END IF;
END$$
delimiter ;