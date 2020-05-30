drop procedure if exists sp_UpdateCustomerAddress;
create procedure sp_UpdateCustomerAddress(par_customerId int,
                                          par_Address1 varchar(100),
                                          par_Address2 varchar(100),
                                          par_cityId int,
                                          par_pincode int,
                                          par_isDefault bool)
begin
    set @isExists = 0;
    select id into @isExists from tbl_CustomerMaster where id = par_customerId and is_active = 1;
    if @isExists > 0 then
        if par_isDefault = 1 then
            update tbl_CustomerAddressMapping set is_default=0 where customer_id = par_customerId and is_active = 1;
        end if;
        insert into tbl_CustomerAddressMapping(customer_id, address1, address2, city_id, pincode, is_default,
                                               created_by)
            value (par_customerId, par_Address1, par_Address2, par_cityId, par_pincode, par_isDefault, par_customerId);
        select 1 as id;
    else
        select -1 as id;
    end if;
end;