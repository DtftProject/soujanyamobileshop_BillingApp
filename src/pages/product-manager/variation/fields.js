const fields = () => {
  const url = "variations";
  const urlParams =
    "fields: id,xid,name,parent_id,x_parent_id,subVariations{id,xid,parent_id,x_parent_id,name}";
  const filterableColumns = ["id", "name", "parent_id"];
  const langKey = "variation";
  const hashableColumns = ["parent_id"];
  const multiDimensalObjectColumns = {
    parent_id: "sub_variations.name",
  };

  const subnavFilterKey = "search_due_type";
  const subnavFilterValue = "";
  const filters = {};
  const extraFilters = {};

  const initData = {
    name: "",
    parent_id: undefined,
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
