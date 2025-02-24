<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.stock_summary')" :back-link="$t('common.back')">
            <f7-nav-right>
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-card header-divider footer-divider v-for="item in table.data" :key="item.xid">
            <f7-card-content :padding="false">
                <f7-list media-list>
                    <f7-list-item
                        :title="`${item.name}`"
                        :subtitle="`${item.category?.name} » ${item.brand?.name}`"
                    >
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="item.image_url"
                                width="48"
                                height="48"
                            />
                        </template>
                        <template #after>
                            {{ item.details.current_stock }}{{ item.unit.short_name }}
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
            <f7-card-footer>
                <table style="width: 100%">
                    <thead>
                        <tr>
                            <td class="text-bold">#</td>
                            <td class="text-bold">{{ $t("product.price") }}</td>
                            <td class="text-right text-bold">
                                {{ $t("product.stock_value") }}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ $t("menu.purchase") }}</td>
                            <td>
                                {{ formatAmountCurrency(item.details?.purchase_price) }}
                            </td>
                            <td class="text-right">
                                {{
                                    formatAmountCurrency(
                                        item.details.current_stock *
                                            item.details.purchase_price
                                    )
                                }}
                            </td>
                        </tr>
                        <tr>
                            <td>{{ $t("menu.sales") }}</td>
                            <td>
                                {{ formatAmountCurrency(item.details?.sales_price) }}
                            </td>
                            <td class="text-right">
                                {{
                                    formatAmountCurrency(
                                        item.details.current_stock *
                                            item.details.sales_price
                                    )
                                }}
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                                    :selectedValue="filters.category_id"
                                    :items="categories"
                                    fieldKey="xid"
                                    fieldName="name"
                                    className="filter-cateogry-select"
                                    @changed="
                                        (newVal) => {
                                            filterOpened = true;
                                            filters.category_id = newVal;
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
                                {{ $t("product.brand") }}
                            </template>
                            <template #input :style="{ padding: '0px', margin: '0px' }">
                                <CodrajSelect
                                    :placeholder="
                                        $t('common.select_default_text', [
                                            $t('product.brand'),
                                        ])
                                    "
                                    :selectedValue="filters.brand_id"
                                    :items="brands"
                                    fieldKey="xid"
                                    fieldName="name"
                                    className="filter-brand-select"
                                    @changed="
                                        (newVal) => {
                                            filterOpened = true;
                                            filters.brand_id = newVal;
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
        const { formatAmountCurrency, permsArray, formatDateTime } = common();
        const categories = ref([]);
        const brands = ref([]);

        onMounted(() => {
            const categoriesPromise = axiosAdmin().get("categories?limit=10000");
            const brandsPromise = axiosAdmin().get("brands?limit=10000");

            Promise.all([categoriesPromise, brandsPromise]).then(
                ([categoriesResponse, brandsResponse]) => {
                    categories.value = categoriesResponse.data;
                    brands.value = brandsResponse.data;
                    datatableVariables.fetch({
                        page: 1,
                    });
                }
            );
        });

        return {
            ...datatableVariables,
            formatAmountCurrency,
            formatDateTime,
            permsArray,

            categories,
            brands,
        };
    },
};
</script>
