drop procedure if exists sp_ServiceFromSubscriptionBooking;
create procedure sp_ServiceFromSubscriptionBooking(IN par_customerId int,
                                                   IN par_subscriptionId varchar(50),
                                                   IN par_serviceId int,
                                                   in par_address_id int,
                                                   in bookingDate date,
                                                   in bookingTime time,
                                                   IN par_isCancel tinyint(1))
begin
    #in case of taking a service from existing subscription
    select is_active
    into @isActive
    from tbl_CustomerSubscriptionMapping
    where customer_id = par_customerId
      and subscription_id = par_subscriptionId;

    select CSM.service_count
    into @serviceCount
    from tbl_CustomerSubscriptionServiceMapping CSM
             inner join tbl_CustomerSubscriptionMapping tCSM
                        on CSM.customer_subscription_mapping_id = tCSM.id
    WHERE tCSM.customer_id = par_customerId
      AND tCSM.subscription_id = par_subscriptionId
      AND CSM.service_id = par_serviceId;

    if par_isCancel = 1
    then
        update tbl_CustomerSubscriptionServiceMapping CSM
            inner join tbl_CustomerSubscriptionMapping tCSM
            on CSM.customer_subscription_mapping_id = tCSM.id
        SET CSM.service_count = CSM.service_count + 1,
            CSM.modified=now()
        WHERE tCSM.customer_id = par_customerId
          AND tCSM.subscription_id = par_subscriptionId
          AND CSM.service_id = par_serviceId;

        UPDATE tbl_SubscriptionServiceBooking
        SET is_active=0,
            booking_status_id=11,
            modified=now()
        WHERE customer_id = par_customerId
          and subscription_id = par_subscriptionId
          and service_id = par_serviceId
          and is_active = 1;

        select id
        from tbl_SubscriptionServiceBooking
        where customer_id = par_customerId
          and subscription_id = par_subscriptionId
          and service_id = par_serviceId
          and is_active = 0;
    else
        if (@isActive = 1 AND @serviceCount > 0)
        then
            update tbl_CustomerSubscriptionServiceMapping CSM
                inner join tbl_CustomerSubscriptionMapping tCSM
                on CSM.customer_subscription_mapping_id = tCSM.id
            SET CSM.service_count = CSM.service_count - 1
            WHERE tCSM.customer_id = par_customerId
              AND tCSM.subscription_id = par_subscriptionId
              AND CSM.service_id = par_serviceId;

            insert into tbl_SubscriptionServiceBooking
            (booking_type,
             customer_id,
             subscription_id,
             service_id,
             booking_date,
             booking_time,
             booking_status_id,
             address_id,
             created_by)
            values ('subscription_service_booking',
                    par_customerId,
                    par_subscriptionId,
                    par_serviceId,
                    bookingDate,
                    bookingTime,
                    4,
                    par_address_id,
                    par_customerId);

            SELECT LAST_INSERT_ID() as id;
        else
            select -1 as id;
        end if;
    end if;


end;