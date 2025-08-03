// All variables
export const SELECTED_WAREHOUSE = "selected_warehouse";
export const IS_DARK_MODE = "is_dark_mode";
export const ALL_WAREHOUSES = "all_warehouses";
export const ALL_LANGS = "all_langs";
export const SELECTED_LANG = "selected_lang";
export const APP_URL = "app_url";
export const APP_TYPE = "app_type";
export const APP_SETTINGS = "app_settings";
export const GLOBAL_SETTINGS = "global_settings";
export const AUTH_TOKEN = "auth_token";
export const AUTH_USER = "auth_user";
export const EXIPRES_KEY = "expires_key";
export const VISIBLE_SUBSCRIPTION_MODULES = "visible_subscription_modules";
export const EMAIL_SETTING_VERIFIED = "email_setting_verified";
export const ADD_MENUS = "add_menus";
export const ALL_LANG_TRANS = "all_lang_trans";
export const THEME_COLOR = "theme_color";

export const getValueFromStorage = (keyName, defaultValue) => {
	
	const value = window.localStorage.getItem(keyName);

	if (
		value === "undefined" ||
		value === "null" ||
		value === undefined ||
		value === null
	) {
		return defaultValue;
	} else {
		return value;
	}
};

export const getValueFromJsonStorage = (keyName, defaultValue) => {
	const value = window.localStorage.getItem(keyName);

	if (
		value === "undefined" ||
		value === "null" ||
		value === undefined ||
		value === null
	) {
		return defaultValue;
	} else {
		return JSON.parse(value);
	}
};

export const setValueInStorage = (keyName, defaultValue) => {
	if (
		defaultValue == "" ||
		defaultValue == undefined ||
		defaultValue == null
	) {
		window.localStorage.removeItem(keyName);
	} else {
		window.localStorage.setItem(keyName, defaultValue);
	}
};

export const setJSONValueInStorage = (keyName, defaultValue) => {
	if (
		defaultValue == "" ||
		defaultValue == undefined ||
		defaultValue == null
	) {
		window.localStorage.removeItem(keyName);
	} else {
		window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
	}
};
