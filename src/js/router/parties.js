import CustomerIndex from "@/pages/parties/customers/index.vue";
import CustomerView from "@/pages/parties/customers/view.vue";
import CustomerAddEdit from "@/pages/parties/customers/addEdit.vue";

import StaffMemberIndex from "@/pages/parties/staff-members/index.vue";
import StaffMemberView from "@/pages/parties/staff-members/view.vue";
import StaffMemberAddEdit from "@/pages/parties/staff-members/addEdit.vue";

export default [
	// Customers
	{
		path: "/parties/",
		component: CustomerIndex,
	},
	{
		path: "/parties-view/",
		component: CustomerView,
	},
	{
		path: "/parties-create/",
		component: CustomerAddEdit,
	},
	{
		path: "/parties-edit/",
		component: CustomerAddEdit,
	},

	//staff-member

	{
		path: "/staff-members/",
		component: StaffMemberIndex,
	},
	{
		path: "/staff-members-view/",
		component: StaffMemberView,
	},
	{
		path: "/staff-members-create/",
		component: StaffMemberAddEdit,
	},
	{
		path: "/staff-members-edit/",
		component: StaffMemberAddEdit,
	},
];
