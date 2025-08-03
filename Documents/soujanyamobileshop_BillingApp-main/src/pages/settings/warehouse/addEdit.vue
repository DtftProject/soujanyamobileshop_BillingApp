<template>
    <f7-page>
        <f7-navbar
            :title="$t(`${fieldsVar.langKey}.${addEditType}`)"
            :back-link="$t('common.back')"
        >
            <f7-nav-right>
                <f7-button @click="submitForm">
                    {{ $t("common.save") }}
                </f7-button>
            </f7-nav-right>
        </f7-navbar>

        <f7-toolbar top tabbar>
            <f7-link tab-link="#tab-1" tab-link-active>{{
                $t("warehouse.basic_details")
            }}</f7-link>
            <f7-link tab-link="#tab-2"> {{ $t("warehouse.visibility") }}</f7-link>
            <f7-link tab-link="#tab-3">{{ $t("menu.pos_settings") }}</f7-link>
        </f7-toolbar>
        <f7-tabs>
            <f7-tab id="tab-1" tab-active>
                <f7-card>
                    <f7-card-content :padding="false">
                        <f7-list strong-ios dividers-ios outline-ios>
                            <f7-list-input
                                type="text"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('warehouse.name'),
                                    ])
                                "
                                error-message-force
                                :error-message="rules.name ? rules.name.message : null"
                                v-model:value="formData.name"
                                v-on:keyup="formData.slug = slugify($event.target.value)"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("warehouse.name") }}
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                type="text"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('warehouse.slug'),
                                    ])
                                "
                                error-message-force
                                :error-message="rules.slug ? rules.slug.message : null"
                                v-model:value="formData.slug"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("warehouse.slug") }}
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                type="email"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('warehouse.email'),
                                    ])
                                "
                                :style="{ width: '100%' }"
                                v-model:value="formData.email"
                                error-message-force
                                :error-message="rules.email ? rules.email.message : null"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("warehouse.email") }}
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                type="tel"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('warehouse.phone'),
                                    ])
                                "
                                error-message-force
                                :error-message="rules.phone ? rules.phone.message : null"
                                v-model:value="formData.phone"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("warehouse.phone") }}
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                :label="$t('warehouse.logo')"
                                :input="false"
                                error-message-force
                                :error-message="rules.logo ? rules.logo.message : null"
                            >
                                <template #input>
                                    <ImageUpload
                                        :formData="formData"
                                        folder="warehouses"
                                        imageField="logo"
                                        @onFileUploaded="
                                            (file) => {
                                                formData.logo = file.file;
                                                formData.logo_url = file.file_url;
                                            }
                                        "
                                    />
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                :label="$t('warehouse.dark_logo')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.dark_logo ? rules.dark_logo.message : null
                                "
                            >
                                <template #input>
                                    <ImageUpload
                                        :formData="formData"
                                        folder="warehouses"
                                        imageField="dark_logo"
                                        @onFileUploaded="
                                            (file) => {
                                                formData.dark_logo = file.file;
                                                formData.dark_logo_url = file.file_url;
                                            }
                                        "
                                    />
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                type="textarea"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('warehouse.address'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.address ? rules.address.message : null
                                "
                                v-model:value="formData.address"
                                :label="$t('warehouse.address')"
                                resizable
                            />

                            <f7-list-input
                                type="textarea"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('warehouse.bank_details'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.bank_details ? rules.bank_details.message : null
                                "
                                v-model:value="formData.bank_details"
                                :label="$t('warehouse.bank_details')"
                                resizable
                            />

                            <f7-list-input
                                type="textarea"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('warehouse.terms_condition'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.terms_condition
                                        ? rules.terms_condition.message
                                        : null
                                "
                                v-model:value="formData.terms_condition"
                                :label="$t('warehouse.terms_condition')"
                                resizable
                            />

                            <f7-list-input
                                :label="$t('warehouse.signature')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.signature ? rules.signature.message : null
                                "
                            >
                                <template #input>
                                    <ImageUpload
                                        :formData="formData"
                                        folder="warehouses"
                                        imageField="signature"
                                        @onFileUploaded="
                                            (file) => {
                                                formData.signature = file.file;
                                                formData.signature_url = file.file_url;
                                            }
                                        "
                                    />
                                </template>
                            </f7-list-input>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>
            <f7-tab id="tab-2">
                <f7-card>
                    <f7-card-content :padding="false">
                        <f7-list strong-ios dividers-ios outline-ios>
                            <f7-list-input
                                :label="$t('warehouse.customers_visibility')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.customers_visibility
                                        ? rules.customers_visibility.message
                                        : null
                                "
                            >
                                <template #input>
                                    <CodrajRadio
                                        :items="[
                                            {
                                                name: $t('warehouse.view_all_customers'),
                                                value: 'all',
                                            },
                                            {
                                                name: $t(
                                                    'warehouse.view_warehouse_customers'
                                                ),
                                                value: 'warehouse',
                                            },
                                        ]"
                                        @select="
                                            (value) =>
                                                (formData.customers_visibility = value)
                                        "
                                        :selectedValue="formData.customers_visibility"
                                        nameKey="customers_visibility"
                                    />
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('warehouse.suppliers_visibility')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.suppliers_visibility
                                        ? rules.suppliers_visibility.message
                                        : null
                                "
                            >
                                <template #input>
                                    <CodrajRadio
                                        :items="[
                                            {
                                                name: $t('warehouse.view_all_suppliers'),
                                                value: 'all',
                                            },
                                            {
                                                name: $t(
                                                    'warehouse.view_warehouse_suppliers'
                                                ),
                                                value: 'warehouse',
                                            },
                                        ]"
                                        @select="
                                            (value) =>
                                                (formData.suppliers_visibility = value)
                                        "
                                        :selectedValue="formData.suppliers_visibility"
                                        nameKey="suppliers_visibility"
                                    />
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('warehouse.products_visibility')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.products_visibility
                                        ? rules.products_visibility.message
                                        : null
                                "
                            >
                                <template #input>
                                    <CodrajRadio
                                        :items="[
                                            {
                                                name: $t('warehouse.view_all_products'),
                                                value: 'all',
                                            },
                                            {
                                                name: $t(
                                                    'warehouse.view_warehouse_products'
                                                ),
                                                value: 'warehouse',
                                            },
                                        ]"
                                        @select="
                                            (value) =>
                                                (formData.products_visibility = value)
                                        "
                                        :selectedValue="formData.products_visibility"
                                        nameKey="products_visibility"
                                    />
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('warehouse.show_email_on_invoice')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.show_email_on_invoice
                                        ? rules.show_email_on_invoice.message
                                        : null
                                "
                            >
                                <template #input>
                                    <CodrajRadio
                                        :items="[
                                            {
                                                name: $t('common.yes'),
                                                value: 1,
                                            },
                                            {
                                                name: $t('common.no'),
                                                value: 0,
                                            },
                                        ]"
                                        @select="
                                            (value) =>
                                                (formData.show_mrp_on_invoice = value)
                                        "
                                        :selectedValue="formData.show_mrp_on_invoice"
                                        nameKey="show_email_on_invoice"
                                    />
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('warehouse.show_phone_on_invoice')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.show_phone_on_invoice
                                        ? rules.show_phone_on_invoice.message
                                        : null
                                "
                            >
                                <template #input>
                                    <CodrajRadio
                                        :items="[
                                            {
                                                name: $t('common.yes'),
                                                value: 1,
                                            },
                                            {
                                                name: $t('common.no'),
                                                value: 0,
                                            },
                                        ]"
                                        @select="
                                            (value) =>
                                                (formData.show_phone_on_invoice = value)
                                        "
                                        :selectedValue="formData.show_phone_on_invoice"
                                        nameKey="show_phone_on_invoice"
                                    />
                                </template>
                            </f7-list-input>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>
            <f7-tab id="tab-3">
                <f7-card>
                    <f7-card-content :padding="false">
                        <f7-list strong-ios dividers-ios outline-ios>
                            <f7-list-input
                                type="select"
                                v-model:value="formData.default_pos_order_status"
                                error-message-force
                                :error-message="
                                    rules.default_pos_order_status
                                        ? rules.default_pos_order_status.message
                                        : null
                                "
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('warehouse.default_pos_order_status'),
                                    ])
                                "
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("warehouse.default_pos_order_status") }}
                                </template>

                                <option
                                    v-for="orderStatus in salesOrderStatus"
                                    :key="orderStatus.key"
                                    :value="orderStatus.key"
                                >
                                    {{ orderStatus.value }}
                                </option>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('warehouse.show_mrp_on_invoice')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.show_mrp_on_invoice
                                        ? rules.show_mrp_on_invoice.message
                                        : null
                                "
                            >
                                <template #input>
                                    <CodrajRadio
                                        :items="[
                                            {
                                                name: $t('common.yes'),
                                                value: 1,
                                            },
                                            {
                                                name: $t('common.no'),
                                                value: 0,
                                            },
                                        ]"
                                        @select="
                                            (value) =>
                                                (formData.show_mrp_on_invoice = value)
                                        "
                                        :selectedValue="formData.show_mrp_on_invoice"
                                        nameKey="show_mrp_on_invoice"
                                    />
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                :label="$t('warehouse.show_discount_tax_on_invoice')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.show_discount_tax_on_invoice
                                        ? rules.show_discount_tax_on_invoice.message
                                        : null
                                "
                            >
                                <template #input>
                                    <CodrajRadio
                                        :items="[
                                            {
                                                name: $t('common.yes'),
                                                value: 1,
                                            },
                                            {
                                                name: $t('common.no'),
                                                value: 0,
                                            },
                                        ]"
                                        @select="
                                            (value) =>
                                                (formData.show_discount_tax_on_invoice = value)
                                        "
                                        :selectedValue="
                                            formData.show_discount_tax_on_invoice
                                        "
                                        nameKey="show_discount_tax_on_invoice"
                                    />
                                </template>
                            </f7-list-input>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>
        </f7-tabs>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import { axiosAdmin } from "@/common/axiosAdmin";
