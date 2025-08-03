<template>
    <f7-block-title
        v-if="imageSliderData.length > 0"
        style="text-align: center; font-size: bold; margin: 16px 0px"
    >
        {{ $t("mobile_app.how_to_use_the_app") }}
    </f7-block-title>

    <!-- slider for videos -->

    <f7-block v-if="imageSliderData.length > 0" class="mb-0 mt-0">
        <swiper-container
            :pagination="true"
            class="demo-swiper-multiple"
            :space-between="50"
            :right="1"
            :speed="100"
            :autoplay="true"
        >
            <swiper-slide v-for="imageSlider in imageSliderData" :key="imageSlider.xid">
                <img
                    style="border-radius: 8px"
                    :src="imageSlider.image_url"
                    @click="openLink(imageSlider.url)"
                    :style="{ width: '100%' }"
                />
            </swiper-slide>
        </swiper-container>
    </f7-block>
</template>

<script>
export default {
    props: ["imageSliderData"],

    setup(props) {
        const openLink = (url) => {
            window.open(url, "_blank");
        };
        return {
            openLink,
        };
    },
};
</script>
