<template>
    <f7-card
        v-if="appType == 'saas' && appSetting.status == 'license_expired'"
        style="background: #fff2f0; border: 1px solid #ffccc7"
    >
        <f7-card-content>
            <div style="display: flex">
                <div><f7-icon f7="exclamationmark_circle"></f7-icon></div>
                <div class="margin-l5">
                    {{
                        $t("subscription_plans.plan_expired_message", [
                            appSetting.licence_expire_on != ""
                                ? formatDate(appSetting.licence_expire_on)
                                : "",
                        ])
                    }}
                </div>
            </div>
        </f7-card-content>
    </f7-card>

    <f7-card
        v-else-if="
            appType == 'saas' &&
            appSetting.subscription_plan &&
            appSetting.subscription_plan.default == 'trial'
        "
        style="background: #fffbe6; border: 1px solid #ffe58f"
    >
        <f7-card-content>
            <div style="display: flex">
                <div><f7-icon f7="exclamationmark_circle"></f7-icon></div>
                <div class="margin-l5">
                    {{
                        $t("subscription_plans.trial_plan_message", [
                            appSetting.licence_expire_on != ""
                                ? formatDate(appSetting.licence_expire_on)
                                : "",
                        ])
                    }}
                </div>
            </div>
        </f7-card-content>
    </f7-card>
</template>

<script>
import common from "@/composable/common";

export default {
    setup(props) {
        const {
            formatAmountCurrency,
            dayjs,
            appSetting,
            permsArray,
            willSubscriptionModuleVisible,
            appType,
            user,
            formatDate,
        } = common();

        return {
            appType,
            appSetting,
            formatDate,
        };
    },
};
</script>
