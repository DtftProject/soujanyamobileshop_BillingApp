<template>
  <f7-page>
    <f7-navbar :title="item.name" back-link="Back"> </f7-navbar>

    <f7-card>
      <f7-card-content :padding="false">
        <div style="text-align: left; margin-top: 15px">
          <img :src="item.image_url" style="border-radius: 8px" width="100" />
        </div>
        <f7-list media-list dividers-ios strong-ios outline-ios>
          <f7-list-item :title="$t('product.name')" :subtitle="item.name" />
          <f7-list-item
            :title="$t('product.product_type')"
            :subtitle="item.product_type"
          />
          <f7-list-item
            :title="$t('product.item_code')"
            :subtitle="item.item_code"
          />

          <f7-list-item
            :title="$t('product.category')"
            :subtitle="
              item.category && item.category.xid ? item.category.name : '-'
            "
          />
          <f7-list-item
            :title="$t('product.brand')"
            :subtitle="item.brand && item.brand.xid ? item.brand.name : '-'"
          />

          <f7-list-item
            :title="$t('product.current_stock')"
            :subtitle="
              item.details && item.details.current_stock
                ? `${item.details.current_stock} ${item.unit.short_name}`
                : '-'
            "
          />
          <f7-list-item
            :title="$t('product.quantitiy_alert')"
            :subtitle="
              item.details && item.details.stock_quantitiy_alert
                ? `${item.details.stock_quantitiy_alert} ${item.unit.short_name}`
                : '-'
            "
          />
          <f7-list-item :title="$t('product.sales_price')">
            <template #subtitle>
              {{
                item.details && item.details.sales_price
                  ? formatAmountCurrency(item.details.sales_price)
                  : "-"
              }}
              {{
                item.details && item.details.sales_tax_type == "inclusive"
                  ? ` (${$t("common.with_tax")})`
                  : ` (${$t("common.without_tax")})`
              }}
            </template>
          </f7-list-item>
          <f7-list-item :title="$t('product.purchase_price')">
            <template #subtitle>
              {{
                item.details && item.details.purchase_price
                  ? formatAmountCurrency(item.details.purchase_price)
                  : "-"
              }}
              {{
                item.details && item.details.sales_tax_type == "inclusive"
                  ? ` (${$t("common.with_tax")})`
                  : ` (${$t("common.without_tax")})`
              }}
            </template>
          </f7-list-item>

          <f7-list-item
            :title="$t('product.mrp')"
            :subtitle="
              item.details && item.details.mrp
                ? formatAmountCurrency(item.details.mrp)
                : '-'
            "
          />
          <f7-list-item
            :title="$t('tax.rate')"
            :subtitle="
              item.details && item.details.tax && item.details.tax.rate
                ? `${item.details.tax.rate}%`
                : '-'
            "
          />
          <f7-list-item
            :title="$t('product.opening_stock')"
            :subtitle="
              item.details && item.details.opening_stock
                ? `${item.details.opening_stock} ${item.unit.short_name}`
                : '-'
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

    onMounted(() => {
      // console.log("hi");
    });

    return {
      formatAmountCurrency,
    };
  },
};
</script>
