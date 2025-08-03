<template>
    <f7-page name="payments-add-edit">
        <f7-navbar
            :title="$t(`${fieldsVar.langKey}.${addEditType}`)"
            :back-link="$t('common.back')"
        >
            <f7-nav-right>
                <f7-button @click="onFormSubmit">
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
                            :error-message="rules.user_id ? rules.user_id.message : null"
                        >
                            <template #label>
                                <span class="required-input">*</span>
                                {{ $t("payments.user") }}
                            </template>
                            <template #input :style="{ padding: '0px', margin: '0px' }">
                                <CodrajSelect
                                    :placeholder="
                                        $t('common.select_default_text', [
                                            $t('payments.user'),
                                        ])
                                    "
                                    :selectedValue="formData.user_id"
                                    :items="users"
                                    fieldKey="xid"
                                    fieldName="name"
                                    className="user-select"
                                    @changed="(userId) => (formData.user_id = userId)"
                                />
                            </template>
                        </f7-list-input>
                    </template>

                    <f7-list-input
                        v-if="addEditType == 'add'"
                        :input="false"
                        error-message-force
                        :error-message="rules.amount ? rules.amount.message : null"
                    >
                        <template #label>
                            <span class="input-prefix">
                                <span class="required-input">*</span>
                                {{ $t("payments.amount") }}
                            </span>
                        </template>
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">
                                    {{ appSetting.currency.symbol }}
                                </span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('payments.amount'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.amount"
                                />
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        v-if="formData.date"
                        error-message-force
                        :error-message="rules.date ? rules.date.message : null"
                        type="datepicker"
                        :placeholder="
                            $t('common.select_default_text', [$t('payments.date')])
                        "
                        readonly
                        :calendar-params="{
                            locale: 'en-GB',
                            value: formData.date ? [formData.date] : [],
                            timePicker: true,
                            formatValue: (allValues) => {
                                let newFormat = formatValueFunciton(allValues);
                                if (newFormat && newFormat[1]) {
                                    formData.date = newFormat[1];
                                }
                                return newFormat && newFormat[0] ? newFormat[0] : '';
                            },
                        }"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("payments.date") }}
                        </template>
                    </f7-list-input>

                    <template v-if="permsArray.includes('admin')">
                        <f7-list-input
                            :input="false"
                            error-message-force
                            :error-message="
                                rules.payment_mode_id
                                    ? rules.payment_mode_id.message
                                    : null
                            "
                        >
                            <template #label>
                                <span class="required-input">*</span>
                                {{ $t("payments.payment_mode") }}
                            </template>
                            <template #input :style="{ padding: '0px', margin: '0px' }">
                                <codraj-select
                                    :placeholder="
                                        $t('common.select_default_text', [
                                            $t('payments.payment_mode'),
                                        ])
                                    "
                                    :selectedValue="formData.payment_mode_id"
                                    :items="paymentModes"
                                    fieldKey="xid"
                                    fieldName="name"
                                    className="payment_mode-select"
                                    @changed="
                                        (newVal) => (formData.payment_mode_id = newVal)
                                    "
                                />
                            </template>
                        </f7-list-input>
                    </template>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('payments.notes')])
                        "
                        error-message-force
                        :error-message="rules.notes ? rules.notes.message : null"
                        v-model:value="formData.notes"
                        :label="$t('payments.notes')"
                        resizable
                    ></f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title
            v-if="
                addEditType == 'add' &&
                formData.user_id &&
                settleInvoiceRef &&
                settleInvoiceRef.invoices &&
                settleInvoiceRef.invoices.length > 0
            "
        >
            {{ $t("payments.settle_invoice_using_payment") }}
        </f7-block-title>

        <SettleInvoices
            v-if="formData.user_id && addEditType == 'add'"
            ref="settleInvoiceRef"
            :userId="formData.user_id"
            :amount="formData.amount"
            :paymentType="formData.payment_type"
        />

        <f7-toolbar v-if="addEditType == 'add'" bottom>
            <span>
                <small>{{ $t("payments.unused_amount") }} : </small>
                {{
                    formatAmountCurrency(
                        settleInvoiceRef && settleInvoiceRef.unUsedAmount
                            ? settleInvoiceRef.unUsedAmount
                            : 0
                    )
                }}
            </span>

            <span>
                <small> {{ $t("common.total") }} : </small>
                {{
                    formatAmountCurrency(
                        settleInvoiceRef && settleInvoiceRef.setteledAmount
                            ? settleInvoiceRef.setteledAmount
                            : 0
                    )
                }}
            </span>
        </f7-toolbar>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { forEach } from "lodash-es";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import crud from "@/composable/crud";
import fields from "./fields";
import SettleInvoices from "./SettleInvoices.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        users: {
            default: [],
        },
        paymentModes: {
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
        SettleInvoices,
    },
    setup(props) {
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const {
            appSetting,
            permsArray,
            formatValueFunciton,
            formatAmountCurrency,
        } = common();
        const settleInvoiceRef = ref(null);

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);
        });

        const onFormSubmit = () => {
            const invoices = [];

            if (
                props.addEditType == "add" &&
                settleInvoiceRef.value &&
                settleInvoiceRef.value.invoices
            ) {
                forEach(settleInvoiceRef.value.invoices, (invoice) => {
                    invoices.push({
                        order_id: invoice.xid,
                        amount: invoice.paying_amount,
                    });
                });
            }

            crudVariables.formData.value = {
                ...crudVariables.formData.value,
                invoices,
            };

            crudVariables.onSubmit();
        };

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            permsArray,
            formatAmountCurrency,

            settleInvoiceRef,
            onFormSubmit,
            formatValueFunciton,
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

.label-cell {
    width: 100px;
}

table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    padding: 0 10px;
}

.list .item-content {
    padding-left: 0px !important;
}

.invoice-title {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 5px;
}
</style>
