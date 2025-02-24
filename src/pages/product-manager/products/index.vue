<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.products')" back-link="Back">
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
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes('products_create') ||
                        permsArray.includes('admin')
                    "
                    @click="
                        createItem({
                            warehouses,
                            brands,
                            units,
                            taxes,
                            categories,
                            customFields,
                        })
                    "
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
                        :title="`${item.name}`"
                        @click="viewItem({ item })"
                        swipeout
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="assignSwipeXId(item.xid)"
                        @swipeout:close="assignSwipeXId('')"
                    >
                        <template #text>
                            {{ formatAmountCurrency(item.details.sales_price) }} »
                            <span
                                :style="{
                                    color:
                                        item.details.status == 'out_of_stock'
                                            ? 'red'
                                            : 'green',
                                }"
                            >
                                {{
                                    `${item.details.current_stock}
                                ${item.unit.short_name}`
                                }}
                            </span>
                        </template>
                        <template #subtitle>
                            {{ item.category?.name }} » {{ item.brand?.name }}
                        </template>
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="item.image_url"
                                width="60"
                                height="60"
                            />
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
                                    permsArray.includes('products_edit') ||
                                    permsArray.includes('admin')
                                "
                                @click="
                                    editItem({
                                        item,
                                        warehouses,
                                        brands,
                                        units,
                                        taxes,
                                        categories,
                                        customFields,
                                        addEditType: 'edit',
                                    })
                                "
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    (permsArray.includes('products_delete') ||
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
                            {{ $t("product.brand") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <codraj-select
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

                    <f7-list-input :input="false">
                        <template #label>
                            {{ $t("product.category") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <codraj-select
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('product.category'),
                                    ])
                                "
                                :selectedValue="filters.category_id"
                                :items="categories"
                                fieldKey="xid"
                                fieldName="name"
                                className="filter-category-select"
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
                </f7-list>
            </f7-page-content>
        </f7-sheet>
    </f7-page>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { f7, f7ready } from "framework7-vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import { height } from "dom7";

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
        const categories = ref([]);
        const warehouses = ref([]);
        const brands = ref([]);

        const units = ref([]);
        const taxes = ref([]);
        const customFields = ref([]);

        onMounted(() => {
            const warehousesPromise = axiosAdmin().get("warehouses?limit=10000");
            const categoriesPromise = axiosAdmin().get("categories?limit=10000");
            const brandsPromise = axiosAdmin().get("brands?limit=10000");
            const unitsPromise = axiosAdmin().get("units?limit=10000");
            const taxesPromise = axiosAdmin().get("taxes?limit=10000");
            const customFieldsPromise = axiosAdmin().get("custom-fields?limit=10000");
            Promise.all([
                warehousesPromise,
                categoriesPromise,
                brandsPromise,
                unitsPromise,
                taxesPromise,
                customFieldsPromise,
            ]).then(
                ([
                    warehousesResponse,
                    categoriesResponse,
                    brandsResponse,
                    unitsResponse,
                    taxesResponse,
                    customResponse,
                ]) => {
                    warehouses.value = warehousesResponse.data;
                    categories.value = categoriesResponse.data;
                    units.value = unitsResponse.data;
                    brands.value = brandsResponse.data;
                    taxes.value = taxesResponse.data;
                    customFields.value = customResponse.data;
                    datatableVariables.fetch({
                        page: 1,
                    });
                }
            );
        });

        return {
            ...datatableVariables,
            formatAmountCurrency,
            permsArray,

            warehouses,
            categories,
            brands,
            units,
            customFields,
            taxes,
        };
    },
};
</script>
