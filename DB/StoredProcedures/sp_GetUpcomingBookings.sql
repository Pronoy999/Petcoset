drop procedure if exists sp_GetUpcomingBookings;
create procedure sp_GetUpcomingBookings(parBookingDate varchar(20))
begin
    select customer_id, c.phone_number, c.first_name, c.last_name,b.booking_date
    from tbl_BookingMaster b
             inner join tbl_CustomerMaster c
                        on b.customer_id = c.id
    where booking_status_id = 14
      and booking_date = parBookingDate
      and b.is_active = 1;
end;