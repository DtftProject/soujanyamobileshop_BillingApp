import common from "@/composable/common";
const fields = () => {
  const { dayjs } = common();
  const url = "purchases";
  const urlParams =
    "fields=id,xid,unique_id,warehouse_id,x_warehouse_id,warehouse{id,xid,name},from_warehouse_id,x_from_warehouse_id,fromWarehouse{id,xid,name},invoice_number,order_type,order_date,tax_amount,discount,shipping,subtotal,paid_amount,due_amount,order_status,payment_status,total,tax_rate,staff_user_id,x_staff_user_id,staffMember{id,xid,name,profile_image,profile_image_url,user_type},user_id,x_user_id,user{id,xid,user_type,name,profile_image,profile_image_url,phone},orderPayments{id,xid,amount,payment_id,x_payment_id},orderPayments:payment{id,xid,amount,payment_mode_id,x_payment_mode_id,date,notes},orderPayments:payment:paymentMode{id,xid,name},items{id,xid,product_id,x_product_id,single_unit_price,unit_price,quantity,tax_rate,total_tax,tax_type,total_discount,subtotal},items:product{id,xid,name,image,image_url,unit_id,x_unit_id},items:product:unit{id,xid,name,short_name},items:product:details{id,xid,warehouse_id,x_warehouse_id,product_id,x_product_id,current_stock},items:orderItemTaxes{id,xid,order_item_id,order_item_id,tax_name,tax_amount},cancelled,terms_condition,shippingAddress{id,xid,order_id,name,email,phone,address,shipping_address,city,state,country,zipcode}";
  const filterableColumns = ["invoice_number"];
  const langKey = "purchases";
  const hashableColumns = ["user_id", "warehouse_id"];
  const multiDimensalObjectColumns = {};

  const subnavFilterKey = "search_due_type";
  const subnavFilterValue = "";
  const filters = {};
  const extraFilters = {};

  const initData = {
    order_date: dayjs().utc().format("YYYY-MM-DDTHH:mm:ssZ"),
    user_id: undefined,
    notes: "",
    order_status: undefined,
    tax_id: undefined,
    warehouse_id: undefined,
    discount: 0,
    shipping: 0,
    subtotal: 0,
  };

  return {
    url,
    urlParams,
    filterableColumns,
    langKey,
    initData,
    hashableColumns,
    multiDimensalObjectColumns,
    filters,
    extraFilters,
    subnavFilterKey,
    subnavFilterValue,
  };
};

export default fields;
