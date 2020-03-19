drop procedure if exists sp_SubscriptionService;
create procedure sp_SubscriptionService(IN par_empId int, IN par_subscriptionName varchar(100),
                                                               IN par_services varchar(100), IN par_serviceCount int)
begin
	SELECT modify_access into @modify_access from tbl_EmployeeMaster where id = par_empId;
    SELECT id into @SubscriptionId FROM tbl_SubscriptionMaster where subscription_name=par_subscriptionName;
	select @SubscriptionId;

	drop temporary table if exists Temp_tblSubscriptionList;
	call spSplitString(par_services,',','Temp_tblSubscriptionList');

	IF(@modify_access='1')
		THEN
		    IF(@SubscriptionId IS NULL)
		        THEN
		            insert into tbl_SubscriptionMaster (subscription_name,created_by) values (par_subscriptionName,par_empId);

                    SELECT id into @subscriptionId from tbl_SubscriptionMaster where subscription_name = par_subscriptionName;

                        insert into tbl_SubscriptionServiceMapping
                        (
                            subscription_id,
                            service_id,
                            services_count,
                            created_by
                        )
                        select
                            @subscriptionId,
                            SM.id,
                            par_serviceCount,
                            par_empId
                        from Temp_tblSubscriptionList temp
                        inner join tbl_ServiceMaster SM
                            on SM.service_name = temp.StrVal
                        ;
                ELSE
		            SELECT 1 as id;
            end if;

		ELSE
			SELECT -1 as modify_access;
	end if;
end;

