drop procedure if exists sp_SubscriptionServiceBookingOnly;
create procedure sp_SubscriptionServiceBookingOnly(IN par_bookingType enum ('service_booking', 'subscription_booking'),
                                                   IN par_customerId int,
                                                   IN par_subscriptionId varchar(50),
                                                   IN par_serviceId int, IN par_vendorId int,
                                                   IN par_amount decimal(18, 2),
                                                   IN par_address1 varchar(50),
                                                   IN par_address2 varchar(50),
                                                   IN par_cityId int, IN par_pincode int,
                                                   IN par_isCancel tinyint(1))
begin
    SELECT AUTO_INCREMENT
    INTO @subscriptionId
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = (SELECT DATABASE())
      AND TABLE_NAME = 'tbl_SubscriptionServiceBooking';

    select id into @bookingId from tbl_BookingType where booking_type = par_bookingType;

    if (par_bookingType = 'subscription_booking')
    then
        #in case if purchasing a subscription

        if par_isCancel = 1
        then
            update tbl_SubscriptionServiceBooking SSB
            set is_active=0
            where customer_id = par_customerId
              and subscription_id = par_subscriptionId;

            update tbl_CustomerSubscriptionMapping
            set is_active=0
            where customer_id = par_customerId
              and subscription_id = par_subscriptionId;
            /*
            update tbl_CustomerSubscriptionServiceMapping
            set is_active=0
            where customer_subscription_mapping_id
            */
        else
            insert into tbl_CustomerSubscriptionMapping
            ( customer_id
            , subscription_id
            , subscription_amount
            , created_by)
            VALUES ( par_customerId
                   , par_subscriptionId
                   , par_amount
                   , par_customerId);

            insert into tbl_CustomerSubscriptionServiceMapping
            ( customer_subscription_mapping_id
            , service_id
            , service_count
            , created_by)
            select CSM.id
                 , SSM.service_id
                 , SSM.services_count
                 , par_customerId
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
             total_amount,
             booking_date,
             booking_time,
             address1,
             address2,
             city_id,
             pincode,
             created_by)
            values (par_bookingType,
                    par_customerId,
                    par_subscriptionId,
                    par_serviceId,
                    par_amount,
                    date(now()),
                    time(now()),
                    par_address1,
                    par_address2,
                    par_cityId,
                    par_pincode,
                    par_customerId);

            SELECT @subscriptionId as id;

        end if;

    else
        #in case of purchasing only service

        if par_isCancel = 1
        then
            update tbl_SubscriptionServiceBooking SSB
            set is_active=0
            where customer_id = par_customerId
              and subscription_id = par_subscriptionId;
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
             pincode,
             created_by)
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
                    par_pincode,
                    par_customerId);

            SELECT @subscriptionId as id;
        end if;
    end if;
end;

