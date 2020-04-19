drop procedure if exists sp_GetState;
create procedure sp_GetState()
BEGIN
    select * FROM tbl_StateMaster;
end;