const fields = () => {
	const url = "currencies";
	const urlParams = "fields=id,xid,name,symbol,position,code";
	const filterableColumns = ["name"];
	const langKey = "currency";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = {};
	const extraFilters = {};

	const initData = {
		name: "",
		symbol: "",
		position: "front",
		code: "",
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
