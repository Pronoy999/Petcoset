drop procedure if exists sp_GetBankDetails;
create procedure sp_GetBankDetails(parVendorId int, parHolderType varchar(50))
begin
    select bm.id,
           bm.holder_id,
           vm.first_name,
           vm.last_name,
           bm.holder_type,
           bm.holder_name,
           bm.account_number,
           bm.bank_name,
           bm.ifsc_code,
           bm.contact_number,
           bm.payment_gateway_account_id,
           sm.status_name
    from tbl_BankDetailsMaster bm
             inner join tbl_VendorMaster vm
                        on vm.id = bm.holder_id
             left join tbl_StatusMaster sm
                       on sm.id = vm.status_id
    where holder_type = parHolderType
      and holder_id = parVendorId
      and bm.is_active = 1;
end;