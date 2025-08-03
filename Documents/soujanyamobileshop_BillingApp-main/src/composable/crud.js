import { reactive, ref, createVNode, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { f7 } from "framework7-vue";
import { includes, has, get, map, filter } from "lodash-es";
import { useAppStore } from "../stores/appStore";
import apiAdmin from "./apiAdmin";
import { axiosAdmin } from "@/common/axiosAdmin";

const crud = (addEditType, addEditItem) => {
	const { addEditRequestAdmin, loading, rules } = apiAdmin();
	const formDataLoaded = ref(false);
	const formData = ref({});
	const { t } = useI18n();
	const appStore = useAppStore();
	const fields = ref({});

	const initCrud = (fieldsVar) => {
		// Show PreLoader
		f7.preloader.show();

		fields.value = fieldsVar;

		if (addEditType == "add") {
			formData.value = { ...fieldsVar.initData };
		} else {
			const itemDetails = {};
			var multiDimension = fields.value.multiDimensalObjectColumns;

			Object.keys(fields.value.initData).forEach((key) => {
				if (has(multiDimension, key)) {
					const multiDimensalObjectColumnValue = multiDimension[key];
					const itemDetailsValue = get(
						addEditItem,
						multiDimensalObjectColumnValue
					);
					itemDetails[key] = itemDetailsValue ? itemDetailsValue : "";
				} else if (includes(fields.value.hashableColumns, key)) {
					itemDetails[key] = addEditItem[`x_${key}`]
						? addEditItem[`x_${key}`]
						: "";
				} else {
					itemDetails[key] = addEditItem[key];
				}
			});

			// const relatoinshipData = {};
			// Object.keys(addEditRelationsKeys.value).forEach((key) => {
			// 	relatoinshipData[key] = get(
			// 		addEditItem,
			// 		addEditRelationsKeys.value[key]
			// 	);
			// });
			// addEditRelations.value = relatoinshipData;

			itemDetails["_method"] = "PUT";
			formData.value = itemDetails;
		}

		formDataLoaded.value = true;

		// Hide PreLoader
		f7.preloader.hide();
	};

	const onSubmit = (waitStatus = "not_wait") => {
		// Showing preloader
		f7.preloader.show();

		if (waitStatus == "wait") {
			return new Promise((resolve, reject) =>
				sendOnSubmitRequest(waitStatus, resolve, reject)
			);
		} else {
			sendOnSubmitRequest("not_wait");
		}
	};

	const sendOnSubmitRequest = (
		waitStatus,
		resolve = undefined,
		reject = undefined
	) => {
		const addEditUrl =
			addEditType == "add"
				? fields.value.url
				: `${fields.value.url}/${addEditItem.xid}`;
		const langCrudType = addEditType == "add" ? "created" : "updated";
		addEditRequestAdmin({
			url: addEditUrl,
			data: formData.value,
			success: (res) => {
				axiosAdmin()
					.get(
						`${fields.value.url}/${res.xid}?${fields.value.urlParams}`
					)
					.then((successResponse) => {
						// if (addEditType.value == "add") {
						// 	table.data = [
						// 		{ ...successResponse.data },
						// 		...table.data,
						// 	];
						// 	// TODO - Also check page number
						// } else {
						// 	let newTableData = map(table.data, (rowData) => {
						// 		if (
						// 			viewData.value &&
						// 			viewData.value.xid &&
						// 			rowData.xid == viewData.value.xid
						// 		) {
						// 			viewData.value = successResponse.data;
						// 		}
						// 		return rowData.xid == res.xid
						// 			? { ...successResponse.data }
						// 			: rowData;
						// 	});
						// 	table.data = newTableData;
						// }
						// // Update Visible Subscription Modules
						// updateSubscriptionModules();
						// restFormData();
						// addEditVisible.value = false;
						// closeToast();

						// Updating the addedit data to store
						appStore.updateAddEditData(successResponse.data);

						if (addEditType == "add") {
							appStore.updateAddXID(res.xid);
						} else {
							appStore.updateEditXID(res.xid);
						}

						// TODO - Update Visible Subscription Modules

						if (waitStatus == "not_wait") {
							submitSuccess();
						}

						if (resolve != undefined) {
							resolve(successResponse.data);
						}
					})
					.catch((errorResponse) => {
						f7.preloader.hide();

						if (reject != undefined) {
							reject(errorResponse);
						}
					});
			},
			error: (error) => {
				f7.preloader.hide();

				if (reject != undefined) {
					reject(error);
				}
			},
		});
	};

	const submitSuccess = () => {
		if (addEditType == "add") {
			// Go to top of page
			const listItemContainer = f7.$(
				`div.page-content.infinite-scroll-content`
			);
			if (listItemContainer) {
				listItemContainer.scrollTop(0, 300);
			}
		}

		f7.views.main.router.back();
		f7.preloader.hide();
	};

	return {
		formData,
		loading,
		rules,
		onSubmit,
		initCrud,
		formDataLoaded,

		submitSuccess,
	};
};

export default crud;
