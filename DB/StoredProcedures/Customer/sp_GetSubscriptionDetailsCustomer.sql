drop procedure if exists sp_GetSubscriptionDetailsCustomer;
create procedure sp_GetSubscriptionDetailsCustomer(parCustomerId int)
begin
    set @isActive = 0;
    select id into @isActive from tbl_CustomerMaster where id = parCustomerId and is_active = 1;
    if @isActive > 0 then
        select csm.id,
               csm.customer_id,
               csm.subscription_id,
               csm.subscription_amount,
               csm.subscription_validity,
               sm.service_count,
               subm.id as SubscriptionId,
               subm.subscription_name,
               subm.subscription_amount,
               subm.start_date,
               subm.end_date,
               tsm.id  as ServiceId,
               service_name,
               service_type
        from tbl_CustomerSubscriptionMapping csm
                 left join tbl_CustomerSubscriptionServiceMapping sm
                           on csm.id = sm.customer_subscription_mapping_id
                 left join tbl_SubscriptionMaster subm
                           on subm.id = csm.subscription_id
                 left join tbl_ServiceMaster tsm
                           on sm.service_id = tsm.id
        where csm.customer_id = parCustomerId
          and csm.is_active = 1;
    else
        select -1 as id;
    end if;
end;