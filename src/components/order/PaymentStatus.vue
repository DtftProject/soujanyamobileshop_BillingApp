<template>
    <f7-chip
        :text="$t(`payments.${paymentStatus}`)"
        :color="color"
        style="font-size: 12px; padding: 5px; border-radius: 3px; height: 20px"
    />
</template>

<script>
import { onMounted, ref } from "vue";

export default {
    props: ["paymentStatus"],
    setup(props) {
        const color = ref("red");

        onMounted(() => {
            if (props.paymentStatus == "paid") {
                color.value = "green";
            } else if (props.paymentStatus == "partially_paid") {
                color.value = "orange";
            }
        });

        return {
            color,
        };
    },
};
</script>
