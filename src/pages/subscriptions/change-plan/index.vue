<template>
    <f7-page>
        <f7-navbar :title="$t('menu.change_plan')" :back-link="$t('common.back')">
            <f7-nav-right> </f7-nav-right>
        </f7-navbar>

        <f7-toolbar top tabbar>
            <f7-link
                tab-link="#monthly-tab"
                :tab-link-active="activeTabName == 'monthly-tab'"
            >
                {{ $t("subscription_plans.monthly") }}
            </f7-link>
            <f7-link
                tab-link="#annual-tab"
                :tab-link-active="activeTabName == 'annual-tab'"
            >
                {{ $t("subscription_plans.yearly") }}</f7-link
            >
        </f7-toolbar>
        <f7-tabs
            @tab:show="
                (selectedTabName) => {
                    activeTabName = selectedTabName.target.id;
                }
            "
        >
            <f7-tab
                id="monthly-tab"
                :tab-active="activeTabName == 'monthly-tab' ? true : false"
            >
                <f7-card
                    footer-divider
                    v-for="allSubscriptionPlan in responseData.all_subscription_plans"
                    :key="allSubscriptionPlan.xid"
                >
                    <f7-card-content :padding="false">
                        <f7-list media-list>
                            <f7-list-item
                                :title="allSubscriptionPlan.name"
                                :text="allSubscriptionPlan.description"
                                @click="
                                    subscribeThisPlan({
                                        plan: allSubscriptionPlan,
                                        planType: 'monthly',
                                        paymentModes,
                                    })
                                "
                            >
                                <template #subtitle>
                                    {{
                                        formatAmountUsingCurrencyObject(
                                            allSubscriptionPlan.monthly_price,
                                            responseData.currency
                                        )
                                    }}/{{ $t("subscription_plans.monthly") }}
                                </template>
                                <template #after>
                                    <f7-chip
                                        v-if="
                                            allSubscriptionPlan.xid ==
                                                appSetting.x_subscription_plan_id &&
                                            appSetting.package_type == 'monthly'
                                        "
                                        :text="$t('menu.current_plan')"
                                        color="green"
                                        style="
                                            font-size: 12px;
                                            padding: 5px;
                                            border-radius: 3px;
                                            height: 20px;
                                        "
                                    />
                                </template>
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                    <f7-card-footer>
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                width: 100%;
                            "
                        >
                            <span>
                                {{ $t("subscription_plans.max_products") }} <br />
                                {{ allSubscriptionPlan.max_products }}
                            </span>
                            <span>
                                {{ $t("subscription_plans.max_stores") }} <br />
                                {{ allSubscriptionPlan.max_stores }}
                            </span>
                            <span>
                                {{ $t("subscription_plans.max_users") }} <br />
                                {{ allSubscriptionPlan.max_users }}
                            </span>
                        </div>
                    </f7-card-footer>
                </f7-card>
            </f7-tab>
            <f7-tab
                id="annual-tab"
                :tab-active="activeTabName == 'annual-tab' ? true : false"
            >
                <f7-card
                    v-for="allSubscriptionPlan in responseData.all_subscription_plans"
                    :key="allSubscriptionPlan.xid"
                >
                    <f7-card-content :padding="false">
                        <f7-list media-list strong-ios dividers-ios>
                            <f7-list-item
                                :title="allSubscriptionPlan.name"
                                :text="allSubscriptionPlan.description"
                                @click="
                                    subscribeThisPlan({
                                        plan: allSubscriptionPlan,
                                        planType: 'annual',
                                        paymentModes,
                                    })
                                "
                            >
                                <template #subtitle>
                                    {{
                                        formatAmountUsingCurrencyObject(
                                            allSubscriptionPlan.annual_price,
                                            responseData.currency
                                        )
                                    }}/{{ $t("subscription_plans.yearly") }}
                                </template>
                                <template #after>
                                    <f7-chip
                                        v-if="
                                            allSubscriptionPlan.xid ==
                                                appSetting.x_subscription_plan_id &&
                                            appSetting.package_type == 'annual'
                                        "
                                        :text="$t('menu.current_plan')"
                                        color="green"
                                        style="
                                            font-size: 12px;
                                            padding: 5px;
                                            border-radius: 3px;
                                            height: 20px;
                                        "
                                    />
                                </template>
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                    <f7-card-footer>
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                width: 100%;
                                margin-top: 10px;
                                padding-top: 10px;
                                border-top: 1px solid var(--f7-card-header-border-color);
                            "
                        >
                            <span>
                                {{ $t("subscription_plans.max_products") }} <br />
                                {{ allSubscriptionPlan.max_products }}
                            </span>
                            <span>
                                {{ $t("subscription_plans.max_stores") }} <br />
                                {{ allSubscriptionPlan.max_stores }}
                            </span>
                            <span>
                                {{ $t("subscription_plans.max_users") }} <br />
                                {{ allSubscriptionPlan.max_users }}
                            </span>
                        </div>
                    </f7-card-footer>
                </f7-card>
            </f7-tab>
        </f7-tabs>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { axiosAdmin } from "@/common/axiosAdmin";
import common from "@/composable/common";
import { f7 } from "framework7-vue";
import CodrajSelect from "@/components/form/CodrajSelect.vue";

export default {
    components: {
        CodrajSelect,
    },
    setup(props) {
        const { permsArray, formatAmountUsingCurrencyObject, appSetting } = common();
        const activeTabName = ref(`${appSetting.package_type}-tab`);
        const responseData = ref([]);
        const paymentModes = ref([]);

        onMounted(() => {
            const allSubscriptionPlanPromise = axiosAdmin().get(
                "all-subscription-plans?limit=10000"
            );
            const paymentsPromise = axiosAdmin().get("all-payment-methods");

            f7.preloader.show();
            Promise.all([allSubscriptionPlanPromise, paymentsPromise]).then(
                ([allSubscriptionPlanResponse, paymentsResponse]) => {
                    responseData.value = allSubscriptionPlanResponse.data;
                    paymentModes.value = paymentsResponse.data.offline_payment_modes;

                    f7.preloader.hide();
                }
            );
        });

        const subscribeThisPlan = (props) => {
            f7.views.main.router.navigate(`/change-plan-create/`, {
                props,
            });
        };

        return {
            permsArray,
            responseData,
            formatAmountUsingCurrencyObject,
            activeTabName,
            paymentModes,
            appSetting,

            subscribeThisPlan,
        };
    },
};
</script>
