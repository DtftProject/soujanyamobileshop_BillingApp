<template>
    <f7-page name="stock_adjustment-add-edit">
        <f7-navbar
            :title="$t(`${fieldsVar.langKey}.${addEditType}`)"
            :back-link="$t('common.back')"
        >
            <f7-nav-right>
                <f7-button @click="onSubmit">
                    {{ $t("common.save") }}
                </f7-button>
            </f7-nav-right>
        </f7-navbar>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list
                    strong-ios
                    dividers-ios
                    outline-ios
                    :style="{ marginTop: '0px' }"
                >
                    <f7-list-input
                        :input="false"
                        type="select"
                        error-message-force
                        :error-message="
                            rules.product_id ? rules.product_id.message : null
                        "
                        v-model:value="formData.product_id"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.product") }}
                        </template>
                        <template #input>
                            <div @click="() => (productModalVisible = true)">
                                <div style="margin-top: 10px; margin-bottom: 10px">
                                    <span v-if="productName != ''">
                                        {{ productName }}
                                    </span>
                                    <span
                                        v-else
                                        style="
                                            color: var(--f7-list-item-after-text-color);
                                        "
                                    >
                                        {{
                                            $t("common.select_default_text", [
                                                $t("product.product"),
                                            ])
                                        }}
                                    </span>
                                </div>
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('stock_adjustment.current_stock'),
                            ])
                        "
                        v-model:value="stockValue"
                        disabled
                    >
                        <template #label>
                            <span class="required-input"></span>
                            {{ $t("stock_adjustment.current_stock") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="rules.quantity ? rules.quantity.message : null"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("stock_adjustment.quantity") }}
                        </template>
                        <template #input>
                            <div style="display: flex">
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('stock_adjustment.quantity'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.quantity"
                                />
                                <span>
                                    <f7-input
                                        :label="null"
                                        type="select"
                                        v-model:value="formData.adjustment_type"
                                        :style="{ width: '100px' }"
                                    >
                                        <option value="add">
                                            {{ $t("stock_adjustment.adjustment_add") }}
                                        </option>
                                        <option value="subtract">
                                            {{
                                                $t("stock_adjustment.adjustment_subtract")
                                            }}
                                        </option>
                                    </f7-input>
                                </span>
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('stock_adjustment.notes'),
                            ])
                        "
                        error-message-force
                        :error-message="rules.notes ? rules.notes.message : null"
                        v-model:value="formData.notes"
                        :label="$t('stock_adjustment.notes')"
                        resizable
                    ></f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-popup v-model:opened="productModalVisible" class="demo-popup">
            <f7-page :with-subnavbar="true">
                <f7-navbar :title="$t('product.product')">
                    <f7-subnavbar :inner="false">
                        <f7-searchbar
                            search-container=".search-list"
                            search-in=".item-title, .item-text"
                        ></f7-searchbar>
                    </f7-subnavbar>
                    <f7-nav-right>
                        <f7-link popup-close>{{ $t("common.close") }}</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-card v-for="product in products" :key="product.xid">
                    <f7-card-content :padding="false">
                        <f7-list
                            media-list
                            strong-ios
                            dividers-ios
                            class="search-list searchbar-found"
                        >
                            <f7-list-item
                                :title="product.name"
                                :text="product.item_code"
                                link="#"
                                @click="
                                    () => {
                                        formData.product_id = product.xid;
                                        productName = product.name;
                                        getStockValue();
                                    }
                                "
                            >
                                <template #media>
                                    <img
                                        style="border-radius: 8px"
                                        :src="product.image_url"
                                        width="28"
                                        height="28"
                                    />
                                </template>
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-page>
        </f7-popup>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import crud from "@/composable/crud";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        products: {
            default: [],
        },
        item: {
            default: {},
        },
        addEditType: {
            default: "add",
        },
    },
    components: {
        CodrajSelect,
    },
    setup(props) {
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const { formatAmountCurrency, appSetting, permsArray } = common();
        const productModalVisible = ref(false);
        const stockValue = ref("-");
        const productName = ref("");

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);

            if (props.addEditType == "edit") {
                productName.value = props.item.product?.name;
                getStockValue();
            }
        });

        const getStockValue = () => {
            if (crudVariables.formData.value.product_id != "") {
                axiosAdmin()
                    .post("product-warehouse-stock", {
                        warehouse_id: appStore.selectedWarehouse.xid,
                        product_id: crudVariables.formData.value.product_id,
                    })
                    .then((response) => {
                        stockValue.value = response.data.stock;
                    });
            } else {
                stockValue.value = "-";
                productName.value = "";
            }
            productModalVisible.value = false;
        };

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            appStore,

            productModalVisible,
            getStockValue,
            stockValue,
            productName,
        };
    },
};
</script>

<style scoped>
.required-input {
    color: red;
}

.input-prefix {
    margin-top: 8px;
    margin-right: 5px;
}

.input-suffix {
    margin-top: 8px;
    margin-left: 5px;
}

.warehouse-class .item-content {
    padding: 0px !important;
}
</style>
