drop procedure if exists sp_GetStatus;
create procedure sp_GetStatus()
begin
    Select *
    from tbl_StatusMaster;
end;