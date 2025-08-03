<template>
    <f7-page>
        <f7-navbar :title="item.name" :back-link="$t('common.back')" />

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item :title="$t('currency.name')" :subtitle="item.name" />
                    <f7-list-item
                        :title="$t('currency.symbol')"
                        :subtitle="item.symbol"
                    />
                    <f7-list-item
                        :title="$t('currency.code')"
                        :subtitle="item.code ? item.code : '-'"
                    />
                    <f7-list-item
                        :title="$t('currency.position')"
                        :subtitle="$t(`currency.${item.position}`)"
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

export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {},
    },
    setup(props) {
        const { formatAmountCurrency } = common();

        onMounted(() => {});

        return {
            formatAmountCurrency,
        };
    },
};
</script>
