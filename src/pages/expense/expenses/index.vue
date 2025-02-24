<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.expenses')" back-link="Back">
            <f7-nav-right>
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes('expenses_create') ||
                        permsArray.includes('admin')
                    "
                    @click="createItem({ expenseCateogries, staffMembers })"
                    class="navbar-action-btn"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-card v-for="item in table.data" :key="item.xid">
            <f7-card-content :padding="false">
                <f7-list
                    media-list
                    strong-ios
                    dividers-ios
                    class="search-list searchbar-found"
                >
                    <f7-list-item
                        @click="viewItem({ item })"
                        swipeout
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="assignSwipeXId(item.xid)"
                        @swipeout:close="assignSwipeXId('')"
                    >
                        <template #title>
                            {{ formatAmountCurrency(item.amount) }}
                            ({{ item.expense_category?.name }})
                        </template>
                        <template #subtitle>
                            {{ formatDate(item.date) }}
                            {{ item.user ? ` » ${item.user.name}` : "" }}
                        </template>
                        <template #text>
                            {{ item.notes }}
                        </template>
                        <template #after>
                            <f7-link
                                v-if="swipeOpenItemXid != item.xid"
                                @click="
                                    (event) => {
                                        event.stopPropagation();
                                        swipeOpenItemXid = item.xid;
                                    }
                                "
                            >
                                <f7-icon f7="ellipsis_vertical" size="20"></f7-icon>
                            </f7-link>
                        </template>
                        <f7-swipeout-actions right>
                            <f7-swipeout-button @click="viewItem({ item })">
                                {{ $t("common.view") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    permsArray.includes('expenses_edit') ||
                                    permsArray.includes('admin')
                                "
                                @click="
                                    editItem({
                                        item,
                                        expenseCateogries,
                                        staffMembers,
                                        addEditType: 'edit',
                                    })
                                "
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    permsArray.includes('expenses_delete') ||
                                    permsArray.includes('admin')
                                "
                                delete
                                :confirm-title="$t('common.delete')"
                                :confirm-text="$t(`${langKey}.delete_message`)"
                            >
                                {{ $t("common.delete") }}
                            </f7-swipeout-button>
                        </f7-swipeout-actions>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
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
                            <codraj-select
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('expense.expense_category'),
                                    ])
                                "
                                :selectedValue="filters.expense_category_id"
                                :items="expenseCateogries"
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
                            <codraj-select
                                :placeholder="
                                    $t('common.select_default_text', [$t('expense.user')])
                                "
                                :selectedValue="filters.user_id"
                                :items="staffMembers"
                                fieldKey="xid"
                                fieldName="name"
                                className="filter-user-select"
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
import { axiosAdmin } from "@/common/axiosAdmin";
import common from "@/composable/common";
import fields from "./fields";
import CodrajSelect from "@/components/form/CodrajSelect.vue";

export default {
    components: {
        CodrajSelect,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { formatAmountCurrency, formatDate, permsArray } = common();
        const expenseCateogries = ref([]);
        const staffMembers = ref([]);

        onMounted(() => {
            const expenseCategoriesPromise = axiosAdmin().get(
                "expense-categories?limit=10000"
            );
            const staffMembersPromise = axiosAdmin().get("users?limit=10000");

            Promise.all([expenseCategoriesPromise, staffMembersPromise]).then(
                ([expenseCategoriesResponse, staffMembersResponse]) => {
                    expenseCateogries.value = expenseCategoriesResponse.data;
                    staffMembers.value = staffMembersResponse.data;

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
            expenseCateogries,
            staffMembers,
        };
    },
};
</script>
