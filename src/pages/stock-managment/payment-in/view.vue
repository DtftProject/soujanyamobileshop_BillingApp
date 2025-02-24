<template>
    <f7-page>
        <f7-navbar :title="item.payment_number" back-link="Back" />
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        :title="$t('payments.transaction_number')"
                        :subtitle="item.payment_number"
                    />
                    <f7-list-item
                        :title="$t('payments.amount')"
                        :subtitle="item.amount ? formatAmountCurrency(item.amount) : '-'"
                    />
                    <f7-list-item
                        :title="$t('payments.date')"
                        :subtitle="item.date ? formatDate(item.date) : '-'"
                    />
                    <f7-list-item
                        :title="$t('payments.user')"
                        :subtitle="item.user?.name"
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title>
            {{ $t("payments.notes") }}
        </f7-block-title>
        <f7-card>
            <f7-card-content>
                <p>{{ item.notes ? item.notes : "-" }}</p>
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
        const { formatAmountCurrency, formatDate } = common();

        onMounted(() => {});

        return {
            formatAmountCurrency,
            formatDate,
        };
    },
};
</script>
