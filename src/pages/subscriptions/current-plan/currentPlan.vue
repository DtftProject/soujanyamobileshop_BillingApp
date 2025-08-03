<template>
    <f7-page>
        <f7-navbar :title="$t('menu.current_plan')" :back-link="$t('common.back')">
            <f7-nav-right> </f7-nav-right>
        </f7-navbar>

        <f7-block-title>
            {{ currentPlan.current_subscription_plan?.name }}
        </f7-block-title>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        :title="$t('subscription_plans.monthly_price')"
                        :subtitle="
                            formatAmountCurrency(
                                currentPlan.current_subscription_plan?.monthly_price
                            )
                        "
                    />

                    <f7-list-item
                        :title="$t('subscription_plans.annual_price')"
                        :subtitle="
                            formatAmountCurrency(
                                currentPlan.current_subscription_plan?.annual_price
                            )
                        "
                    />

                    <f7-list-item :title="$t('subscription_plans.max_products')">
                        <template #subtitle>
                            <span
                                v-if="
                                    currentPlan.current_subscription_plan?.max_products ==
                                    0
                                "
                            >
                                {{ $t("subscription_plans.unlimited") }}
                            </span>
                            <span v-else>
                                {{ currentPlan.products_count }}
                                {{ $t("subscription_plans.out_of") }}
                                {{ currentPlan.current_subscription_plan?.max_products }}
                            </span>
                        </template>
                    </f7-list-item>

                    <f7-list-item :title="$t('payment_transaction.last_paid_on')">
                        <template #subtitle>
                            <span v-if="currentPlan.last_payment_transcation">
                                {{ currentPlan.last_payment_transcation?.paid_on }}
                            </span>
                            <span v-else>-</span>
                        </template>
                    </f7-list-item>

                    <f7-list-item :title="$t('payment_transaction.next_payment_date')">
                        <template #subtitle>
                            <span v-if="currentPlan.last_payment_transcation">
                                {{
                                    formatDate(
                                        currentPlan.last_payment_transcation
                                            ?.next_payment_date
                                    )
                                }}
                            </span>
                            <span v-else-if="appSetting.licence_expire_on != ''">
                                {{ formatDate(appSetting.licence_expire_on) }}
                            </span>
                            <span v-else>-</span>
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import PaymentStatus from "../../../components/order/PaymentStatus.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    components: {
        CodrajSelect,
        PaymentStatus,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const {
            formatAmountCurrency,
            permsArray,
            formatDateTime,
            appSetting,
            formatDate,
        } = common();
        const currentPlan = ref({});
        // const users = ref([]);

        onMounted(() => {
            const currentPlanPromise = axiosAdmin().get(
                "subscription-plan-details?limit=10000"
            );

            Promise.all([currentPlanPromise]).then(([currentPlanResponse]) => {
                currentPlan.value = currentPlanResponse.data;
                datatableVariables.fetch({
                    page: 1,
                });
            });
        });

        return {
            ...datatableVariables,
            formatAmountCurrency,
            formatDateTime,
            permsArray,
            currentPlan,
            appSetting,
            formatDate,

            // users,
        };
    },
};
</script>

<style>
.sales-retport-table .item-inner {
    padding-bottom: 0px !important;
}
</style>
