drop procedure if exists sp_UpdateCustomerImages;
create procedure sp_UpdateCustomerImages(parImageType ENUM ('DOCUMENT','PET','DP'), parImageKey varchar(255),
                                         parBaseUrl varchar(255), parPosition int, parCustomerId int)
begin
    if parImageType = 'DP' then
        #updating the customer profile image.
        set @isValid = 0;
        select id into @isValid from tbl_CustomerMaster where id = parCustomerId and is_active = 1;
        if @isValid > 0 then
            update tbl_CustomerMaster
            set profile_image= parBaseUrl,
                modified=now(),
                modified_by=parCustomerId
            where id = parCustomerId;
            select 1 as id;
        else
            select -1 as id;
        end if;
    else
        #Inserting the image into the pet images table.
        set @isValid = 0;
        #for a customer a position and pet image is unique.
        if parImageType = 'PET' then
            select id
            into @isValid
            from tbl_CustomerImages
            where customer_id = parCustomerId
              and position = parPosition
              and image_type = 'PET'
              and is_active = 1;
            if @isValid > 0 then
                update tbl_CustomerImages
                set is_active  =0,
                    modified_by= parCustomerId,
                    modified=now()
                where id = @isValid;
            end if;
        end if;
        #Confirming a vendor after a document upload.
        if parImageType = 'DOCUMENT' then
            set @documentId = 0;
            select id
            into @documentId
            from tbl_CustomerImages
            where customer_id = parCustomerId
              and image_type = 'DOCUMENT';
            update tbl_CustomerImages
            set is_active=0,
                modified=now(),
                modified_by=parCustomerId
            where id = @documentId;
        end if;
        insert into tbl_CustomerImages (customer_id, image_type, image_key, base_url, position, created_by)
            value (parCustomerId, parImageType, parImageKey, parBaseUrl, parPosition, parCustomerId);
        select last_insert_id() as id;
    end if;
end;