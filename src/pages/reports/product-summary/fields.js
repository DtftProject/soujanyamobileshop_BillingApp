const fields = () => {
	const url = "order-items";
	const urlParams = "fields=id";
	const filterableColumns = [];
	const langKey = "product-summary";
	const hashableColumns = ["product_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = {};
	const extraFilters = { category_id: "" };
	const fixedFilters = { product_sales_summary: true };

	const initData = {};
	const sorter = { field: "products.name", order: "asc" };
	const pageSize = 1000;

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
