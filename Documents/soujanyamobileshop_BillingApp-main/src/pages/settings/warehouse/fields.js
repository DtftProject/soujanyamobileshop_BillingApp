const fields = () => {
	const url = "warehouses";
	const urlParams =
		"fields=id,xid,company_id,x_company_id,logo,logo_url,dark_logo,dark_logo_url,name,slug,email,phone,address,show_email_on_invoice,show_phone_on_invoice,show_mrp_on_invoice,show_discount_tax_on_invoice,terms_condition,bank_details,signature,signature_url,online_store_enabled,default_pos_order_status,customers_visibility,suppliers_visibility,products_visibility";
	const filterableColumns = ["name", "email", "phone"];
	const langKey = "warehouse";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "search_due_type";
	const subnavFilterValue = "";
	const filters = {};
	const extraFilters = {};

	const initData = {
		name: "",
		slug: "",
		email: "",
		phone: "",
		logo: undefined,
		logo_url: undefined,
		dark_logo: undefined,
		dark_logo_url: undefined,
		show_email_on_invoice: 0,
		show_phone_on_invoice: 0,
		show_mrp_on_invoice: 1,
		show_discount_tax_on_invoice: 1,
		address: "",
		terms_condition: `1. Goods once sold will not be taken back or exchanged
2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only`,
		bank_details: "",
		signature: undefined,
		signature_url: undefined,
		default_pos_order_status: "delivered",
		customers_visibility: "all",
		suppliers_visibility: "all",
		products_visibility: "all",
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
