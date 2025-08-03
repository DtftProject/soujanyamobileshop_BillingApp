import { useI18n } from "vue-i18n";
import common from "@/composable/common";
import { useAppStore } from "@/stores/appStore";

const fields = (orderType = "sales") => {
	const getOrderPageObject = () => {
		var pageObjectDetails = {};

		if (orderType == "purchases") {
			pageObjectDetails = {
				type: "purchases",
				langKey: "purchase",
				menuKey: "purchases",
				userType: "suppliers",
				permission: "purchases",
			};
		} else if (orderType == "sales") {
			pageObjectDetails = {
				type: "sales",
				langKey: "sales",
				menuKey: "sales",
				userType: "customers",
				permission: "sales",
			};
		} else if (orderType == "purchase-returns") {
			pageObjectDetails = {
				type: "purchase-returns",
				langKey: "purchase_returns",
				menuKey: "purchase_returns",
				userType: "suppliers",
				permission: "purchase_returns",
			};
		} else if (orderType == "sales-returns") {
			pageObjectDetails = {
				type: "sales-returns",
				langKey: "sales_returns",
				menuKey: "sales_returns",
				userType: "customers",
				permission: "sales_returns",
			};
		} else if (orderType == "online-orders") {
			pageObjectDetails = {
				type: "online-orders",
				langKey: "online_orders",
				menuKey: "online_orders",
				userType: "customers",
				permission: "online_orders",
			};
		} else if (orderType == "quotations") {
			pageObjectDetails = {
				type: "quotations",
				langKey: "quotation",
				menuKey: "quotation",
				userType: "customers",
				permission: "quotations",
			};
		} else if (orderType == "stock-transfers") {
			pageObjectDetails = {
				type: "stock-transfers",
				langKey: "stock_transfer",
				menuKey: "stock_transfer",
				userType: "customers",
				permission: "stock_transfers",
			};
		}

		return pageObjectDetails;
	};

	const getDefaultOrderStatus = () => {
		if (
			orderType == "purchases" ||
			orderType == "sales" ||
			orderType == "stock-transfers"
		) {
			return "ordered";
		} else if (
			orderType == "sales-returns" ||
			orderType == "purchase-returns"
		) {
			return "pending";
		} else {
			return "";
		}
	};

	const { t } = useI18n();
	const appStore = useAppStore();
	const { dayjs } = common();
	const orderPageObject = getOrderPageObject();
	const url = orderPageObject.type;
	const urlParams =
		"fields=id,total_items,total_quantity,xid,unique_id,warehouse_id,adjustement,exchange,x_warehouse_id,warehouse{id,xid,name},from_warehouse_id,x_from_warehouse_id,fromWarehouse{id,xid,name},invoice_number,order_type,order_date,tax_amount,discount,shipping,subtotal,paid_amount,due_amount,order_status,payment_status,total,tax_rate,staff_user_id,x_staff_user_id,staffMember{id,xid,name,profile_image,profile_image_url,shipping_address,tax_number,email,user_type},user_id,x_user_id,user{id,xid,user_type,name,email,address,tax_number,profile_image,profile_image_url,phone},user:details{opening_balance,opening_balance_type,credit_period,credit_limit,due_amount,warehouse_id,x_warehouse_id},orderPayments{id,xid,amount,payment_id,x_payment_id},orderPayments:payment{id,xid,payment_number,amount,payment_mode_id,x_payment_mode_id,date,notes},orderPayments:payment:paymentMode{id,xid,name},items.limit(10000).offset(0){id,xid,product_id,x_product_id,unit_id,x_unit_id,item_code,single_unit_price,unit_price,quantity,tax_rate,total_tax,tax_type,total_discount,subtotal,mrp},items:unit{id,xid,name,short_name},items:product{id,xid,name,image,image_url,category_id},items:product:unit{id,xid,name,short_name},items:product:brand{id,xid,name},items:product:details{id,xid,warehouse_id,x_warehouse_id,product_id,x_product_id,current_stock},items:orderItemTaxes{id,xid,order_item_id,order_item_id,tax_name,tax_amount},cancelled,terms_condition,shippingAddress{id,xid,order_id,name,email,phone,address,address,city,state,country,zipcode}";
	const filterableColumns = ["invoice_number"];
	const langKey = orderPageObject.langKey;
	const vueRouteUrl = "orders";
	const hashableColumns = ["user_id", "warehouse_id", "tax_id"];
	const multiDimensalObjectColumns = {};

	const subnavFilterKey = "";
	const subnavFilterValue = "";
	const filters = { user_id: "" };
	const extraFilters = {};

	// TODO - warehouse_id logic for stock transfer
	const initData = {
		order_type: orderType,
		invoice_number: "",
		order_date: dayjs().utc().format("YYYY-MM-DDTHH:mm:ssZ"),
		warehouse_id:
			orderType == "stock-transfers"
				? undefined
				: appStore.selectedWarehouse.xid,
		user_id: undefined,
		terms_condition: appStore.selectedWarehouse.terms_condition,
		notes: "",
		order_status: getDefaultOrderStatus(),
		tax_id: undefined,
		tax_rate: 0,
		tax_amount: 0,
		discount: 0,
		shipping: 0,
		subtotal: 0,
		roundfigure:1,
		exchange:0,
		all_payments:[],
	};

	const purchaseOrderStatus = [
		{
			key: "received",
			value: t("common.received"),
		},
		{
			key: "pending",
			value: t("common.pending"),
		},
		{
			key: "ordered",
			value: t("common.ordered"),
		},
	];

	const purchaseReturnStatus = [
		{
			key: "completed",
			value: t("common.completed"),
		},
		{
			key: "pending",
			value: t("common.pending"),
		},
	];

	const onlineOrderChangeStatus = [
		{
			key: "confirmed",
			value: t("common.confirmed"),
		},
		{
			key: "processing",
			value: t("common.processing"),
		},
		{
			key: "shipping",
			value: t("common.shipping"),
		},
	];

	const salesOrderStatus = [
		{
			key: "ordered",
			value: t("common.ordered"),
		},
		...onlineOrderChangeStatus,
		{
			key: "delivered",
			value: t("common.delivered"),
		},
	];

	const salesReturnStatus = [
		{
			key: "received",
			value: t("common.received"),
		},
		{
			key: "pending",
			value: t("common.pending"),
		},
	];

	const getAllOrderStatus = () => {
		if (orderType == "purchases") {
			return purchaseOrderStatus;
		} else if (orderType == "sales" || orderType == "stock-transfers") {
			return salesOrderStatus;
		} else if (orderType == "sales-returns") {
			return salesReturnStatus;
		} else if (orderType == "purchase-returns") {
			return purchaseReturnStatus;
		} else if (orderType == "quotations") {
			return [];
		} else {
			return [];
		}
	};

	const allOrderStatus = getAllOrderStatus();

	return {
		url,
		urlParams,
		filterableColumns,
		langKey,
		vueRouteUrl,
		initData,
		hashableColumns,
		multiDimensalObjectColumns,
		filters,
		extraFilters,
		subnavFilterKey,
		subnavFilterValue,

		purchaseOrderStatus,
		purchaseReturnStatus,
		onlineOrderChangeStatus,
		salesOrderStatus,
		salesReturnStatus,

		orderPageObject,
		allOrderStatus,
	};
};

export default fields;
