drop procedure if exists sp_ServicesRegistration;
create procedure sp_ServicesRegistration(IN par_serviceName varchar(100), IN par_serviceType varchar(100),
                                         IN par_userId int)
begin
    select 1 into @serviceName from tbl_ServiceMaster where service_name = par_serviceName;
    SET @serviceID = 0;
    select AUTO_INCREMENT
    INTO @serviceID
    from information_schema.TABLES
    WHERE TABLE_SCHEMA = (select database())
      AND table_name = 'tbl_ServiceMaster';
    if (@serviceName = 1)
    THEN
        select 1
        into @serviceType
        from tbl_ServiceMaster
        where service_type = par_serviceType
          and service_name = par_serviceName;
        IF (@serviceType = 1)
        THEN

            select -1 as id;
        ELSE
            UPDATE tbl_ServiceMaster
            SET service_type = par_serviceType
            WHERE service_name = par_serviceName;

            select @serviceID as id;
        end if;
    ELSE
        insert into tbl_ServiceMaster
            (service_name, service_type, created_by)
        values (par_serviceName, par_serviceType, par_userId);
        select @serviceID as id;
    end if;
end;