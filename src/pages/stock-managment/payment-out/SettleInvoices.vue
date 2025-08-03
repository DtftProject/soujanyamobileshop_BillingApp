<template>
    <f7-card>
        <f7-card-content :padding="false">
            <f7-list strong-ios dividers-ios outline-ios :style="{ marginTop: '0px' }">
                <f7-list-input
                    v-for="invoice in invoices"
                    :key="invoice.xid"
                    :input="false"
                    error-message-force
                >
                    <template #inner-start>
                        <div style="width: 100%">
                            <div class="invoice-title">
                                <span>
                                    {{ invoice.invoice_number }} (
                                    {{ formatDate(invoice.order_date) }})
                                </span>
                                <span>
                                    {{ $t("common.total") }} :
                                    {{ formatAmountCurrency(invoice.total) }}
                                </span>
                            </div>
                        </div>
                    </template>
                    <template #info>
                        {{ $t("common.pending") }}:
                        {{ formatAmountCurrency(invoice.due_amount) }}
                    </template>
                    <template #input>
                        <div style="display: flex">
                            <span class="input-prefix">{{
                                appSetting.currency.symbol
                            }}</span>
                            <f7-input
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('payments.amount'),
                                    ])
                                "
                                :style="{ width: '100%' }"
                                style="
                                     {
                                        width: '100%';
                                    }
                                "
                                v-model:value="invoice.paying_amount"
                                :min="0"
                                type="number"
                                @blur="inputValueChanged(invoice)"
                            />
                        </div>
                    </template>
                </f7-list-input>
            </f7-list>
        </f7-card-content>
    </f7-card>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { f7 } from "framework7-vue";
import { forEach } from "lodash-es";
import { axiosAdmin } from "@/common/axiosAdmin";
import common from "@/composable/common";

export default {
    props: ["userId", "amount", "paymentType"],
    setup(props, { emit }) {
        const { formatDate, appSetting, formatAmountCurrency } = common();
        const invoices = ref([]);
        const setteledAmount = ref(0);
        const unUsedAmount = ref(0);

        onMounted(() => {
            getInvoices();
        });

        const getInvoices = () => {
            f7.preloader.show();

            axiosAdmin()
                .post("user-invoices", {
                    user_id: props.userId,
                    payment_type: props.paymentType,
                })
                .then((response) => {
                    const allInvoices = response.data.invoices;
                    var enteredAmount = props.amount;
                    var setteledAmt = 0;

                    forEach(allInvoices, (allInvoice) => {
                        if (allInvoice.due_amount <= enteredAmount) {
                            allInvoice.paying_amount = allInvoice.due_amount;
                            enteredAmount =
                                parseFloat(enteredAmount) -
                                parseFloat(allInvoice.due_amount);
                            setteledAmt =
                                parseFloat(setteledAmt) +
                                parseFloat(allInvoice.due_amount);
                        } else if (allInvoice.due_amount > enteredAmount) {
                            allInvoice.paying_amount = enteredAmount;
                            setteledAmt =
                                parseFloat(setteledAmt) + parseFloat(enteredAmount);
                            enteredAmount = 0;
                        }
                    });

                    setteledAmount.value = setteledAmt;

                    unUsedAmount.value =
                        parseFloat(props.amount) - parseFloat(setteledAmt);
                    invoices.value = allInvoices;

                    f7.preloader.hide();
                })
                .catch((error) => {
                    f7.preloader.hide();
                });
        };

        const inputValueChanged = (record) => {
            const newValues = invoices.value;
            var totalEnteredAmount = 0;

            forEach(newValues, (newValue) => {
                totalEnteredAmount += parseFloat(newValue.paying_amount);
            });

            if (record.paying_amount > record.due_amount) {
                record.paying_amount = record.due_amount;
            } else if (totalEnteredAmount > props.amount) {
                record.paying_amount =
                    parseFloat(props.amount) -
                    (totalEnteredAmount - parseFloat(record.paying_amount));
            }

            if (!record.paying_amount) {
                record.paying_amount = 0;
            }

            var newtotalEnteredAmount = 0;
            forEach(newValues, (newValue) => {
                newtotalEnteredAmount += parseFloat(newValue.paying_amount);
            });
            setteledAmount.value = newtotalEnteredAmount;
            unUsedAmount.value =
                parseFloat(props.amount) - parseFloat(newtotalEnteredAmount);
        };

        watch(props, (newVal, oldVal) => {
            getInvoices();
        });

        return {
            invoices,

            setteledAmount,
            unUsedAmount,
            inputValueChanged,

            appSetting,
            formatDate,
            formatAmountCurrency,
        };
    },
};
</script>

<style scoped>
.input-prefix {
    margin-top: 8px;
    margin-right: 5px;
}

.input-suffix {
    margin-top: 8px;
    margin-left: 5px;
}
.invoice-title {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 5px;
}
</style>
