drop procedure if exists sp_GetBookingDetails;
create procedure sp_GetBookingDetails(parCustomerId int, parBookingId int)
begin
    set @whereClaus = '';
    if parCustomerId > 0 then
        set @whereClaus = concat(@whereClaus, ' b.customer_id = ', parCustomerId, ' and ');
    end if;
    if parBookingId > 0 then
        set @whereClaus = concat(@whereClaus, ' b.id = ', parBookingId, ' and ');
    end if;
    set @whereClaus = concat(@whereClaus, ' b.is_active =1 ');
    select concat('select b.id,
           b.booking_type,
           b.customer_id,
           c.first_name,
           c.last_name,
           c.email,
           sub.subscription_name,
           subscription_id,
           s.service_name,
           s.service_type,
           service_id,
           e.first_name,
           e.last_name,
           employee_id,
           v.first_name,
           v.last_name,
           vendor_id,
           total_amount,
           booking_status_id,
           sm.status_name,
           booking_date,
           booking_time,
           address_id,
           ad.id,
           address1,
           address2,
           city_id,
           cm.city_name,
           ad.pincode,
           is_default
    from tbl_BookingMaster b
             left join tbl_CustomerMaster c
                       on b.customer_id = c.id
             left join tbl_VendorMaster v
                       on b.vendor_id = v.id
             left join tbl_StatusMaster sm
                on b.booking_status_id=sm.id
             left join tbl_EmployeeMaster e
                       on b.employee_id = e.id
             left join tbl_ServiceMaster s
                       on b.service_id = s.id
             left join tbl_SubscriptionMaster sub
                       on sub.id = b.subscription_id
             left join tbl_CustomerAddressMapping ad
                       on b.address_id = ad.id
             left join tbl_CityMaster cm
                       on ad.city_id = cm.id  where ', @whereClaus)
    into @stmtSQL;
    #select @stmtSQL;
    prepare stmtExec from @stmtSQL;
    execute stmtExec;
    deallocate prepare stmtExec;
end;