const fields = () => {
	const url = "stock-adjustments";
	const urlParams =
		"fields=xid,product_id,x_product_id,product{id,xid,name,image,image_url},quantity,adjustment_type";
	const filterableColumns = [];
	const langKey = "stock_adjustment";
	const vueRouteUrl = "stock-adjustment";
	const hashableColumns = ["product_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "search_due_type";
	const subnavFilterValue = "";
	const filters = { product_id: "" };
	const extraFilters = {};

	const initData = {
		product_id: "",
		quantity: 1,
		notes: "",
		adjustment_type: "add",
	};

	return {
		url,
		urlParams,
		filterableColumns,
		langKey,
		vueRouteUrl,
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
