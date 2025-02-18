import axios from "axios";
import { useAppStore } from "@/stores/appStore";
import { f7 } from "framework7-vue";
import { APP_URL, AUTH_TOKEN, getValueFromStorage } from "../stores/storage";

export const axiosAdmin = () => {
	const appStore = useAppStore();
	var storageBaseUrl = getValueFromStorage(
		APP_URL,
		"https://demo.stockifly.in"
	);
	var authToken = getValueFromStorage(AUTH_TOKEN, "");
	let newAxios;

	if (storageBaseUrl != "") {
		newAxios = axios.create({
			baseURL: storageBaseUrl + "/api/v1",
		});
	} else {
		newAxios = axios.create({
			baseURL: "/api/v1",
		});
	}

	// Axios default headers
	newAxios.defaults.headers["Accept"] = "application/json";
	newAxios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

	if (authToken != "") {
		newAxios.defaults.headers.common["Authorization"] =
			"Bearer " + authToken;
	}

	if (
		appStore &&
		appStore.selectedWarehouse &&
		appStore.selectedWarehouse.xid != ""
	) {
		newAxios.defaults.headers.common["Selected-Warehouse-XID"] =
			appStore.selectedWarehouse.xid;
	}

	// Axios error listener
	newAxios.interceptors.response.use(
		function (response) {
			return response.data;
		},
		function (error) {
			const errorCode = error.response.status;

			if (errorCode === 401) {
				// If error 401 redirect to login
				// window.location.href = window.config.path + '/admin/login';
				// delete window.axiosAdmin.defaults.headers.common.Authorization;
				// localStorage.removeItem('auth_token');
				// localStorage.setItem('auth_user', null);
				// throw new Error('Unauthorized');

				window.sessionStorage.clear();

				appStore.updateAuthUser(null);
				appStore.updateAuthToken(null);
				appStore.updateExpires(null);
				appStore.updateEmailVerifiedSetting(false);
				appStore.updateActiveTabName("dashboard");

				f7.views.main.router.navigate("/login/");
			} else if (errorCode === 400) {
				var errMessage = error.response.data.error.message;
				// message.error(errMessage);
			} else if (errorCode === 403) {
				var errMessage = error.response.data.error.message;
				// message.error(errMessage);
			} else if (errorCode === 404) {
				var errMessage = error.response.data.error.message;
				// message.error(errMessage);
			} else if (errorCode === 405) {
				const appType =
					appStore.globalSetting.is_global == 1 ? "saas" : "non-saas";

				appStore.updateApp();
				if (appType == "saas") {
					appStore.updateIsLicenseExpired(true);
					f7.views.main.router.navigate("/dashboard/");
				}
			}

			return Promise.reject(error.response);
		}
	);

	return newAxios;
};
