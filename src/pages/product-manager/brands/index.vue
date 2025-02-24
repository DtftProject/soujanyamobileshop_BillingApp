<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.brands')" :back-link="$t('common.back')">
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable navbar-action-btn"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes('brands_create') ||
                        permsArray.includes('admin')
                    "
                    @click="createItem({})"
                    class="navbar-action-btn"
                />
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
                        :title="`${item.name}`"
                        swipeout
                        @click="viewItem({ item })"
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="() => (swipeOpenItemXid = item.xid)"
                        @swipeout:close="() => (swipeOpenItemXid = '')"
                    >
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="item.image_url"
                                width="32"
                                height="32"
                            />
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
                            <f7-swipeout-button
                                v-if="
                                    permsArray.includes('brands_edit') ||
                                    permsArray.includes('admin')
                                "
                                @click="editItem({ item, addEditType: 'edit' })"
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    permsArray.includes('brands_delete') ||
                                    permsArray.includes('admin')
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
    </f7-page>
</template>

<script>
import { onMounted } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { permsArray } = common();

        onMounted(() => {
            datatableVariables.fetch({
                page: 1,
            });
        });

        return {
            ...datatableVariables,
            permsArray,
        };
    },
};
</script>
