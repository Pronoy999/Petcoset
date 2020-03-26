drop procedure if exists sp_SearchSubscription;
create procedure sp_SearchSubscription(in par_priceRangeStart decimal(18, 2),
                                       in par_priceRangeEnd decimal(18, 2),
                                       in par_serviceList varchar(100),
                                       in par_subscriptionName varchar(100),
                                       in par_validity int)
BEGIN

    call spSplitString(par_serviceList, ',', 'temp_tblServiceList');

    select length(StrVal) into @serviceLength from temp_tblServiceList;

    select concat('
        select SM.id,
            SM.subscription_name,
            TSM.service_name,
            SM.subscription_amount,
            SM.start_date,
            SM.end_date,
            DATEDIFF(SM.end_date, SM.start_date) as Validity
        from tbl_SubscriptionMaster SM
            inner join tbl_SubscriptionServiceMapping SSM
                on SSM.subscription_id = SM.id ' ,
            CASE
                WHEN
                    @serviceLength > 0
                    THEN concat('
                    inner join temp_tblServiceList temp
                            on temp.StrVal = SSM.service_id
                    inner join tbl_ServiceMaster TSM
                            ON TSM.id = temp.StrVal')
                ELSE
                '
                    inner join tbl_ServiceMaster TSM
                        on TSM.id = SSM.service_id
                '
            END,
            '
                WHERE SM.is_active = ''1''
                    AND SM.subscription_name like ''%', par_subscriptionName, '%''
;
            ')
    into @dySQL;
        #select @dySQL;
    PREPARE stmt_Growth FROM @dySQL;
	EXECUTE stmt_Growth;
	DEALLOCATE PREPARE stmt_Growth;
end;