import common from "@/composable/common";
import { useI18n } from "vue-i18n";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import CodrajRadio from "@/components/form/CodrajRadio.vue";
import crud from "@/composable/crud";
import fields from "./fields";
import ImageUpload from "@/components/form/ImageUpload.vue";

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
    },
    components: {
        CodrajSelect,
        CodrajRadio,
        ImageUpload,
    },
    setup(props) {
        const { t } = useI18n();
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const { formatAmountCurrency, appSetting, permsArray, slugify } = common();
        const salesOrderStatus = ref([
            {
                key: "ordered",
                value: t("common.ordered"),
            },
            {
                key: "confirmed",
                value: t("common.confirmed"),
            },
            {
                key: "processing",
                value: t("common.processing"),
            },
            {
                key: "shipping",
                value: t("common.shipping"),
            },
            {
                key: "delivered",
                value: t("common.delivered"),
            },
        ]);

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);
        });

        const submitForm = () => {
            crudVariables
                .onSubmit("wait")
                .then((response) => {
                    appStore.getAndUpdateAllWarehouses();

                    if (
                        appStore.selectedWarehouse &&
                        appStore.selectedWarehouse.xid &&
                        appStore.selectedWarehouse.xid == response.xid
                    ) {
                        axiosAdmin()
                            .post("change-warehouse", {
                                warehouse_id: response.xid,
                            })
                            .then((res) => {
                                appStore.updateSelectedWarehouse(res.data.warehouse);

                                crudVariables.submitSuccess();
                            })
                            .catch((error) => {
                                crudVariables.submitSuccess();
                            });
                    } else {
                        crudVariables.submitSuccess();
                    }
                })
                .catch((error) => {
                    crudVariables.submitSuccess();
                });
        };

        return {
            ...crudVariables,
            slugify,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,

            appStore,
            salesOrderStatus,

            submitForm,
        };
    },
};
</script>
