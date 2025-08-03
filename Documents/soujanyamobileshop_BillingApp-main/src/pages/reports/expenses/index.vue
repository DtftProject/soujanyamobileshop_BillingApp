<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.expense_reports')" :back-link="$t('common.back')">
            <f7-nav-right>
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-card header-divider footer-divider v-for="item in table.data" :key="item.xid">
            <f7-card-header style="font-weight: bold; font-size: 14px">
                {{ formatDate(item.date) }}
            </f7-card-header>
            <f7-card-content :padding="false">
                <f7-list media-list>
                    <f7-list-item :title="item.expense_category?.name">
                        <template #subtitle>
                            {{ item.user && item.user.name ? item.user.name : "-" }}
                        </template>

                        <template #media style="padding-top: 0px !important">
                            <img
                                v-if="item.user && item.user.profile_image_url"
                                style="border-radius: 8px"
                                :src="item.user.profile_image_url"
                                width="48"
                                height="48"
                            />
                            <f7-icon v-else f7="person_crop_square" size="48px"></f7-icon>
                        </template>
                        <template #after>
                            {{ formatAmountCurrency(item.amount) }}
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
            <f7-card-footer>
                {{ $t("expense.notes") }} :
                {{ item.notes ? item.notes : "-" }}</f7-card-footer
            >
        </f7-card>

        <f7-sheet
            v-model:opened="filterOpened"
            backdrop
            swipe-to-close
            :style="{ height: '50%' }"
        >
            <f7-toolbar>
                <div class="left">
                    {{ $t("common.filters") }}
                </div>
                <div class="right">
                    <f7-link v-if="filterApplied" @click="clearFilters">
                        {{ $t("common.clear") }}
                    </f7-link>
                </div>
            </f7-toolbar>
            <!-- Scrollable sheet content -->
            <f7-page-content>
                <f7-list
                    strong-ios
                    dividers-ios
                    outline-ios
                    :style="{ marginTop: '0px' }"
                >
                    <f7-list-input :input="false">
                        <template #label>
                            {{ $t("expense.expense_category") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('expense.expense_category'),
                                    ])
                                "
                                :selectedValue="filters.expense_category_id"
                                :items="expenseCategories"
                                fieldKey="xid"
                                fieldName="name"
                                className="filter-expense-category-select"
                                @changed="
                                    (newVal) => {
                                        filterOpened = true;
                                        filters.expense_category_id = newVal;
                                        setUrlData();
                                    }
                                "
                                @opened="
                                    () => {
                                        filterOpened = false;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>
                    <f7-list-input :input="false">
                        <template #label>
                            {{ $t("expense.user") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [$t('expense.user')])
                                "
                                :selectedValue="filters.user_id"
                                :items="users"
                                fieldKey="xid"
                                fieldName="name"
                                className="filter-users-select"
                                @changed="
                                    (newVal) => {
                                        filterOpened = true;
                                        filters.user_id = newVal;
                                        setUrlData();
                                    }
                                "
                                @opened="
                                    () => {
                                        filterOpened = false;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-page-content>
        </f7-sheet>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";
import CodrajSelect from "@/components/form/CodrajSelect.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    components: {
        CodrajSelect,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { formatAmountCurrency, permsArray, formatDate } = common();
        const expenseCategories = ref([]);
        const users = ref([]);

        onMounted(() => {
            // console.log(props.f7router.history, "customer-index");
            const expenseCategoriesPromise = axiosAdmin().get(
                "expense-categories?limit=10000"
            );
            const usersPromise = axiosAdmin().get("users?limit=10000");

            Promise.all([expenseCategoriesPromise, usersPromise]).then(
                ([expenseCategoriesResponse, usersResponse]) => {
                    expenseCategories.value = expenseCategoriesResponse.data;
                    users.value = usersResponse.data;

                    datatableVariables.fetch({
                        page: 1,
                    });
                }
            );
        });

        return {
            ...datatableVariables,
            formatAmountCurrency,
            formatDate,
            permsArray,

            expenseCategories,
            users,
        };
    },
};
</script>
