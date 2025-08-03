<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.suppliers')" :back-link="$t('common.back')">
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
                <f7-link
                    icon-ios="f7:plus_circle"
                    icon-md="f7:plus_circle"
                    @click="createItem({})"
                />
            </f7-nav-right>
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
        </f7-navbar>

        <f7-list media-list strong-ios dividers-ios class="search-list searchbar-found">
            <f7-list-item
                v-for="item in table.data"
                :key="item.xid"
                :title="`${item.name}`"
                @click="viewItem({ item })"
                :subtitle="item.email"
                swipeout
                @swipeout:deleted="deleteItem(item.xid)"
            >
                <template #text>
                    {{ formatAmountCurrency(item.details?.due_amount) }}
                </template>
                <template #media>
                    <img
                        style="border-radius: 8px"
                        :src="item.profile_image_url"
                        width="64"
                    />
                </template>
                <f7-swipeout-actions right>
                    <f7-swipeout-button @click="editItem({ item })">
                        {{ $t("common.edit") }}
                    </f7-swipeout-button>
                    <f7-swipeout-button
                        delete
                        :confirm-title="$t('common.delete')"
                        :confirm-text="$t(`${langKey}.delete_message`)"
                    >
                        {{ $t("common.delete") }}
                    </f7-swipeout-button>
                </f7-swipeout-actions>
            </f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";

export default {
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { formatAmountCurrency } = common();

        onMounted(() => {
            datatableVariables.fetch({
                page: 1,
            });
        });

        return {
            ...datatableVariables,
            formatAmountCurrency,
        };
    },
};
</script>
