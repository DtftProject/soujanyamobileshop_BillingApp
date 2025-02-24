import { reactive, ref, watch, computed } from "vue";
import { f7 } from "framework7-vue";
import { useI18n } from "vue-i18n";
import { forEach, debounce, forOwn, includes, map, some } from "lodash-es";
import { filter } from "lodash-es";
import { axiosAdmin } from "@/common/axiosAdmin";
import { useAppStore } from "@/stores/appStore";

const datatable = (fieldsVar) => {
	const { t } = useI18n();
	const appStore = useAppStore();

	const table = reactive({
		data: [],
		pageSize: fieldsVar.pageSize ? fieldsVar.pageSize : 20,
		totalRecords: 0,
		loading: false,
		sorter: fieldsVar.sorter ? fieldsVar.sorter : {},
		searchColumn: undefined,
		searchString: "",
		searchStatus: undefined,
		filterLoading: false,
		filterableColumns: fieldsVar.filterableColumns,
		selectedRowKeys: [],
		tableColumns: [],
		finished: false,
		refreshing: false,

		allowInfinite: true,
		showPreloader: true,
	});
	const currentPage = ref(0);
	const tableUrl = ref({
		url: fieldsVar.url,
		urlParams: fieldsVar.urlParams,
	});
	const hashable = ref(fieldsVar.hashableColumns);
	const sendingUrl = ref("");
	const langKey = ref(fieldsVar.langKey);
	const exportDetails = ref({
		allowExport: false,
		exportType: "",
	});
	const filterOpened = ref(false);
	const filters = ref({ ...fieldsVar.filters });
	const extraFilters = ref({ ...fieldsVar.extraFilters });
	const fixedFilters = ref({ ...fieldsVar.fixedFilters });
	const filterApplied = computed(() => {
		return (
			some(filters.value, (value) => value != "") ||
			some(extraFilters.value, (value) => value != "")
		);
	});
	let recordDeleted = 0;

	// Subnav segment filter
	const subnavFilterValue = ref(fieldsVar.subnavFilterValue);

	// Fow Swipe
	const swipeOpenItemXid = ref("");

	const queryData = (params) => {
		let limit = params.limit;
		let offset = (params.page - 1) * limit;
		if (recordDeleted > 0) {
			offset = offset - recordDeleted;
			limit = limit + recordDeleted;
			recordDeleted = 0;
		}

		const url = generateUrl(limit, offset);
		sendingUrl.value = url;
		return axiosAdmin().get(url);
	};

	const generateUrl = (limit, offset) => {
		var url = `${tableUrl.value.url}?${tableUrl.value.urlParams}`;
		var filterString = "";
		var hashableString = "";
		var trimString = false;
		var trimHashable = false;

		// Filters
		if (
			"filterString" in tableUrl.value &&
			tableUrl.value.filterString != "" &&
			typeof tableUrl.value.filterString == "string"
		) {
			filterString += `${tableUrl.value.filterString} and `;
			trimString = true;
		}

		if (typeof filters.value == "object") {
			forOwn(filters.value, (value, key) => {
				if (value != undefined && value != "") {
					filterString += `${key} eq "${value}" and `;
					trimString = true;

					// May be Hashable
					if (includes(hashable.value, key)) {
						hashableString += `${value},`;
						trimHashable = true;
					}
				}
			});
		}

		if (table.searchColumn != undefined && table.searchString != "") {
			filterString += `${table.searchColumn} lk "%${table.searchString}%" and `;
			trimString = true;
			table.filterLoading = true;
		} else if (
			table.searchString != "" &&
			table.filterableColumns.length > 0
		) {
			var newSearchString = "";
			forEach(table.filterableColumns, (filterColumn) => {
				newSearchString += `${filterColumn} lk "%${table.searchString}%" or `;
			});

			if (newSearchString.length > 0) {
				filterString += `(${newSearchString.substring(
					0,
					newSearchString.length - 3
				)})`;
				trimString = false;
			}
			table.filterLoading = true;
		}
		if (filterString.length > 0 && trimString == true) {
			url += `&filters=${encodeURIComponent(
				filterString.substring(0, filterString.length - 5)
			)}`;
		} else if (filterString.length > 0 && trimString == false) {
			url += `&filters=${encodeURIComponent(filterString)}`;
		}

		// Extra Filters
		// Used for sending as query params
		// like ?order_type=purchase
		if (extraFilters.value && typeof extraFilters.value == "object") {
			forOwn(extraFilters.value, (value, key) => {
				if (value != undefined && value != "") {
					url += `&${key}=${value}`;

					// May be Hashable
					if (includes(hashable.value, key)) {
						hashableString += `${value},`;
						trimHashable = true;
					}
				}
			});
		}

		// Fixed Filters
		// Used for sending as query params
		// like ?order_type=purchase
		if (fixedFilters.value && typeof fixedFilters.value == "object") {
			forOwn(fixedFilters.value, (value, key) => {
				if (value != undefined && value != "") {
					url += `&${key}=${value}`;

					// May be Hashable
					if (includes(hashable.value, key)) {
						hashableString += `${value},`;
						trimHashable = true;
					}
				}
			});
		}

		// Subnav filter is a type of exta filter
		if (fieldsVar.subnavFilterKey != "" && subnavFilterValue.value != "") {
			url += `&${fieldsVar.subnavFilterKey}=${subnavFilterValue.value}`;

			// May be Hashable
			if (includes(hashable.value, fieldsVar.subnavFilterKey)) {
				hashableString += `${subnavFilterValue.value},`;
				trimHashable = true;
			}
		}

		// Order
		if (table.sorter && table.sorter.field) {
			const sortOrder =
				table.sorter.order == "ascend" || table.sorter.order == "asc"
					? "asc"
					: "desc";
			url += `&order=${table.sorter.field} ${sortOrder}`;
		} else {
			url += "&order=id desc";
		}

		// Offset and Limit
		url += `&offset=${offset}&limit=${limit}`;

		// Hashable
		if (trimHashable) {
			hashableString = hashableString.substring(
				0,
				hashableString.length - 1
			);
			url += `&hashable=${hashableString}`;
		}

		return url;
	};

	const fetch = (params = {}) => {
		if (!table.allowInfinite || !table.showPreloader) return;
		table.allowInfinite = false;

		currentPage.value += 1;
		table.loading = true;

		// Show PreLoader
		// f7.preloader.show();

		queryData({
			limit: table.pageSize,
			page: currentPage.value,
			...params,
		})
			.then((results) => {
				const data = results.data;
				table.totalRecords = results.meta.paging.total;

				table.data = [...table.data, ...data];

				if (table.data.length >= results.meta.paging.total) {
					table.finished = true;
					table.showPreloader = false;
				}

				table.filterLoading = false;
				table.loading = false;
				table.allowInfinite = true;

				// For export data
				// if (exportDetails.value.allowExport) {
				//     var exportDataType = exportDetails.value.exportType;
				//     if (exportDataType != "") {
				//         var allExportDatas = store.state.auth.allExportData;
				//         var allExportDataExceptType = filter(allExportDatas, (allExportData) => allExportData.export_type != exportDataType);

				//         store.commit("auth/updatAllExportData", [
				//             ...allExportDataExceptType,
				//             {
				//                 export_type: exportDataType,
				//                 data: data,
				//                 url: sendingUrl.value
				//             }
				//         ]);
				//     }
				// }

				if (params.success != undefined) {
					params.success(data);
				}

				// Hide PreLoader
				// f7.preloader.hide();
			})
			.catch((errorResponse) => {
				if (params.error != undefined) {
					params.error(errorResponse);
				}

				// Hide PreLoader
				// f7.preloader.hide();
			});
	};

	const onTableSearch = debounce(
		(searchbar, searchbarQuery, searchbarPreviousQuery) => {
			table.refreshing = false;
			table.finished = false;
			table.loading = true;
			currentPage.value = 0;
			table.searchString = searchbarQuery;
			table.showPreloader = true;
			table.allowInfinite = true;
			recordDeleted = 0;
			table.data = [];

			fetch({
				page: 1,
			});
		},
		400
	);

	const onRowSelectChange = (rowKeys) => {
		table.selectedRowKeys = rowKeys;
	};

	const onRefresh = () => {
		table.refreshing = false;
		table.finished = false;
		table.loading = true;
		currentPage.value = 0;
		table.data = [];
		fetch();
	};

	const deleteItem = (xid) => {
		f7.preloader.show();

		axiosAdmin()
			.delete(`${tableUrl.value.url}/${xid}`)
			.then((successResponse) => {
				// Saving data except deleted item
				var newTableData = filter(table.data, function (dataRecord) {
					return dataRecord.xid != xid;
				});
				table.data = newTableData;
				table.totalRecords = newTableData.length;
				recordDeleted += 1;

				f7.preloader.hide();

				f7.toast
					.create({
						text: t(`${langKey.value}.deleted`),
						position: "bottom",
						closeTimeout: 2000,
					})
					.open();
			})
			.catch((error) => {
				f7.preloader.hide();
			});
	};

	const viewItem = (props) => {
		const vueRouteUrl = fieldsVar.vueRouteUrl
			? fieldsVar.vueRouteUrl
			: langKey.value;
		f7.views.main.router.navigate(`/${vueRouteUrl}-view/`, {
			props,
		});
	};

	const createItem = (props) => {
		const vueRouteUrl = fieldsVar.vueRouteUrl
			? fieldsVar.vueRouteUrl
			: langKey.value;
		f7.views.main.router.navigate(`/${vueRouteUrl}-create/`, {
			props,
		});
	};

	const editItem = (props) => {
		const vueRouteUrl = fieldsVar.vueRouteUrl
			? fieldsVar.vueRouteUrl
			: langKey.value;
		f7.views.main.router.navigate(`/${vueRouteUrl}-edit/`, {
			props,
		});
	};

	const openFilters = () => {
		filterOpened.value = true;
	};

	const setUrlData = () => {
		table.refreshing = false;
		table.finished = false;
		table.loading = true;
		currentPage.value = 0;
		table.showPreloader = true;
		table.allowInfinite = true;
		recordDeleted = 0;
		table.data = [];

		// Go to top of page
		const listItemContainer = f7.$(
			`div.page-content.infinite-scroll-content`
		);
		if (listItemContainer) {
			listItemContainer.scrollTop(0, 300);
		}

		fetch({
			page: 1,
		});
	};

	const subnavSelected = (subnavFltrValue) => {
		subnavFilterValue.value = subnavFltrValue;
		setUrlData();
	};

	const assignSwipeXId = (swipeXid) => {
		swipeOpenItemXid.value = swipeXid;
	};

	const clearFilters = () => {
		filters.value = { ...fieldsVar.filters };
		extraFilters.value = { ...fieldsVar.extraFilters };
		setUrlData();
	};

	watch(
		() => appStore.addXID,
		(newVal, oldVal) => {
			if (newVal != "") {
				table.data = [{ ...appStore.addEditData }, ...table.data];

				// Resting the store data
				// Because if same id for different crud
				// Then it not watch change
				appStore.updateAddXID("");
				appStore.updateAddEditData({});

				f7.toast
					.create({
						text: t(`${langKey.value}.created`),
						position: "bottom",
						closeTimeout: 2000,
					})
					.open();
			}
		}
	);

	watch(
		() => appStore.editXID,
		(newVal, oldVal) => {
			if (newVal != "") {
				// Updating the table editdata
				let newTableData = map(table.data, (rowData) => {
					return rowData.xid == newVal
						? { ...appStore.addEditData }
						: rowData;
				});
				table.data = newTableData;

				// Resting the store data
				// Because if same id for different crud
				// Then it not watch change
				appStore.updateEditXID("");
				appStore.updateAddEditData({});

				f7.toast
					.create({
						text: t(`${langKey.value}.updated`),
						position: "bottom",
						closeTimeout: 2000,
					})
					.open();
			}
		}
	);

	return {
		table,
		tableUrl,
		exportDetails,
		currentPage,
		hashable,
		langKey,

		fetch,

		onTableSearch,
		onRowSelectChange,

		onRefresh,
		deleteItem,
		viewItem,
		createItem,
		editItem,

		filterOpened,
		openFilters,
		filters,
		extraFilters,
		clearFilters,
		subnavFilterValue,
		subnavSelected,
		setUrlData,
		filterApplied,

		swipeOpenItemXid,
		assignSwipeXId,
	};
};

export default datatable;
