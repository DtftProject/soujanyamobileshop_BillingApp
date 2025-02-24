const fields = () => {
	const url = "taxes";
	const urlParams =
		"fields=id,xid,name,rate,tax_type,x_parent_id,parent_id,multipleTax{id,xid,name,rate,tax_type,x_parent_id,parent_id}";
	const filterableColumns = ["name"];
	const langKey = "tax";
	const hashableColumns = ["parent_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = {};
	const extraFilters = {};

	const initData = {
		name: "",
		rate: "",
		tax_type: "single",
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
