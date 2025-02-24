import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { forEach } from "lodash-es";
import { f7 } from "framework7-vue";
import { axiosAdmin } from "../common/axiosAdmin";
import { useAppStore } from "../stores/appStore";

const api = () => {
	const { appSetting } = useAppStore();
	const loading = ref(false);
	const rules = ref({});
	const { t } = useI18n();

	const addEditRequestAdmin = (configObject) => {
		loading.value = true;
		rules.value = {};
		const { url, data, success } = configObject;
		var formData = {};

		// Replace undefined values to null
		forEach(data, function (value, key) {
			if (value == undefined) {
				formData[key] = null;
			} else {
				formData[key] = value;
			}
		});

		axiosAdmin()
			.post(url, formData)
			.then((response) => {
				// Toastr Notificaiton
				if (configObject.successMessage) {
					f7.toast
						.create({
							text: configObject.successMessage,
							position: "bottom",
							closeTimeout: 2000,
						})
						.open();
				}

				success(response.data);
				loading.value = false;
				rules.value = {};
			})
			.catch((errorResponse) => {
				var err = errorResponse.data;
				const errorCode = errorResponse.status;
				var errorRules = {};

				if (errorCode == 422) {
					if (err.error && typeof err.error.details != "undefined") {
						var keys = Object.keys(err.error.details);
						for (var i = 0; i < keys.length; i++) {
							// Escape dot that comes with error in array fields
							var key = keys[i].replace(".", "\\.");

							errorRules[key] = {
								required: true,
								message: err.error.details[keys[i]][0],
							};
						}
					}

					rules.value = errorRules;

					// showNotify({
					//     type: 'warning',
					//     position: 'top',
					//     message: t("common.fix_errors"),
					//     className: 'safe-area-top-space'
					// });
				}

				if (err && err.message) {
					// showNotify({
					//     type: 'danger',
					//     position: 'bottom',
					//     message: err.message,
					//     className: 'safe-area-top-space'
					// });
					err = {
						error: {
							...err,
						},
					};
				}

				if (configObject.error) {
					configObject.error(err);
				}

				loading.value = false;
			});
	};

	const addEditFileRequestAdmin = (configObject) => {
		loading.value = true;
		const { url, data, success } = configObject;
		const formData = new FormData();

		// Replace undefined values to null
		forEach(data, function (value, key) {
			if (value == undefined) {
				formData.append(key, null);
			} else {
				formData.append(key, value.originFileObj);
			}
		});

		axiosAdmin
			.post(url, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				// Toastr Notificaiton
				if (configObject.successMessage) {
					// notification.success({
					//     placement: appSetting.value.rtl ? "bottomLeft" : "bottomRight",
					//     message: t("common.success"),
					//     description: configObject.successMessage
					// });
				}

				success(response.data);
				loading.value = false;
				rules.value = {};
			})
			.catch((errorResponse) => {
				var err = errorResponse.data;
				const errorCode = errorResponse.status;
				var errorRules = {};

				if (errorCode == 422) {
					if (err.error && typeof err.error.details != "undefined") {
						var keys = Object.keys(err.error.details);
						for (var i = 0; i < keys.length; i++) {
							// Escape dot that comes with error in array fields
							var key = keys[i].replace(".", "\\.");

							errorRules[key] = {
								required: true,
								message: err.error.details[keys[i]][0],
							};
						}
					}

					rules.value = errorRules;
					message.error(t("common.fix_errors"));
				}

				if (err && err.message) {
					message.error(err.message);
					err = {
						error: {
							...err,
						},
					};
				}

				if (configObject.error) {
					configObject.error(err);
				}

				loading.value = false;
			});
	};

	return {
		loading,
		rules,
		addEditRequestAdmin,
		addEditFileRequestAdmin,
	};
};

export default api;
