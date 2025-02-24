const fields = () => {
	const url = "products";
	const urlParams =
		"fields=id,xid,name,,item_code,image,image_url,category_id,x_category_id,category{id,xid,name},brand_id,x_brand_id,brand{id,xid,name},unit_id,x_unit_id,unit{id,xid,name,short_name},details{mrp,sales_price,tax_id,x_tax_id,purchase_tax_type,sales_tax_type},details:tax{id,xid,name,rate}";
	const filterableColumns = ["name", "item_code"];
	const langKey = "rate-list";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
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
