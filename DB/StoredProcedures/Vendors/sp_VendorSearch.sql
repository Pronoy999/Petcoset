drop procedure if exists sp_VendorSearch;
create procedure sp_VendorSearch(IN par_email varchar(100), IN par_phno varchar(100), IN par_id int,
                                 in parStatus varchar(30))
BEGIN
    if (length(par_email) < 5 and length(par_phno) < 10 and par_id < 1 and length(parStatus) < 0)
    then
        SELECT -1 as id;
    else
        set @statusId = 0;
        if length(parStatus) > 0 THEN
            select id into @statusId from tbl_StatusMaster where status_name LIKE parStatus;
        end if;
        #select @statusId;
        SELECT concat(
                       'SELECT C.id, first_name, last_name, email, phone_number, gender, address_1, address_2,
                        CM.city_name,sm.state_name, pincode,C.status_id,s.status_name
               FROM tbl_VendorMaster C
                left join tbl_CityMaster CM
                    on CM.id=C.city
                left join tbl_StateMaster sm
                    on sm.id=CM.state_id
                left join tbl_StatusMaster s
                    on C.status_id = s.id
               WHERE C.is_active=1 ',
                       CASE
                           WHEN length(par_email) > 5 THEN concat(' and C.email = ''', par_email, '''')
                           ELSE ''
                           END,
                       CASE
                           WHEN length(par_phno) > 10 THEN concat(' and C.phone_number =''', par_phno, '''')
                           ELSE ''
                           END
                   , CASE
                         WHEN par_id > 0 THEN concat(' and C.id = ', par_id)
                         ELSE '' END
                   , case
                         when @statusId > 0 THEN concat(' and C.status_id = ', @statusId)
                         ELSE ''
                           END
                   )
        into @dySQL;
        #select @dySQL;
        PREPARE stmt_Growth FROM @dySQL;
        EXECUTE stmt_Growth;
        DEALLOCATE PREPARE stmt_Growth;
    end if;

END;

