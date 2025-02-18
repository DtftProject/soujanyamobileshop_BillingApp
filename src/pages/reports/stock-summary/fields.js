const fields = () => {
	const url = "products";
	const urlParams =
		"fields=id,xid,name,,item_code,image,image_url,category_id,x_category_id,category{id,xid,name},brand_id,x_brand_id,brand{id,xid,name},unit_id,x_unit_id,unit{id,xid,name,short_name},details{stock_quantitiy_alert,opening_stock,opening_stock_date,wholesale_price,wholesale_quantity,mrp,purchase_price,sales_price,tax_id,x_tax_id,purchase_tax_type,sales_tax_type,current_stock,warehouse_id,x_warehouse_id,status},details:tax{id,xid,name,rate}";
	const filterableColumns = [];
	const langKey = "stock-summary";
	const hashableColumns = ["category_id", "brand_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = { category_id: "", brand_id: "" };
	const extraFilters = {};

	const initData = {};
	const sorter = { field: "name", order: "asc" };

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
		sorter,
	};
};

export default fields;
