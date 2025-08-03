const fields = () => {
	const url = "sales";
	const urlParams =
		"fields=id,xid,order_date,invoice_number,total,payment_status,user_id,x_user_id,user{id,xid,name,profile_image,profile_image_url,user_type},staff_user_id,x_staff_user_id,staffMember{id,xid,name,profile_image,profile_image_url,user_type}";
	const filterableColumns = [];
	const langKey = "sales-summary";
	const hashableColumns = ["staff_user_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = { staff_user_id: "" };
	const extraFilters = {};

	const initData = {};
	const sorter = { field: "order_date", order: "desc" };

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
