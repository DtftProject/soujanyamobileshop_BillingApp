import OrdersIndex from "@/pages/stock-managment/orders/index.vue";
import OrdersView from "@/pages/stock-managment/orders/view.vue";
import OrdersAddEdit from "@/pages/stock-managment/orders/addEdit.vue";

import PaymentInIndex from "@/pages/stock-managment/payment-in/index.vue";
import PaymentInView from "@/pages/stock-managment/payment-in/view.vue";
import PaymentInAddEdit from "@/pages/stock-managment/payment-in/addEdit.vue";

import PaymentOutIndex from "@/pages/stock-managment/payment-out/index.vue";
import PaymentOutView from "@/pages/stock-managment/payment-out/view.vue";
import PaymentOutAddEdit from "@/pages/stock-managment/payment-out/addEdit.vue";

import AdjustmentIndex from "@/pages/stock-managment/adjustment/index.vue";
import AdjustmentView from "@/pages/stock-managment/adjustment/view.vue";
import AdjustmentAddEdit from "@/pages/stock-managment/adjustment/addEdit.vue";

export default [
	//   Adjustments
	{
		path: "/stock-adjustment/",
		component: AdjustmentIndex,
	},
	{
		path: "/stock-adjustment-view/",
		component: AdjustmentView,
	},
	{
		path: "/stock-adjustment-create/",
		component: AdjustmentAddEdit,
	},
	{
		path: "/stock-adjustment-edit/",
		component: AdjustmentAddEdit,
	},

	// Sales

	{
		path: "/orders/",
		component: OrdersIndex,
	},
	{
		path: "/orders-view/",
		component: OrdersView,
	},
	{
		path: "/orders-create/",
		component: OrdersAddEdit,
	},
	{
		path: "/orders-edit/",
		component: OrdersAddEdit,
	},

	// paymentIn

	{
		path: "/payment-in/",
		component: PaymentInIndex,
	},
	{
		path: "/payment-in-view/",
		component: PaymentInView,
	},
	{
		path: "/payment-in-create/",
		component: PaymentInAddEdit,
	},
	{
		path: "/payment-in-edit/",
		component: PaymentInAddEdit,
	},

	// paymentOut

	{
		path: "/payment-out/",
		component: PaymentOutIndex,
	},
	{
		path: "/payment-out-view/",
		component: PaymentOutView,
	},
	{
		path: "/payment-out-create/",
		component: PaymentOutAddEdit,
	},
	{
		path: "/payment-out-edit/",
		component: PaymentOutAddEdit,
	},
];
