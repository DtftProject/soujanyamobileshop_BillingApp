const fields = () => {
  const url = "suppliers";
  const urlParams =
    "fields=id,xid,user_type,name,email,profile_image,profile_image_url,is_walkin_customer,phone,address,shipping_address,status,tax_number,created_at,details{opening_balance,opening_balance_type,credit_period,credit_limit,due_amount,warehouse_id,x_warehouse_id},details:warehouse{id,xid,name},role_id,role{id,xid,name,display_name},warehouse_id,x_warehouse_id,warehouse{xid,name},userWarehouses{user_id,x_user_id,warehouse_id,x_warehouse_id}";
  const filterableColumns = ["name", "email", "phone"];
  const langKey = "supplier";

  return {
    url,
    urlParams,
    filterableColumns,
    langKey,
  };
};

export default fields;
