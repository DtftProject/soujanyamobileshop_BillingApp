<template>
    <f7-list-item>
        <template #title>
            <img style="border-radius: 8px" :src="item.image_url" width="16" />
            {{ item.name }}
        </template>
        <recursive-list-item
            :item="child"
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
        />
    </f7-list-item>
</template>

<script>
export default {
    props: {
        item: Object,
    },
    setup(props, { emit }) {
        return {};
    },
};
</script>
