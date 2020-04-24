drop procedure if exists sp_UpdateCustomerAddress;
create procedure sp_UpdateCustomerAddress(par_customerId int,
                                          par_Address1 varchar(100),
                                          par_Address2 varchar(100),
                                          par_cityId int,
                                          par_pincode int,
                                          par_isDefault bool)
begin
    IF EXISTS
        (
            select 1 from tbl_CustomerAddressMapping where customer_id = par_customerId
        )
    THEN
        IF par_isDefault = 1
        THEN
            #if a customer already has default address then make previous address default==0
            UPDATE tbl_CustomerAddressMapping
            SET is_default=0,
                modified_by = par_customerId,
                modified = current_timestamp()
            where customer_id = par_customerId;

            #insert the new customer address with default value
            insert into tbl_CustomerAddressMapping
            (customer_id,
             address1,
             address2,
             city_id,
             pincode,
             is_default,
             created_by,
             created)
            values (par_customerId,
                    par_Address1,
                    par_Address2,
                    par_cityId,
                    par_pincode,
                    par_isDefault,
                    par_customerId,
                    current_timestamp());

            select last_insert_id();

        ELSE

            #insert the new customer address with default value
            insert into tbl_CustomerAddressMapping
            (customer_id,
             address1,
             address2,
             city_id,
             pincode,
             is_default,
             created_by,
             created)
            values (par_customerId,
                    par_Address1,
                    par_Address2,
                    par_cityId,
                    par_pincode,
                    par_isDefault,
                    par_customerId,
                    current_timestamp());

            select last_insert_id();
        end if;
    ELSE
        select -1 as customer_id;
    END IF;
end;