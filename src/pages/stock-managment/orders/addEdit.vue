<template>
    <f7-page name="sales-add-edit">
        <f7-navbar
            :title="$t(`${orderPageObject.langKey}.${addEditType}`)"
            :back-link="$t('common.back')"
        >
            <f7-nav-right>
                <f7-button @click="onFormSubmit">
                    {{ $t("common.save") }}
                </f7-button>
            </f7-nav-right>
        </f7-navbar>

        <f7-card
            v-if="editOrderDisable"
            style="background: #fffbe6; border: 1px solid #ffe58f"
        >
            <f7-card-content>
                <div style="display: flex">
                    <div><f7-icon f7="exclamationmark_circle"></f7-icon></div>
                    <div class="margin-l5">
                        {{ $t("messages.not_able_to_edit_order") }}
                    </div>
                </div>
            </f7-card-content>
        </f7-card>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list
                    strong-ios
                    dividers-ios
                    outline-ios
                    :style="{ marginTop: '0px' }"
                >
                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('stock.invoice_number'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.invoice_number ? rules.invoice_number.message : null
                        "
                        v-model:value="formData.invoice_number"
                        :label="$t('stock.invoice_number')"
                        :disabled="editOrderDisable"
                    />

                    <f7-list-input
                        v-if="orderPageObject.type == 'stock-transfers'"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.warehouse_id ? rules.warehouse_id.message : null
                        "
                        :disabled="editOrderDisable"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t(`${orderPageObject.langKey}.warehouse`) }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t(`${orderPageObject.langKey}.warehouse`),
                                    ])
                                "
                                :selectedValue="formData.warehouse_id"
                                :items="warehouses"
                                fieldKey="xid"
                                fieldName="name"
                                className="warehouse-select"
                                @changed="(newVal) => (formData.warehouse_id = newVal)"
                            />
                        </template>
                    </f7-list-input>
                    <f7-list-input
                        v-else
                        :input="false"
                        error-message-force
                        :error-message="rules.user_id ? rules.user_id.message : null"
                        :disabled="editOrderDisable"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t(`${orderPageObject.langKey}.user`) }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t(`${orderPageObject.langKey}.user`),
                                    ])
                                "
                                :selectedValue="formData.user_id"
                                :items="users"
                                fieldKey="xid"
                                fieldName="name"
                                className="user-select"
                                @changed="(newVal) => (formData.user_id = newVal)"
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        v-if="formData.order_date"
                        error-message-force
                        :error-message="
                            rules.order_date ? rules.order_date.message : null
                        "
                        type="datepicker"
                        :placeholder="
                            $t('common.select_default_text', [
                                $t(
                                    `${orderPageObject.langKey}.${orderPageObject.langKey}_date`
                                ),
                            ])
                        "
                        readonly
                        :calendar-params="{
                            locale: 'en-GB',
                            value: formData.order_date ? [formData.order_date] : [],
                            timePicker: true,
                            formatValue: (allValues) => {
                                let newFormat = formatValueFunciton(allValues);
                                if (newFormat && newFormat[1]) {
                                    formData.order_date = newFormat[1];
                                }
                                return newFormat && newFormat[0] ? newFormat[0] : '';
                            },
                        }"
                        :disabled="editOrderDisable"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{
                                $t(
                                    `${orderPageObject.langKey}.${orderPageObject.langKey}_date`
                                )
                            }}
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title>
            <div style="display: flex; justify-content: space-between">
                <span style="margin-top: 5px">{{ $t("product.order_items") }}</span>
                <BarcodeScanCart
                    v-if="!editOrderDisable"
                    :selectedProducts="selectedProducts"
                    @quantityChanged="(product) => quantityChanged(product)"
                    @showDeleteConfirm="(product) => showDeleteConfirm(product)"
                    @searchValueSelected="
                        (product) => searchValueSelected('', { product })
                    "
                    :warehouseId="formData.warehouse_id"
                    :orderType="formData.order_type"
                />
            </div>
        </f7-block-title>

        <div
            class="align-content text-red"
            v-if="rules.product_items && rules.product_items.message"
        >
            {{ rules.product_items.message }}
        </div>

        <f7-card v-if="selectedProducts.length > 0">
            <f7-card-content>
                <f7-list media-list strong-ios dividers-ios>
                    <f7-list-item
                        v-for="product in selectedProducts"
                        :key="product.xid"
                        :title="product.name"
                    >
                        <template #media>
                            <img
                                style="border-radius: 8px"
                                :src="product.image_url"
                                width="44"
                                height="44"
                            />
                        </template>
                        <template #after>
                            {{ formatAmountCurrency(product.subtotal) }}
                        </template>
                        <template #subtitle> </template>

                        <template #inner>
                            <div
                                style="display: flex; justify-content: space-between"
                                class="margin-t10"
                            >
                                <div>
                                    <small>
                                        {{
                                            `${formatAmountCurrency(
                                                product.single_unit_price
                                            )} x ${product.quantity}`
                                        }}
                                    </small>
                                </div>
                                <div>
                                    <span style="display: flex">
                                        <f7-button
                                            @click="
                                                () => {
                                                    if (product.quantity == 1) {
                                                        showDeleteConfirm(product);
                                                    } else {
                                                        product.quantity -= 1;
                                                        quantityChanged(product);
                                                    }
                                                }
                                            "
                                            :disabled="editOrderDisable"
                                        >
                                            <f7-icon
                                                f7="minus_circle"
                                                size="20px"
                                                color="blue"
                                            >
                                            </f7-icon>
                                        </f7-button>
                                        <div style="margin-top: 2px">
                                            {{ product.quantity }}
                                        </div>
                                        <f7-button
                                            @click="
                                                () => {
                                                    product.quantity += 1;
                                                    quantityChanged(product);
                                                }
                                            "
                                            :disabled="editOrderDisable"
                                        >
                                            <f7-icon
                                                f7="plus_circle_fill"
                                                size="20px"
                                                color="blue"
                                            >
                                            </f7-icon>
                                        </f7-button>
                                        <f7-button
                                            @click="editItem(product)"
                                            :disabled="editOrderDisable"
                                        >
                                            <f7-icon material="edit" size="20px" color="blue">
                                            </f7-icon>
                                        </f7-button>
                                        <f7-button
                                            @click="showDeleteConfirm(product)"
                                            :disabled="editOrderDisable"
                                        >
                                            <f7-icon f7="trash" size="20px" color="blue">
                                            </f7-icon>
                                        </f7-button>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-card v-if="!editOrderDisable">
            <div class="add-order-item" @click="openProductList">
                <f7-link icon-only class="add-order-item-icon">
                    <f7-icon ios="f7:plus" md="f7:plus" size="18" />
                    {{ $t("stock.add_order_item") }}
                </f7-link>
            </div>
        </f7-card>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list
                    strong-ios
                    dividers-ios
                    outline-ios
                    :style="{ marginTop: '0px' }"
                >
                    <f7-list-input
                        v-if="orderPageObject.type != 'quotations'"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.order_status ? rules.order_status.message : null
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("stock.status") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <f7-input
                                :label="null"
                                type="select"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('stock.status'),
                                    ])
                                "
                                :style="{ width: '100%' }"
                                v-model:value="formData.order_status"
                            >
                                <option
                                    v-for="status in allOrderStatus"
                                    :key="status.key"
                                    :value="status.key"
                                >
                                    {{ status.value }}
                                </option>
                            </f7-input>
                        </template>
                    </f7-list-input>
                    <f7-list-input
                        :label="$t('stock.order_tax')"
                        :input="false"
                        error-message-force
                        :error-message="rules.tax_id ? rules.tax_id.message : null"
                        :disabled="editOrderDisable"
                    >
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('stock.order_tax'),
                                    ])
                                "
                                :selectedValue="formData.tax_id"
                                :items="taxes"
                                fieldKey="xid"
                                fieldName="name"
                                className="taxes-select"
                                :sendFullObject="1"
                                @changed="
                                    (tax) => {
                                        formData.tax_id = tax.xid;
                                        taxChanged(tax.xid, { tax });
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>
                    <f7-list-input
                        :input="false"
                        type="text"
                        :label="$t('stock.discount')"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('stock.discount')])
                        "
                        error-message-force
                        :error-message="rules.discount ? rules.discount.message : null"
                        :disabled="editOrderDisable"
                    >
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">
                                    {{ appSetting.currency.symbol }}
                                </span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('product.discount'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.discount"
                                    @change="recalculateFinalTotal"
                                />
                            </div>
                        </template>
                    </f7-list-input>
                    <f7-list-input
                           :label="$t(`Round The Amount`)"
                          type="select"
                         v-model:value="formData.roundfigure"
                        @change="roundprice()"
                        >
                          
                          <option
                             v-for="item in roundoption"
                                :key="item.id"
                                :value="item.id"
                                :title="item.name"
                                >
                                 {{ item.name }}
                          </option>
                        </f7-list-input>
                      <f7-list-input
                        :input="false"
                        type="text"
                        :label="$t('Exchange')"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('exchange')])
                        "
                        error-message-force
                        :error-message="rules.exchange ? rules.exchange.message : null"
                        :disabled="editOrderDisable"
                    >
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">
                                    {{ appSetting.currency.symbol }}
                                </span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('exchange'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.exchange"
                                    @change="recalculateFinalTotal"
                                />
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :input="false"
                        type="text"
                        :label="$t('stock.shipping')"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('stock.shipping')])
                        "
                        error-message-force
                        :error-message="rules.shipping ? rules.shipping.message : null"
                        :disabled="editOrderDisable"
                    >
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">
                                    {{ appSetting.currency.symbol }}
                                </span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('product.shipping'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.shipping"
                                    @change="recalculateFinalTotal"
                                />
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('stock.notes')])
                        "
                        error-message-force
                        :error-message="rules.notes ? rules.notes.message : null"
                        v-model:value="formData.notes"
                        :label="$t('stock.notes')"
                        resizable
                        :disabled="editOrderDisable"
                    />

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('stock.notes')])
                        "
                        error-message-force
                        :error-message="
                            rules.terms_condition ? rules.terms_condition.message : null
                        "
                        v-model:value="formData.terms_condition"
                        :label="$t('warehouse.terms_condition')"
                        resizable
                        :disabled="editOrderDisable"
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-toolbar bottom>
            <f7-link sheet-open=".demo-sheet-swipe-to-close">
                {{ $t("stock.grand_total") }} :
                {{ formatAmountCurrency(formData.subtotal) }}
            </f7-link>

            <f7-link
                sheet-open=".demo-sheet-swipe-to-close"
                icon-size="24"
                class="margin-l10"
                icon-ios="f7:chevron_up"
                icon-md="f7:chevron_up"
            />
        </f7-toolbar>

        <f7-popup v-model:opened="productVisible" class="demo-popup">
            <f7-page>
                <f7-navbar :title="$t('product.product')">
                    <f7-nav-right>
                        <f7-link popup-close>{{ $t("Close") }}</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-searchbar
                    :custom-search="true"
                    @searchbar:search="
                        (searchbar, searchbarQuery, searchbarPreviousQuery) => {
                            fetchProducts(searchbarQuery);
                        }
                    "
                    class="searchbar-demo"
                />

                <f7-block v-if="state.products.length == 0">
                    <p class="text-center">
                        {{ $t("stock.search_item_to_add") }}
                    </p>
                </f7-block>

                <f7-card v-else>
                    <f7-card-content>
                        <f7-list media-list strong-ios dividers-ios>
                            <f7-list-item
                                v-for="product in state.products"
                                :key="product.xid"
                                
                            >
                                <template #media>
                                    <img
                                        style="border-radius: 8px"
                                        :src="product.image_url"
                                        width="44"
                                        height="44"
                                    />
                                </template>
                                 <template #title>
                                    <div
                                      style="
                                        font-size: 16px;
                                        white-space: normal;
                                       word-break: break-word;
                                        line-height: 1.3;
                                      "
                                    >
                                      {{ product.name }}
                                    </div>
                                  </template>
                                <template #after>
                                    {{ $t("product.avl_qty") }}
                                    {{
                                        `${product.stock_quantity}${product.unit?.short_name}`
                                    }}
                                </template>

                                <template #inner>
                                    <div
                                        style="
                                            display: flex;
                                            justify-content: space-between;
                                        "
                                        class="margin-t10"
                                    >
                                        <div>
                                            <small>
                                                {{
                                                    formatAmountCurrency(
                                                        product.single_unit_price
                                                    )
                                                }}
                                            </small>
                                        </div>
                                        <div>
                                            <f7-link
                                                icon-ios="f7:plus"
                                                icon-md="f7:plus"
                                                icon-size="18"
                                                @click="
                                                    () =>
                                                        searchValueSelected(
                                                            product.name,
                                                            { product }
                                                        )
                                                "
                                                style="
                                                    font-weight: bold;
                                                    background: #f6f6f6;
                                                    padding: 1px 2px;
                                                    border-radius: 2px;
                                                "
                                            >
                                                <span style="margin-right: 4px">
                                                    {{ $t("common.add") }}
                                                </span>
                                            </f7-link>
                                        </div>
                                    </div>
                                </template>
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>

                <f7-toolbar bottom>
                    <f7-link sheet-open=".cart-sheet-swipe-to-close">
                        {{ $t("invoice.total_items") }} :
                        {{ selectedProducts.length }} ({{ totalQuantity }})
                    </f7-link>

                    <f7-link
                        sheet-open=".cart-sheet-swipe-to-close"
                        icon-size="24"
                        class="margin-l10"
                        icon-ios="f7:chevron_up"
                        icon-md="f7:chevron_up"
                    />
                </f7-toolbar>
            </f7-page>
        </f7-popup>

        <f7-sheet
            class="demo-sheet-swipe-to-close"
            style="height: auto"
            swipe-to-close
            backdrop
        >
            <div class="swipe-handler"></div>

            <f7-page-content>
                <f7-block-title medium class="text-center">
                    {{ $t("invoice.total") }} :
                    {{ formatAmountCurrency(formData.subtotal) }}
                </f7-block-title>
                <f7-list strong outline-ios dividers-ios inset-md>
                    <f7-list-item
                        :title="$t('product.subtotal')"
                        :after="formatAmountCurrency(productsAmount.subtotal)"
                    />
                    <f7-list-item
                        :title="$t('stock.order_tax')"
                        :after="formatAmountCurrency(formData.tax_amount)"
                    />
                    <f7-list-item
                        :title="$t('stock.discount')"
                        :after="formatAmountCurrency(formData.discount)"
                    />
                    <f7-list-item
                        :title="$t('stock.shipping')"
                        :after="formatAmountCurrency(formData.shipping)"
                    />
                    <f7-list-item
                        :title="$t('stock.grand_total')"
                        :after="formatAmountCurrency(formData.subtotal)"
                    />
                </f7-list>
            </f7-page-content>
        </f7-sheet>

        <f7-sheet
            class="cart-sheet-swipe-to-close"
            style="height: 50%"
            swipe-to-close
            backdrop
        >
            <div class="swipe-handler"></div>

            <f7-page-content>
                <f7-card v-if="selectedProducts.length > 0">
                    <f7-card-content>
                        <f7-list media-list strong-ios dividers-ios>
                            <f7-list-item
                                v-for="product in selectedProducts"
                                :key="product.xid"
                                :title="product.name"
                            >
                                <template #media>
                                    <img
                                        style="border-radius: 8px"
                                        :src="product.image_url"
                                        width="44"
                                        height="44"
                                    />
                                </template>
                                <template #after>
                                    {{ formatAmountCurrency(product.subtotal) }}
                                </template>
                                <template #subtitle> </template>

                                <template #inner>
                                    <div
                                        style="
                                            display: flex;
                                            justify-content: space-between;
                                        "
                                        class="margin-t10"
                                    >
                                        <div>
                                            <small>
                                                {{
                                                    `${formatAmountCurrency(
                                                        product.single_unit_price
                                                    )} x ${product.quantity}`
                                                }}
                                            </small>
                                        </div>
                                        <div>
                                            <span style="display: flex">
                                                <f7-button
                                                    @click="
                                                        () => {
                                                            if (product.quantity == 1) {
                                                                showDeleteConfirm(
                                                                    product
                                                                );
                                                            } else {
                                                                product.quantity -= 1;
                                                                quantityChanged(product);
                                                            }
                                                        }
                                                    "
                                                >
                                                    <f7-icon
                                                        f7="minus_circle"
                                                        size="20px"
                                                        color="blue"
                                                    >
                                                    </f7-icon>
                                                </f7-button>
                                                <div style="margin-top: 2px">
                                                    {{ product.quantity }}
                                                </div>
                                                <f7-button
                                                    @click="
                                                        () => {
                                                            product.quantity += 1;
                                                            quantityChanged(product);
                                                        }
                                                    "
                                                >
                                                    <f7-icon
                                                        f7="plus_circle_fill"
                                                        size="20px"
                                                        color="blue"
                                                    >
                                                    </f7-icon>
                                                </f7-button>

                                                <f7-button
                                                    @click="showDeleteConfirm(product)"
                                                >
                                                    <f7-icon
                                                        f7="trash"
                                                        size="20px"
                                                        color="blue"
                                                    >
                                                    </f7-icon>
                                                </f7-button>
                                            </span>
                                        </div>
                                    </div>
                                </template>
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-page-content>
        </f7-sheet>
        <f7-popup v-model:opened="addEditVisible">
            <f7-page>
                <f7-navbar :title="addEditPageTitle">
                  <f7-nav-right>
                    <f7-link popup-close>Close</f7-link>
                  </f7-nav-right>
                </f7-navbar>
                <f7-list form>
                  <f7-list-input
                    :label="$t('Serial No.')"
                     name="item_code"
                     v-if="addEditFormData.category_id != 1"
                     v-model:value="addEditFormData.item_code"
                    :placeholder="
                                $t('common.placeholder_default_text', [
                                    $t('Product Serial Number'),
                                ])
                            "
                    clear-button
                  ></f7-list-input>
                   <f7-list-input
                    :input="false"
                    type="text"
                    :label="$t('product.unit_price')"
                    :placeholder="
                                $t('common.placeholder_default_text', [
                                    $t('product.unit_price'),
                                ])
                            "
                    min="0"
                    clear-button
                  >
                  <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">
                                    {{ appSetting.currency.symbol }}
                                </span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                $t('common.placeholder_default_text', [
                                    $t('product.unit_price'),
                                ])
                            "
                                    :style="{ width: '100%' }"
                                    name="unit_price"
                                    v-model:value="addEditFormData.unit_price"  
                                />
                            </div>
                        </template>
              </f7-list-input>
                <f7-list-input
                    :input="false"
                    type="text"
                    :label="$t('product.discount')"
                    
                     :placeholder="
                                $t('common.placeholder_default_text', [
                                    $t('product.discount'),
                                ])
                            "
                    min="0"
                    clear-button
                  >
                  <template #input>
                            <div style="display: flex">
                                
                                <f7-input
                                    type="number"
                                    :placeholder="
                                $t('common.placeholder_default_text', [
                                    $t('product.discount'),
                                ])
                            "
                                    :style="{ width: '100%' }"
                                    name="discount_rate"
                                    v-model:value="addEditFormData.discount_rate"  
                                />
                                <span class="input-prefix">
                                    %
                                </span>
                            </div>
                        </template>
                </f7-list-input>
                <f7-list-input
                          :label="$t('product.tax')"
                          type="select"
                          v-model:value="addEditFormData.tax_id"
                        >
                          <option
                             v-for="tax in taxes"
                                    :key="tax.xid"
                                    :value="tax.xid"
                                    :title="tax.name"
                                >
                                {{ tax.name }} ({{ tax.rate }}%)
                          </option>
                        </f7-list-input>
                        
                    <f7-list-input
                          :label="$t('product.tax_type')"
                          type="select"
                          v-model:value="addEditFormData.tax_type"
                        >
                         
                          <option
                            v-for="taxType in taxTypes"
                            :key="taxType.key"
                            :value="taxType.key"
                          >
                            {{ taxType.value }}
                          </option>
                        </f7-list-input>
                </f7-list>
                <f7-toolbar bottom class="custom-toolbar">
                <div class="toolbar-inner">
                  <f7-link @click="onAddEditSubmit">
                    <f7-icon md="save" title="Save"></f7-icon>
                    {{ $t('common.save') }}
                  </f7-link>
                  </div>
                </f7-toolbar>
            </f7-page>
        </f7-popup>
    </f7-page>
