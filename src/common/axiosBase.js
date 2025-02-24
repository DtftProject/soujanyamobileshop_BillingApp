import axios from "axios";
import { APP_URL, getValueFromStorage } from "../stores/storage";

export const axiosBase = (baseUrl = undefined) => {
	var storageBaseUrl = getValueFromStorage(APP_URL, "");
	let newAxios;

	if (baseUrl != undefined) {
		newAxios = axios.create({
			baseURL: baseUrl + "/api/v1",
		});
	} else if (storageBaseUrl != "") {
		newAxios = axios.create({
			baseURL: storageBaseUrl + "/api/v1",
		});
	}

	// Axios default headers
	newAxios.defaults.headers["Accept"] = "application/json";
	newAxios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

	// Axios error listener
	newAxios.interceptors.response.use(
		function (response) {
			return response.data;
		},
		function (error) {
			const errorCode = error.response.status;
			if (errorCode === 401) {
				// If error 401 redirect to login
				// window.location.href = window.config.path;
				// throw new Error('Unauthorized');
			} else {
				// If it is an uncontrolled error, display http status
				// Ladda.stopAll();
				// swal('Error ' + error.response.status, error.response.statusText, 'error');
				return Promise.reject(error.response);
			}
		}
	);

	return newAxios;
};
