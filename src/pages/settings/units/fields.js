const fields = () => {
	const url = "units";
	const urlParams =
		"fields=id,xid,name,short_name,operator,operator_value,is_deletable";
	const filterableColumns = ["name"];
	const langKey = "unit";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "search_due_type";
	const subnavFilterValue = "";
	const filters = {};
	const extraFilters = {};

	const initData = {
		name: "",
		short_name: "",
		parent_id: null,
		operator: "multiply",
		operator_value: 1,
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
