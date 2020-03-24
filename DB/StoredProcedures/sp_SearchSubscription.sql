drop procedure if exists sp_SearchSubscription;
create procedure sp_SearchSubscription(in par_priceRangeStart decimal(18, 2),
                                       in par_priceRangeEnd decimal(18, 2),
                                       in par_serviceList varchar(100),
                                       in par_subscriptionName int,
                                       in par_validity int)
BEGIN

    call spSplitString(par_serviceList, ',', 'temp_tblServiceList');

    select SM.id,
           SM.subscription_name,
           TSM.service_name,
           SM.subscription_amount,
           SM.start_date,
           SM.end_date,
           DATEDIFF(SM.end_date, SM.start_date) as Validity
    from tbl_SubscriptionMaster SM
             inner join tbl_SubscriptionServiceMapping SSM
                        on SSM.subscription_id = SM.id
             inner join temp_tblServiceList temp
                        on temp.StrVal = SSM.service_id
             inner join tbl_ServiceMaster TSM
                        ON TSM.id = temp.StrVal
    where SM.is_active = '1'
      AND CASE
              WHEN
                  par_priceRangeStart > -1 and par_priceRangeEnd <= -1
                  THEN SM.subscription_amount > par_priceRangeStart
              WHEN
                  par_priceRangeStart <= -1 and par_priceRangeEnd > -1
                  THEN SM.subscription_amount < par_priceRangeEnd
              WHEN
                  par_priceRangeStart > -1 and par_priceRangeEnd > -1
                  THEN SM.subscription_amount between par_priceRangeStart and par_priceRangeEnd
              WHEN
                  length(par_subscriptionName) > 1
                  THEN SM.subscription_name = par_subscriptionName
              WHEN par_validity > - 1
                  THEN DATEDIFF(SM.end_date, SM.start_date) = par_validity
              ELSE 1 = 1
        END;
end;
