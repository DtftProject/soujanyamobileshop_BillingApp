<template>
    <f7-page>
        <f7-navbar :title="$t('menu.profit_loss')" :back-link="$t('common.back')">
            <f7-nav-right>
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-card header-divider footer-divider>
            <f7-card-header style="font-weight: bold; font-size: 14px">
                {{ $t("common.profit_reports_by_orders") }}
            </f7-card-header>
            <f7-card-content>
                <table style="width: 100%">
                    <thead>
                        <tr>
                            <td class="text-bold">{{ $t("common.particulars") }}</td>
                            <td class="text-right text-bold">
                                {{ $t("common.amount") }}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ $t("menu.sales") }} (+)</td>
                            <td class="text-right">
                                {{ formatAmountCurrency(reportData.sales) }}
                            </td>
                        </tr>
                        <tr>
                            <td>{{ $t("menu.purchases") }} (-)</td>
                            <td class="text-right">
                                {{ formatAmountCurrency(reportData.purchases) }}
                            </td>
                        </tr>
                        <tr>
                            <td>{{ $t("menu.purchase_returns") }} (+)</td>
                            <td class="text-right">
                                {{ formatAmountCurrency(reportData.purchase_returns) }}
                            </td>
                        </tr>
                        <tr>
                            <td>{{ $t("menu.sales_returns") }} (-)</td>
                            <td class="text-right">
                                {{ formatAmountCurrency(reportData.sales_returns) }}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {{ $t("stock_transfer.stock_transfer_transfered") }} (+)
                            </td>
                            <td class="text-right">
                                {{
                                    formatAmountCurrency(
                                        reportData.stock_transfer_transfered
                                    )
                                }}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {{ $t("stock_transfer.stock_transfer_received") }} (-)
                            </td>
                            <td class="text-right">
                                {{
                                    formatAmountCurrency(
                                        reportData.stock_transfer_received
                                    )
                                }}
                            </td>
                        </tr>
                        <tr>
                            <td>{{ $t("menu.expenses") }} (-)</td>
                            <td class="text-right">
                                {{ formatAmountCurrency(reportData.expenses) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </f7-card-content>
            <f7-card-footer style="font-weight: bold; font-size: 14px">
                <span>{{ $t("common.profit") }}</span>
                <span
                    :class="[
                        'text-right',
                        reportData.profit > 0 ? 'text-green' : 'text-red',
                    ]"
                >
                    {{ formatAmountCurrency(reportData.profit) }}</span
                >
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
                        id="input-filterCal"
                        input-id="filterCal"
                        ref="filterCal"
                        type="datepicker"
                        :label="$t('common.select_default_text', [$t('common.date')])"
                        :placeholder="
                            $t('common.select_default_text', [$t('common.date')])
                        "
                        clear-button
                        readonly
                        :calendar-params="{
                            locale: 'en-GB',
                            rangePicker: true,
                            openIn: 'customModal',
                            footer: true,
                            formatValue: (allValues) => {
                                let newFormat = formatRangeValueFunciton(allValues);
                                if (newFormat && newFormat[1] && newFormat[3]) {
                                    filters.dates = [newFormat[1], newFormat[3]];
                                    filterApplied = true;
                                } else {
                                    filters.dates = [];
                                }

                                getData();

                                return newFormat && newFormat[0] && newFormat[2]
                                    ? `${newFormat[0]} » ${newFormat[2]}`
                                    : '';
                            },
                        }"
                    />
                </f7-list>
            </f7-page-content>
        </f7-sheet>
    </f7-page>
</template>

<script>
import { onMounted, ref, reactive } from "vue";
import common from "@/composable/common";
import { axiosAdmin } from "@/common/axiosAdmin";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import { f7 } from "framework7-vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    components: {
        CodrajSelect,
    },
    setup(props) {
        const {
            formatAmountCurrency,
            permsArray,
            formatDate,
            formatRangeValueFunciton,
        } = common();
        const reportData = ref([]);
        const dateWiseReportResults = ref([]);
        const filters = reactive({
            dates: [],
            active_report_type: "daily_income",
        });

        const filterOpened = ref(false);
        const filterApplied = ref(false);
        const filterCal = ref(null);

        onMounted(() => {
            getData();
        });

        const getData = () => {
            axiosAdmin()
                .post("reports/profit-loss", filters)
                .then((response) => {
                    reportData.value = response.data.results;
                    dateWiseReportResults.value = response.data.dates;
                });
        };

        const openFilters = () => {
            filterOpened.value = true;
        };

        const clearFilters = () => {
            filters.dates = [];
            filterApplied.value = false;
        };

        return {
            formatAmountCurrency,
            formatDate,
            permsArray,
            formatRangeValueFunciton,

            getData,
            reportData,
            dateWiseReportResults,

            filters,
            filterOpened,
            filterApplied,
            openFilters,
            clearFilters,

            filterCal,
        };
    },
};
</script>

<style scoped>
th,
td {
    padding-top: 10px;
}
</style>
