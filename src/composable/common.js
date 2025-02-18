import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { forEach, find, includes } from "lodash-es";
import { checkUserPermission } from "../common/functions";
import dayjs from "dayjs";
import { useAppStore } from "../stores/appStore";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const common = () => {
	const { t } = useI18n();
	const appStore = useAppStore();
	// const invoiceBaseUrl = window.config.invoice_url;
	// const downloadLangCsvUrl = window.config.download_lang_csv_url;
	const appType = appStore.globalSetting.is_global == 1 ? "saas" : "non-saas";

	const menuCollapsed = appStore.menuCollapsed;
	// const cssSettings = computed(() => store.state.auth.cssSettings);
	// const appModules = computed(() => store.state.auth.activeModules);
	const visibleSubscriptionModules = appStore.visibleSubscriptionModules;
	const globalSetting = appStore.globalSetting;
	const appSetting = appStore.appSetting;
	const addMenus = appStore.addMenus;
	const selectedLang = appStore.selectedLang;
	const user = appStore.authUser;
	// const frontAppSetting = computed(() => store.state.front.appSetting);
	const selectedWarehouse = appStore.selectedWarehouse;

	const statusColors = {
		enabled: "success",
		disabled: "error",
	};

	const userStatus = [
		{
			key: "enabled",
			value: t("common.enabled"),
		},
		{
			key: "disabled",
			value: t("common.disabled"),
		},
	];

	const taxTypes = [
		{
			key: "inclusive",
			value: t("product.inclusive"),
		},
		{
			key: "exclusive",
			value: t("product.exclusive"),
		},
	];

	const disabledDate = (current) => {
		// Can not select days before today and today
		return current && current > dayjs().endOf("day");
	};

	const dayjsObject = (date) => {
		if (date == undefined) {
			return dayjs().tz(appSetting.timezone);
		} else {
			return dayjs(date).tz(appSetting.timezone);
		}
	};

	const formatDate = (date) => {
		if (date == undefined) {
			return dayjs()
				.tz(appSetting.timezone)
				.format(`${appSetting.date_format}`);
		} else {
			return dayjs(date)
				.tz(appSetting.timezone)
				.format(`${appSetting.date_format}`);
		}
	};

	const formatQuantity = (quantity) => {
		return parseInt(quantity);
	};

	function numberWithCommas(amount) {
		// x = x.toString();
		// var pattern = /(-?\d+)(\d{3})/;
		// while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
		// return x;

		return parseFloat(Math.abs(amount))
			.toFixed(2)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const formatDateTime = (dateTime) => {
		if (dateTime == undefined) {
			return dayjs()
				.tz(appSetting.timezone)
				.format(`${appSetting.date_format} ${appSetting.time_format}`);
		} else {
			return dayjs(dateTime)
				.tz(appSetting.timezone)
				.format(`${appSetting.date_format} ${appSetting.time_format}`);
		}
	};

	const formatAmount = (amount) => {
		return parseFloat(parseFloat(amount).toFixed(2));
	};

	const formatAmountCurrency = (amount) => {
		const newAmount = parseFloat(Math.abs(amount))
			.toFixed(2)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		if (appSetting.currency.position == "front") {
			var newAmountString = `${appSetting.currency.symbol}${newAmount}`;
		} else {
			var newAmountString = `${newAmount}${appSetting.currency.symbol}`;
		}

		return amount < 0 ? `- ${newAmountString}` : newAmountString;
	};

	const formatAmountUsingCurrencyObject = (amount, currency) => {
		const newAmount = parseFloat(Math.abs(amount))
			.toFixed(2)
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		if (currency.position == "front") {
			var newAmountString = `${currency.symbol}${newAmount}`;
		} else {
			var newAmountString = `${newAmount}${currency.symbol}`;
		}

		return amount < 0 ? `- ${newAmountString}` : newAmountString;
	};

	const calculateFilterString = (filters) => {
		var filterString = "";

		forEach(filters, (filterValue, filterKey) => {
			if (filterValue != undefined) {
				filterString += `${filterKey} eq "${filterValue}" and `;
			}
		});

		if (filterString.length > 0) {
			filterString = filterString.substring(0, filterString.length - 4);
		}

		return filterString;
	};

	const checkPermission = (permissionName) =>
		checkUserPermission(permissionName, user);

	const updatePageTitle = (pageName) => {
		store.commit("auth/updatePageTitle", t(`menu.${pageName}`));
	};

	const permsArray = computed(() => {
		const permsArrayList =
			user && user && user.role ? [user.role.name] : [];

		if (user && user && user.role) {
			forEach(user.role.perms, (permission) => {
				permsArrayList.push(permission.name);
			});
		}

		return permsArrayList;
	});

	const orderStatus = [
		{
			key: "pending",
			value: t("common.unpaid"),
		},
		{
			key: "paid",
			value: t("common.paid"),
		},
	];

	const paymentStatus = [
		{
			key: "pending",
			value: t("common.pending"),
		},
		{
			key: "paid",
			value: t("common.paid"),
		},
		{
			key: "cancelled",
			value: t("common.cancelled"),
		},
	];

	const orderStatusColors = {
		received: "green",
		pending: "orange",
		ordered: "blue",

		completed: "green",
		pending: "orange",

		delivered: "green",
		shipping: "purple",
		processing: "pink",
		confirmed: "cyan",
		ordered: "blue",

		received: "green",
		pending: "orange",
	};

	const barcodeSymbology = [
		{
			key: "CODE128",
			value: "CODE128",
		},
		{
			key: "CODE39",
			value: "CODE39",
		},
	];

	const getRecursiveCategories = (response, excludeId = null) => {
		const allCategoriesArray = [];
		const listArray = [];

		response.data.map((responseArray) => {
			if (
				excludeId == null ||
				(excludeId != null && responseArray.x_parent_id != excludeId)
			) {
				listArray.push({
					xid: responseArray.xid,
					x_parent_id: responseArray.x_parent_id,
					title: responseArray.name,
					value: responseArray.xid,
				});
			}
		});

		listArray.forEach((node) => {
			// No parentId means top level
			if (!node.x_parent_id) return allCategoriesArray.push(node);

			// Insert node as child of parent in listArray array
			const parentIndex = listArray.findIndex(
				(el) => el.xid === node.x_parent_id
			);
			if (!listArray[parentIndex].children) {
				return (listArray[parentIndex].children = [node]);
			}

			listArray[parentIndex].children.push(node);
		});

		return allCategoriesArray;
	};

	const filterTreeNode = (inputValue, treeNode) => {
		const treeString = treeNode.props.title.toLowerCase();

		return treeString.includes(inputValue.toLowerCase());
	};

	const slugify = (text) => {
		var randomString = Math.random().toString(36).slice(5);

		var newSlug = text
			.toString()
			.toLowerCase()
			.replace(/\s+/g, "-") // Replace spaces with -
			.replace(/[^\w\-]+/g, "") // Remove all non-word chars
			.replace(/\-\-+/g, "-") // Replace multiple - with single -
			.replace(/^-+/, "") // Trim - from start of text
			.replace(/-+$/, ""); // Trim - from end of text

		return newSlug + "-" + randomString;
	};

	const convertToPositive = (amount) => {
		return amount < 0 ? amount * -1 : amount;
	};

	const willSubscriptionModuleVisible = (moduleName) => {
		if (appType == "non-saas") {
			return true;
		} else {
			if (
				appSetting.subscription_plan &&
				appSetting.subscription_plan.modules
			) {
				return includes(
					appSetting.subscription_plan.modules,
					moduleName
				);
			} else {
				return false;
			}
		}
	};

	const formatValueFunciton = (value) => {
		if (value[0]) {
			const displayValue = dayjs(value[0])
				.tz(appSetting.timezone)
				.format(`${appSetting.date_format} ${appSetting.time_format}`);
			const formatedValue = dayjs(value[0])
				.utc()
				.format("YYYY-MM-DDTHH:mm:ssZ");

			return [displayValue, formatedValue];
		}
	};

	const formatRangeValueFunciton = (value) => {
		if (value[0] && value[1]) {
			const displayValue0 = dayjs(value[0])
				.tz(appSetting.timezone)
				.format(`${appSetting.date_format}`);

			const formatedValue0 = dayjs(value[0])
				.tz(appSetting.timezone)
				.startOf("day")
				.utc()
				.format("YYYY-MM-DD HH:mm:ss");

			const displayValue1 = dayjs(value[1])
				.tz(appSetting.timezone)
				.format(`${appSetting.date_format}`);
			const formatedValue1 = dayjs(value[1])
				.tz(appSetting.timezone)
				.endOf("day")
				.utc()
				.format("YYYY-MM-DD HH:mm:ss");

			return [
				displayValue0,
				formatedValue0,
				displayValue1,
				formatedValue1,
			];
		}
	};

	return {
		menuCollapsed,
		appSetting,
		selectedWarehouse,
		appType,
		addMenus,
		selectedLang,
		user,
		checkPermission,
		permsArray,
		statusColors,
		orderStatusColors,
		userStatus,
		taxTypes,
		barcodeSymbology,

		disabledDate,
		formatAmount,
		formatAmountCurrency,
		formatAmountUsingCurrencyObject,
		convertToPositive,

		calculateFilterString,
		updatePageTitle,

		// For Stock routes
		orderStatus,
		paymentStatus,

		getRecursiveCategories,
		filterTreeNode,

		dayjs,
		formatDate,
		formatDateTime,
		dayjsObject,
		slugify,

		// invoiceBaseUrl,
		// downloadLangCsvUrl,
		// frontAppSetting,
		// appModules,
		// cssSettings,
		globalSetting,

		willSubscriptionModuleVisible,
		visibleSubscriptionModules,

		formatValueFunciton,
		formatRangeValueFunciton,
		numberWithCommas,

		formatQuantity,
	};
};

export default common;
