const fields = () => {
	const url = "payments";
	const urlParams =
		"fields=id,xid,date,payment_type,amount,payment_number,user_id,x_user_id,user{id,xid,name,profile_image,profile_image_url,user_type},payment_mode_id,x_payment_mode_id,paymentMode{id,xid,name,mode_type}";
	const filterableColumns = [];
	const langKey = "payment";
	const hashableColumns = [];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "payment_mode";
	const subnavFilterValue = "cash";
	const filters = {};
	const extraFilters = {};

	const initData = {};
	const sorter = { field: "date", order: "desc" };

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
