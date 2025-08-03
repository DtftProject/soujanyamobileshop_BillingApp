<template>
    <f7-page>
        <f7-navbar :title="item.name" :back-link="$t('common.back')"> </f7-navbar>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        :title="$t('stock.order_date')"
                        :subtitle="
                            item.order_date ? formatDateTime(item.order_date) : '-'
                        "
                    />
                    <f7-list-item
                        :title="$t('stock.invoice_number')"
                        :subtitle="item.invoice_number"
                    />

                    <f7-list-item :title="$t('stock.customer')">
                        <template #subtitle>
                            {{ item.user ? item.user.name : "-" }}
                        </template>
                    </f7-list-item>

                    <f7-list-item
                        :title="$t('invoice.order_status')"
                        :subtitle="item.order_status"
                    />

                    <f7-list-item :title="$t('payments.payment_status')">
                        <template #subtitle>
                            <PaymentStatus :paymentStatus="item.payment_status" />
                        </template>
                    </f7-list-item>

                    <f7-list-item
                        :title="$t('stock.order_taken_by')"
                        :subtitle="
                            item.staff_member && item.staff_member.name
                                ? item.staff_member.name
                                : '-'
                        "
                    />
                    <f7-list-item
                        :title="$t('payments.total_amount')"
                        :subtitle="
                            item.subtotal ? formatAmountCurrency(item.subtotal) : '-'
                        "
                    />
                    <f7-list-item
                        :title="$t('payments.paid_amount')"
                        :subtitle="
                            `${item.paid_amount}`
                                ? formatAmountCurrency(item.paid_amount)
                                : '-'
                        "
                    />
                    <f7-list-item
                        :title="$t('payments.due_amount')"
                        :subtitle="
                            item.due_amount ? formatAmountCurrency(item.due_amount) : '-'
                        "
                    />
                    <f7-list-item
                        :title="$t('stock.discount')"
                        :subtitle="
                            item.discount ? formatAmountCurrency(item.discount) : '-'
                        "
                    />
                    <f7-list-item
                        :title="$t('stock.shipping')"
                        :subtitle="
                            item.shipping ? formatAmountCurrency(item.shipping) : '-'
                        "
                    />
                    <f7-list-item
                        :title="$t('stock.order_tax')"
                        :subtitle="item.tax_rate > 0 ? `${item.tax_rate}%` : '-'"
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import common from "@/composable/common";
import PaymentStatus from "../../../components/order/PaymentStatus.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {},
    },
    components: {
        PaymentStatus,
    },
    setup(props) {
        const { formatAmountCurrency, formatDateTime } = common();

        onMounted(() => {
            // console.log("hi");
        });

        return {
            formatAmountCurrency,
            formatDateTime,
        };
    },
};
</script>
