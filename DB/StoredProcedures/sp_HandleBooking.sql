drop procedure if exists sp_HandleBooking;
create procedure sp_HandleBooking(parBookingType enum ('service_booking','subscription_booking','subscription_service_booking',''),
                                  parCustomerId int,
                                  parSubscriptionId int,
                                  parServiceId int,
                                  parVendorId int,
                                  parTotalAmount decimal(18, 2),
                                  parDate varchar(11),
                                  parTime varchar(11),
                                  parEndTime varchar(11),
                                  parAddressId int,
                                  parRemarks varchar(255),
                                  parIsCancel tinyint,
                                  parBookingId int)
begin
    if parIsCancel = 1 and parBookingId > 0 then
        update tbl_BookingMaster
        set booking_status_id=11,
            modified_by=parCustomerId,
            modified=now(),
            is_active=0
        where id = parBookingId;
        #Getting the booking details.
        set @subId = 0;
        set @serviceId = 0;
        select booking_type, subscription_id, service_id
        into parBookingType,@subId,@serviceId
        from tbl_BookingMaster
        where id = parBookingId;
        if parBookingType = 'subscription_service_booking' then
            #Incrementing the service count for the cancelled booking.
            update tbl_CustomerSubscriptionMapping csm , tbl_CustomerSubscriptionServiceMapping cssm
            set cssm.service_count=(cssm.service_count + 1),
                cssm.modified_by=parCustomerId,
                cssm.modified=now()
            where csm.customer_id = parCustomerId
              and csm.subscription_id = @subId
              and cssm.service_id = @serviceId
              and csm.is_active = 1;
        end if;
    elseif parBookingType = 'subscription_booking' then
        set @isSubValid = 0;
        set @endDate = 0;
        select id, end_date
        into @isSubValid,@endDate
        from tbl_SubscriptionMaster
        where id = parSubscriptionId
          and start_date <= date(now())
          and end_date > date(now())
          and is_active = 1;
        if @isSubValid = parSubscriptionId then
            set @custSubMappingId = 0;
            insert into tbl_CustomerSubscriptionMapping (customer_id, subscription_id, subscription_amount,
                                                         subscription_validity, created_by)
                value (parCustomerId, parSubscriptionId, parTotalAmount, @endDate, parCustomerId);
            select last_insert_id() into @custSubMappingId;
            #Creating the subscription service mapping data.
            insert into tbl_CustomerSubscriptionServiceMapping (customer_subscription_mapping_id, service_id,
                                                                service_count, created_by)
            select @custSubMappingId, service_id, services_count, parCustomerId
            from tbl_SubscriptionServiceMapping
            where subscription_id = parSubscriptionId
              and is_active = 1;
            #Creating the booking record.
            insert into tbl_BookingMaster (booking_type, customer_id, subscription_id, total_amount, booking_status_id,
                                           booking_date,
                                           created_by)
                value ('subscription_booking', parCustomerId, parSubscriptionId, parTotalAmount, 6, date(now()),
                       parCustomerId);
            select last_insert_id() as id;
        else
            select -1 as id;
        end if;
    else
        #Creating the booking.
        set @bookingId = 0;
        call sp_CoreBooking(parBookingType, parCustomerId,
                            parSubscriptionId, parServiceId, parVendorId,
                            parTotalAmount, parDate, parTime,
                            parEndTime, parAddressId, parRemarks,
                            @bookingId);
        if @bookingId > 0 then
            select @bookingId as id;
        else
            select -1 as id;
        end if;
    end if;
end;