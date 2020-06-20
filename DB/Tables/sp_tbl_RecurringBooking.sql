drop procedure if exists sp_tbl_RecurringBooking;
create procedure sp_tbl_RecurringBooking()
begin
    declare currentSchema varchar(50) default '';
    select database() into currentSchema;
    if not exists(
            select 1
            from information_schema.TABLES
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_RecurringBooking'
        ) then
        begin
            create table tbl_RecurringBooking
            (
                id                 int primary key auto_increment      not null,
                customer_id        int                                 not null,
                initial_booking_id int                                 not null,
                service_id         int                                 not null,
                subscription_id    int       default null,
                booking_date       date                                not null,
                booking_time       time                                not null,
                filter_id          int       default null,
                is_active          tinyint   default 1,
                created_by         int                                 not null,
                created            timestamp default current_timestamp not null,
                modified_by        int       default null,
                modified           timestamp default null
            );
        end;
    end if;
    if not exists(
            select 1
            from information_schema.COLUMNS
            where TABLE_SCHEMA = currentSchema
              and TABLE_NAME = 'tbl_RecurringBooking'
              and COLUMN_NAME = 'booking_end_time'
        ) then
        begin
            alter table tbl_RecurringBooking
                add column booking_end_time time default null after booking_time;
        end;
    end if;
end;
call sp_tbl_RecurringBooking();
drop procedure if exists sp_tbl_RecurringBooking;