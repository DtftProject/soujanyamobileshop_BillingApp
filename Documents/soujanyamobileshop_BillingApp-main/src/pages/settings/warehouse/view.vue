<template>
    <f7-page>
        <f7-navbar :title="item.name" back-link="Back"> </f7-navbar>
        <div style="text-align: center; margin-top: 15px">
            <img :src="item.logo_url" style="border-radius: 8px" width="100" />
        </div>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item :title="$t('warehouse.name')" :subtitle="item.name" />
                    <f7-list-item :title="$t('warehouse.email')" :subtitle="item.email" />
                    <f7-list-item
                        :title="$t('warehouse.phone')"
                        :subtitle="item.phone ? item.phone : '-'"
                    />
                    <f7-list-item
                        :title="$t('warehouse.terms_condition')"
                        :subtitle="item.terms_condition ? item.terms_condition : '-'"
                    />

                    <f7-list-item
                        :title="$t('warehouse.default_pos_order_status')"
                        :subtitle="$t(`common.${item.default_pos_order_status}`)"
                    />
                    <f7-list-item
                        :title="$t('warehouse.address')"
                        :subtitle="item.address ? item.address : '-'"
                    />
                    <f7-list-item
                        :title="$t('warehouse.bank_details')"
                        :subtitle="item.bank_details ? item.bank_details : '-'"
                    />
                    <f7-list-item
                        :title="$t('warehouse.customers_visibility')"
                        :subtitle="
                            item.customers_visibility == 'all'
                                ? $t('warehouse.view_all_customers')
                                : $t('warehouse.view_warehouse_customers')
                        "
                    />
                    <f7-list-item
                        :title="$t('warehouse.suppliers_visibility')"
                        :subtitle="
                            item.suppliers_visibility == 'all'
                                ? $t('warehouse.view_all_suppliers')
                                : $t('warehouse.view_warehouse_suppliers')
                        "
                    />
                    <f7-list-item
                        :title="$t('warehouse.products_visibility')"
                        :subtitle="
                            item.products_visibility == 'all'
                                ? $t('warehouse.view_all_products')
                                : $t('warehouse.view_warehouse_products')
                        "
                    />
                    <f7-list-item
                        :title="$t('warehouse.barcode_type')"
                        :subtitle="
                            item.barcode_type == 'barcode'
                                ? $t('warehouse.barcode')
                                : $t('warehouse.qrcode')
                        "
                    />
                    <f7-list-item
                        :title="$t('warehouse.show_email_on_invoice')"
                        :subtitle="
                            item.show_email_on_invoice
                                ? $t('common.yes')
                                : $t('common.no')
                        "
                    />
                    <f7-list-item
                        :title="$t('warehouse.show_phone_on_invoice')"
                        :subtitle="
                            item.show_phone_on_invoice
                                ? $t('common.yes')
                                : $t('common.no')
                        "
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import common from "@/composable/common";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {},
    },
    setup(props) {
        const { formatAmountCurrency } = common();

        onMounted(() => {});

        return {
            formatAmountCurrency,
        };
    },
};
</script>
