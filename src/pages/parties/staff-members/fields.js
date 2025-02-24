const fields = () => {
	const url = "users";
	const urlParams =
		"fields=id,xid,user_type,name,email,profile_image,profile_image_url,is_walkin_customer,phone,address,shipping_address,status,tax_number,created_at,details{opening_balance,opening_balance_type,credit_period,credit_limit,due_amount,warehouse_id,x_warehouse_id},details:warehouse{id,xid,name},role_id,role{id,xid,name,display_name},warehouse_id,x_warehouse_id,warehouse{xid,name},userWarehouses{user_id,x_user_id,warehouse_id,x_warehouse_id}";
	const filterableColumns = ["name", "email", "phone"];
	const langKey = "staff_member";
	const vueRouteUrl = "staff-members";
	const hashableColumns = ["warehouse_id", "role_id"];
	const multiDimensalObjectColumns = {
		credit_period: "details.credit_period",
		credit_limit: "details.credit_limit",
		opening_balance: "details.opening_balance",
		opening_balance_type: "details.opening_balance_type",
	};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = { status: "" };
	const extraFilters = { warehouse_id: "" };

	const initData = {
		warehouse_id: "",
		warehouses: [],
		name: "",
		email: "",
		profile_image: undefined,
		profile_image_url: undefined,
		phone: "",
		address: "",
		status: "enabled",
		user_type: "staff_members",
		shipping_address: "",
		opening_balance: "",
		opening_balance_type: "receive",
		credit_period: "30",
		credit_limit: "",
		tax_number: undefined,
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
