<template>
    <f7-page name="staff-members-add-edit">
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
                    <template v-if="permsArray.includes('admin')">
                        <f7-list-input
                            :input="false"
                            error-message-force
                            :error-message="rules.role_id ? rules.role_id.message : null"
                        >
                            <template #label>
                                <span class="required-input">*</span>
                                {{ $t("user.role") }}
                            </template>
                            <template #input :style="{ padding: '0px', margin: '0px' }">
                                <codraj-select
                                    :placeholder="
                                        $t('common.select_default_text', [
                                            $t('user.role'),
                                        ])
                                    "
                                    :selectedValue="formData.role_id"
                                    :items="roles"
                                    fieldKey="xid"
                                    fieldName="display_name"
                                    className="role-select"
                                    :sendFullObject="true"
                                    @changed="
                                        (newVal) => {
                                            formData.role_id = newVal.xid;
                                            warehouseVisible =
                                                newVal.name == 'admin' ? false : true;
                                        }
                                    "
                                />
                            </template>
                        </f7-list-input>
                    </template>

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
                                        :selectedValue="formData.warehouses"
                                        :items="warehouses"
                                        fieldKey="xid"
                                        fieldName="name"
                                        className="warehouse-select"
                                        @changed="
                                            (newVal) => {
                                                formData.warehouses = newVal;
                                                formData.warehouse_id =
                                                    newVal.length > 0
                                                        ? newVal[0]
                                                        : undefined;
                                            }
                                        "
                                        :multiple="true"
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

                    <!-- <f7-list-input
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
                    /> -->

                    <!-- <f7-list-input
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
                    </f7-list-input> -->

                    <!-- <f7-list-input
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
                    </f7-list-input> -->

                    <!-- <f7-list-input
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
                    </f7-list-input> -->

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.address')])
                        "
                        error-message-force
                        :error-message="rules.address ? rules.address.message : null"
                        v-model:value="formData.address"
                        :label="$t('user.address')"
                        resizable
                    ></f7-list-input>

                    <!-- <f7-list-input
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
                    ></f7-list-input> -->
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { forEach } from "lodash-es";
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
        roles: {
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
        ImageUpload,
    },
    setup(props) {
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const { formatAmountCurrency, appSetting, permsArray } = common();
        const warehouseVisible = ref(true);

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);

            if (
                props.addEditType == "edit" &&
                props.item.user_type == "staff_members" &&
                props.item.role &&
                props.item.role.name == "admin"
            ) {
                warehouseVisible.value = false;
            }

            if (props.addEditType == "add") {
                crudVariables.formData.value = {
                    ...crudVariables.formData.value,
                    warehouse_id: appStore.selectedWarehouse.xid,
                    warehouses: [appStore.selectedWarehouse.xid],
                };
            }
            if (props.addEditType == "edit") {
                var addEditUserWarehouses = [];
                var userWarehouses = props.item.user_warehouses;
                forEach(userWarehouses, (userWarehouseValue) => {
                    addEditUserWarehouses.push(userWarehouseValue.x_warehouse_id);
                });

                crudVariables.formData.value = {
                    ...crudVariables.formData.value,
                    role_id: props.item.role.xid,
                    warehouses: addEditUserWarehouses,
                };
            }
        });

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            warehouseVisible,
            appStore,
        };
    },
};
</script>
