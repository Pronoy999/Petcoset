drop procedure if exists sp_DeleteServiceImages;
create procedure sp_DeleteServiceImages(parVendorId int, parServiceId int)
begin
    set @position = concat(parServiceId, '00');
    set @minPosId = concat((parServiceId + 1), '00');
    update tbl_VendorImages
    set is_active=0,
        modified=now(),
        modified_by=parVendorId
    where vendor_id = parVendorId
      and position >= @position
      and position < @minPosId
      and is_active = 1;
end;