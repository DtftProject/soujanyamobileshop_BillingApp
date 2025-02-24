const fields = () => {
	const url = "payment-modes";
	const urlParams = "fields=id,xid,name,mode_type";
	const filterableColumns = ["name"];
	const langKey = "payment_mode";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = {};
	const extraFilters = {};

	const initData = {
		name: "",
		mode_type: "bank",
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
