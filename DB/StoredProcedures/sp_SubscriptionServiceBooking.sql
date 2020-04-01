drop procedure if exists sp_SubscriptionServiceBooking;
create procedure sp_SubscriptionServiceBooking(par_bookingType enum ('service_booking','subscription_booking'),
                                               par_customerId int,
                                               par_subscriptionId varchar(50),
                                               par_serviceId int,
                                               par_employeeId int,
                                               par_vendorId int,
                                               par_amount decimal(18, 2))
begin
    SELECT AUTO_INCREMENT
    INTO @subscriptionId
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = (SELECT DATABASE())
      AND TABLE_NAME = 'tbl_SubscriptionServiceBooking';

    if (par_bookingType = 'subscription_booking')
    then

        insert into tbl_SubscriptionServiceBooking
        (booking_type,
         customer_id,
         subscription_id,
         service_id,
         employee_id,
         total_amount,
         created_by)
        values (par_bookingType,
                par_customerId,
                par_subscriptionId,
                par_serviceId,
                par_employeeId,
                par_amount,
                par_customerId);

        SELECT @subscriptionId as id;
    else
        insert into tbl_SubscriptionServiceBooking
        (booking_type,
         customer_id,
         subscription_id,
         service_id,
         vendor_id,
         total_amount,
         created_by)
        values (par_bookingType,
                par_customerId,
                par_subscriptionId,
                par_serviceId,
                par_vendorId,
                par_amount,
                par_customerId);

        SELECT @subscriptionId as id;
    end if;
end;