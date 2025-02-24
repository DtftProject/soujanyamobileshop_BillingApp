import ExpenseCategoryIndex from "@/pages/expense/expense-categories/index.vue";
import ExpenseCategoryView from "@/pages/expense/expense-categories/view.vue";
import ExpenseCategoryAddEdit from "@/pages/expense/expense-categories/addEdit.vue";

import ExpenseIndex from "@/pages/expense/expenses/index.vue";
import ExpenseView from "@/pages/expense/expenses/view.vue";
import ExpenseAddEdit from "@/pages/expense/expenses/addEdit.vue";

export default [
	// Expense-Category
	{
		path: "/expense_category/",
		component: ExpenseCategoryIndex,
	},
	{
		path: "/expense_category-view/",
		component: ExpenseCategoryView,
	},
	{
		path: "/expense_category-create/",
		component: ExpenseCategoryAddEdit,
	},
	{
		path: "/expense_category-edit/",
		component: ExpenseCategoryAddEdit,
	},

	//   Expenses
	{
		path: "/expense/",
		component: ExpenseIndex,
	},
	{
		path: "/expense-view/",
		component: ExpenseView,
	},
	{
		path: "/expense-create/",
		component: ExpenseAddEdit,
	},
	{
		path: "/expense-edit/",
		component: ExpenseAddEdit,
	},
];
