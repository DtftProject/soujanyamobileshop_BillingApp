<template>
    <f7-block-title v-if="appType == 'saas'">
        {{ $t("menu.subscriptions") }}
    </f7-block-title>
    <f7-card v-if="appType == 'saas'">
        <f7-card-content :padding="false">
            <f7-list media-list dividers-ios strong-ios>
                <f7-list-item link="/current-plan/" :title="$t('menu.current_plan')">
                    <template #media>
                        <f7-icon
                            f7="pencil_outline"
                            size="24px"
                            :color="appStore.themeColor"
                        ></f7-icon>
                    </template>
                </f7-list-item>
                <f7-list-item link="/transcations/" :title="$t('menu.transcations')">
                    <template #media>
                        <f7-icon
                            f7="bolt_badge_a"
                            size="24px"
                            :color="appStore.themeColor"
                        ></f7-icon>
                    </template>
                </f7-list-item>
                <f7-list-item
                    link="/offline-requests/"
                    :title="$t('menu.offline_requests')"
                >
                    <template #media>
                        <f7-icon
                            f7="building_columns"
                            size="24px"
                            :color="appStore.themeColor"
                        ></f7-icon>
                    </template>
                </f7-list-item>
                <f7-list-item link="/change-plan/" :title="$t('menu.change_plan')">
                    <template #media>
                        <f7-icon
                            f7="pencil"
                            size="24px"
                            :color="appStore.themeColor"
                        ></f7-icon>
                    </template>
                </f7-list-item>
            </f7-list>
        </f7-card-content>
    </f7-card>
</template>

<script>
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";

export default {
    setup(props) {
        const appStore = useAppStore();
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
            appStore,

            appType,
            appSetting,
            formatDate,
        };
    },
};
</script>
