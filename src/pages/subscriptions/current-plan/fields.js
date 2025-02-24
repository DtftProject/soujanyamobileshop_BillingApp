const fields = () => {
  const url = "subscription-plan-details";
  const filterableColumns = [];
  const langKey = "subscription_plans";
  const hashableColumns = [];
  const multiDimensalObjectColumns = {};

  const subnavFilterKey = "";
  const subnavFilterValue = "";
  const filters = { staff_user_id: "" };
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
  };
};

export default fields;