</template>
<script>
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import { axiosAdmin } from "@/common/axiosAdmin";
import fields from "./fields";
import stockManagement from "./stockManagement";
import BarcodeScanCart from "../../../components/scanner/BarcodeScanCart.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        warehouses: {
            default: [],
        },
        products: {
            default: [],
        },
        users: {
            default: [],
        },
        taxes: {
            default: [],
        },
        item: {
            default: {},
        },
        addEditType: {
            default: "add",
        },
        orderType: {
            default: "sales",
        },
    },
    components: {
        CodrajSelect,
        BarcodeScanCart,
    },
    setup(props) {
        
        const appStore = useAppStore();
        const fieldsVar = fields(props.orderType);
        const allOrderStatus = fieldsVar.allOrderStatus;
        const orderPageObject = fieldsVar.orderPageObject;
        const {
            formatAmountCurrency,
            appSetting,
            permsArray,
            taxTypes,
            formatValueFunciton,
        } = common();
        const warehouseVisible = ref(false);
        const productVisible = ref(false);
        const roundoption = ref([
              { id: 0, name: 'Pleae Choose' },
              { id: 1, name: 'Round Up' },
              { id: 2, name: 'Round Down'}
            ]);
        const {
            setFormData,
            state,
            orderType,
            selectedProducts,
            selectedProductIds,
            productsAmount,
            taxes,
            
            setTaxes,
            recalculateValues,
            fetchProducts,
            searchValueSelected,
            quantityChanged,
            recalculateFinalTotal,
            showDeleteConfirm,
            taxChanged,
            editItem,

            // Add Edit
            addEditVisible,
            addEditFormData,
            addEditFormSubmitting,
            addEditRules,
            addEditPageTitle,
            onAddEditSubmit,
            onAddEditClose,
            removedOrderItemsIds,

            calculateProductAmount,
            inputValueChanged,
            roundprice,
            formData,
            loading,
            rules,
            onSubmit,
            initCrud,
            formDataLoaded,
            totalQuantity,
            editOrderDisable,
        } = stockManagement(props.addEditType, props.item, fieldsVar);

        onMounted(() => {
            setFormData();
            taxes.value = props.taxes;
            
            // Sending request if formDataLoaded from initCrud
            // TODO - later extract object from order object
            // So that no need to send axios request
            // TODO - Don't forgot to update the total from subtotal
            if (props.addEditType == "edit") {
                axiosAdmin()
                    .get(`${orderType.value}/${props.item.xid}`)
                    .then((orderResponse) => {
                        const orderResponseData = orderResponse.data;

                        formData.value = {
                            ...formData.value,
                            subtotal: orderResponseData.order.total,
                        };

                        selectedProductIds.value = orderResponseData.ids;
                        selectedProducts.value = orderResponseData.items;

                        calculateProductAmount();

                        if (orderResponseData.order.payment_status != "unpaid") {
                            editOrderDisable.value = true;
                        }
                    });
            }
        });

        const onFormSubmit = () => {
            formData.value = {
                ...formData.value,
                total: formData.value.subtotal,
                total_items: selectedProducts.value.length,
                product_items: selectedProducts.value,
            };

            if (props.addEditType == "edit") {
                formData.value = {
                    ...formData.value,
                    removed_items: removedOrderItemsIds.value,
                };
            }

            onSubmit();
        };

        const openProductList = () => {
            productVisible.value = true;
        };

        return {
            formData,
            loading,
            rules,
            onSubmit,
            initCrud,
            formDataLoaded,
            taxTypes,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            warehouseVisible,
            appStore,
            formatValueFunciton,

            onFormSubmit,

            state,
            orderType,
            orderPageObject,
            selectedProducts,
            productsAmount,

            recalculateValues,
            fetchProducts,
            searchValueSelected,
            quantityChanged,
            recalculateFinalTotal,
            showDeleteConfirm,
            taxChanged,
            editItem,

            // Add Edit
            addEditVisible,
            addEditFormData,
            addEditFormSubmitting,
            addEditRules,
            addEditPageTitle,
            onAddEditSubmit,
            onAddEditClose,

            inputValueChanged,
            allOrderStatus,
            productVisible,
            openProductList,
            roundoption,
            editOrderDisable,
            roundprice,
            totalQuantity,
        };
    },
};
</script>

<style scoped>
.add-order-item {
    position: relative;
    width: 100%; /* Set width as needed */
    height: 40px; /* Set height as needed */
    background-color: #00000005; /* Gray background */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
}

.add-order-item-icon {
    font-weight: bold;
}

.swipe-handler {
    height: 16px;
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    background: #fff;
    cursor: pointer;
    z-index: 10;
}

.swipe-handler:after {
    content: "";
    width: 36px;
    height: 6px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -18px;
    margin-top: -3px;
    border-radius: 3px;
    background: #666;
}
.custom-input-group {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 4px 8px;
}
.input-prefix {
  font-size: 16px;
  color: #555;
  margin-right: 8px;
  white-space: nowrap;
}
</style>
