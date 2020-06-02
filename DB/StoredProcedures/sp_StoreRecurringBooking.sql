drop procedure if exists sp_StoreRecurringBooking;
create procedure sp_StoreRecurringBooking(parBookingDates varchar(255), parBookingTimes varchar(255),
                                          parInitialBookingId int)
begin
    call spSplitString(parBookingDates, ',', 'TempDates');
    call spSplitString(parBookingTimes, ',', 'TempTimes');
    set @subscriptionId = 0;
    set @serviceId = 0;
    set @customerId = 0;
    select service_id, subscription_id, customer_id
    into @serviceId,@subscriptionId,@customerId
    from tbl_BookingMaster
    where id = parInitialBookingId
      and is_active = 1
      and booking_type IN ('subscription_service_booking', 'service_booking');
    if @serviceId > 0 and @customerId > 0 then
        #Breaking the date and time.
        insert into tbl_RecurringBooking (customer_id, initial_booking_id, service_id, subscription_id, booking_date,
                                          booking_time, created_by)
        select @customerId,
               parInitialBookingId,
               @serviceId,
               @subscriptionId,
               str_to_date(d.StrVal, '%Y-%m-%d'),
               str_to_date(t.StrVal, '%H:%i:%S'),
               @customerId
        from TempDates d
                 inner join TempTimes t on d.ID = t.ID;
        select 1 as id;
    else
        select -1 as id;
    end if;
end;