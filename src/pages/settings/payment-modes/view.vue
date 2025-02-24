<template>
    <f7-page>
        <f7-navbar :title="item.name" :back-link="$t('common.back')"> </f7-navbar>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        :title="$t('payment_mode.name')"
                        :subtitle="item.name"
                    />
                    <f7-list-item
                        :title="$t('payment_mode.mode_type')"
                        :subtitle="$t(`payment_mode.${item.mode_type}`)"
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
