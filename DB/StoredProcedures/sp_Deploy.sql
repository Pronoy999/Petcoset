drop procedure if exists sp_Deploy;
create procedure sp_Deploy(parAdminEmail varchar(255), parAdminPassword varchar(50))
begin
    truncate tbl_VendorMaster;
    truncate tbl_LoginMaster;
    truncate tbl_VendorServiceMapping;
    truncate tbl_BankDetailsMaster;
    truncate tbl_IdentificationDocumentMaster;
    truncate tbl_CustomerMaster;
    truncate tbl_CustomerAddressMapping;
    truncate tbl_CustomerPetDetailsMapping;
    truncate tbl_CustomerServiceBooking;
    truncate tbl_CustomerImages;
    truncate tbl_CustomerSubscriptionMapping;
    truncate tbl_CustomerSubscriptionServiceMapping;
    truncate tbl_OTPMaster;
    truncate tbl_PaymentMaster;
    truncate tbl_ApiLogger;
    truncate tbl_EmployeeMaster;
    truncate tbl_EmployeeServiceMapping;
    truncate tbl_BookingMaster;
    truncate tbl_RecurringBooking;
    truncate tbl_VendorImages;
    insert into tbl_EmployeeMaster(first_name, last_name,
                                   employee_role, email,
                                   phone_number, gender,
                                   address_1, address_2,
                                   city, state, country,
                                   pincode, status_id,
                                   modify_access, created_by)
        VALUE (
               'Petcoset', 'Admin', 'Admin', parAdminEmail, '+917908717077', 'M', '', '', 0, 0, 1, 0, 12, 1, 1
        );
    insert into tbl_LoginMaster(email_id, password, role, is_active, created_by)
        VALUE (parAdminEmail, TO_BASE64(parAdminPassword), 'tbl_EmployeeMaster', 1, 1);
    select parAdminEmail as Email, parAdminPassword as Password;
end;