<template>
    <f7-page>
        <f7-navbar :title="item.product.name" back-link="Back"> </f7-navbar>
        <div style="text-align: center; margin-top: 15px">
            <img :src="item.product.image_url" style="border-radius: 8px" width="100" />
        </div>
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        :title="$t('product.product')"
                        :subtitle="item.product.name"
                    />
                    <f7-list-item
                        :title="$t('stock_adjustment.quantity')"
                        :subtitle="item.quantity"
                    />
                    <f7-list-item
                        :title="$t('stock_adjustment.adjustment_type')"
                        :subtitle="item.adjustment_type"
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title>
            {{ $t("stock_adjustment.notes") }}
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
        const { formatAmountCurrency } = common();

        onMounted(() => {});

        return {
            formatAmountCurrency,
        };
    },
};
</script>
