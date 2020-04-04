drop procedure if exists sp_SubscriptionServiceBooking;
create procedure sp_SubscriptionServiceBooking(par_bookingType enum ('service_booking','subscription_booking','subscription_service_booking'),
                                               par_customerId int,
                                               par_subscriptionId varchar(50),
                                               par_serviceId int,
                                               par_employeeId int,
                                               par_vendorId int,
                                               par_amount decimal(18, 2),
                                               par_address1 varchar(50),
                                               par_address2 varchar(50),
                                               par_cityId int,
                                               par_pincode int)
begin
    SELECT AUTO_INCREMENT
    INTO @subscriptionId
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = (SELECT DATABASE())
      AND TABLE_NAME = 'tbl_SubscriptionServiceBooking';

    select id into @bookingId from tbl_BookingType where booking_type = par_bookingType;

    if (par_bookingType = 'subscription_booking')
    then
        insert into tbl_CustomerSubscriptionServiceMapping
        ( customer_subscription_mapping_id
        , service_id
        , service_count)
        select CSM.id
             , SSM.service_id
             , SSM.services_count
        FROM tbl_CustomerSubscriptionMapping CSM
                 INNER JOIN
             tbl_SubscriptionServiceMapping SSM
             ON SSM.subscription_id = CSM.subscription_id
        where CSM.customer_id = par_customerId
          AND CSM.subscription_id = par_subscriptionId;

        insert into tbl_SubscriptionServiceBooking
        (booking_type,
         customer_id,
         subscription_id,
         service_id,
         employee_id,
         total_amount,
         booking_date,
         booking_time,
         address1,
         address2,
         city_id,
         pincode)
        values (par_bookingType,
                par_customerId,
                par_subscriptionId,
                par_serviceId,
                par_employeeId,
                par_amount,
                date(now()),
                time(now()),
                par_address1,
                par_address2,
                par_cityId,
                par_pincode);

        call sp_PaymentUpdateInsert(@bookingId, '', null, par_amount);

        SELECT @subscriptionId as id;
    elseif (par_bookingType = 'subscription_service_booking')
    then
        select is_active
        into @isActive
        from tbl_CustomerSubscriptionMapping
        where customer_id = par_customerId
          and subscription_id = par_subscriptionId;

        select CSM.service_count
        into @serviceCount
        from tbl_CustomerSubscriptionServiceMapping CSM
        WHERE CSM.customer_id = par_customerId
          AND CSM.subscription_id = par_subscriptionId
          AND CSM.service_id = par_serviceId;

        if @isActive = 1 AND @serviceCount > 0
        then
            update tbl_CustomerSubscriptionServiceMapping CSM
            SET CSM.service_count = CSM.service_count - 1
            WHERE CSM.customer_id = par_customerId
              AND CSM.subscription_id = par_subscriptionId
              AND CSM.service_id = par_serviceId;

            insert into tbl_SubscriptionServiceBooking
            (booking_type,
             customer_id,
             subscription_id,
             service_id,
             vendor_id,
             total_amount,
             booking_date,
             booking_time,
             address1,
             address2,
             city_id,
             pincode)
            values (par_bookingType,
                    par_customerId,
                    par_subscriptionId,
                    par_serviceId,
                    par_vendorId,
                    par_amount,
                    date(now()),
                    time(now()),
                    par_address1,
                    par_address2,
                    par_cityId,
                    par_pincode);
        else
            select -1 as is_active;
        end if;
    else
        insert into tbl_SubscriptionServiceBooking
        (booking_type,
         customer_id,
         subscription_id,
         service_id,
         vendor_id,
         total_amount,
         booking_date,
         booking_time,
         address1,
         address2,
         city_id,
         pincode)
        values (par_bookingType,
                par_customerId,
                par_subscriptionId,
                par_serviceId,
                par_vendorId,
                par_amount,
                date(now()),
                time(now()),
                par_address1,
                par_address2,
                par_cityId,
                par_pincode);

        SELECT @subscriptionId as id;
    end if;
end;