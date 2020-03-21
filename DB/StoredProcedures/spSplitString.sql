drop procedure if exists spSplitString;
create procedure spSplitString(IN par_StringToSplit varchar(5000), IN par_Separator varchar(100),
                                                      IN par_TempTableName varchar(200))
BEGIN

	

	drop temporary table if exists TempStringToSplit;
	create temporary table TempStringToSplit( txt text );
	insert into TempStringToSplit values(par_StringToSplit);
    
    set @par_Separator = par_Separator;
    
    set @dySQL = concat("set @dyValues = replace((select group_concat(txt separator '", @par_Separator,"') as data from TempStringToSplit), '", @par_Separator, "', '''),(''')");
    
    prepare stmt from @dySQL;
    execute stmt;
    
    set @dySQL = concat("drop temporary table if exists ", par_TempTableName, ";");
    prepare stmt from @dySQL;
	execute stmt;
    
	set @dySQL = concat( "create temporary table ", par_TempTableName," (ID int AUTO_INCREMENT Primary Key, StrVal varchar(500));");
    prepare stmt from @dySQL;
	execute stmt;
    
	set @dySQL = concat("insert into ", par_TempTableName, "(StrVal) values ('", @dyValues, "');");
    prepare stmt from @dySQL;
	execute stmt;
    
    set @dySQL = concat('update ', par_TempTableName, ' set StrVal = TRIM(StrVal) where ID > 0;'); 
	prepare stmt from @dySQL;
	execute stmt;
    
END;

