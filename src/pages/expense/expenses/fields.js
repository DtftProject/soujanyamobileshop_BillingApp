const fields = () => {
	const url = "expenses";
	const urlParams =
		"fields=id,xid,bill,bill_url,expense_category_id,x_expense_category_id,expenseCategory{id,xid,name},amount,user_id,x_user_id,user{id,xid,name},notes,date";
	const filterableColumns = [];
	const langKey = "expense";
	const hashableColumns = ["expense_category_id", "user_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = { status: "" };
	const extraFilters = {};

	const initData = {
		expense_category_id: "",
		amount: "",
		bill: undefined,
		bill_url: undefined,
		date: undefined,
		user_id: "",
		notes: "",
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
