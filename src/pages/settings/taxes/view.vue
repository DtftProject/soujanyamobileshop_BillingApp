<template>
    <f7-page>
        <f7-navbar :title="item.name" :back-link="$t('common.back')" />

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item :title="$t('tax.name')" :subtitle="item.name" />
                    <f7-list-item :title="$t('tax.tax_type')" :subtitle="item.tax_type" />
                    <f7-list-item :title="$t('tax.rate')" :subtitle="`${item.rate}%`" />
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title v-if="item.tax_type == 'multiple'">
            {{ $t("tax.multiple_tax") }}
        </f7-block-title>
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        v-for="tax in item.multiple_tax"
                        :key="`tax_${tax.xid}`"
                        :title="tax.name"
                        :after="`${tax.rate}%`"
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {},
    },
};
</script>
