drop procedure if exists sp_GetCustomerAddress;
create procedure sp_GetCustomerAddress(parCustomerId int)
begin
    set @isExists = 0;
    select id into @isExists from tbl_CustomerMaster where id = parCustomerId and is_active = 1;
    if @isExists > 0 then
        select a.id,
               customer_id,
               address1,
               address2,
               city_id,
               c.city_name,
               s.state_name,
               pincode,
               is_default
        from tbl_CustomerAddressMapping a
                 left join tbl_CityMaster c
                           on a.city_id = c.city_name
                 left join tbl_StateMaster s
                           on c.state_id = s.id
        where customer_id = parCustomerId
          and a.is_active = 1;
    else
        select -1 as id;
    end if;
end;