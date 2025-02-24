<template>
    <f7-card outline-md class="demo-card-header-pic">
        <f7-card-header>{{ $t("dashboard.top_selling_product") }}</f7-card-header>
        <f7-card-content style="display: flex">
            <f7-pie-chart tooltip :datasets="topSales" />
        </f7-card-content>
    </f7-card>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { forEach } from "lodash-es";
export default {
    props: {
        data: {
            default: [],
        },
    },
    setup(props, {}) {
        const topSales = ref([]);
        const leba = ref("");
        const valo = ref(0);
        const lebalCount = ref(0);
        const valueCount = ref(0);
        const arrayCount = ref(0);

        watch(
            () => props.data,
            (newVal, oldVal) => {
                topSales.value = [];

                forEach(newVal.topSellingProducts.colors, (col) => {
                    lebalCount.value = 0;
                    valueCount.value = 0;
                    forEach(newVal.topSellingProducts.labels, (lebbb) => {
                        if (lebalCount.value == arrayCount.value) {
                            leba.value = lebbb;
                        }
                        lebalCount.value += 1;
                    });

                    forEach(newVal.topSellingProducts.values, (val) => {
                        if (valueCount.value == arrayCount.value) {
                            valo.value = val;
                        }
                        valueCount.value += 1;
                    });

                    topSales.value.push({
                        label: leba.value,
                        value: valo.value,
                        color: col,
                    });
                    arrayCount.value += 1;
                });
            }
        );

        return {
            topSales,
        };
    },
};
</script>
