const fields = () => {
	const url = "langs";
	const urlParams = "fields=id,xid,name,image,image_url,key,enabled";
	const filterableColumns = ["name"];
	const langKey = "langs";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = {};

	const extraFilters = {};

	const initData = {
		name: "",
		key: "",
		image: undefined,
		image_url: undefined,
		enabled: 1,
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
