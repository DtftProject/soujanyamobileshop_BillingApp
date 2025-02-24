const fields = () => {
  const url = "offline-requests";
  const urlParams =
    "fields=id,xid,created_at,proof_document,proof_document_url,subscription_plan_id,x_subscription_plan_id,subscriptionPlan{id,xid,name},plan_type,offline_payment_mode_id,x_offline_payment_mode_id,offlinePaymentMode{id,xid,name},status,submitted_by_id,x_submitted_by_id,submittor{id,xid,name}";
  const filterableColumns = ["name", "item_code"];
  // const langKey = "offline-request";
  const hashableColumns = [
    "subscription_plan_id",
    "offline_payment_mode_id",
    "submitted_by_id",
  ];
  const multiDimensalObjectColumns = {};
  const vueRouteUrl = "offline-request";
  const subnavFilterKey = "";
  const subnavFilterValue = "";
  const filters = { status: "" };
  const extraFilters = {};

  const initData = {};

  return {
    url,
    urlParams,
    filterableColumns,
    // langKey,
    initData,
    hashableColumns,
    multiDimensalObjectColumns,
    filters,
    extraFilters,
    subnavFilterKey,
    subnavFilterValue,
    vueRouteUrl,
  };
};

export default fields;
