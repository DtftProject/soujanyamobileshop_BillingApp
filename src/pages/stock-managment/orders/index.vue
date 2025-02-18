<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar
            :title="$t(`menu.${orderPageObject.menuKey}`)"
            :back-link="$t('common.back')"
        >
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
                        permsArray.includes(`${orderPageObject.permission}_create`) ||
                        permsArray.includes('admin')
                    "
                    @click="
                        createItem({
                            warehouses,
                            allUnits,
                            taxes,
                            products,
                            users,
                            orderType: orderPageObject.type,
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
                        :title="`${item.user.name}`"
                        @click="viewItem({ item })"
                        swipeout
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="assignSwipeXId(item.xid)"
                        @swipeout:close="assignSwipeXId('')"
                    >
                        <template #header>
                            <span
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    font-size: var(--f7-list-item-text-font-size);
                                    color: var(--f7-list-item-title-text-color);
                                    border-top: 1px solide black;
                                    margin-bottom: 5px;
                                "
                            >
                                <PaymentStatus :paymentStatus="item.payment_status" />
                                <span
                                    style="
                                        color: var(--f7-list-item-text-text-color);
                                        margin-top: 3px;
                                    "
                                    >{{ item.invoice_number }}</span
                                >
                            </span>
                        </template>

                        <template #inner>
                            <span
                                class="margin-t5 margin-b5"
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    font-size: var(--f7-list-item-text-font-size);
                                    color: var(--f7-list-item-text-text-color);
                                "
                            >
                                <span>
                                    {{ $t("invoice.total") }} :
                                    {{ formatAmountCurrency(item.total) }}
                                </span>
                                <span>
                                    {{ $t("payments.paid") }} :
                                    {{ formatAmountCurrency(item.paid_amount) }}
                                </span>
                            </span>
                        </template>
                        <template #text>
                            <div class="margin-t5">
                                <f7-icon f7="calendar" size="18"></f7-icon>
                                {{ formatDateTime(item.order_date) }}
                            </div>
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
                                    permsArray.includes(
                                        `${orderPageObject.permission}_edit`
                                    ) || permsArray.includes('admin')
                                "
                                @click="
                                    editItem({
                                        item,
                                        warehouses,
                                        allUnits,
                                        taxes,
                                        products,
                                        users,
                                        orderType: orderPageObject.type,
                                        addEditType: 'edit',
                                    })
                                "
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    (permsArray.includes(
                                        `${orderPageObject.permission}_delete`
                                    ) ||
                                        permsArray.includes('admin')) &&
                                    item.payment_status == 'unpaid'
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
            <f7-card-footer>
                <f7-icon
                    f7="arrow_down_doc"
                    size="20px"
                    color="blue"
                    @click="downloadPdf(item)"
                ></f7-icon>
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
                    <f7-list-input :input="false">
                        <template #label>
                            {{ $t(`${orderPageObject.langKey}.user`) }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t(`${orderPageObject.langKey}.user`),
                                    ])
                                "
                                :selectedValue="filters.user_id"
                                :items="users"
                                fieldKey="xid"
                                fieldName="name"
                                className="filter-customer-category-select"
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
import { onMounted, ref, watch } from "vue";
import { Share } from "@capacitor/share";
import { f7 } from "framework7-vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import datatable from "@/composable/datatable";
import { useAppStore } from "../../../stores/appStore";
import common from "@/composable/common";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import PaymentStatus from "../../../components/order/PaymentStatus.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        orderType: {
            default: "sales",
        },
    },
    components: {
        CodrajSelect,
        PaymentStatus,
    },
    setup(props) {
        const appStore = useAppStore();
        const fieldsVar = fields(props.orderType);
        const orderPageObject = fieldsVar.orderPageObject;
        const datatableVariables = datatable(fieldsVar);
        const {
            formatAmountCurrency,
            permsArray,
            formatDateTime,
            selectedWarehouse,
        } = common();
        const warehouses = ref([]);
        const taxes = ref([]);
        const allUnits = ref([]);
        const products = ref([]);
        const users = ref([]);

        onMounted(() => {
            const taxesPromise = axiosAdmin().get("taxes?limit=10000");
            const unitsPromise = axiosAdmin().get("units?limit=10000");
            const usersPromise = axiosAdmin().get(
                `${orderPageObject.userType}?limit=10000`
            );
            const productsPromise = axiosAdmin().get(
                `products?fields=id,xid,name,slug,product_type,barcode_symbology,item_code,image,image_url,category_id,x_category_id,category{id,xid,name},brand_id,x_brand_id,brand{id,xid,name},unit_id,x_unit_id,unit{id,xid,name,short_name},description,details{stock_quantitiy_alert,opening_stock,opening_stock_date,wholesale_price,wholesale_quantity,mrp,purchase_price,sales_price,tax_id,x_tax_id,purchase_tax_type,sales_tax_type,current_stock,warehouse_id,x_warehouse_id,status},details:tax{id,xid,name,rate},details:warehouse{id,xid,name},customFields{id,xid,field_name,field_value},warehouse_id,x_warehouse_id,warehouse{id,xid}&order=${encodeURIComponent(
                    "id desc"
                )}&limit=10`
            );
            const warehousesPromise = axiosAdmin().get(
                `warehouses?filters=id ne "${selectedWarehouse.xid}"&hashable=${selectedWarehouse.xid}&limit=10000`
            );

            Promise.all([
                warehousesPromise,
                taxesPromise,
                unitsPromise,
                usersPromise,
                productsPromise,
            ]).then(
                ([
                    warehousesResponse,
                    taxResponse,
                    unitResponse,
                    usersResponse,
                    productsResponse,
                ]) => {
                    warehouses.value = warehousesResponse.data;
                    taxes.value = taxResponse.data;
                    allUnits.value = unitResponse.data;
                    products.value = productsResponse.data;
                    users.value = usersResponse.data;
                    datatableVariables.fetch({
                        page: 1,
                    });
                }
            );
        });

        const downloadPdf = async (item) => {
            f7.preloader.show();

            try {
                const pdfUrl = `https://demo.stockifly.in/api/v1/pdf/${item.unique_id}/en`;

                // Download the PDF file
                const response = await fetch(pdfUrl);
                const pdfData = await response.blob();

                // Generate a unique filename
                const filename = `${item.invoice_number}.pdf`;

                // Write the PDF data to application storage
                await Filesystem.writeFile({
                    path: filename,
                    directory: Directory.Documents,
                    data: await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(pdfData);
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                    }),
                });

                // Get the local file URI
                // const fileUri = `file://${Filesystem.documentsDirectory}/${filename}`;

                const uri = await Filesystem.getUri({
                    directory: Directory.Documents,
                    path: filename,
                });

                f7.preloader.hide();

                // Share the PDF using the Share plugin
                await Share.share({
                    title: "Share PDF",
                    files: [uri.uri],
                });
            } catch (error) {
                f7.preloader.hide();
                console.error("Error sharing PDF:", error);
            } finally {
                // Hide F7 loader
                f7.preloader.hide();
            }
        };

        return {
            ...datatableVariables,
            formatAmountCurrency,
            permsArray,

            warehouses,
            taxes,
            allUnits,
            products,
            users,

            formatDateTime,

            orderPageObject,

            downloadPdf,
        };
    },
};
</script>
