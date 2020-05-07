drop procedure if exists sp_UpdateImageDetails;
create procedure sp_UpdateImageDetails(parImageType ENUM ('DOCUMENT','PET','DP'), parImageKey varchar(255),
                                       parBaseUrl varchar(255), parVendorId int)
begin
    if parImageType = 'DP' then
        #updating the vendor profile image.
        set @isValid = 0;
        select id into @isValid from tbl_VendorMaster where id = parVendorId and is_active = 1;
        if @isValid > 0 then
            update tbl_VendorMaster
            set profile_image= parImageKey,
                modified=now(),
                modified_by=parVendorId
            where id = parVendorId;
            select 1 as id;
        else
            select -1 as id;
        end if;
    else
        #Inserting the image into the pet images table.
        insert into tbl_VendorPetImages (vendor_id, image_type, image_key, base_url, created_by)
            value (parVendorId, parImageType, parImageKey, parBaseUrl, parVendorId);
        select last_insert_id() as id;
    end if;
end;