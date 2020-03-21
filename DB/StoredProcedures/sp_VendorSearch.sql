drop procedure if exists sp_VendorSearch;
create procedure sp_VendorSearch(IN par_email varchar(100), IN par_phno varchar(100), IN par_id int)
BEGIN
	 if (length(par_email) < 5 and length(par_phno) < 10 and par_id < 1)
    then
        SELECT -1 as id;
    else
		 SELECT concat(
                       'SELECT C.id, first_name, last_name, email, phone_number, gender, address_1, address_2, CM.city_name, pincode
               FROM tbl_VendorMaster C,tbl_CityMaster CM
               WHERE CM.id=C.city ',
                       CASE
                           WHEN length(par_email) > 5 THEN concat(' and C.email = ''', par_email, '''')
                           ELSE ''
                           END,
                       CASE
                           WHEN length(par_phno) > 10 THEN concat(' and C.phone_number =''', par_phno, '''')
                           ELSE ''
                           END
                   , CASE WHEN par_id > 0 THEN concat(' and C.id = ', par_id) ELSE '' END
                   )
        into @dySQL;
        #select @dySQL;
        PREPARE stmt_Growth FROM @dySQL;
		EXECUTE stmt_Growth;
		DEALLOCATE PREPARE stmt_Growth;
	end if;
        
END;

