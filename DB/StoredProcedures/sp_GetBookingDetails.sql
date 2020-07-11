drop procedure if exists sp_GetBookingDetails;
create procedure sp_GetBookingDetails(parCustomerId int, parBookingId int, parStatusId int, parVendorId int)
begin
    set @whereClaus = '';
    if parCustomerId > 0 then
        set @whereClaus = concat(@whereClaus, ' b.customer_id = ', parCustomerId, ' and ');
    end if;
    if parBookingId > 0 and length(parBookingId) > 0 then
        set @whereClaus = concat(@whereClaus, ' b.id = ', parBookingId, ' and ');
    end if;
    if parStatusId > 0 then
        set @whereClaus = concat(@whereClaus, ' b.booking_status_id = ', parStatusId, ' and ');
    end if;
    if parVendorId > 0 then
        set @whereClaus = concat(@whereClaus, ' b.vendor_id = ', parVendorId, ' and ');
    end if;
    set @whereClaus = concat(@whereClaus, ' b.is_active =1 ');
    select concat('select
           b.id,
           b.booking_type,
           b.customer_id,
           c.first_name as CustomerFirstName,
           c.last_name as CustomerLastName,
           c.phone_number,
           c.email,
           sub.subscription_name,
           subscription_id,
           s.service_name,
           s.service_type,
           service_id,
           e.first_name as EmployeeFirstName,
           e.last_name as EmployeeLastName,
           employee_id,
           v.first_name as VendorFirstName,
           v.last_name as VendorLastName,
           vendor_id,
           total_amount,
           booking_status_id,
           sm.status_name,
           booking_date,
           booking_time,
           booking_end_time,
           address_id,
           ad.id as addressId,
           address1,
           address2,
           city_id,
           cm.city_name,
           ad.pincode,
           b.breed_id,
           is_default,
           p.id as payment_id,
           p.payment_amount,
           p.transaction_id,
           p.payment_status_id
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
            left join tbl_PaymentMaster p
                on p.booking_id = b.id
             left join tbl_CityMaster cm
                       on ad.city_id = cm.id  where ', @whereClaus, ' order by booking_date')
    into @stmtSQL;
    #select @stmtSQL;
    prepare stmtExec from @stmtSQL;
    execute stmtExec;
    deallocate prepare stmtExec;
end;