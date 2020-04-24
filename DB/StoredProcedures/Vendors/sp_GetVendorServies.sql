drop procedure if exists sp_GetVendorServices;
create procedure sp_GetVendorServices(parVendorId int)
begin
    select v.id as vendor_id,
           s.service_id,
           sm.service_name,
           sm.service_type,
           s.pet_type,
           s.is_bathing_provided,
           s.service_duration_hours,
           s.service_charge
    from tbl_VendorMaster v
             inner join tbl_VendorServiceMapping s
                        on s.vendor_id = v.id
             inner join tbl_ServiceMaster sm
                        on sm.id = s.service_id
    WHERE v.id = parVendorId
      and s.is_active = 1;
end;