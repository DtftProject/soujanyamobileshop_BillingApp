<template>
    <f7-page>
        <f7-navbar :title="item.name" back-link="Back"> </f7-navbar>
        <div style="text-align: center; margin-top: 15px">
            <img :src="item.image_url" style="border-radius: 8px" width="100" />
        </div>
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item :title="$t('user.name')" :subtitle="item.name" />

                    <f7-list-item
                        :title="$t('brand.slug')"
                        :subtitle="item.slug ? item.slug : '-'"
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import common from "@/composable/common";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {},
    },
    setup(props) {
        const { formatAmountCurrency } = common();

        return {
            formatAmountCurrency,
        };
    },
};
</script>
