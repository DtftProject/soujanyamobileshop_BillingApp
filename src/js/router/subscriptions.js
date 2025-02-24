import CurrentPlan from "../../pages/subscriptions/current-plan/currentPlan.vue";
import Transaction from "../../pages/subscriptions/transactions/index.vue";
import TransactionView from "../../pages/subscriptions/transactions/view.vue";
import OfflineRequest from "../../pages/subscriptions/offline-request/index.vue";
import OfflineRequestView from "../../pages/subscriptions/offline-request/view.vue";
import ChangePlan from "../../pages/subscriptions/change-plan/index.vue";
import ChangePlanCreate from "../../pages/subscriptions/change-plan/create.vue";

export default [
	{
		path: "/current-plan/",
		component: CurrentPlan,
	},
	{
		path: "/transcations/",
		component: Transaction,
	},
	{
		path: "/transcations-view/",
		component: TransactionView,
	},
	{
		path: "/offline-requests/",
		component: OfflineRequest,
	},
	{
		path: "/offline-request-view/",
		component: OfflineRequestView,
	},
	{
		path: "/change-plan/",
		component: ChangePlan,
	},
	{
		path: "/change-plan-create/",
		component: ChangePlanCreate,
	},
];
