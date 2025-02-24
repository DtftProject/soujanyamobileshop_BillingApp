<template>
    <f7-card outline-md class="demo-card-header-pic">
        <f7-card-header>{{ $t("payments.payments") }}</f7-card-header>
        <f7-card-content style="display: flex">
            <f7-area-chart
                tooltip
                axis
                :axis-labels="dates"
                legend
                toggle-datasets
                line-chart
                :format-axis-label="(date) => axisDateFormat.format(date)"
                :format-tooltip-axis-label="(date) => tooltipDateFormat.format(date)"
                :datasets="datasets"
            />
        </f7-card-content>
    </f7-card>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { forEach } from "lodash-es";
export default {
    props: {
        datas: {
            default: [],
        },
    },
    setup(props, {}) {
        const datasets = ref([]);
        const { t } = useI18n();
        const dates = ref([]);

        const axisDateFormat = Intl.DateTimeFormat(undefined, {
            month: "short",
            year: "numeric",
        });
        const tooltipDateFormat = Intl.DateTimeFormat(undefined, {
            month: "long",
            year: "numeric",
        });

        watch(
            () => props.datas,
            (newVal, oldVal) => {
                forEach(newVal.paymentChartData.dates, (date) => {
                    dates.value.push(new Date(date));
                });

                datasets.value = [
                    {
                        label: t("dashboard.payment_sent"),
                        values: newVal.paymentChartData.sent
                            ? newVal.paymentChartData.sent
                            : [],
                        color: "#20C997",
                    },
                    {
                        label: t("dashboard.payment_received"),
                        values: newVal.paymentChartData.received
                            ? newVal.paymentChartData.received
                            : [],
                        color: "#FFCD56",
                    },
                ];
            }
        );

        return {
            dates,
            datasets,
            axisDateFormat,
            tooltipDateFormat,
        };
    },
};
</script>
