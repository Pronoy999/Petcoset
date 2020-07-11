drop procedure if exists sp_CoreBooking;
create procedure sp_CoreBooking(parBookingType enum ('service_booking','subscription_service_booking'),
                                parCustomerId int,
                                parSubscriptionId int, parServiceId int, parVendorId int, parTotalAmount decimal(18, 2),
                                parDate date, parTime time, parEndTime time, parAddressId int,
                                parRemarks varchar(255), OUT parBookingId int)
begin
    set @isSubValid = 0;
    set @isCustValid = 0;
    set @isVendorValid = 0;
    #Checking valid customer
    select c.id
    into @isCustValid
    from tbl_CustomerMaster c
             inner join tbl_CustomerAddressMapping a
                        on a.customer_id = c.id
    where c.id = parCustomerId
      and a.id = parAddressId
      and c.is_active = 1
    limit 1;
    if parBookingType = 'subscription_service_booking' then
        #Booking from subscription.

        #Checking valid subscription.
        select csm.id
        into @isSubValid
        from tbl_CustomerSubscriptionMapping csm
                 inner join tbl_CustomerSubscriptionServiceMapping cssm
                            on csm.id = cssm.customer_subscription_mapping_id
        where csm.customer_id = parCustomerId
          and csm.subscription_id = parSubscriptionId
          and csm.subscription_validity > date(now())
          and cssm.service_id = parServiceId
          and cssm.service_count > 0
          and csm.is_active = 1
        limit 1;
        if @isSubValid > 0 and @isCustValid > 0 then
            #Creating the booking with pending status.
            insert into tbl_BookingMaster (booking_type, customer_id, subscription_id, service_id, vendor_id,
                                           booking_status_id,
                                           booking_date, booking_time, booking_end_time,
                                           address_id, remarks, created_by)
                value (parBookingType, parCustomerId, parSubscriptionId, parServiceId, parVendorId, 4,
                       parDate, parTime, parEndTime, parAddressId, parRemarks, parCustomerId);
            select last_insert_id() into parBookingId;
            #Updating the service count after booking confirmed.
            update tbl_CustomerSubscriptionServiceMapping
            set service_count=(service_count - 1),
                modified=now(),
                modified_by=parCustomerId
            where service_id = parServiceId
              and customer_subscription_mapping_id = @isSubValid;
        else
            set parBookingId = -1;
        end if;
    elseif parBookingType = 'service_booking' then
        #Booking only a service.

        #Checking vendor is available.
        select id
        into @isVendorValid
        from tbl_BookingMaster
        where vendor_id = parVendorId
          and booking_date = parDate
          and booking_time = parTime
          and booking_status_id NOT IN (2, 11);
        if @isVendorValid = 0 then
            #Creating the booking with pending status.
            insert into tbl_BookingMaster (booking_type, customer_id, service_id, vendor_id, total_amount,
                                           booking_status_id, booking_date, booking_time, booking_end_time, address_id,
                                           remarks, created_by)
                value (parBookingType, parCustomerId, parServiceId, parVendorId, parTotalAmount, 4, parDate, parTime,
                       parEndTime, parAddressId, parRemarks, parCustomerId);
            select last_insert_id() into parBookingId;
        end if;
    end if;
end;