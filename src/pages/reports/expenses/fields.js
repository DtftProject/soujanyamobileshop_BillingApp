const fields = () => {
	const url = "expenses";
	const urlParams =
		"fields=id,xid,bill,bill_url,expense_category_id,x_expense_category_id,expenseCategory{id,xid,name},amount,user_id,x_user_id,user{id,xid,name,profile_image,profile_image_url},notes,date";
	const filterableColumns = [];
	const langKey = "expense-summary";
	const hashableColumns = ["user_id", "expense_category_id"];
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
