<template>
    <f7-page>
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
                <f7-list strong-ios dividers-ios outline-ios>
                      <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.profile_image ? rules.profile_image.message : null
                        "
                    >
                      <template #label>
                                <span class="required-input">*</span>
                                {{ $t("product.image") }}
                            </template>
                        <template #input>
                            <ImageUpload
                                :formData="formData"
                                folder="product"
                                @onFileUploaded="
                                    (file) => {
                                        formData.image = file.file;
                                        formData.image_url = file.file_url;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>
                    <template v-if="permsArray.includes('admin')">
                        <f7-list-input
                            :input="false"
                            error-message-force
                            :error-message="
                                rules.warehouse_id ? rules.warehouse_id.message : null
                            "
                        >
                            <template #label>
                                <span class="required-input">*</span>
                                {{ $t("warehouse.warehouse") }}
                            </template>
                            <template #input :style="{ padding: '0px', margin: '0px' }">
                                <CodrajSelect
                                    :placeholder="
                                        $t('common.select_default_text', [
                                            $t('warehouse.warehouse'),
                                        ])
                                    "
                                    :selectedValue="formData.warehouse_id"
                                    :items="warehouses"
                                    fieldKey="xid"
                                    fieldName="name"
                                    className="warehouse-select"
                                    @changed="
                                        (newVal) => (formData.warehouse_id = newVal)
                                    "
                                />
                            </template>
                        </f7-list-input>
                    </template>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('product.name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                        v-on:keyup="formData.slug = slugify($event.target.value)"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('product.slug')])
                        "
                        error-message-force
                        :error-message="rules.slug ? rules.slug.message : null"
                        v-model:value="formData.slug"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.slug") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.category_id ? rules.category_id.message : null
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.category") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <codraj-select
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('product.category'),
                                    ])
                                "
                                :selectedValue="formData.category_id"
                                :items="categories"
                                fieldKey="xid"
                                fieldName="name"
                                className="category-select"
                                @changed="(newVal) => (formData.category_id = newVal)"
                            />
                        </template>
                    </f7-list-input>
                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="rules.brand_id ? rules.brand_id.message : null"
                    >
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
                                :selectedValue="formData.brand_id"
                                :items="brands"
                                fieldKey="xid"
                                fieldName="name"
                                className="brand-select"
                                @changed="(newVal) => (formData.brand_id = newVal)"
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="rules.unit_id ? rules.unit_id.message : null"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.unit") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <codraj-select
                                :placeholder="
                                    $t('common.select_default_text', [$t('product.unit')])
                                "
                                :selectedValue="formData.unit_id"
                                :items="units"
                                fieldKey="xid"
                                fieldName="name"
                                className="unit-select"
                                @changed="(newVal) => (formData.unit_id = newVal)"
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="number"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('product.quantitiy_alert'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.stock_quantitiy_alert
                                ? rules.stock_quantitiy_alert.message
                                : null
                        "
                        v-model:value="formData.stock_quantitiy_alert"
                    >
                        <template #label>
                            {{ $t("product.quantitiy_alert") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="select"
                        v-model:value="formData.barcode_symbology"
                        :placeholder="
                            $t('common.select_default_text', [
                                $t('product.barcode_symbology'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.barcode_symbology
                                ? rules.barcode_symbology.message
                                : null
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.barcode_symbology") }}
                        </template>

                        <option key="CODE128" value="CODE128">
                            {{ "CODE128" }}
                        </option>
                        <option key="CODE39" value="CODE39">
                            {{ "CODE39" }}
                        </option>
                    </f7-list-input>
                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="rules.item_code ? rules.item_code.message : null"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.item_code") }}
                        </template>
                        <template #input>
                            <div style="display: flex">
                                <f7-input
                                    type="text"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('product.item_code'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.item_code"
                                />
                                <span class="input-suffix">
                                    <div style="display: flex">
                                        <f7-button
                                            tonal
                                            v-if="formData.item_code == ''"
                                            @click="
                                                () =>
                                                    (formData.item_code = parseInt(
                                                        Math.random() * 10000000000
                                                    ))
                                            "
                                            icon-ios="f7:barcode"
                                            icon-md="f7:barcode"
                                        />

                                        <BarcodeScan
                                            class="margin-l5"
                                            @success="
                                                (barcode) =>
                                                    (formData.item_code =
                                                        barcode.rawValue)
                                            "
                                        />
                                    </div>
                                </span>
                            </div>
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title>
            {{ $t("product.price_tax") }}
        </f7-block-title>
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.purchase_price ? rules.purchase_price.message : null
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.purchase_price") }}
                        </template>
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">{{
                                    appSetting.currency.symbol
                                }}</span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('product.purchase_price'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.purchase_price"
                                />
                                <span>
                                    <f7-input
                                        :label="null"
                                        type="select"
                                        v-model:value="formData.purchase_tax_type"
                                        :style="{ width: '100px' }"
                                    >
                                        <option value="inclusive">
                                            {{ $t("common.with_tax") }}
                                        </option>
                                        <option value="exclusive">
                                            {{ $t("common.without_tax") }}
                                        </option>
                                    </f7-input>
                                </span>
                            </div>
                        </template>
                    </f7-list-input>
                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.sales_price ? rules.sales_price.message : null
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("product.sales_price") }}
                        </template>
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">{{
                                    appSetting.currency.symbol
                                }}</span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('product.sales_price'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.sales_price"
                                />
                                <span>
                                    <f7-input
                                        :label="null"
                                        type="select"
                                        v-model:value="formData.sales_tax_type"
                                        :style="{ width: '100px' }"
                                    >
                                        <option value="inclusive">
                                            {{ $t("common.with_tax") }}
                                        </option>
                                        <option value="exclusive">
                                            {{ $t("common.without_tax") }}
                                        </option>
                                    </f7-input>
                                </span>
                            </div>
                        </template>
                    </f7-list-input>
                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="rules.mrp ? rules.mrp.message : null"
                    >
                        <template #label>
                            {{ $t("product.mrp") }}
                        </template>
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">{{
                                    appSetting.currency.symbol
                                }}</span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('product.mrp'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.mrp"
                                />
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="number"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('product.opening_stock'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.opening_stock ? rules.opening_stock.message : null
                        "
                        v-model:value="formData.opening_stock"
                    >
                        <template #label>
                            {{ $t("product.opening_stock") }}
                        </template>
                    </f7-list-input>
                    <f7-list-input
                        :label="$t('product.opening_stock_date')"
                        type="datepicker"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('product.opening_stock_date'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.opening_stock_date
                                ? rules.opening_stock_date.message
                                : null
                        "
                        v-model:value="formData.opening_stock_date"
                        readonly
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('product.description'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.description ? rules.description.message : null
                        "
                        v-model:value="formData.description"
                        :label="$t('product.description')"
                        resizable
                    ></f7-list-input>
                    
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import crud from "@/composable/crud";
import fields from "./fields";
import { some, sumBy, filter, forEach } from "lodash-es";
import BarcodeScan from "../../../components/scanner/BarcodeScan.vue";
import ImageUpload from "../../../components/form/ImageUpload.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        warehouses: {
            default: [],
        },
        item: {
            default: {},
        },
        addEditType: {
            default: "add",
        },
        categories: {
            default: [],
        },
        customFields: {
            default: [],
        },
        units: {
            default: [],
        },
        brands: {
            default: [],
        },
        taxes: {
            default: [],
        },
    },
    components: {
        CodrajSelect,
        BarcodeScan,
        ImageUpload
    },
    setup(props) {
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const {
            formatAmountCurrency,
            appSetting,
            permsArray,
            barcodeSymbology,
            slugify,
        } = common();
        const categoryVisible = ref(false);

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);

            if (
                props.addEditType == "add" ||
                (props.addEditType == "edit" && !props.item.is_walkin_customer)
            ) {
                categoryVisible.value = true;
            }

            if (props.addEditType == "add") {
                crudVariables.formData.value = {
                    ...crudVariables.formData.value,
                    warehouse_id: appStore.selectedWarehouse.xid,
                };
            }
        });

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            slugify,
            categoryVisible,
            appStore,
            barcodeSymbology,
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
