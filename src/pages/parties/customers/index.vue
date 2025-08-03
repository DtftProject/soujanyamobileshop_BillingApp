<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
        :with-subnavbar="true"
    >
        <f7-navbar
            :title="$t(`menu.${partiesPageObject.menuKey}`)"
            :back-link="$t('common.back')"
        >
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
            <f7-subnavbar>
                <f7-segmented strong>
                    <f7-button
                        small-md
                        :active="subnavFilterValue == ''"
                        @click="subnavSelected('')"
                    >
                        {{ $t("common.all") }}
                    </f7-button>
                    <f7-button
                        small-md
                        :active="subnavFilterValue == 'receive'"
                        @click="subnavSelected('receive')"
                    >
                        {{ $t("user.to_receive") }}
                    </f7-button>
                    <f7-button
                        small-md
                        :active="subnavFilterValue == 'pay'"
                        @click="subnavSelected('pay')"
                    >
                        {{ $t("user.to_pay") }}
                    </f7-button>
                </f7-segmented>
            </f7-subnavbar>
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable navbar-action-btn"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes(`${partiesPageObject.permission}_create`) ||
                        permsArray.includes('admin')
                    "
                    @click="createItem({ warehouses, userType: partiesPageObject.type })"
                    class="navbar-action-btn"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-card v-for="item in table.data" :key="item.xid">
            <f7-card-content :padding="false">
                <f7-list media-list>
                    <f7-list-item
                        :title="`${item.name}`"
                        :subtitle="item.email"
                        swipeout
                        @click="viewItem({ item })"
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="assignSwipeXId(item.xid)"
                        @swipeout:close="assignSwipeXId('')"
                    >
                        <template #text>
                            {{ formatAmountCurrency(item.details?.due_amount) }}
                        </template>
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="item.profile_image_url"
                                width="60"
                                height="60"
                            />
                        </template>
                        <template #after>
                            <f7-link
                                v-if="swipeOpenItemXid != item.xid"
                                @click="
                                    (event) => {
                                        event.stopPropagation();
                                        assignSwipeXId(item.xid);
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
                            <f7-swipeout-button
                                v-if="
                                    permsArray.includes(
                                        `${partiesPageObject.permission}_edit`
                                    ) || permsArray.includes('admin')
                                "
                                @click="
                                    editItem({
                                        item,
                                        warehouses,
                                        addEditType: 'edit',
                                        userType: partiesPageObject.type,
                                    })
                                "
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    (permsArray.includes(
                                        `${partiesPageObject.permission}_delete`
                                    ) ||
                                        permsArray.includes('admin')) &&
                                    !item.is_walkin_customer
                                "
                                delete
                                :confirm-title="$t('common.delete')"
                                :confirm-text="$t(`${langKey}.delete_message`)"
                            >
                                {{ $t("common.delete") }}
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
                    <f7-list-input
                        @change="setUrlData"
                        :label="$t('user.status')"
                        v-model:value="filters.status"
                        type="select"
                        :placeholder="
                            $t('common.select_default_text', [$t('user.status')])
                        "
                    >
                        <option value="">
                            {{ $t("common.all") }}
                        </option>
                        <option value="enabled">
                            {{ $t("common.enabled") }}
                        </option>
                        <option value="disabled">
                            {{ $t("common.disabled") }}
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

export default {
    props: {
        f7router: Object,
        f7route: Object,
        userType: {
            default: "customers",
        },
    },
    components: {
        CodrajSelect,
    },
    setup(props) {
        const fieldsVar = fields(props.userType);
        const partiesPageObject = fieldsVar.partiesPageObject;
        const datatableVariables = datatable(fieldsVar);
        const { formatAmountCurrency, permsArray } = common();
        const warehouses = ref([]);

        onMounted(() => {
            const warehousesPromise = axiosAdmin().get("warehouses?limit=10000");

            Promise.all([warehousesPromise]).then(([warehousesResponse]) => {
                warehouses.value = warehousesResponse.data;
                datatableVariables.fetch({
                    page: 1,
                });
            });
        });

        return {
            ...datatableVariables,
            formatAmountCurrency,
            permsArray,

            warehouses,

            partiesPageObject,
        };
    },
};
</script>
