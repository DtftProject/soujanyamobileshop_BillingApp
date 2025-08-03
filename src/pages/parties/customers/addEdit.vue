<template>
    <f7-page name="customer-add-edit" @page:beforeunmount="beforeEnter">
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
                    <template v-if="warehouseVisible">
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
                                <template
                                    #input
                                    :style="{ padding: '0px', margin: '0px' }"
                                >
                                    <codraj-select
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
                    </template>

                    <f7-list-input
                        :label="$t('user.profile_image')"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.profile_image ? rules.profile_image.message : null
                        "
                    >
                        <template #input>
                            <ImageUpload
                                :formData="formData"
                                folder="user"
                                imageField="profile_image"
                                @onFileUploaded="
                                    (file) => {
                                        formData.profile_image = file.file;
                                        formData.profile_image_url = file.file_url;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("user.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="select"
                        v-model:value="formData.status"
                        :placeholder="
                            $t('common.select_default_text', [$t('user.status')])
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("user.status") }}
                        </template>

                        <option value="enabled">
                            {{ $t("common.enabled") }}
                        </option>
                        <option value="disabled">
                            {{ $t("common.disabled") }}
                        </option>
                    </f7-list-input>

                    <f7-list-input
                        type="tel"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.phone')])
                        "
                        error-message-force
                        :error-message="rules.phone ? rules.phone.message : null"
                        v-model:value="formData.phone"
                        :label="$t('user.phone')"
                    />

                    <f7-list-input
                        type="email"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.email')])
                        "
                        error-message-force
                        :error-message="rules.email ? rules.email.message : null"
                        v-model:value="formData.email"
                        :label="$t('user.email')"
                    />

                    <f7-list-input
                        type="password"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.password')])
                        "
                        error-message-force
                        :error-message="rules.password ? rules.password.message : null"
                        v-model:value="formData.password"
                        :label="$t('user.password')"
                    />

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.tax_number')])
                        "
                        error-message-force
                        :error-message="
                            rules.tax_number ? rules.tax_number.message : null
                        "
                        v-model:value="formData.tax_number"
                        :label="$t('user.tax_number')"
                    />

                    <f7-list-input
                        :label="$t('user.opening_balance')"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.opening_balance ? rules.opening_balance.message : null
                        "
                    >
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">{{
                                    appSetting.currency.symbol
                                }}</span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('user.opening_balance'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.credit_period"
                                />
                                <span>
                                    <f7-input
                                        :label="null"
                                        type="select"
                                        v-model:value="formData.opening_balance_type"
                                        :placeholder="
                                            $t('common.select_default_text', [
                                                $t('user.status'),
                                            ])
                                        "
                                        :style="{ width: '100px' }"
                                    >
                                        <option value="receive">
                                            {{ $t("user.receive") }}
                                        </option>
                                        <option value="pay">
                                            {{ $t("user.pay") }}
                                        </option>
                                    </f7-input>
                                </span>
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :label="$t('user.credit_period')"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.credit_period ? rules.credit_period.message : null
                        "
                    >
                        <template #input>
                            <div style="display: flex">
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('user.credit_period'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.credit_period"
                                />
                                <span class="input-suffix">{{ $t("user.days") }}</span>
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :label="$t('user.credit_limit')"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.credit_limit ? rules.credit_limit.message : null
                        "
                    >
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">{{
                                    appSetting.currency.symbol
                                }}</span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('user.credit_limit'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.credit_limit"
                                />
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('user.billing_address'),
                            ])
                        "
                        error-message-force
                        :error-message="rules.address ? rules.address.message : null"
                        v-model:value="formData.address"
                        :label="$t('user.address')"
                        resizable
                    ></f7-list-input>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('user.shipping_address'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.shipping_address ? rules.shipping_address.message : null
                        "
                        v-model:value="formData.shipping_address"
                        :label="$t('user.shipping_address')"
                        resizable
                    ></f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import crud from "@/composable/crud";
import fields from "./fields";
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
        userType: {
            default: "customers",
        },
    },
    components: {
        CodrajSelect,
        ImageUpload,
    },
    setup(props) {
        const appStore = useAppStore();
        const fieldsVar = fields(props.userType);
        const crudVariables = crud(props.addEditType, props.item);
        const { formatAmountCurrency, appSetting, permsArray } = common();
        const warehouseVisible = ref(false);

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);

            if (
                props.addEditType == "add" ||
                (props.addEditType == "edit" && !props.item.is_walkin_customer)
            ) {
                warehouseVisible.value = true;
            }

            if (props.addEditType == "add") {
                crudVariables.formData.value = {
                    ...crudVariables.formData.value,
                    warehouse_id: appStore.selectedWarehouse.xid,
                };
            }
        });

        const beforeEnter = ({ route }) => {
            route.options.loaded = true;
            // Check if the page was previously loaded
            // const isPageLoaded = route.options.loaded;

            // if (!isPageLoaded) {
            //     // Mark the page as loaded to prevent refreshing on back navigation
            //     route.options.loaded = true;
            // }
        };

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            warehouseVisible,
            appStore,

            beforeEnter,
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
