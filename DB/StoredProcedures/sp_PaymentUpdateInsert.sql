drop procedure if exists sp_PaymentUpdateInsert;
create procedure sp_PaymentUpdateInsert(in par_bookingId int,
                                        in par_transactionId varchar(100),
                                        in par_paymentStatusId int,
                                        in par_customerId int,
                                        in par_paymentAmount decimal(18, 2))
begin
    select 1
    into @paymentFlag
    from tbl_PaymentMaster
    where transaction_id = par_transactionId
       OR booking_id = par_bookingId;

    if (@paymentFlag = 1) #if transaction exists
    then
        update tbl_PaymentMaster
        set payment_status_id = par_paymentStatusId,
            modified          = current_timestamp(),
            modified_by       = par_customerId
        where transaction_id = par_transactionId
           OR booking_id = par_bookingId;
        select 1 as id;
    else
        set @bookingAmt = 0;
        select total_amount into @bookingAmt from tbl_BookingMaster where id = par_bookingId;
        if par_paymentAmount = @bookingAmt then
            insert into tbl_PaymentMaster
            ( booking_id
            , transaction_id
            , payment_amount
            , payment_status_id
            , created_by
            , created)
            values ( par_bookingId
                   , par_transactionId
                   , par_paymentAmount
                   , par_paymentStatusId
                   , par_customerId
                   , current_timestamp());
            select last_insert_id() as id;
            update tbl_BookingMaster
            set booking_status_id=6,
                modified=now(),
                modified_by=par_customerId
            where id = par_bookingId
              and is_active = 1
              and booking_status_id = 13;
        else
            select -1 as id;
        end if;
    end if;
end;