<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.rate_list')" :back-link="$t('common.back')">
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-card header-divider footer-divider v-for="item in table.data" :key="item.xid">
            <f7-card-header style="font-weight: bold; font-size: 14px">
                {{ item.category?.name }} » {{ item.brand?.name }}
            </f7-card-header>
            <f7-card-content :padding="false">
                <f7-list media-list>
                    <f7-list-item :title="item.name" :subtitle="item.item_code">
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="item.image_url"
                                width="48"
                                height="48"
                            />
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
            <f7-card-footer>
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                    "
                >
                    <span>
                        {{ $t("product.mrp") }} :
                        {{ formatAmountCurrency(item.details?.mrp) }}
                    </span>

                    <span>
                        {{ $t("product.sales_price") }} :
                        {{ formatAmountCurrency(item.details?.sales_price) }}
                    </span>
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
