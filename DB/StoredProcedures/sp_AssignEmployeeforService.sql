drop procedure if exists sp_AssignEmployeeforService;
create procedure sp_AssignEmployeeforService(par_bookingId int,
                                             par_assignedEmpId int,
                                             par_modifyEmpId int)
begin
    select modify_access into @modifyAccess from tbl_EmployeeMaster where id = par_modifyEmpId;

    select 1 into @bookingExists from tbl_SubscriptionServiceBooking where id = par_bookingId;

    if (@modifyAccess = '1' and @bookingExists = 1)
    then
        update tbl_SubscriptionServiceBooking
        set employee_id = par_assignedEmpId,
            modified_by = par_modifyEmpId
        where id = par_bookingId;

        select par_bookingId as id;
    else
        select -1 as id;
    end if;
end;