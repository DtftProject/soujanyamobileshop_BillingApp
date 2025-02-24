const fields = () => {
	const url = "categories";
	const urlParams =
		"fields=id,xid,name,slug,parent_id,x_parent_id,image,image_url";
	const filterableColumns = ["name", "slug"];
	const langKey = "category";
	const hashableColumns = ["parent_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = { status: "" };
	const extraFilters = {};

	const initData = {
		name: "",
		slug: "",
		image: undefined,
		image_url: undefined,
		parent_id: "",
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
