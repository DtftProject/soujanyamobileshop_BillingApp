<template>
    <f7-page>
        <f7-navbar :title="item.name" back-link="Back"> </f7-navbar>
        <div style="text-align: center; margin-top: 15px">
            <img :src="item.image_url" style="border-radius: 8px" width="100" />
        </div>
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item :title="$t('category.name')" :subtitle="item.name" />
                    <f7-list-item :title="$t('category.slug')" :subtitle="item.slug" />
                    <f7-list-item
                        :title="$t('category.parent_category')"
                        :subtitle="
                            parentCategory && parentCategory.name
                                ? parentCategory.name
                                : '-'
                        "
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { find } from "lodash-es";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {},
        categories: {
            default: [],
        },
    },
    setup(props) {
        const parentCategory = ref({});

        onMounted(() => {
            parentCategory.value = find(props.categories, [
                "xid",
                props.item.x_parent_id,
            ]);
        });

        return {
            parentCategory,
        };
    },
};
</script>
