drop procedure if exists sp_UpdateBookingDetails;
create procedure sp_UpdateBookingDetails(parBookingId int, parUserId int, parVendorId int, parEmployeeId int,
                                         parAmount decimal(18, 2), parBookingDate varchar(12),
                                         parBookingTime varchar(12), parAddressId int,
                                         parRemarks varchar(255), parStatusId int)
begin
    set @setClaus = '';
    if parVendorId > 0 then
        set @setClaus = concat(@setClaus, ' vendor_id = ', parVendorId, ',');
    end if;
    if parEmployeeId > 0 then
        set @setClaus = concat(@setClaus, ' employee_id = ', parEmployeeId, ',');
    end if;
    if length(parBookingDate) > 0 then
        set @setClaus = concat(@setClaus, ' booking_date = ''', parBookingDate, ''',');
    end if;
    if length(parBookingTime) > 0 then
        set @setClaus = concat(@setClaus, ' booking_time = ''', parBookingTime, ''',');
    end if;
    if parStatusId > 0 then
        set @setClaus = concat(@setClaus, ' booking_status_id = ', parStatusId, ',');
    end if;
    if parAddressId > 0 then
        set @setClaus = concat(@setClaus, ' address_id = ', parAddressId, ',');
    end if;
    if parAmount > 0 then
        set @setClaus = concat(@setClaus, ' total_amount = ', parAmount, ',');
    end if;
    if length(parRemarks) > 0 then
        set @setClaus = concat(@setClaus, ' remarks = ''', parRemarks, ''',');
    end if;
    if length(@setClaus) > 0 then
        set @setClaus = concat(@setClaus, ' modified_by = ', parUserId, ', modified = now()');
        select concat(' update tbl_BookingMaster set ', @setClaus, ' where id = ', parBookingId, ' and is_active =1')
        into @stmtSQL;
        #select @stmtSQL;
        prepare stmtExec from @stmtSQL;
        execute stmtExec;
        deallocate prepare stmtExec;
        select 1 as id;
    else
        select -1 as id;
    end if;
end;