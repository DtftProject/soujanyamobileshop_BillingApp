const fields = () => {
	const url = "brands";
	const urlParams = "fields=id,xid,name,slug,image,image_url";
	const filterableColumns = ["name"];
	const langKey = "brand";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "search_due_type";
	const subnavFilterValue = "";
	const filters = { status: "" };
	const extraFilters = { warehouse_id: "" };

	const initData = {
		name: "",
		slug: "",
		image: undefined,
		image_url: undefined,
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
