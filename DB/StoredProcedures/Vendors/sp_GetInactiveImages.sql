drop procedure if exists sp_GetInActiveImages;
create procedure sp_GetInActiveImages()
begin
    select * from tbl_VendorImages where is_active = 0;
end;