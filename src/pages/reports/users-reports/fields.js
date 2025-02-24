const fields = () => {
	const url = "customers";
	const urlParams =
		"fields=id,xid,user_type,name,email,profile_image,user_type,profile_image_url,phone,details{purchase_order_count,purchase_return_count,sales_order_count,sales_return_count,total_amount,paid_amount,due_amount}";
	const filterableColumns = ["name", "phone"];
	const langKey = "";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = {};
	const extraFilters = {};
	const fixedFilters = {};

	const initData = {};
	const sorter = {};
	const pageSize = 10;

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
		fixedFilters,
		pageSize,
	};
};

export default fields;
