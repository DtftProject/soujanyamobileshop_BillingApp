const fields = () => {
	const url = "roles";
	const urlParams =
		"fields=id,xid,name,display_name,description,perms.limit(10000)";
	const filterableColumns = [];
	const langKey = "role";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = {};
	const extraFilters = {};

	const initData = {
		name: "",
		display_name: "",
		description: "",
		permissions: [],
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
