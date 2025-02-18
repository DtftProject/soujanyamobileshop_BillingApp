<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.stock_alert')" :back-link="$t('common.back')">
            <f7-nav-right> </f7-nav-right>
        </f7-navbar>

        <f7-card footer-divider v-for="item in table.data" :key="item.xid">
            <f7-card-content :padding="false">
                <f7-list media-list>
                    <f7-list-item :title="`${item.name}`" :subtitle="item.item_code">
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="item.image_url"
                                width="32"
                                height="32"
                            />
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
            <f7-card-footer>
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                    "
                >
                    <span>
                        {{ $t("product.current_stock") }} :
                        {{ `${item.details?.current_stock}${item.unit?.short_name}` }}
                    </span>

                    <span>
                        {{ $t("product.quantitiy_alert") }} :
                        {{
                            `${item.details?.stock_quantitiy_alert}${item.unit?.short_name}`
                        }}
                    </span>
                </div>
            </f7-card-footer>
        </f7-card>

        <f7-sheet
            v-model:opened="filterOpened"
            backdrop
            swipe-to-close
            :style="{ height: '50%' }"
        >
            <f7-toolbar>
                <div class="left">
                    {{ $t("common.filters") }}
                </div>
                <div class="right">
                    <f7-link v-if="filterApplied" @click="clearFilters">
                        {{ $t("common.clear") }}
                    </f7-link>
                </div>
            </f7-toolbar>
            <!-- Scrollable sheet content -->
            <f7-page-content>
                <f7-list
                    strong-ios
                    dividers-ios
                    outline-ios
                    :style="{ marginTop: '0px' }"
                >
                </f7-list>
            </f7-page-content>
        </f7-sheet>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";
import CodrajSelect from "@/components/form/CodrajSelect.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    components: {
        CodrajSelect,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { formatAmountCurrency, permsArray, formatDate } = common();

        onMounted(() => {
            datatableVariables.fetch({
                page: 1,
            });
        });

        return {
            ...datatableVariables,
            formatAmountCurrency,
            formatDate,
            permsArray,
        };
    },
};
</script>
