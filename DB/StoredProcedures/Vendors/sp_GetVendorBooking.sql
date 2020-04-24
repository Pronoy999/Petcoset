drop procedure if exists sp_GetVendorBooking;
create procedure sp_GetVendorBooking(parVendorId int, parDateFilter varchar(12), parTimeFilter varchar(10))
begin
    set @dateClaus = ' ';
    if length(parDateFilter) > 4 THEN
        set @dateClaus = concat(' and b.booking_date LIKE  ''', parDateFilter, '''');
    end if;
    #select @dateClaus;
    set @timeClaus = ' ';
    if length(parTimeFilter) > 0 THEN
        set @timeClaus = concat(' and b.booking_time LIKE ''', parTimeFilter, '''');
    end if;
    select concat('select b.id,
           b.booking_type,
           b.customer_id,
           cm.first_name,
           cm.last_name,
           cm.phone_number,
           b.subscription_id,
           b.service_id,
           sm.service_name,
           sm.service_type,
           b.vendor_id,
           b.total_amount,
           b.booking_status_id,
           st.status_name,
           b.booking_date,
           b.booking_time,
           b.address_id,
           am.address1,
           am.address2,
           cm.city,
           ct.city_name,
           am.pincode
    from tbl_SubscriptionServiceBooking b
             left join tbl_ServiceMaster sm
                       on b.service_id = sm.id
             left join tbl_StatusMaster st
                       on st.id = b.booking_status_id
             inner join tbl_CustomerMaster cm
                        on b.customer_id = cm.id
             left join tbl_CustomerAddressMapping am
                       on am.id = b.address_id
             left join tbl_CityMaster ct
                       on ct.id = am.city_id
    where b.vendor_id = ', parVendorId, @dateClaus, @timeClaus)
    into @stmtSQL;
    #SELECT @stmtSQL;
    prepare stmtExec from @stmtSQL;
    EXECUTE stmtExec;
    deallocate prepare stmtExec;
end;