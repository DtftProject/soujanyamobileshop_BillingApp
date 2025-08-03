const fields = () => {
	const url = "products";
	const urlParams =
		"fields=id,xid,name,slug,product_type,barcode_symbology,item_code,image,image_url,category_id,x_category_id,category{id,xid,name},brand_id,x_brand_id,brand{id,xid,name},unit_id,x_unit_id,unit{id,xid,name,short_name},description,details{stock_quantitiy_alert,opening_stock,opening_stock_date,wholesale_price,wholesale_quantity,mrp,purchase_price,sales_price,tax_id,x_tax_id,purchase_tax_type,sales_tax_type,current_stock,warehouse_id,x_warehouse_id,status},details:tax{id,xid,name,rate},details:warehouse{id,xid,name},customFields{id,xid,field_name,field_value},warehouse_id,x_warehouse_id,warehouse{id,xid}";
	const filterableColumns = ["name", "item_code"];
	const langKey = "product";
	const hashableColumns = [
		"warehouse_id",
		"unit_id",
		"category_id",
		"brand_id",
		"tax_id",
	];
	const multiDimensalObjectColumns = {
		stock_quantitiy_alert: "details.stock_quantitiy_alert",
		mrp: "details.mrp",
		purchase_price: "details.purchase_price",
		sales_price: "details.sales_price",
		tax_id: "details.x_tax_id",
		purchase_tax_type: "details.purchase_tax_type",
		sales_tax_type: "details.sales_tax_type",
		opening_stock: "details.opening_stock",
		opening_stock_date: "details.opening_stock_date",
		wholesale_price: "details.wholesale_price",
		wholesale_quantity: "details.wholesale_quantity",
	};

	const subnavFilterKey = "product_type";
	const subnavFilterValue = "single";
	const filters = { brand_id: "" };
	const extraFilters = {};

	const initData = {
		warehouse_id: undefined,
		name: "",
		slug: "",
		image: undefined,
		image_url: undefined,
		barcode_symbology: "CODE128",
		item_code: "",
		stock_quantitiy_alert: null,
		category_id: undefined,
		brand_id: undefined,
		mrp: 0,
		purchase_price: 0,
		sales_price: 0,
		tax_id: undefined,
		unit_id: undefined,
		description: "",
		purchase_tax_type: "exclusive",
		sales_tax_type: "exclusive",
		custom_fields: [],
		opening_stock: undefined,
		opening_stock_date: undefined,
		wholesale_price: undefined,
		wholesale_quantity: undefined,
		product_type: "single",
		variations: [],
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
