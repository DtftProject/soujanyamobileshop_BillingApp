<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
        :with-subnavbar="true"
    >
        <f7-navbar :title="$t('menu.users_reports')" :back-link="$t('common.back')">
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
                        :active="tableUrl.url == 'customers'"
                        @click="
                            () => {
                                tableUrl.url = 'customers';
                                setUrlData();
                            }
                        "
                    >
                        {{ $t("menu.customers") }}
                    </f7-button>
                    <f7-button
                        small-md
                        :active="tableUrl.url == 'suppliers'"
                        @click="
                            () => {
                                tableUrl.url = 'suppliers';
                                setUrlData();
                            }
                        "
                    >
                        {{ $t("menu.suppliers") }}
                    </f7-button>
                </f7-segmented>
            </f7-subnavbar>
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-card footer-divider v-for="item in table.data" :key="item.xid">
            <f7-card-content :padding="false">
                <f7-list media-list>
                    <f7-list-item
                        :title="item.name"
                        :subtitle="
                            item.user_type == 'customers'
                                ? $t(`stock.customer`)
                                : $t('stock.supplier')
                        "
                    >
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="item.profile_image_url"
                                width="48"
                                height="48"
                            />
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
            <f7-card-footer>
                <div style="width: 100%">
                    <table style="width: 100%">
                        <thead>
                            <tr>
                                <td class="text-bold">#</td>
                                <td class="text-bold text-right">
                                    {{ $t("common.total") }}
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ $t("menu.purchase") }}</td>
                                <td class="text-right">
                                    {{ item.details?.purchase_order_count }}
                                </td>
                            </tr>
                            <tr>
                                <td>{{ $t("menu.sales") }}</td>
                                <td class="text-right">
                                    {{ item.details?.sales_order_count }}
                                </td>
                            </tr>
                            <tr>
                                <td>{{ $t("menu.purchase_returns") }}</td>
                                <td class="text-right">
                                    {{ item.details?.purchase_return_count }}
                                </td>
                            </tr>

                            <tr>
                                <td>{{ $t("menu.sales_returns") }}</td>
                                <td class="text-right">
                                    {{ item.details?.sales_return_count }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            width: 100%;
                            margin-top: 10px;
                            padding-top: 10px;
                            border-top: 1px solid var(--f7-card-header-border-color);
                        "
                    >
                        <span>
                            {{ $t("payments.total_amount") }} <br />
                            {{ formatAmountCurrency(item.details.total_amount) }}
                        </span>

                        <span>
                            {{ $t("payments.paid_amount") }} <br />
                            {{ formatAmountCurrency(item.details.paid_amount) }}
                        </span>

                        <span>
                            {{ $t("payments.due_amount") }} <br />
                            {{ formatAmountCurrency(item.details.due_amount) }}
                        </span>
                    </div>
                </div>
            </f7-card-footer>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { formatAmountCurrency, permsArray, formatDateTime } = common();

        onMounted(() => {
            datatableVariables.fetch({
                page: 1,
            });
        });

        return {
            ...datatableVariables,
            formatAmountCurrency,
            formatDateTime,
            permsArray,
        };
    },
};
</script>
