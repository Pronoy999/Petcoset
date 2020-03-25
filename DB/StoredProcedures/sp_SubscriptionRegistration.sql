drop procedure if exists sp_SubscriptionRegistration;
create procedure sp_SubscriptionRegistration(IN par_empId int,
                                             IN par_subscriptionName varchar(100),
                                             IN par_subscriptionAmount decimal(18, 2),
                                             IN par_services varchar(100),
                                             IN par_serviceCount varchar(100),
                                             IN par_startDate date,
                                             IN par_endDate date)
begin
    #SP to Create New Subscription with ServiceCount
    SELECT modify_access into @modify_access from tbl_EmployeeMaster where id = par_empId;
    SELECT id into @SubscriptionId FROM tbl_SubscriptionMaster where subscription_name = par_subscriptionName;

    drop temporary table if exists Temp_tblSubscriptionList;
    call spSplitString(par_services, '', '', ''Temp_tblSubscriptionList'');

    drop temporary table if exists Temp_tblServiceCount;
    call spSplitString(par_serviceCount, '', '', ''Temp_tblServiceCount'');

    IF (@modify_access = 1)
    THEN
        IF (@SubscriptionId IS NULL) #IF Subscription not exists
        THEN

            insert into tbl_SubscriptionMaster
            (subscription_name,
             subscription_amount,
             start_date,
             end_date,
             created_by)
            values (par_subscriptionName,
                    par_subscriptionAmount,
                    par_startDate,
                    par_endDate,
                    par_empId);

            SELECT id into @subscriptionId from tbl_SubscriptionMaster where subscription_name = par_subscriptionName;

            DROP TABLE IF EXISTS temp_tblServiceCountMapping;
            CREATE TEMPORARY TABLE temp_tblServiceCountMapping
            AS
                (
                    select L.StrVal as ServiceName,
                           C.StrVal as ServiceCount
                    from Temp_tblSubscriptionList L
                             inner join Temp_tblServiceCount C
                                        ON L.ID = C.ID
                );
            -- select * from temp_tblServiceCountMapping;
            insert into tbl_SubscriptionServiceMapping
            (subscription_id,
             service_id,
             services_count,
             created_by)
            select @subscriptionId,
                   SM.id,
                   temp.ServiceCount,
                   par_empId
            from temp_tblServiceCountMapping temp
                     inner join tbl_ServiceMaster SM
                                on SM.service_name = temp.ServiceName;
            select 1 as id; #inserted successfully
        ELSE
            SELECT -1 as id; #subscription already exists
        end if;

    ELSE
        SELECT -1 as modify_access; #employee does not have the access to perform the operation
    end if;
end;