drop procedure if exists sp_BankDetailsUpdateInsert;
create procedure sp_BankDetailsUpdateInsert(par_holder_id int,
                                            par_holder_type varchar(50), #tbl_VendorMaster
                                            par_holder_name varchar(1000),
                                            par_account_number varchar(1000),
                                            par_bank_name varchar(250),
                                            par_ifsc_code varchar(1000),
                                            par_contact_number varchar(50),
                                            par_payment_gateway_account_id varchar(1000),
											-- par_status_id int,
                                            par_is_update bool)
begin
    if par_is_update = 1
    then
        update tbl_BankDetailsMaster
        set payment_gateway_account_id = par_payment_gateway_account_id
        where id = par_holder_id
          and holder_type = par_holder_type
          and account_number = par_account_number;


        select concat
                   ('
            update ', par_holder_type, '
            set status_id = 12         #12 for Verified
                where id = ', par_holder_id, '
        ')
        into @dySql;

        #select @dySQL;
        PREPARE stmt_Growth FROM @dySQL;
        EXECUTE stmt_Growth;
        DEALLOCATE PREPARE stmt_Growth;

        select 1 as id;
    else
        insert into tbl_BankDetailsMaster
        ( holder_id
        , holder_type
        , holder_name
        , account_number
        , bank_name
        , ifsc_code
        , contact_number
        , payment_gateway_account_id
        , created_by)
        values (par_holder_id,
                par_holder_type,
                par_holder_name,
                par_account_number,
                par_bank_name,
                par_ifsc_code,
                par_contact_number,
                par_payment_gateway_account_id,
                par_holder_id);

        select last_insert_id() as id;
    end if;

end;