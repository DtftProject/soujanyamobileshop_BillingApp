<template>
    <f7-page>
        <f7-navbar
            :title="$t(`${fieldsVar.langKey}.${addEditType}`)"
            :back-link="$t('common.back')"
        >
            <f7-nav-right>
                <f7-button @click="onFormSubmit">
                    {{ $t("common.save") }}
                </f7-button>
            </f7-nav-right>
        </f7-navbar>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('role.display_name'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.display_name ? rules.display_name.message : null
                        "
                        v-model:value="formData.display_name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("role.display_name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('role.role_name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("role.role_name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('role.description'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.description ? rules.description.message : null
                        "
                        v-model:value="formData.description"
                        :label="$t('role.description')"
                        resizable
                    >
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title>{{ $t("role.permissions") }}</f7-block-title>
        <span class="text-red align-content" v-if="rules.permissions">
            {{ rules.permissions ? rules.permissions.message : "" }}
        </span>
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list strong-ios outline-ios dividers-ios>
                    <f7-list-item :title="$t('menu.brands')" name="brands">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['brands_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="brands_view"
                                    :value="permissions['brands_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['brands_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="brands_create"
                                    :value="permissions['brands_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['brands_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="brands_edit"
                                    :value="permissions['brands_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['brands_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="brands_delete"
                                    :value="permissions['brands_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>

                    <f7-list-item :title="$t('menu.categories')" name="categories">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['categories_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="categories_view"
                                    :value="permissions['categories_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['categories_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="categories_create"
                                    :value="permissions['categories_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['categories_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="categories_edit"
                                    :value="permissions['categories_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['categories_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="categories_delete"
                                    :value="permissions['categories_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>

                    <f7-list-item :title="$t('menu.variations')" name="variations">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['variations_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="variations_view"
                                    :value="permissions['variations_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['variations_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="variations_create"
                                    :value="permissions['variations_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['variations_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="variations_edit"
                                    :value="permissions['variations_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['variations_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="variations_delete"
                                    :value="permissions['variations_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.products')" name="products">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['products_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="products_view"
                                    :value="permissions['products_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['products_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="products_create"
                                    :value="permissions['products_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['products_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="products_edit"
                                    :value="permissions['products_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['products_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="products_delete"
                                    :value="permissions['products_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item
                        :title="$t('menu.expense_categories')"
                        name="expense_categories"
                    >
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['expense_categories_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="expense_categories_view"
                                    :value="permissions['expense_categories_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['expense_categories_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="expense_categories_create"
                                    :value="permissions['expense_categories_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['expense_categories_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="expense_categories_edit"
                                    :value="permissions['expense_categories_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['expense_categories_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="expense_categories_delete"
                                    :value="permissions['expense_categories_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.expenses')" name="expenses">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['expenses_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="expenses_view"
                                    :value="permissions['expenses_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['expenses_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="expenses_create"
                                    :value="permissions['expenses_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['expenses_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="expenses_edit"
                                    :value="permissions['expenses_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['expenses_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="expenses_delete"
                                    :value="permissions['expenses_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.purchases')" name="purchases">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['purchases_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="purchases_view"
                                    :value="permissions['purchases_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['purchases_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="purchases_create"
                                    :value="permissions['purchases_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['purchases_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="purchases_edit"
                                    :value="permissions['purchases_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['purchases_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="purchases_delete"
                                    :value="permissions['purchases_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item
                        :title="$t('menu.purchase_returns')"
                        name="purchase_returns"
                    >
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['purchase_returns_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="purchase_returns_view"
                                    :value="permissions['purchase_returns_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['purchase_returns_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="purchase_returns_create"
                                    :value="permissions['purchase_returns_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['purchase_returns_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="purchase_returns_edit"
                                    :value="permissions['purchase_returns_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['purchase_returns_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="purchase_returns_delete"
                                    :value="permissions['purchase_returns_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.sales')" name="sales">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['sales_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="sales_view"
                                    :value="permissions['sales_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['sales_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="sales_create"
                                    :value="permissions['sales_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['sales_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="sales_edit"
                                    :value="permissions['sales_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['sales_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="sales_delete"
                                    :value="permissions['sales_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.sales_returns')" name="sales_returns">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['sales_returns_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="sales_returns_view"
                                    :value="permissions['sales_returns_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['sales_returns_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="sales_returns_create"
                                    :value="permissions['sales_returns_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['sales_returns_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="sales_returns_edit"
                                    :value="permissions['sales_returns_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['sales_returns_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="sales_returns_delete"
                                    :value="permissions['sales_returns_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item
                        :title="$t('menu.order_payments')"
                        name="order_payments"
                    >
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['order_payments_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="order_payments_view"
                                    :value="permissions['order_payments_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['order_payments_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="order_payments_create"
                                    :value="permissions['order_payments_create']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.payment_in')" name="payment_in">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_in_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="payment_in_view"
                                    :value="permissions['payment_in_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_in_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="payment_in_create"
                                    :value="permissions['payment_in_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_in_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="payment_in_edit"
                                    :value="permissions['payment_in_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_in_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="payment_in_delete"
                                    :value="permissions['payment_in_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.payment_out')" name="payment_out">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_out_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="payment_out_view"
                                    :value="permissions['payment_out_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_out_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="payment_out_create"
                                    :value="permissions['payment_out_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_out_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="payment_out_edit"
                                    :value="permissions['payment_out_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_out_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="payment_out_delete"
                                    :value="permissions['payment_out_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.quotation')" name="quotations">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['quotations_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="quotations_view"
                                    :value="permissions['quotations_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['quotations_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="quotations_create"
                                    :value="permissions['quotations_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['quotations_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="quotations_edit"
                                    :value="permissions['quotations_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['quotations_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="quotations_delete"
                                    :value="permissions['quotations_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item
                        :title="$t('menu.stock_adjustment')"
                        name="stock_adjustments"
                    >
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['stock_adjustments_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="stock_adjustments_view"
                                    :value="permissions['stock_adjustments_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['stock_adjustments_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="stock_adjustments_create"
                                    :value="permissions['stock_adjustments_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['stock_adjustments_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="stock_adjustments_edit"
                                    :value="permissions['stock_adjustments_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['stock_adjustments_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="stock_adjustments_delete"
                                    :value="permissions['stock_adjustments_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item
                        :title="$t('menu.stock_transfer')"
                        name="stock_transfers"
                    >
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['stock_transfers_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="stock_transfers_view"
                                    :value="permissions['stock_transfers_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['stock_transfers_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="stock_transfers_create"
                                    :value="permissions['stock_transfers_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['stock_transfers_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="stock_transfers_edit"
                                    :value="permissions['stock_transfers_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['stock_transfers_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="stock_transfers_delete"
                                    :value="permissions['stock_transfers_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.pos')" name="pos">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['pos_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="pos_view"
                                    :value="permissions['pos_view']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.company')" name="companies">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['companies_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="companies_edit"
                                    :value="permissions['companies_edit']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item
                        :title="$t('menu.storage_settings')"
                        name="storage_settings"
                    >
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['storage_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="storage_edit"
                                    :value="permissions['storage_edit']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item
                        :title="$t('menu.email_settings')"
                        name="email_settings"
                    >
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['email_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="email_edit"
                                    :value="permissions['email_edit']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.update_app')" name="update_app">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['update_app']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.update_app')"
                                    name="update_app"
                                    :value="permissions['update_app']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.cash_bank')" name="cash_bank">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['cash_bank_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="cash_bank_view"
                                    :value="permissions['cash_bank_view']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.warehouses')" name="warehouses">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['warehouses_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="warehouses_view"
                                    :value="permissions['warehouses_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['warehouses_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="warehouses_create"
                                    :value="permissions['warehouses_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['warehouses_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="warehouses_edit"
                                    :value="permissions['warehouses_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['warehouses_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="warehouses_delete"
                                    :value="permissions['warehouses_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.translations')" name="translations">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['translations_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="translations_view"
                                    :value="permissions['translations_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['translations_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="translations_create"
                                    :value="permissions['translations_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['translations_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="translations_edit"
                                    :value="permissions['translations_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['translations_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="translations_delete"
                                    :value="permissions['translations_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.roles')" name="roles">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['roles_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="roles_view"
                                    :value="permissions['roles_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['roles_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="roles_create"
                                    :value="permissions['roles_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['roles_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="roles_edit"
                                    :value="permissions['roles_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['roles_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="roles_delete"
                                    :value="permissions['roles_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.taxes')" name="taxes">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['taxes_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="taxes_view"
                                    :value="permissions['taxes_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['taxes_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="taxes_create"
                                    :value="permissions['taxes_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['taxes_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="taxes_edit"
                                    :value="permissions['taxes_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['taxes_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="taxes_delete"
                                    :value="permissions['taxes_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.currencies')" name="currencies">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['currencies_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="currencies_view"
                                    :value="permissions['currencies_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['currencies_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="currencies_create"
                                    :value="permissions['currencies_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['currencies_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="currencies_edit"
                                    :value="permissions['currencies_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['currencies_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="currencies_delete"
                                    :value="permissions['currencies_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.payment_modes')" name="payment_modes">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_modes_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="payment_modes_view"
                                    :value="permissions['payment_modes_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_modes_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="payment_modes_create"
                                    :value="permissions['payment_modes_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_modes_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="payment_modes_edit"
                                    :value="permissions['payment_modes_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['payment_modes_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="payment_modes_delete"
                                    :value="permissions['payment_modes_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.units')" name="units">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['units_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="units_view"
                                    :value="permissions['units_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['units_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="units_create"
                                    :value="permissions['units_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['units_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="units_edit"
                                    :value="permissions['units_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['units_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="units_delete"
                                    :value="permissions['units_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.custom_fields')" name="custom_fields">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['custom_fields_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="custom_fields_view"
                                    :value="permissions['custom_fields_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['custom_fields_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="custom_fields_create"
                                    :value="permissions['custom_fields_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['custom_fields_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="custom_fields_edit"
                                    :value="permissions['custom_fields_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['custom_fields_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="custom_fields_delete"
                                    :value="permissions['custom_fields_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.staff_members')" name="staff_members">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['users_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="users_view"
                                    :value="permissions['users_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['users_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="users_create"
                                    :value="permissions['users_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['users_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="users_edit"
                                    :value="permissions['users_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['users_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="users_delete"
                                    :value="permissions['users_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.customers')" name="customers">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['customers_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="customers_view"
                                    :value="permissions['customers_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['customers_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="customers_create"
                                    :value="permissions['customers_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['customers_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="customers_edit"
                                    :value="permissions['customers_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['customers_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="customers_delete"
                                    :value="permissions['customers_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                    <f7-list-item :title="$t('menu.suppliers')" name="suppliers">
                        <template #root>
                            <ul style="display: flex; flex-wrap: wrap; padding: 0px">
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['suppliers_view']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.view')"
                                    name="suppliers_view"
                                    :value="permissions['suppliers_view']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['suppliers_create']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.add')"
                                    name="suppliers_create"
                                    :value="permissions['suppliers_create']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['suppliers_edit']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.edit')"
                                    name="suppliers_edit"
                                    :value="permissions['suppliers_edit']"
                                    @change="checkboxClicked"
                                />
                                <f7-list-item
                                    :style="{ flex: '50%' }"
                                    :checked="
                                        checkedPermissions.includes(
                                            permissions['suppliers_delete']
                                        )
                                            ? true
                                            : false
                                    "
                                    checkbox
                                    :title="$t('common.delete')"
                                    name="suppliers_delete"
                                    :value="permissions['suppliers_delete']"
                                    @change="checkboxClicked"
                                />
                            </ul>
                        </template>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import crud from "@/composable/crud";
import fields from "./fields";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        permissions: {
            default: [],
        },
        item: {
            default: {},
        },
        addEditType: {
            default: "add",
        },
    },
    components: {
        CodrajSelect,
    },
    setup(props) {
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const {
            formatAmountCurrency,
            appSetting,
            permsArray,
            slugify,
            appModules,
        } = common();
        const warehouseVisible = ref(false);
        const checkedPermissions = ref([]);

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);

            if (
                props.addEditType == "add" ||
                (props.addEditType == "edit" && !props.item.is_walkin_customer)
            ) {
                warehouseVisible.value = true;
            }

            if (props.addEditType == "add") {
                crudVariables.formData.value = {
                    ...crudVariables.formData.value,
                    warehouse_id: appStore.selectedWarehouse.xid,
                };
            }
            if (props.addEditType == "edit") {
                props.item.perms.forEach((value) => {
                    checkedPermissions.value.push(value.xid);
                });
            }
        });

        const checkboxClicked = (e) => {
            const value = e.target.value;

            if (e.target.checked) {
                checkedPermissions.value.push(value);
            } else {
                checkedPermissions.value.splice(
                    checkedPermissions.value.indexOf(value),
                    1
                );
            }
        };

        const onFormSubmit = () => {
            crudVariables.formData.value = {
                ...crudVariables.formData.value,
                permissions: checkedPermissions.value,
            };

            crudVariables.onSubmit();
        };

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            warehouseVisible,
            appStore,
            checkedPermissions,
            onFormSubmit,

            checkboxClicked,
        };
    },
};
</script>

<style scoped>
.required-input {
    color: red;
}

.input-prefix {
    margin-top: 8px;
    margin-right: 5px;
}

.input-suffix {
    margin-top: 8px;
    margin-left: 5px;
}

.warehouse-class .item-content {
    padding: 0px !important;
}
</style>
