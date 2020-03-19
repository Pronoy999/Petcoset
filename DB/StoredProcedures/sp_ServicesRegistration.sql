drop procedure if exists sp_ServicesRegistration;
create procedure sp_ServicesRegistration(IN par_serviceName varchar(100), IN par_servieType varchar(100), IN par_userId int)
begin
    select 1 into @serviceName from tbl_ServiceMaster where service_name=par_serviceName;

    if(@serviceName = 1)
        THEN
            select -1 as id;
        ELSE
            insert into tbl_ServiceMaster
                (
                    service_name,service_type,created_by
                )
            values
                (par_serviceName,par_servieType,par_userId);
    end if;
end;