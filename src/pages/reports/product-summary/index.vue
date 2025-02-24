<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar
            :title="$t('menu.product_sales_summary')"
            :back-link="$t('common.back')"
        >
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="customSearch"
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
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <template v-for="item in table.data" :key="item.xid">
            <f7-card
                header-divider
                footer-divider
                v-if="
                    customSearchVisible || (!customSearchVisible && item && item.visible)
                "
            >
                <f7-card-header style="font-weight: bold; font-size: 14px">
                    {{ $t("product.unit_sold") }} :
                    {{ `${item.unit_sold}${item.product?.unit?.short_name}` }}
                </f7-card-header>
                <f7-card-content :padding="false">
                    <f7-list media-list>
                        <f7-list-item :title="item.name" :subtitle="item.item_code">
                            <template #media>
                                <img
                                    style="border-radius: 8px"
                                    :src="item.product.image_url"
                                    width="48"
                                    height="48"
                                />
                            </template>
                        </f7-list-item>
                    </f7-list>
                </f7-card-content>
                <f7-card-footer>
                    <span>
                        {{ $t("product.total_purchase_price") }} <br />
                        {{
                            formatAmountCurrency(
                                item.unit_sold * item.product.details.purchase_price
                            )
                        }}
                    </span>

                    <span>
                        {{ $t("product.total_sales_price") }} <br />
                        {{ formatAmountCurrency(item.total_sales_price) }}
                    </span>
                </f7-card-footer>
            </f7-card>
        </template>

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
                            {{ $t("category.category") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('category.category'),
                                    ])
                                "
                                :selectedValue="extraFilters.category_id"
                                :items="categories"
                                fieldKey="xid"
                                fieldName="name"
                                className="filter-cateogry-select"
                                @changed="
                                    (newVal) => {
                                        filterOpened = true;
                                        extraFilters.category_id = newVal;
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
import PaymentStatus from "../../../components/order/PaymentStatus.vue";
import { forEach, includes, debounce } from "lodash-es";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    components: {
        CodrajSelect,
        PaymentStatus,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { formatAmountCurrency, permsArray, formatDateTime } = common();
        const warehouses = ref([]);
        const categories = ref([]);
        const customSearchVisible = ref(true);

        onMounted(() => {
            const categoriesPromise = axiosAdmin().get("categories?limit=10000");

            Promise.all([categoriesPromise]).then(([categoriesResponse]) => {
                categories.value = categoriesResponse.data;

                datatableVariables.fetch({
                    page: 1,
                });
            });
        });

        const customSearch = debounce(
            (searchbar, searchbarQuery, searchbarPreviousQuery) => {
                if (searchbarQuery == "") {
                    customSearchVisible.value = true;
                } else {
                    customSearchVisible.value = false;
                    forEach(datatableVariables.table.data, function (value, key) {
                        value.visible =
                            includes(
                                value.name.toLowerCase(),
                                searchbarQuery.toLowerCase()
                            ) ||
                            includes(
                                value.item_code.toLowerCase(),
                                searchbarQuery.toLowerCase()
                            ) ||
                            searchbarQuery == "";
                    });
                }
            },
            400
        );

        return {
            ...datatableVariables,
            formatAmountCurrency,
            formatDateTime,
            permsArray,

            categories,

            customSearch,
            customSearchVisible,
        };
    },
};
</script>
