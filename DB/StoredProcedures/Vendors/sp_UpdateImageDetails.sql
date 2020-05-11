drop procedure if exists sp_UpdateImageDetails;
create procedure sp_UpdateImageDetails(parImageType ENUM ('DOCUMENT','PET','DP'), parImageKey varchar(255),
                                       parBaseUrl varchar(255), parPosition int, parVendorId int)
begin
    if parImageType = 'DP' then
        #updating the vendor profile image.
        set @isValid = 0;
        select id into @isValid from tbl_VendorMaster where id = parVendorId and is_active = 1;
        if @isValid > 0 then
            update tbl_VendorMaster
            set profile_image= parBaseUrl,
                modified=now(),
                modified_by=parVendorId
            where id = parVendorId;
            select 1 as id;
        else
            select -1 as id;
        end if;
    else
        #Inserting the image into the pet images table.
        set @isValid = 0;
        #for a vendor a position and pet image is unique.
        if parImageType = 'PET' then
            select id
            into @isValid
            from tbl_VendorImages
            where vendor_id = parVendorId
              and position = parPosition
              and image_type = 'PET'
              and is_active = 1;
            if @isValid > 0 then
                update tbl_VendorImages set is_active =0, modified_by= parVendorId, modified=now() where id = @isValid;
            end if;
        end if;
        #Confirming a vendor after a document upload.
        if parImageType = 'DOCUMENT' then
            update tbl_VendorImages
            set is_active=0,
                modified=now(),
                modified_by=parVendorId
            where id = (select id from tbl_VendorImages where vendor_id = parVendorId and image_type = 'DOCUMENT');
            update tbl_VendorMaster set status_id = 6 where id = parVendorId;
        end if;
        insert into tbl_VendorImages (vendor_id, image_type, image_key, base_url, position, created_by)
            value (parVendorId, parImageType, parImageKey, parBaseUrl, parPosition, parVendorId);
        select last_insert_id() as id;
    end if;
end;