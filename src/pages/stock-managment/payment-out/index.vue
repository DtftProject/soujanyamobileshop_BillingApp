<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.payment_out')" :back-link="$t('common.back')">
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable navbar-action-btn"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes('payment_out_create') ||
                        permsArray.includes('admin')
                    "
                    @click="
                        createItem({
                            paymentModes,
                            users,
                            addEditType: 'add',
                        })
                    "
                    class="navbar-action-btn"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-card v-for="item in table.data" :key="item.xid">
            <f7-card-content :padding="false">
                <f7-list media-list>
                    <f7-list-item
                        :title="`${item.payment_number}`"
                        swipeout
                        @click="viewItem({ item })"
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="assignSwipeXId(item.xid)"
                        @swipeout:close="assignSwipeXId('')"
                    >
                        <template #subtitle>
                            {{ formatDate(item.date) }}
                        </template>
                        <template #text>
                            {{ formatAmountCurrency(item.amount) }} » {{ item.user.name }}
                        </template>

                        <template #after>
                            <f7-link
                                v-if="swipeOpenItemXid != item.xid"
                                @click="
                                    (event) => {
                                        event.stopPropagation();
                                        assignSwipeXId(item.xid);
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
                                    permsArray.includes('payment_out_edit') ||
                                    permsArray.includes('admin')
                                "
                                @click="
                                    editItem({
                                        item,
                                        paymentModes,
                                        users,
                                        addEditType: 'edit',
                                    })
                                "
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    (permsArray.includes('payment_out_delete') ||
                                        permsArray.includes('admin')) &&
                                    !item.is_walkin_customer
                                "
                                delete
                                :confirm-title="$t('common.delete')"
                                :confirm-text="$t(`payments.delete_message`)"
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
                            {{ $t("user.user") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <codraj-select
                                :placeholder="
                                    $t('common.select_default_text', [$t('user.user')])
                                "
                                :selectedValue="filters.user_id"
                                :items="users"
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
        const paymentModes = ref([]);
        const users = ref([]);

        onMounted(() => {
            const usersPromise = axiosAdmin().post("customer-suppliers");
            const paymentsPromise = axiosAdmin().get("payment-modes?limit=10000");

            Promise.all([usersPromise, paymentsPromise]).then(
                ([usersResponse, paymentsResponse]) => {
                    users.value = usersResponse.data;
                    paymentModes.value = paymentsResponse.data;

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

            users,
            paymentModes,
        };
    },
};
</script>
