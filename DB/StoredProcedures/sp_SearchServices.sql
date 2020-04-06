drop procedure if exists sp_SearchServices;
create procedure sp_SearchServices(in par_serviceName varchar(200),
                                   in par_serviceType varchar(100),
                                   in par_serviceId int)
BEGIN
    DECLARE whereClaus varchar(100) default '';
    IF length(par_serviceName) > 0 THEN
        SET whereClaus = concat(' and SM.service_name LIKE ''', par_serviceName, '%''');
    ELSEIF length(par_serviceType) > 0 THEN
        SET whereClaus = concat(' and SM.service_type LIKE ''', par_serviceType, '''');
    ELSEIF par_serviceId > 0 THEN
        SET whereClaus = concat(' and id = ', par_serviceId);
    ELSE
        SET whereClaus = ' and 1=1';
    end if;
    select concat('select SM.id, SM.service_name, SM.service_type, SM.is_active
    from tbl_ServiceMaster SM
    where SM.is_active = 1', whereClaus)
    into @stmtSQL;
    #SELECT @stmtSQL;
    PREPARE stmt_exec FROM @stmtSQL;
    EXECUTE stmt_exec;
    DEALLOCATE PREPARE stmt_exec;
end;
