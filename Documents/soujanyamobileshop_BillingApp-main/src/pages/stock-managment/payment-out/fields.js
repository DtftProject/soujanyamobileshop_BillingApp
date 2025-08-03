import dayjs from "dayjs";
const fields = () => {
	const url = "payment-out";
	const urlParams =
		"fields=id,xid,date,amount,notes,payment_mode_id,payment_number,payment_type,payment_mode_id,x_payment_mode_id,paymentMode{id,xid,name},user_id,x_user_id,user{id,xid,name,profile_image,profile_image_url,user_type}";
	const filterableColumns = ["payment_number"];
	const langKey = "payments";
	const vueRouteUrl = "payment-out";
	const hashableColumns = ["payment_mode_id", "user_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "search_due_type";
	const subnavFilterValue = "";
	const filters = { user_id: "" };
	const extraFilters = {};
	const fixedFilters = { payment_type: "out" };

	const initData = {
		payment_type: "out",
		date: dayjs().format("YYYY-MM-DD"),
		amount: "",
		payment_mode_id: "",
		user_id: "",
		notes: "",
	};

	return {
		url,
		urlParams,
		filterableColumns,
		langKey,
		vueRouteUrl,
		initData,
		subnavFilterKey,
		subnavFilterValue,
		hashableColumns,
		multiDimensalObjectColumns,
		filters,
		extraFilters,
		fixedFilters,
	};
};

export default fields;
