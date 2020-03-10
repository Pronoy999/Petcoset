drop procedure if exists sp_VendorSearch;
delimiter $$
create procedure sp_VendorSearch(in par_email varchar(100),in par_phno varchar(100),in par_id int)
BEGIN
	if(par_email=null and par_phno = null and par_id = null)
    then 
		SELECT -1;
	else
		SELECT 
        concat(
        'SELECT', par_email,' 
        FROM tbl_VendorMaster WHERE ',
        case when par_email <> null then concat('email = ',par_email, '') else '' end,
        case when par_phno <> null then concat('and phone_number = ',par_phno, '') else '' end,
        case when par_id <> null then concat('and id = ',par_id, '') else '' end, ''
        )
        into @dySQL;
        #select @dySQL;
        PREPARE stmt_Growth FROM @dySQL_Growth;
		EXECUTE stmt_Growth;
		DEALLOCATE PREPARE stmt_Growth;
	end if;
        
END$$
Delimiter ;
