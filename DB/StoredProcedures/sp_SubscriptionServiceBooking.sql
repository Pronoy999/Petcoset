drop procedure if exists sp_SubscriptionServiceBooking;
create procedure sp_SubscriptionServiceBooking(IN par_customerId int,
                                                                      IN par_subscriptionId varchar(50),
                                                                      IN par_serviceId int, IN par_address1 varchar(50),
                                                                      IN par_address2 varchar(50), IN par_cityId int,
                                                                      IN par_pincode int, IN par_isCancel tinyint(1))
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
        SET CSM.service_count = CSM.service_count + 1
        WHERE tCSM.customer_id = par_customerId
          AND tCSM.subscription_id = par_subscriptionId
          AND CSM.service_id = par_serviceId;

        UPDATE tbl_SubscriptionServiceBooking
        SET is_active=0
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
             address1,
             address2,
             city_id,
             pincode,
             created_by)
            values ('subscription_service_booking',
                    par_customerId,
                    par_subscriptionId,
                    par_serviceId,
                    date(now()),
                    time(now()),
                    par_address1,
                    par_address2,
                    par_cityId,
                    par_pincode,
                    par_customerId);

            SELECT LAST_INSERT_ID() as id;
        end if;
    end if;


end;

