<template>
    <f7-page>
        <f7-navbar :title="item?.name" back-link="Back"> </f7-navbar>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        :title="$t('payment_transaction.paid_on')"
                        :subtitle="formatDate(item?.paid_on)"
                    />
                    <f7-list-item
                        :title="$t('payment_transaction.plan')"
                        :subtitle="item.subscriptionPlan?.name"
                    />
                    <f7-list-item
                        :title="$t('offline_request.transcation_id')"
                        :subtitle="item?.transcation_id"
                    />
                    <f7-list-item
                        :title="$t('payment_transaction.payment_method')"
                        :subtitle="item?.payment_method"
                    />
                    <f7-list-item
                        :title="$t('payment_transaction.next_payment_date')"
                        :subtitle="formatDate(item?.next_payment_date)"
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import common from "@/composable/common";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {},
    },
    setup(props) {
        const { formatAmountCurrency, formatDate } = common();

        return {
            formatAmountCurrency,
            formatDate,
        };
    },
};
</script>
