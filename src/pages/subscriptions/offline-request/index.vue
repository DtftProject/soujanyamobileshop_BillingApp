<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.offline_requests')" :back-link="$t('common.back')">
            <f7-nav-right>
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-card v-for="item in table.data" :key="item.xid">
            <f7-card-content :padding="false">
                <f7-list
                    media-list
                    strong-ios
                    dividers-ios
                    class="search-list searchbar-found"
                >
                    <f7-list-item
                        @click="viewItem({ item })"
                        swipeout
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:open="assignSwipeXId(item.xid)"
                        @swipeout:close="assignSwipeXId('')"
                    >
                        <template #title>
                            {{ $t("offline_request.submitted_by") }}:
                            {{ item.submittor?.name }}
                        </template>
                        <template #subtitle>
                            {{ $t("offline_request.submitted_on") }}:
                            {{ formatDate(item.created_at) }}
                        </template>
                        <template #text>
                            {{ $t("offline_request.status") }}: {{ item.status }}
                        </template>
                        <template #after>
                            <f7-link
                                v-if="swipeOpenItemXid != item.xid"
                                @click="
                                    (event) => {
                                        event.stopPropagation();
                                        swipeOpenItemXid = item.xid;
                                    }
                                "
                            >
                                <f7-icon f7="ellipsis_vertical" size="20"></f7-icon>
                            </f7-link>
                        </template>
                        <f7-swipeout-actions right>
                            <f7-swipeout-button @click="viewItem({ item })">
                                {{ $t("common.view") }}
                            </f7-swipeout-button>
                        </f7-swipeout-actions>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-sheet
            v-model:opened="filterOpened"
            backdrop
            swipe-to-close
            :style="{ height: '50%', width: '100%' }"
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
                    <f7-list-input
                        @change="setUrlData"
                        :label="$t('offline_request.status')"
                        v-model:value="filters.status"
                        type="select"
                        :placeholder="
                            $t('common.select_default_text', [
                                $t('offline_request.status'),
                            ])
                        "
                    >
                        <option value="">
                            {{ $t("offline_request.pending") }}
                        </option>
                        <option value="approved">
                            {{ $t("offline_request.approved") }}
                        </option>
                        <option value="rejected">
                            {{ $t("offline_request.rejected") }}
                        </option>
                    </f7-list-input>
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
import { width } from "dom7";

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
        const status = ref([
            { pending: "Pending" },
            { approved: "Approved" },
            { rejected: "Rejected" },
        ]);

        return {
            ...datatableVariables,
            formatAmountCurrency,
            formatDate,
            permsArray,
            status,
        };
    },
};
</script>
