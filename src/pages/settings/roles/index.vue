<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.roles')" :back-link="$t('common.back')">
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
            <f7-nav-right>
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes('roles_create') ||
                        permsArray.includes('admin')
                    "
                    @click="createItem({ permissions, addEditType: 'add' })"
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
                        :title="item.display_name"
                        @click="viewItem({ item })"
                        :subtitle="item.symbol"
                        swipeout
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="() => (swipeOpenItemXid = item.xid)"
                        @swipeout:close="() => (swipeOpenItemXid = '')"
                    >
                        <template #text>
                            {{ item.description }}
                        </template>

                        <template #after>
                            <f7-link
                                v-if="
                                    swipeOpenItemXid != item.xid && item.name != 'admin'
                                "
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
                            <f7-swipeout-button
                                v-if="
                                    (permsArray.includes('roles_edit') ||
                                        permsArray.includes('admin')) &&
                                    item.name != 'admin'
                                "
                                @click="
                                    editItem({ item, permissions, addEditType: 'edit' })
                                "
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    (permsArray.includes('roles_delete') ||
                                        permsArray.includes('admin')) &&
                                    item.name != 'admin'
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
import { onMounted, ref } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    setup(props) {
        const fieldsVar = fields();
        const datatableVariables = datatable(fieldsVar);
        const { permsArray } = common();
        const permissions = ref([]);

        onMounted(() => {
            const permissionsPromise = axiosAdmin().get(
                "permissions?fields=id,xid,name,display_name&limit=10000"
            );
            Promise.all([permissionsPromise]).then(([permissionsResponse]) => {
                const permissionArray = [];
                permissionsResponse.data.map((res) => {
                    permissionArray[res.name] = res.xid;
                });
                permissions.value = permissionArray;

                datatableVariables.fetch({
                    page: 1,
                });
            });
        });

        return {
            ...datatableVariables,
            permsArray,

            permissions,
        };
    },
};
</script>
