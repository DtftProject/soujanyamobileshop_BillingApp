import PaymentIndex from "@/pages/reports/payments/index.vue";
import CashBankIndex from "@/pages/reports/cash-bank/index.vue";
import StockAlertIndex from "@/pages/reports/stock-alert/index.vue";
import SalesSummaryIndex from "@/pages/reports/sales-summary/index.vue";
import StockSummaryIndex from "@/pages/reports/stock-summary/index.vue";
import RateListIndex from "@/pages/reports/rate-list/index.vue";
import ProductSummaryIndex from "@/pages/reports/product-summary/index.vue";
import UsersReportsIndex from "@/pages/reports/users-reports/index.vue";
import ExpenseSummaryIndex from "@/pages/reports/expenses/index.vue";
import ProfitLossIndex from "@/pages/reports/profit-loss/index.vue";

export default [
	// sales-summary
	{
		path: "/sales-summary/",
		component: SalesSummaryIndex,
	},

	// payment
	{
		path: "/payment/",
		component: PaymentIndex,
	},

	// banks
	{
		path: "/cash-bank/",
		component: CashBankIndex,
	},

	// Stock-alert
	{
		path: "/stock-alert/",
		component: StockAlertIndex,
	},

	// stock summary

	{
		path: "/stock-summary/",
		component: StockSummaryIndex,
	},

	// rate-list

	{
		path: "/rate-list/",
		component: RateListIndex,
	},

	// product summary
	{
		path: "/product-summary/",
		component: ProductSummaryIndex,
	},

	// Users Reports
	{
		path: "/users-reports/",
		component: UsersReportsIndex,
	},

	// expense
	{
		path: "/expense-summary/",
		component: ExpenseSummaryIndex,
	},

	// profit loss

	{
		path: "/profit-loss/",
		component: ProfitLossIndex,
	},
];
