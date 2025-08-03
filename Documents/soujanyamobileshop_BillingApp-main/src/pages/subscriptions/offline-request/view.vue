<template>
    <f7-page>
        <f7-navbar :title="item.name" back-link="Back"> </f7-navbar>
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        :title="$t('payment_transaction.plan')"
                        :subtitle="item.submittor?.name"
                    />
                    <f7-list-item
                        :title="$t('offline_request.submitted_on')"
                        :subtitle="formatDate(item.created_at)"
                    />
                    <f7-list-item
                        :title="$t('offline_request.subscription_plan')"
                        :subtitle="item.subscription_plan?.name"
                    />
                    <f7-list-item
                        :title="$t('offline_request.plan_type')"
                        :subtitle="item.plan_type"
                    />
                    <f7-list-item
                        :title="$t('offline_request.payment_method')"
                        :subtitle="item.offline_payment_mode?.name"
                    />
                    <f7-list-item
                        :title="$t('offline_request.status')"
                        :subtitle="item.status"
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
