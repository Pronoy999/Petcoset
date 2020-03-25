drop procedure if exists sp_SearchServices;
create procedure sp_SearchServices(in par_serviceName varchar(200),
                                   in par_serviceType varchar(100),
                                   in par_serviceId int)
BEGIN

    select SM.id, SM.service_name, SM.service_type, SM.is_active
    from tbl_ServiceMaster SM
    where SM.is_active = '1'
      AND CASE
              WHEN
                  length(par_serviceName) > 1
                  THEN SM.service_name = par_serviceName
              WHEN
                  length(par_serviceType) > 1
                  THEN SM.service_type = par_serviceType
              WHEN
                  par_serviceId > -1
                  THEN SM.id = par_serviceId
              ELSE
                  1 = 1
        END;
end;
