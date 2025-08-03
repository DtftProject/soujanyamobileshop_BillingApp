import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { f7 } from "framework7-vue";
import dayjs from "dayjs";
import { StatusBar, Style } from "@capacitor/status-bar";
import { axiosAdmin } from "../common/axiosAdmin";
import {
	SELECTED_WAREHOUSE,
	ALL_WAREHOUSES,
	IS_DARK_MODE,
	ALL_LANGS,
	SELECTED_LANG,
	APP_URL,
	APP_TYPE,
	APP_SETTINGS,
	GLOBAL_SETTINGS,
	AUTH_TOKEN,
	AUTH_USER,
	EXIPRES_KEY,
	VISIBLE_SUBSCRIPTION_MODULES,
	EMAIL_SETTING_VERIFIED,
	ADD_MENUS,
	ALL_LANG_TRANS,
	getValueFromStorage,
	getValueFromJsonStorage,
	setValueInStorage,
	setJSONValueInStorage,
	THEME_COLOR,
} from "./storage";

export const useAppStore = defineStore("appStore", () => {
	const addXID = ref("");
	const editXID = ref("");
	const activeTabName = ref("dashboard");
	const addEditData = ref({});
	const isDarkMode = ref(getValueFromStorage(IS_DARK_MODE, false));
	const isLicenseExpired = ref(false);
	const appUrl = ref(
		getValueFromStorage(APP_URL, "https://billing.soujanya360.com")
	);
	const appType = ref(getValueFromStorage(APP_TYPE, "non-saas"));
	const themeColor = ref(getValueFromStorage(THEME_COLOR, "#1890ff"));
	const globalSetting = ref(getValueFromJsonStorage(GLOBAL_SETTINGS, {}));
	const allWarehouses = ref(getValueFromJsonStorage(ALL_WAREHOUSES, []));
	const allLangs = ref(getValueFromJsonStorage(ALL_LANGS, []));
	const selectedLang = ref(getValueFromJsonStorage(SELECTED_LANG, []));
	const selectedWarehouse = ref(
		getValueFromJsonStorage(SELECTED_WAREHOUSE, {})
	);
	const appSetting = ref(getValueFromJsonStorage(APP_SETTINGS, {}));
	const authToken = ref(getValueFromStorage(AUTH_TOKEN, ""));
	const authUser = ref(getValueFromJsonStorage(AUTH_USER, {}));
	const expires = ref(getValueFromStorage(EXIPRES_KEY, null));
	const visibleSubscriptionModules = ref(
		getValueFromJsonStorage(VISIBLE_SUBSCRIPTION_MODULES, [])
	);
	const emailSettingVerified = ref(
		getValueFromStorage(EMAIL_SETTING_VERIFIED, false)
	);
	const addMenus = ref(getValueFromJsonStorage(ADD_MENUS, []));
	const allLangTrans = ref(getValueFromJsonStorage(ALL_LANG_TRANS, []));

	const isLoggedIn = computed(() => {
		if (authToken.value === null || authToken.value === "") {
			return false;
		} else {
			return dayjs(expires.value).isAfter(dayjs());
		}
	});

	const updateAddXID = (newVal) => {
		addXID.value = newVal;
	};

	const updateThemeColor = (newVal) => {
		themeColor.value = newVal;

		setValueInStorage(THEME_COLOR, newVal);
	};

	const updateEditXID = (newVal) => {
		editXID.value = newVal;
	};

	const updateActiveTabName = (newVal) => {
		activeTabName.value = newVal;
	};

	const updateAddEditData = (newVal) => {
		addEditData.value = newVal;
	};

	const updateAppUrl = (newVal) => {
		appUrl.value = newVal;

		setValueInStorage(APP_URL, newVal);
	};

	const updateAppType = (newVal) => {
		appType.value = newVal;

		setValueInStorage(APP_TYPE, newVal);
	};

	const updateIsDarkMode = (newVal) => {
		isDarkMode.value = newVal;

		setValueInStorage(IS_DARK_MODE, newVal);
	};

	const updateIsLicenseExpired = (newVal) => {
		isLicenseExpired.value = newVal;
	};

	const updateGlobalSetting = (newVal) => {
		globalSetting.value = newVal;

		setJSONValueInStorage(GLOBAL_SETTINGS, newVal);
	};

	const updateAllWarehouses = (newVal) => {
		allWarehouses.value = newVal;

		setJSONValueInStorage(ALL_WAREHOUSES, newVal);
	};

	const updateSelectedWarehouse = (newVal) => {
		selectedWarehouse.value = newVal;

		setJSONValueInStorage(SELECTED_WAREHOUSE, newVal);
	};

	const updateAllLangs = (newVal) => {
		allLangs.value = newVal;

		setJSONValueInStorage(ALL_LANGS, newVal);
	};

	const updateSelectedLang = (
		newVal,
		instance = undefined,
		locale = undefined
	) => {
		selectedLang.value = newVal;

		// Update i18n Lang Trans
		if (
			instance &&
			locale &&
			allLangTrans.value &&
			allLangTrans.value[newVal.key]
		) {
			instance.appContext.app.config.globalProperties.$i18nObject.global.setLocaleMessage(
				newVal.key,
				allLangTrans.value[newVal.key]
			);

			locale.value = newVal.key;
		}

		setJSONValueInStorage(SELECTED_LANG, newVal);
	};

	const updateAppSetting = (newVal) => {
		appSetting.value = newVal;

		setJSONValueInStorage(APP_SETTINGS, newVal);
	};

	const updateAuthToken = (newVal) => {
		authToken.value = newVal;

		setValueInStorage(AUTH_TOKEN, newVal);
	};

	const updateAuthUser = (newVal) => {
		authUser.value = newVal;

		setJSONValueInStorage(AUTH_USER, newVal);
	};

	const updateExpires = (newVal) => {
		expires.value = newVal;

		setValueInStorage(EXIPRES_KEY, newVal);
	};

	const updateVisibleSubscriptionModules = (newVal) => {
		visibleSubscriptionModules.value = newVal;

		setJSONValueInStorage(VISIBLE_SUBSCRIPTION_MODULES, newVal);
	};

	const updateEmailVerifiedSetting = (newVal) => {
		emailSettingVerified.value = newVal;

		setValueInStorage(EMAIL_SETTING_VERIFIED, newVal);
	};

	const updateAddMenus = (newVal) => {
		addMenus.value = newVal;

		setJSONValueInStorage(ADD_MENUS, newVal);
	};

	const updateAllLangTrans = (langTransResponse) => {
		const messages = {};
		langTransResponse.map((lang) => {
			messages[lang.key] = {};

			lang.translations.map((translation) => {
				if (messages[lang.key][translation.group] == undefined) {
					messages[lang.key][translation.group] = {};
				}
				messages[lang.key][translation.group][translation.key] =
					translation.value;
			});
		});
		allLangTrans.value = messages;

		setJSONValueInStorage(ALL_LANG_TRANS, messages);
	};

	const getAndUpdateAllWarehouses = () => {
		if (appUrl.value != "") {
			axiosAdmin()
				.get("/warehouses?limit=10000")
				.then(function (response) {
					updateAllWarehouses(response.data);
				})
				.catch(function (error) { });
		}
	};

	const getAndUpdateAllLangs = () => {
		if (appUrl.value != "") {
			axiosAdmin()
				.get("/all-langs")
				.then(function (response) {
					updateAllLangs(response.data.langs);
				})
				.catch(function (error) { });
		}
	};

	const updateApp = () => {
		if (appUrl.value != "") {
			axiosAdmin()
				.get("/app")
				.then(function (response) {
					updateAppSetting(response.data.app);
					updateAddMenus(response.data.shortcut_menus.credentials);
					updateEmailVerifiedSetting(
						response.data.email_setting_verified
					);

					changeColor(response.data.app.primary_color);
				})
				.catch(function (error) { });
		}
	};

	const changeColor = (newColor) => {
		updateThemeColor(newColor);
		f7.setColorTheme(newColor);

		if (isDarkMode.value) {
			StatusBar.setStyle({ style: Style.Dark });
			StatusBar.setBackgroundColor({ color: "#1c1c1d" });
		} else {
			StatusBar.setStyle({ style: Style.Dark });
			StatusBar.setBackgroundColor({ color: newColor });
		}
	};

	const getAndUpdateAllLangTrans = (
		instance = undefined,
		locale = undefined
	) => {
		if (appUrl.value != "") {
			axiosAdmin()
				.get("/lang-trans")
				.then(function (response) {
					updateAllLangTrans(response.data.data);

					// Also Updating the i18n messages
					if (
						instance &&
						locale &&
						selectedLang.value &&
						selectedLang.value.key
					) {
						updateSelectedLang(
							selectedLang.value,
							instance,
							locale
						);
					}
				})
				.catch(function (error) { });
		}
	};

	const getAndUpdateSelectedWarehouse = (warehouseId) => {
		if (appUrl.value != "") {
			f7.preloader.show();
			return axiosAdmin()
				.post("change-warehouse", { warehouse_id: warehouseId })
				.then((response) => {
					updateSelectedWarehouse(response.data.warehouse);
					f7.preloader.hide();
				})
				.catch(function (error) {
					f7.preloader.hide();
				});
		}
	};

	return {
		isLoggedIn,

		appUrl,
		appType,
		addXID,
		editXID,
		addEditData,
		selectedWarehouse,
		appSetting,
		globalSetting,
		authToken,
		authUser,
		expires,
		visibleSubscriptionModules,
		addMenus,
		isLicenseExpired,

		allWarehouses,
		updateAllWarehouses,
		getAndUpdateAllWarehouses,

		allLangs,
		updateAllLangs,
		getAndUpdateAllLangs,
		selectedLang,
		updateSelectedLang,
		allLangTrans,
		updateAllLangTrans,
		getAndUpdateAllLangTrans,

		isDarkMode,
		updateIsDarkMode,

		updateAddXID,
		updateEditXID,
		updateAddEditData,
		updateSelectedWarehouse,
		getAndUpdateSelectedWarehouse,
		updateAppUrl,
		updateAppType,
		updateAppSetting,
		updateApp,
		updateGlobalSetting,
		updateAuthToken,
		updateAuthUser,
		updateExpires,
		updateVisibleSubscriptionModules,
		updateEmailVerifiedSetting,
		updateAddMenus,
		updateIsLicenseExpired,

		activeTabName,
		updateActiveTabName,

		themeColor,
		updateThemeColor,
		changeColor,
	};
});
