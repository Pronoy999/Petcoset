drop procedure if exists sp_GetVendorImages;
create procedure sp_GetVendorImages(parImageType ENUM ('PET','DOCUMENT'), parVendorId int)
begin
    select id, vendor_id, image_type, image_key, base_url
    from tbl_VendorImages
    where image_type = parImageType
      and vendor_id = parVendorId
      and is_active = 1;
end;

