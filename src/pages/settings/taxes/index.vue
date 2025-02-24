<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar :title="$t('menu.taxes')" :back-link="$t('common.back')">
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes('taxes_create') ||
                        permsArray.includes('admin')
                    "
                    @click="createItem({ permissions, addEditType: 'add' })"
                    class="navbar-action-btn"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-card footer-divider v-for="item in table.data" :key="item.xid">
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
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="() => (swipeOpenItemXid = item.xid)"
                        @swipeout:close="() => (swipeOpenItemXid = '')"
                    >
                        <template #title> {{ item.name }} ({{ item.rate }}%) </template>
                        <template #subtitle>
                            {{
                                item.tax_type == "single"
                                    ? $t("tax.single")
                                    : $t("tax.multiple")
                            }}
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
                                    permsArray.includes('taxes_edit') ||
                                    permsArray.includes('admin')
                                "
                                @click="editItem({ item, addEditType: 'edit' })"
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    permsArray.includes('taxes_delete') ||
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
            <f7-card-footer v-if="item.tax_type == 'multiple'">
                <div style="width: 100%">
                    <table style="width: 100%">
                        <thead>
                            <tr>
                                <td class="text-bold">{{ $t("tax.name") }}</td>
                                <td class="text-bold text-right">
                                    {{ $t("tax.rate") }}
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tax in item.multiple_tax" :key="`tax_${tax.xid}`">
                                <td>{{ tax.name }}</td>
                                <td class="text-right">{{ tax.rate }}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </f7-card-footer>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted } from "vue";
import datatable from "@/composable/datatable";
import common from "@/composable/common";
import fields from "./fields";
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
