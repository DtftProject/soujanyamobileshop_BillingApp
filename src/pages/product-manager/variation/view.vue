<template>
    <f7-page>
        <f7-navbar :title="item.name" back-link="Back"> </f7-navbar>
        <div style="text-align: center; margin-top: 15px">
            <img :src="item.profile_image_url" style="border-radius: 8px" width="100" />
        </div>
        <f7-list media-list dividers-ios strong-ios outline-ios>
            <f7-list-item :title="$t('variation.name')" :subtitle="item.name" />
            <!-- <f7-list-item :title="$t('tax.tax_type')" :subtitle="item.tax_type" /> -->
            <!-- <f7-list-item
                :title="$t('user.phone')"
                :subtitle="item.phone ? item.phone : '-'"
            />
            <f7-list-item
                :title="$t('user.opening_balance')"
                :subtitle="
                    item.details.opening_balance_type == 'pay'
                        ? -`${item.details.opening_balance}`
                        : item.details.opening_balance
                "
            />
            <f7-list-item
                :title="$t('user.billing_address')"
                :subtitle="item.address ? item.address : '-'"
            />

            <f7-list-item
                :title="$t('user.credit_period')"
                :subtitle="
                    item.details && item.details.credit_period
                        ? `${item.details.credit_period} day(s)`
                        : '-'
                "
            />
            <f7-list-item
                :title="$t('user.credit_limit')"
                :subtitle="
                    item.details && item.details.credit_limit
                        ? formatAmountCurrency(item.details.credit_limit)
                        : '-'
                "
            />
            <f7-list-item
                :title="$t('common.balance')"
                :subtitle="formatAmountCurrency(item.details?.due_amount)"
            />
            <f7-list-item
                :title="$t('user.tax_number')"
                :subtitle="item.tax_number ? item.tax_number : '-'"
            /> -->
        </f7-list>
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

        onMounted(() => {
            // console.log("hi");
        });

        return {
            formatAmountCurrency,
        };
    },
};
</script>
