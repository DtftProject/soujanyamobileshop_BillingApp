const fields = () => {
  const url = "subscription-transcations";
  const urlParams =
    "fields=id,xid,paid_on,transcation_id,next_payment_date,payment_method,subscription_plan_id,x_subscription_plan_id,subscriptionPlan{id,xid,name}";
  const filterableColumns = [];
  const langKey = "transcations";
  const hashableColumns = ["transcation_id"];
  const multiDimensalObjectColumns = {};
  const vueRouteUrl = "transcations";

  const subnavFilterKey = "";
  const subnavFilterValue = "";
  const filters = { transcation_id: "" };
  const extraFilters = {};

  const initData = {};

  return {
    url,
    filterableColumns,
    langKey,
    initData,
    hashableColumns,
    multiDimensalObjectColumns,
    filters,
    extraFilters,
    subnavFilterKey,
    subnavFilterValue,
    urlParams,
    vueRouteUrl,
  };
};

export default fields;
