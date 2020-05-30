drop procedure if exists sp_GetCustomerImages;
create procedure sp_GetCustomerImages(parCustomerId int, parImageType ENUM ('PET','DOCUMENT','DP'))
begin
    set @isActive = 0;
    select id into @isActive from tbl_CustomerMaster where id = parCustomerId and is_active = 1;
    if @isActive > 0 then
        if parImageType = 'PET' or parImageType = 'DOCUMENT' then
            select id, customer_id, image_type, image_key, base_url, position
            from tbl_CustomerImages
            where customer_id = parCustomerId
              and image_type = parImageType
              and is_active = 1;
        else
            select profile_image from tbl_CustomerMaster where id = parCustomerId and is_active = 1;
        end if;
    else
        select -1 as id;
    end if;
end;