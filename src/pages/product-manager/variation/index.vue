<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
        :with-subnavbar="true"
    >
        <f7-navbar :title="$t('menu.variations')" :back-link="$t('common.back')">
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
            <f7-subnavbar>
                <f7-segmented strong>
                    <f7-button
                        small-md
                        :active="subnavFilterValue == ''"
                        @click="subnavSelected('')"
                    >
                        {{ $t("common.all") }}
                    </f7-button>
                    <f7-button
                        small-md
                        :active="subnavFilterValue == 'receive'"
                        @click="subnavSelected('receive')"
                    >
                        {{ $t("user.to_receive") }}
                    </f7-button>
                    <f7-button
                        small-md
                        :active="subnavFilterValue == 'pay'"
                        @click="subnavSelected('pay')"
                    >
                        {{ $t("user.to_pay") }}
                    </f7-button>
                </f7-segmented>
            </f7-subnavbar>
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable navbar-action-btn"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span
                            v-if="filterApplied"
                            style="
                                position: absolute;
                                top: 0;
                                right: 0;
                                width: 10px;
                                height: 10px;
                                background-color: red;
                                border-radius: 50%;
                            "
                        >
                            &nbsp;
                        </span>
                    </f7-icon>
                </f7-link>
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes('customers_create') ||
                        permsArray.includes('admin')
                    "
                    @click="createItem({ warehouses })"
                    class="navbar-action-btn"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-list media-list strong-ios dividers-ios class="search-list searchbar-found">
            <f7-list-item
                v-for="item in table.data"
                :key="item.xid"
                :title="`${item.name}`"
                :subtitle="item.slug"
                swipeout
                @click="viewItem({ item })"
                :swipeout-opened="swipeOpenItemXid == item.xid"
                @swipeout:deleted="deleteItem(item.xid)"
                @swipeout:open="() => (swipeOpenItemXid = item.xid)"
                @swipeout:close="() => (swipeOpenItemXid = '')"
            >
                <template #text>
                    {{ item.name }}
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
                        <f7-icon f7="ellipsis_vertical"></f7-icon>
                    </f7-link>
                </template>
                <f7-swipeout-actions right>
                    <f7-swipeout-button @click="viewItem({ item })">
                        {{ $t("common.view") }}
                    </f7-swipeout-button>
                    <f7-swipeout-button
                        v-if="
                            permsArray.includes('customers_edit') ||
                            permsArray.includes('admin')
                        "
                        @click="editItem({ item, warehouses, addEditType: 'edit' })"
                    >
                        {{ $t("common.edit") }}
                    </f7-swipeout-button>
                    <f7-swipeout-button
                        v-if="
                            (permsArray.includes('customers_delete') ||
                                permsArray.includes('admin')) &&
                            !item.is_walkin_customer
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

        <f7-fab
            position="right-bottom"
            :style="{ marginBottom: '20px', marginRight: '10px' }"
        >
            <f7-icon
                ios="f7:plus"
                md="material:add"
                v-if="
                    permsArray.includes('customers_create') ||
                    permsArray.includes('admin')
                "
                @click="createItem({ warehouses })"
            ></f7-icon>
        </f7-fab>

        <f7-sheet
            v-model:opened="filterOpened"
            backdrop
            swipe-to-close
            :style="{ height: '50%' }"
        >
            <f7-toolbar>
                <div class="left">Filters</div>
                <div class="right">
                    <f7-link sheet-close>Close</f7-link>
                </div>
            </f7-toolbar>
            <!-- Scrollable sheet content -->
            <f7-page-content>
                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        @change="setUrlData"
                        :label="$t('user.status')"
                        v-model:value="filters.status"
                        type="select"
                        :placeholder="
                            $t('common.select_default_text', [$t('user.status')])
                        "
                    >
                        <option value="">
                            {{ $t("common.all") }}
                        </option>
                        <option value="enabled">
                            {{ $t("common.enabled") }}
                        </option>
                        <option value="disabled">
                            {{ $t("common.disabled") }}
                        </option>
                    </f7-list-input>
                    <f7-list-input :input="false">
                        <template #label>
                            {{ $t("warehouse.warehouse") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <codraj-select
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('warehouse.warehouse'),
                                    ])
                                "
                                :selectedValue="extraFilters.warehouse_id"
                                :items="warehouses"
                                fieldKey="xid"
                                fieldName="name"
                                className="filter-warehouse-select"
                                @changed="
                                    (newVal) => {
                                        filterOpened = true;
                                        extraFilters.warehouse_id = newVal;
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
import { onMounted, ref, watch } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";
import CodrajSelect from "@/components/form/CodrajSelect.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        warehouses: {},
    },
    components: {
        CodrajSelect,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { formatAmountCurrency, permsArray } = common();
        const warehouses = ref([]);
        const swipeOpenItemXid = ref("");

        onMounted(() => {
            const warehousesPromise = axiosAdmin().get("warehouses?limit=10000");

            Promise.all([warehousesPromise]).then(([warehousesResponse]) => {
                warehouses.value = warehousesResponse.data;
                datatableVariables.fetch({
                    page: 1,
                });
            });
        });

        const swipeClicked = (xid) => {};

        return {
            ...datatableVariables,
            formatAmountCurrency,
            permsArray,

            warehouses,
            swipeOpenItemXid,
            swipeClicked,
        };
    },
};
</script>
