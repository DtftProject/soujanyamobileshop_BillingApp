import UnitIndex from "@/pages/settings/units/index.vue";
import UnitView from "@/pages/settings/units/view.vue";
import UnitAddEdit from "@/pages/settings/units/addEdit.vue";

import PaymentModeIndex from "@/pages/settings/payment-modes/index.vue";
import PaymentModeView from "@/pages/settings/payment-modes/view.vue";
import PaymentModeAddEdit from "@/pages/settings/payment-modes/addEdit.vue";

import CurrencyIndex from "@/pages/settings/currency/index.vue";
import CurrencyView from "@/pages/settings/currency/view.vue";
import CurrencyAddEdit from "@/pages/settings/currency/addEdit.vue";

import TaxIndex from "@/pages/settings/taxes/index.vue";
import TaxView from "@/pages/settings/taxes/view.vue";
import TaxAddEdit from "@/pages/settings/taxes/addEdit.vue";

import RoleIndex from "@/pages/settings/roles/index.vue";
import RoleView from "@/pages/settings/roles/view.vue";
import RoleAddEdit from "@/pages/settings/roles/addEdit.vue";

import WarehouseIndex from "@/pages/settings/warehouse/index.vue";
import WarehouseView from "@/pages/settings/warehouse/view.vue";
import WarehouseAddEdit from "@/pages/settings/warehouse/addEdit.vue";

import LanguageIndex from "@/pages/settings/language/index.vue";
import LanguageView from "@/pages/settings/language/view.vue";
import LanguageAddEdit from "@/pages/settings/language/addEdit.vue";

import CompanySettingEdit from "@/pages/settings/company/edit.vue";
import SettingProfileView from "@/pages/settings/profile/edit.vue";

export default [
	{
		path: "/company-settings/",
		component: CompanySettingEdit,
	},
	{
		path: "/profile/",
		component: SettingProfileView,
	},

	{
		path: "/unit/",
		component: UnitIndex,
	},
	{
		path: "/unit-view/",
		component: UnitView,
	},
	{
		path: "/unit-create/",
		component: UnitAddEdit,
	},
	{
		path: "/unit-edit/",
		component: UnitAddEdit,
	},

	//   payment_modes
	{
		path: "/payment_mode/",
		component: PaymentModeIndex,
	},
	{
		path: "/payment_mode-view/",
		component: PaymentModeView,
	},
	{
		path: "/payment_mode-create/",
		component: PaymentModeAddEdit,
	},
	{
		path: "/payment_mode-edit/",
		component: PaymentModeAddEdit,
	},

	// Currency

	{
		path: "/currency/",
		component: CurrencyIndex,
	},
	{
		path: "/currency-view/",
		component: CurrencyView,
	},
	{
		path: "/currency-create/",
		component: CurrencyAddEdit,
	},
	{
		path: "/currency-edit/",
		component: CurrencyAddEdit,
	},

	//Taxes

	{
		path: "/tax/",
		component: TaxIndex,
	},
	{
		path: "/tax-view/",
		component: TaxView,
	},
	{
		path: "/tax-create/",
		component: TaxAddEdit,
	},
	{
		path: "/tax-edit/",
		component: TaxAddEdit,
	},

	// roles and permission

	{
		path: "/role/",
		component: RoleIndex,
	},
	{
		path: "/role-view/",
		component: RoleView,
	},
	{
		path: "/role-create/",
		component: RoleAddEdit,
	},
	{
		path: "/role-edit/",
		component: RoleAddEdit,
	},

	//warehouse

	{
		path: "/warehouse/",
		component: WarehouseIndex,
	},
	{
		path: "/warehouse-view/",
		component: WarehouseView,
	},
	{
		path: "/warehouse-create/",
		component: WarehouseAddEdit,
	},
	{
		path: "/warehouse-edit/",
		component: WarehouseAddEdit,
	},

	//language

	{
		path: "/language/",
		component: LanguageIndex,
	},
	{
		path: "/langs-view/",
		component: LanguageView,
	},
	{
		path: "/langs-create/",
		component: LanguageAddEdit,
	},
	{
		path: "/langs-edit/",
		component: LanguageAddEdit,
	},
];
