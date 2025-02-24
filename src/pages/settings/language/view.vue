<template>
    <f7-page name="langs-view-page">
        <f7-navbar :title="item.name" :back-link="$t('common.back')"> </f7-navbar>
        <div style="text-align: center; margin-top: 15px">
            <img :src="item.image_url" style="border-radius: 8px" width="100" />
        </div>
        <f7-list media-list dividers-ios strong-ios outline-ios>
            <f7-list-item :title="$t('langs.name')" :subtitle="item.name" />
            <f7-list-item :title="$t('langs.key')" :subtitle="item.key" />
        </f7-list>
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
