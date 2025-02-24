<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
        :with-subnavbar="true"
    >
        <f7-navbar :title="$t('menu.cash_bank')" :back-link="$t('common.back')">
            <f7-subnavbar>
                <f7-segmented strong>
                    <f7-button
                        small-md
                        :active="subnavFilterValue == 'cash'"
                        @click="subnavSelected('cash')"
                    >
                        {{ $t("payments.cash") }}
                    </f7-button>
                    <f7-button
                        small-md
                        :active="subnavFilterValue == 'bank'"
                        @click="subnavSelected('bank')"
                    >
                        {{ $t("payments.bank") }}
                    </f7-button>
                </f7-segmented>
            </f7-subnavbar>
            <f7-nav-right> </f7-nav-right>
        </f7-navbar>

        <f7-card header-divider footer-divider v-for="item in table.data" :key="item.xid">
            <f7-card-header style="font-weight: bold; font-size: 14px">
                {{ formatDate(item.date) }}
            </f7-card-header>
            <f7-card-content :padding="false">
                <f7-list media-list>
                    <f7-list-item
                        :title="item.payment_number"
                        :subtitle="item.user?.name"
                    >
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="item.user?.profile_image_url"
                                width="48"
                                height="48"
                            />
                        </template>
                        <template #after>
                            {{ formatAmountCurrency(item.amount) }}
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
            <f7-card-footer>
                <span>{{ item.payment_mode?.name }}</span>

                <f7-chip
                    :text="$t(`menu.payment_${item.payment_type}`)"
                    :color="item.payment_type == 'in' ? 'green' : 'red'"
                    style="
                        font-size: 12px;
                        padding: 5px;
                        border-radius: 3px;
                        height: 20px;
                    "
                />
            </f7-card-footer>
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
        const warehouses = ref([]);
        const users = ref([]);

        onMounted(() => {
            // console.log(props.f7router.history, "customer-index");
            const warehousesPromise = axiosAdmin().get("warehouses?limit=10000");
            const usersPromise = axiosAdmin().post("customer-suppliers");

            Promise.all([warehousesPromise, usersPromise]).then(
                ([warehousesResponse, usersResponse]) => {
                    warehouses.value = warehousesResponse.data;
                    users.value = usersResponse.data;
                    datatableVariables.table.sorter = { field: "date", order: "desc" };
                    datatableVariables.exportDetails.value = {
                        allowExport: true,
                        exportType: "payment_reports",
                    };
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

            warehouses,
        };
    },
};
</script>
