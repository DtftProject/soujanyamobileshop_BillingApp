<template>
    <f7-page>
        <f7-navbar :title="item.name" back-link="Back"> </f7-navbar>

        <f7-block-title>
            {{ $t("expense_category.name") }}
        </f7-block-title>
        <f7-card>
            <f7-card-content>
                <p>{{ item.name }}</p>
            </f7-card-content>
        </f7-card>

        <f7-block-title>
            {{ $t("expense_category.description") }}
        </f7-block-title>
        <f7-card>
            <f7-card-content>
                <p>{{ item.description }}</p>
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

        onMounted(() => {
            console.log("hi");
        });

        return {
            formatAmountCurrency,
        };
    },
};
</script>
