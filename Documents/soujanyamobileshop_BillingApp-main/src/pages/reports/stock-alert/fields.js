const fields = () => {
	const url = "products";
	const urlParams =
		"fields=id,xid,name,image,image_url,item_code,unit_id,x_unit_id,unit{id,xid,short_name},details{product_id,x_product_id,current_stock,stock_quantitiy_alert}";
	const filterableColumns = [];
	const langKey = "stock-alert";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "fetch_stock_alert";
	const subnavFilterValue = true;
	const filters = {};
	const extraFilters = {};

	const initData = {};

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
