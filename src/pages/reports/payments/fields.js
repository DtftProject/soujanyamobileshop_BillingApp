const fields = () => {
	const url = "payments";
	const urlParams =
		"fields=id,xid,date,payment_type,amount,payment_number,user_id,x_user_id,user{id,xid,name,profile_image,profile_image_url,user_type},payment_mode_id,x_payment_mode_id,paymentMode{id,xid,name,mode_type}";
	const filterableColumns = [];
	const langKey = "payment";
	const hashableColumns = ["user_id", "payment_mode_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = { user_id: "" };
	const extraFilters = { dates: "", payment_mode: "" };

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
