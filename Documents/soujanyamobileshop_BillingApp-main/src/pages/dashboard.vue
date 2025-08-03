<template>
    <f7-page name="home" :page-content="pageContent">
        <!-- Top Navbar -->
        <f7-navbar>
            <f7-nav-left>
                <f7-link>
                    <img
                        :src="
                            appStore &&
                            appStore.authUser &&
                            appStore.authUser.profile_image_url
                                ? appStore.authUser.profile_image_url
                                : ''
                        "
                        :style="{
                            borderRadius: '50%',
                            width: '30px',
                            marginLeft: '5px',
                        }"
                    />
                </f7-link>

                <f7-link
                    popover-open=".waehouse-select-dropdown"
                    style="margin-left: 7px"
                >
                    {{ appStore.selectedWarehouse.name }}

                    <f7-icon material="expand_more" size="32px"></f7-icon>
                </f7-link>
            </f7-nav-left>

            <f7-nav-right>
                <f7-link
                    class="navbar-action-btn"
                    @click="darkModeClicked"
                    :icon-ios="appStore.isDarkMode ? 'f7:sun_max' : 'f7:moon_stars'"
                    :icon-md="appStore.isDarkMode ? 'f7:sun_max' : 'f7:moon_stars'"
                />
                <f7-link
                    class="navbar-action-btn"
                    popover-open=".lang-select-dropdown"
                    icon-ios="material:translate"
                    icon-md="material:translate"
                />
                <f7-link
                    class="navbar-action-btn"
                    @click="logout"
                    :icon-ios="'f7:square_arrow_right'"
                    :icon-md="'f7:square_arrow_right'"
                />
            </f7-nav-right>
        </f7-navbar>

        <template v-if="pageContent">
            <template v-if="extendedLicense">
                <f7-card
                    v-if="extendedLicenseMessage != ''"
                    style="background: #fff2f0; border: 1px solid #ffccc7"
                >
                    <f7-card-content>
                        <div style="display: flex">
                            <div><f7-icon f7="exclamationmark_circle"></f7-icon></div>
                            <div class="margin-l5">
                                {{ extendedLicenseMessage }}
                            </div>
                        </div>
                    </f7-card-content>
                </f7-card>

                <Faqs :title="faqTitle" :faqs="faqs" />
            </template>
            <template v-else>
                <LicenseInfo />

                <SubscriptionMenus />
            </template>

            <MobileSlider :imageSliderData="imageSliderData" />
        </template>
        <template v-else>
            <f7-toolbar bottom tabbar icons>
                <f7-link
                    tab-link="#dashboard"
                    :tab-link-active="appStore.activeTabName == 'dashboard'"
                    icon-ios="f7:house_fill"
                    icon-md="f7:house_fill"
                    :text="$t('menu.dashboard')"
                />
                <f7-link
                    tab-link="#users"
                    :tab-link-active="appStore.activeTabName == 'users'"
                    icon-ios="f7:circle_grid_3x3_fill"
                    icon-md="f7:circle_grid_3x3_fill"
                    :text="$t('menu.menu')"
                />
                <f7-link
                    tab-link="#reports"
                    :tab-link-active="appStore.activeTabName == 'reports'"
                    icon-ios="material:signal_cellular_alt"
                    icon-md="material:signal_cellular_alt"
                    :text="$t('menu.reports')"
                />
                <f7-link
                    tab-link="#settings"
                    :tab-link-active="appStore.activeTabName == 'settings'"
                    icon-ios="material:settings"
                    icon-md="material:settings"
                    :text="$t('menu.settings')"
                />
            </f7-toolbar>
            <f7-tabs @tab:show="tabShowed">
                <f7-tab
                    id="dashboard"
                    :tab-active="appStore.activeTabName == 'dashboard'"
                    class="page-content"
                    :style="{ overflow: 'auto' }"
                >
                    <div class="pl-16 pr-16 pt-16 margin-b16 wallet-card-section">
                        <div class="wallet-card">
                            <div
                                :style="{
                                    width: '100%',
                                    display: 'flex',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                }"
                            >
                                <div :style="{ width: '76%' }">
                                    <span>{{ $t("dashboard.total_sales") }}</span>
                                </div>
                                <div :style="{ width: '24%' }">
                                    <f7-input
                                        class="date-change-picker"
                                        :label="null"
                                        type="select"
                                        v-model:value="activeDateSelector"
                                        @change="dateSelectorClicked"
                                    >
                                        <option value="today">
                                            {{ $t("mobile_app.today") }}
                                        </option>
                                        <option value="yesterday">
                                            {{ $t("mobile_app.yesterday") }}
                                        </option>
                                        <option value="week">
                                            {{ $t("mobile_app.weekly") }}
                                        </option>
                                        <option value="month">
                                            {{ $t("mobile_app.monthly") }}
                                        </option>
                                        <option value="year">
                                            {{ $t("mobile_app.yearly") }}
                                        </option>
                                    </f7-input>
                                </div>
                            </div>
                            <div
                                :style="{
                                    fontWeight: 800,
                                    fontSize: '22px',
                                    margin: '0px 0px 16px 0px',
                                }"
                            >
                                {{
                                    responseData.stateData &&
                                    responseData.stateData.totalSales
                                        ? formatAmountCurrency(
                                              responseData.stateData.totalSales
                                          )
                                        : formatAmountCurrency(0)
                                }}
                            </div>

                            <f7-list
                                class="more-stats"
                                :style="{ marginBottom: '15px' }"
                                dividers-ios
                                strong-ios
                            >
                                <f7-list-item
                                    :link="
                                        permsArray.includes('expenses_view') ||
                                        permsArray.includes('admin')
                                            ? '/expense/'
                                            : false
                                    "
                                    :title="$t('dashboard.total_expenses')"
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="wallet"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                    <template #after>
                                        {{
                                            responseData.stateData &&
                                            responseData.stateData.totalExpenses
                                                ? formatAmountCurrency(
                                                      responseData.stateData.totalExpenses
                                                  )
                                                : formatAmountCurrency(0)
                                        }}
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    :link="
                                        permsArray.includes('payment_out_view') ||
                                        permsArray.includes('admin')
                                            ? '/payment-out/'
                                            : false
                                    "
                                    :title="$t('dashboard.payment_sent')"
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="tray_arrow_up"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                    <template #after>
                                        {{
                                            responseData.stateData &&
                                            responseData.stateData.paymentSent
                                                ? formatAmountCurrency(
                                                      responseData.stateData.paymentSent
                                                  )
                                                : formatAmountCurrency(0)
                                        }}
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    :link="
                                        permsArray.includes('payment_in_view') ||
                                        permsArray.includes('admin')
                                            ? '/payment-in/'
                                            : false
                                    "
                                    :title="$t('dashboard.payment_received')"
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="tray_arrow_down"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                    <template #after>
                                        {{
                                            responseData.stateData &&
                                            responseData.stateData.paymentReceived
                                                ? formatAmountCurrency(
                                                      responseData.stateData
                                                          .paymentReceived
                                                  )
                                                : formatAmountCurrency(0)
                                        }}
                                    </template>
                                </f7-list-item>
                            </f7-list>

                            <!-- * Balance -->
                            <!-- Wallet Footer -->
                            <div class="wallet-footer">
                                <div class="grid grid-cols-4 gap-8 mb-8">
                                    <div
                                        v-if="
                                            permsArray.includes('products_view') ||
                                            permsArray.includes('admin')
                                        "
                                        class="item"
                                    >
                                        <a
                                            href="javascript:void(0);"
                                            @click="viewItem('/product/', {})"
                                        >
                                            <div class="icon-wrapper">
                                                <f7-icon
                                                    f7="gift"
                                                    size="28px"
                                                    color="white"
                                                />
                                            </div>
                                            <strong>{{ $t("menu.products") }}</strong>
                                        </a>
                                    </div>
                                    <div
                                        v-if="
                                            permsArray.includes('expenses_view') ||
                                            permsArray.includes('admin')
                                        "
                                        class="item"
                                    >
                                        <a
                                            href="javascript:void(0);"
                                            @click="viewItem('/expense/', {})"
                                        >
                                            <div class="icon-wrapper">
                                                <f7-icon
                                                    f7="wallet"
                                                    size="28px"
                                                    color="white"
                                                />
                                            </div>
                                            <strong>{{ $t("menu.expenses") }}</strong>
                                        </a>
                                    </div>
                                    <div
                                        v-if="
                                            (permsArray.includes(
                                                'stock_adjustments_view'
                                            ) ||
                                                permsArray.includes('admin')) &&
                                            willSubscriptionModuleVisible(
                                                'stock_adjustment'
                                            )
                                        "
                                        class="item"
                                    >
                                        <a
                                            href="javascript:void(0);"
                                            @click="viewItem('/stock-adjustment/', {})"
                                        >
                                            <div class="icon-wrapper">
                                                <f7-icon
                                                    f7="keyboard_chevron_compact_down"
                                                    size="28px"
                                                    color="white"
                                                />
                                            </div>
                                            <strong
                                                v-html="
                                                    $t('menu.stock_adjustment').replace(
                                                        /\s+/g,
                                                        '<br />'
                                                    )
                                                "
                                            ></strong>
                                        </a>
                                    </div>
                                    <div
                                        v-if="
                                            permsArray.includes('products_view') ||
                                            permsArray.includes('admin')
                                        "
                                        class="item"
                                    >
                                        <a
                                            href="javascript:void(0);"
                                            @click="viewItem('/stock-summary/', {})"
                                        >
                                            <div class="icon-wrapper">
                                                <f7-icon
                                                    f7="arrow_up_arrow_down_square"
                                                    size="28px"
                                                    color="white"
                                                />
                                            </div>
                                            <strong
                                                v-html="
                                                    $t('menu.stock_summary').replace(
                                                        /\s+/g,
                                                        '<br />'
                                                    )
                                                "
                                            ></strong>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!-- * Wallet Footer -->

                            <f7-list
                                class="more-stats"
                                :style="{ marginBottom: '15px' }"
                                dividers-ios
                                strong-ios
                            >
                                <f7-list-item
                                    :link="
                                        permsArray.includes('sales_view') ||
                                        permsArray.includes('admin')
                                            ? '/orders/'
                                            : false
                                    "
                                    link="/orders/"
                                    :route-props="{ orderType: 'sales' }"
                                    :title="$t('dashboard.total_sales_items')"
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="cart"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                    <template #after>
                                        {{
                                            responseData.stockHistoryStatsData &&
                                            responseData.stockHistoryStatsData.totalSales
                                                ? formatQuantity(
                                                      responseData.stockHistoryStatsData
                                                          .totalSales
                                                  )
                                                : formatQuantity(0)
                                        }}
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    :link="
                                        (permsArray.includes('sales_returns_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('sales_return')
                                            ? '/orders/'
                                            : false
                                    "
                                    link="/orders/"
                                    :route-props="{ orderType: 'sales-returns' }"
                                    :title="$t('dashboard.total_sales_returns_items')"
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="return"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                    <template #after>
                                        {{
                                            responseData.stockHistoryStatsData &&
                                            responseData.stockHistoryStatsData
                                                .totalSalesReturn
                                                ? formatQuantity(
                                                      responseData.stockHistoryStatsData
                                                          .totalSalesReturn
                                                  )
                                                : formatQuantity(0)
                                        }}
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    :link="
                                        permsArray.includes('purchases_view') ||
                                        permsArray.includes('admin')
                                            ? '/orders/'
                                            : false
                                    "
                                    link="/orders/"
                                    :route-props="{ orderType: 'purchases' }"
                                    :title="$t('dashboard.total_purchases_items')"
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="bag_badge_plus"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                    <template #after>
                                        {{
                                            responseData.stockHistoryStatsData &&
                                            responseData.stockHistoryStatsData
                                                .totalPurchases
                                                ? formatQuantity(
                                                      responseData.stockHistoryStatsData
                                                          .totalPurchases
                                                  )
                                                : formatQuantity(0)
                                        }}
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    :link="
                                        (permsArray.includes('purchase_returns_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('purchase_return')
                                            ? '/orders/'
                                            : false
                                    "
                                    :route-props="{ orderType: 'purchase-returns' }"
                                    :title="$t('dashboard.total_purchase_returns_items')"
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="arrow_up_doc"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                    <template #after>
                                        {{
                                            responseData.stockHistoryStatsData &&
                                            responseData.stockHistoryStatsData
                                                .totalPurchaseReturn
                                                ? formatQuantity(
                                                      responseData.stockHistoryStatsData
                                                          .totalPurchaseReturn
                                                  )
                                                : formatQuantity(0)
                                        }}
                                    </template>
                                </f7-list-item>
                            </f7-list>
                        </div>
                    </div>

                    <MobileSlider :imageSliderData="imageSliderData" />
                </f7-tab>
                <f7-tab
                    id="users"
                    class="page-content"
                    :tab-active="appStore.activeTabName == 'users'"
                >
                    <f7-block-title
                        v-if="
                            permsArray.includes('customers_view') ||
                            permsArray.includes('suppliers_view') ||
                            permsArray.includes('users_view') ||
                            permsArray.includes('admin')
                        "
                        >{{ $t("menu.parties") }}</f7-block-title
                    >
                    <f7-card>
                        <f7-card-content :padding="false">
                            <f7-list>
                                <f7-list-item
                                    link="/parties/"
                                    :route-props="{ userType: 'customers' }"
                                    :title="$t('menu.customers')"
                                    v-if="
                                        permsArray.includes('customers_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="person_2"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/parties/"
                                    :route-props="{ userType: 'suppliers' }"
                                    :title="$t('menu.suppliers')"
                                    v-if="
                                        permsArray.includes('suppliers_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="person_2_square_stack"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/staff-members/"
                                    :title="$t('menu.staff_members')"
                                    v-if="
                                        permsArray.includes('users_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="person_crop_circle_badge_checkmark"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                            </f7-list>
                        </f7-card-content>
                    </f7-card>

                    <f7-block-title
                        v-if="
                            permsArray.includes('brands_view') ||
                            permsArray.includes('categories_view') ||
                            permsArray.includes('variations_view') ||
                            permsArray.includes('products_view') ||
                            permsArray.includes('stock_adjustments_view') ||
                            permsArray.includes('admin')
                        "
                        >{{ $t("menu.product_manager") }}</f7-block-title
                    >
                    <f7-card>
                        <f7-card-content :padding="false">
                            <f7-list media-list dividers-ios strong-ios>
                                <f7-list-item
                                    link="/brand/"
                                    :title="$t('menu.brands')"
                                    v-if="
                                        permsArray.includes('brands_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="archivebox"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/category/"
                                    :title="$t('menu.categories')"
                                    v-if="
                                        permsArray.includes('categories_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="list_dash"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <!-- <f7-list-item
                                link="/variation/"
                                :title="$t('menu.variations')"
                            >
                                <template #media>
                                    <f7-icon f7="cube_box_fill" size="24px"></f7-icon>
                                </template>
                            </f7-list-item> -->
                                <f7-list-item
                                    link="/product/"
                                    :title="$t('menu.products')"
                                    v-if="
                                        permsArray.includes('products_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="gift"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/stock-adjustment/"
                                    :title="$t('menu.stock_adjustment')"
                                    v-if="
                                        (permsArray.includes('stock_adjustments_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('stock_adjustment')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="keyboard_chevron_compact_down"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                            </f7-list>
                        </f7-card-content>
                    </f7-card>

                    <f7-block-title
                        v-if="
                            permsArray.includes('sales_view') ||
                            permsArray.includes('quotations_view') ||
                            permsArray.includes('sales_returns_view') ||
                            permsArray.includes('payment_in_view') ||
                            permsArray.includes('stock_transfers_view') ||
                            permsArray.includes('admin')
                        "
                        >{{ $t("menu.sales") }}</f7-block-title
                    >
                    <f7-card>
                        <f7-card-content :padding="false">
                            <f7-list media-list dividers-ios strong-ios>
                                <f7-list-item
                                    link="/orders/"
                                    :route-props="{ orderType: 'sales' }"
                                    :title="$t('menu.sales')"
                                    v-if="
                                        permsArray.includes('sales_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="cart"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/orders/"
                                    :route-props="{ orderType: 'sales-returns' }"
                                    :title="$t('menu.sales_returns')"
                                    v-if="
                                        (permsArray.includes('sales_returns_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('sales_return')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="return"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/payment-in/"
                                    :title="$t('menu.payment_in')"
                                    v-if="
                                        permsArray.includes('payment_in_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="tray_arrow_down"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/orders/"
                                    :route-props="{ orderType: 'quotations' }"
                                    :title="$t('menu.quotations')"
                                    v-if="
                                        (permsArray.includes('quotations_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('quotation')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="doc_richtext"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/orders/"
                                    :route-props="{ orderType: 'stock-transfers' }"
                                    :title="$t('menu.stock_transfers')"
                                    v-if="
                                        (permsArray.includes('stock_transfers_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('stock_transfer')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="car_fill"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                            </f7-list>
                        </f7-card-content>
                    </f7-card>

                    <f7-block-title
                        v-if="
                            permsArray.includes('purchases_view') ||
                            permsArray.includes('purchase_returns_view') ||
                            permsArray.includes('payment_out_view') ||
                            permsArray.includes('admin')
                        "
                        >{{ $t("menu.purchases") }}</f7-block-title
                    >
                    <f7-card>
                        <f7-card-content :padding="false">
                            <f7-list media-list dividers-ios strong-ios>
                                <f7-list-item
                                    link="/orders/"
                                    :route-props="{ orderType: 'purchases' }"
                                    :title="$t('menu.purchases')"
                                    v-if="
                                        permsArray.includes('purchases_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="bag_badge_plus"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/orders/"
                                    :route-props="{ orderType: 'purchase-returns' }"
                                    :title="$t('menu.purchase_returns')"
                                    v-if="
                                        (permsArray.includes('purchase_returns_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('purchase_return')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="arrow_up_doc"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/payment-out/"
                                    :title="$t('menu.payment_out')"
                                    v-if="
                                        permsArray.includes('payment_out_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="tray_arrow_up"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                            </f7-list>
                        </f7-card-content>
                    </f7-card>

                    <f7-block-title
                        v-if="
                            (permsArray.includes('expense_categories_view') ||
                                permsArray.includes('expenses_view') ||
                                permsArray.includes('admin')) &&
                            willSubscriptionModuleVisible('expense')
                        "
                        >{{ $t("menu.expenses") }}</f7-block-title
                    >
                    <f7-card>
                        <f7-card-content :padding="false">
                            <f7-list media-list dividers-ios strong-ios>
                                <f7-list-item
                                    link="/expense_category/"
                                    :title="$t('menu.expense_categories')"
                                    v-if="
                                        (permsArray.includes('expense_categories_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('expense')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="squares_below_rectangle"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/expense/"
                                    :title="$t('menu.expenses')"
                                    v-if="
                                        (permsArray.includes('expenses_view') ||
                                            permsArray.includes('admin')) &&
                                        willSubscriptionModuleVisible('expense')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="wallet"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                            </f7-list>
                        </f7-card-content>
                    </f7-card>
                </f7-tab>
                <f7-tab
                    id="reports"
                    class="page-content"
                    :tab-active="appStore.activeTabName == 'reports'"
                >
                    <f7-block-title>{{ $t("menu.reports") }}</f7-block-title>
                    <f7-card>
                        <f7-card-content :padding="false">
                            <f7-list media-list dividers-ios strong-ios>
                                <f7-list-item
                                    link="/cash-bank/"
                                    :title="$t('menu.cash_bank')"
                                    v-if="
                                        permsArray.includes('cash_bank_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="building_columns"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/payment/"
                                    :title="$t('menu.payments')"
                                    v-if="
                                        ((permsArray.includes('purchases_view') ||
                                            permsArray.includes('sales_view') ||
                                            permsArray.includes(
                                                'purchase_returns_view'
                                            ) ||
                                            permsArray.includes('sales_returns_view')) &&
                                            permsArray.includes('order_payments_view')) ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="doc_chart"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    v-if="
                                        permsArray.includes('products_view') ||
                                        permsArray.includes('admin')
                                    "
                                    link="/stock-alert/"
                                    :title="$t('menu.stock_alert')"
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="gauge"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/sales-summary/"
                                    :title="$t('menu.sales_summary')"
                                    v-if="
                                        permsArray.includes('users_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="cart"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/stock-summary/"
                                    :title="$t('menu.stock_summary')"
                                    v-if="
                                        permsArray.includes('products_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="arrow_up_arrow_down_square"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/rate-list/"
                                    :title="$t('menu.rate_list')"
                                    v-if="
                                        permsArray.includes('products_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="money_dollar"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/product-summary/"
                                    :title="$t('menu.product_sales_summary')"
                                    v-if="
                                        permsArray.includes('products_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="gift"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/users-reports/"
                                    :title="$t('menu.users_reports')"
                                    v-if="
                                        permsArray.includes('customers_view') ||
                                        permsArray.includes('suppliers_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="person"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/expense-summary/"
                                    :title="$t('menu.expense_reports')"
                                    v-if="
                                        permsArray.includes('expenses_view') ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="wallet"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                                <f7-list-item
                                    link="/profit-loss/"
                                    :title="$t('menu.profit_loss')"
                                    v-if="
                                        (permsArray.includes('products_view') &&
                                            permsArray.includes('purchases_view') &&
                                            permsArray.includes('sales_view') &&
                                            permsArray.includes(
                                                'purchase_returns_view'
                                            ) &&
                                            permsArray.includes('sales_returns_view')) ||
                                        permsArray.includes('admin')
                                    "
                                >
                                    <template #media>
                                        <f7-icon
                                            f7="minus_slash_plus"
                                            size="24px"
                                            :color="appStore.themeColor"
                                        ></f7-icon>
                                    </template>
                                </f7-list-item>
                            </f7-list>
                        </f7-card-content>
                    </f7-card>
                </f7-tab>
                <f7-tab
                    id="settings"
                    class="page-content"
                    :tab-active="appStore.activeTabName == 'settings'"
                >
                    <LicenseInfo />

                    <template
                        v-if="
                            appType == 'non-saas' ||
                            (appType == 'saas' && appSetting.status != 'license_expired')
                        "
                    >
                        <f7-block-title>{{ $t("menu.settings") }}</f7-block-title>
                        <f7-card>
                            <f7-card-content :padding="false">
                                <f7-list media-list dividers-ios strong-ios>
                                    <f7-list-item
                                        link="/company-settings/"
                                        :title="$t('menu.company')"
                                        v-if="
                                            permsArray.includes('companies_edit') ||
                                            permsArray.includes('admin')
                                        "
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="wrench"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <f7-list-item
                                        link="/profile/"
                                        :title="$t('menu.profile')"
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="person_circle"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <f7-list-item
                                        link="/language/"
                                        :title="$t('menu.languages')"
                                        v-if="
                                            appType == 'non-saas' &&
                                            (permsArray.includes('translations_view') ||
                                                permsArray.includes('admin'))
                                        "
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="globe"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <f7-list-item
                                        link="/warehouse/"
                                        :title="$t('menu.warehouses')"
                                        v-if="
                                            permsArray.includes('warehouses_view') ||
                                            permsArray.includes('admin')
                                        "
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="building_2"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <f7-list-item
                                        link="/role/"
                                        :title="$t('menu.roles')"
                                        v-if="
                                            permsArray.includes('roles_view') ||
                                            permsArray.includes('admin')
                                        "
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="folder_badge_person_crop"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <f7-list-item
                                        link="/tax/"
                                        :title="$t('menu.taxes')"
                                        v-if="
                                            permsArray.includes('taxes_view') ||
                                            permsArray.includes('admin')
                                        "
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="doc_text"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <f7-list-item
                                        link="/currency/"
                                        :title="$t('menu.currencies')"
                                        v-if="
                                            permsArray.includes('currencies_view') ||
                                            permsArray.includes('admin')
                                        "
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="money_dollar_circle"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <f7-list-item
                                        link="/payment_mode/"
                                        :title="$t('menu.payment_modes')"
                                        v-if="
                                            permsArray.includes('payment_modes_view') ||
                                            permsArray.includes('admin')
                                        "
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="creditcard"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <f7-list-item
                                        link="/unit/"
                                        :title="$t('menu.units')"
                                        v-if="
                                            permsArray.includes('units_view') ||
                                            permsArray.includes('admin')
                                        "
                                    >
                                        <template #media>
                                            <f7-icon
                                                f7="layers_alt"
                                                size="24px"
                                                :color="appStore.themeColor"
                                            ></f7-icon>
                                        </template>
                                    </f7-list-item>
                                    <!-- <f7-list-item
                                link="/offline-requests/"
                                :title="$t('menu.offline_requests')"
                            >
                                <template #media>
                                    <f7-icon
                                        f7="layers_alt"
                                        size="24px"
                                        :color="appStore.themeColor"
                                    ></f7-icon>
                                </template>
                            </f7-list-item> -->
                                </f7-list>
                            </f7-card-content>
                        </f7-card>
                    </template>

                    <SubscriptionMenus />
                </f7-tab>
            </f7-tabs>
        </template>

        <!-- Warehouse Popover Selecter -->
        <f7-popover class="waehouse-select-dropdown">
            <f7-list>
                <f7-list-item
                    link="#"
                    radio
                    radio-icon="start"
                    v-for="allWarehouse in appStore.allWarehouses"
                    :checked="allWarehouse.xid == appStore.selectedWarehouse.xid"
                    :key="allWarehouse.xid"
                    @click="warehouseChanged(allWarehouse)"
                    popover-close
                    :title="allWarehouse.name"
                />
            </f7-list>
        </f7-popover>

        <!-- Language Popover Selecter -->
        <f7-popover class="lang-select-dropdown">
            <f7-list>
                <f7-list-item
                    link="#"
                    media-list
                    radio
                    radio-icon="start"
                    v-for="allLang in appStore.allLangs"
                    :checked="allLang.xid == appStore.selectedLang.xid"
                    :key="allLang.xid"
                    @click="langChanged(allLang)"
                    popover-close
                    :title="allLang.name"
                >
                    <template #media>
                        <img
                            style="border-radius: 8px"
                            :src="allLang.image_url"
                            width="32"
                            height="32"
                        />
                    </template>
                </f7-list-item>
            </f7-list>
        </f7-popover>

        <f7-sheet
            v-model:opened="profileSheetOpened"
            backdrop
            swipe-to-close
            :style="{ height: '93%' }"
            push
        >
            <f7-toolbar>
                <div class="left"></div>
                <div class="right">
                    <f7-link sheet-close>{{ $t("common.close") }}</f7-link>
                </div>
            </f7-toolbar>
            <!-- Scrollable sheet content -->
            <f7-page-content>
                <f7-block> </f7-block>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item @click="logout" link="#" :title="$t('menu.logout')" />
                </f7-list>
            </f7-page-content>
        </f7-sheet>
    </f7-page>
</template>
<script>
import { onMounted, ref, getCurrentInstance, inject, watch, reactive } from "vue";
import { getDevice } from "framework7";
import { f7 } from "framework7-vue";
import { useI18n } from "vue-i18n";
import { axiosAdmin } from "@/common/axiosAdmin";
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";
import PieChart from "@/components/card/PieChart.vue";
import LicenseInfo from "@/components/license/LicenseInfo.vue";
import Faqs from "@/components/dashboard/Faqs.vue";
import MobileSlider from "@/components/dashboard/MobileSlider.vue";
import SubscriptionMenus from "@/components/license/SubscriptionMenus.vue";
import { StatusBar, Style } from "@capacitor/status-bar";
import PaymentChart from "@/components/card/PaymentChart.vue";
import salesSvg from "../assets/SALE.svg";
import axios from "axios";

export default {
    props: {
        f7router: Object,
    },
    components: {
        PieChart,
        PaymentChart,
        LicenseInfo,
        SubscriptionMenus,
        MobileSlider,
        Faqs,
    },
    setup(props) {
        const device = getDevice();
        const instance = getCurrentInstance();
        const { t, locale } = useI18n();
        const appStore = useAppStore();
        const profileSheetOpened = ref(false);
        const activeDateSelector = ref("today");
        const serachDateRangePicker = ref(null);
        const themeColor = ref("");

        const {
            formatAmountCurrency,
            dayjs,
            appSetting,
            permsArray,
            willSubscriptionModuleVisible,
            appType,
            user,
            formatDate,
            numberWithCommas,
            formatQuantity,
        } = common();
        const filters = reactive({
            dates: [
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
            ],
        });
        const responseData = ref([]);
        const imageSliderData = ref([]);
        const currentDate = dayjs().format("D MMMM YYYY");
        const pageContent = ref(false);
        const extendedLicenseFaqTitle = ref("");
        const extendedLicenseMessage = ref("");
        const extendedLicense = ref(false);
        const faqTitle = ref("");
        const faqs = ref([]);

        onMounted(() => {
            if (
                appType == "saas" &&
                (appSetting.status == "license_expired" || appStore.isLicenseExpired)
            ) {
                pageContent.value = true;
            } else {
                pageContent.value = false;
            }

            filters.dates = getDates([dayjs(), dayjs()]);

            fetchDashboard();
        });

        const saleSvg = salesSvg;

        const fetchDashboard = () => {
            const dashboardPromise = axiosAdmin().post("dashboard", filters);
            Promise.all([dashboardPromise]).then(([dashboardResponse]) => {
                responseData.value = dashboardResponse.data;
            });

            // const domainUrl = appStore.appUrl.replace(/^https?:\/\//, "");
            // axios
            //     .post(`https://envato.codeifly.com/verify-app`, {
            //         domain: domainUrl,
            //         app_name: "Stockifly",
            //     })
            //     .then((response) => {
            //         if (response.data.success == false) {
            //             pageContent.value = true;
            //             extendedLicense.value = true;
            //             extendedLicenseMessage.value = response.data.message;
            //             extendedLicenseFaqTitle.value = response.data.slider_title
            //                 ? response.data.slider_title
            //                 : "";
            //             faqTitle.value = response.data.faq_title
            //                 ? response.data.faq_title
            //                 : "";
            //             faqs.value = response.data.faqs ? response.data.faqs : "";

            //             imageSliderData.value = response.data.sliders;
            //         }
            //     });
        };

        const tabShowed = (tabb) => {
            const listItemContainer = f7.$(`.page-current .page-content`);
            if (listItemContainer) {
                listItemContainer.scrollTop(0, 300);
            }

            appStore.updateActiveTabName(tabb.target.id);
        };

        const warehouseChanged = (warehouse) => {
            appStore.getAndUpdateSelectedWarehouse(warehouse.xid).then((response) => {
                fetchDashboard();
            });

            // f7.toast
            //     .create({
            //         text: t(`${langKey.value}.created`),
            //         position: "bottom",
            //         closeTimeout: 2000,
            //     })
            //     .open();

            // Todo: refetch the dashboard
        };

        const dateSelectorClicked = () => {
            f7.preloader.show();

            if (activeDateSelector.value == "today") {
                filters.dates = getDates([dayjs(), dayjs()]);
            } else if (activeDateSelector.value == "yesterday") {
                filters.dates = getDates([
                    dayjs().add(-1, "d").startOf("day"),
                    dayjs().add(-1, "d").endOf("day"),
                ]);
            } else if (activeDateSelector.value == "week") {
                filters.dates = getDates([dayjs().add(-7, "d"), dayjs()]);
            } else if (activeDateSelector.value == "month") {
                filters.dates = getDates([dayjs().startOf("month"), dayjs()]);
            } else if (activeDateSelector.value == "year") {
                filters.dates = getDates([dayjs().startOf("year"), dayjs()]);
            }

            axiosAdmin()
                .post("dashboard", filters)
                .then((dashboardResponse) => {
                    responseData.value = dashboardResponse.data;
                    //   console.log(responseData.value ,'button');

                    f7.preloader.hide();
                });
        };

        const getDates = (newValue) => {
            if (newValue && newValue[0] && newValue[1]) {
                return [
                    newValue[0]
                        .tz(appSetting.timezone)
                        .startOf("day")
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                    newValue[1]
                        .tz(appSetting.timezone)
                        .endOf("day")
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss"),
                ];
            } else {
                return [];
            }
        };

        const langChanged = (lang) => {
            appStore.updateSelectedLang(lang, instance, locale);

            // Todo: refetch the dashboard
            fetchDashboard();
        };

        const darkModeClicked = () => {
            const isDarkMode = appStore.isDarkMode;

            appStore.updateIsDarkMode(!isDarkMode);
            f7.setDarkMode(!isDarkMode);

            if (appStore.isDarkMode) {
                StatusBar.setStyle({ style: Style.Dark });
                StatusBar.setBackgroundColor({ color: "#1c1c1d" });
            } else {
                StatusBar.setStyle({ style: Style.Dark });
                StatusBar.setBackgroundColor({ color: appStore.themeColor });
            }
        };

        const viewItem = (url, props) => {
            f7.views.main.router.navigate(`${url}`, {
                props,
            });
        };

        const logout = () => {
            f7.dialog.confirm(
                "Are you sure you want to logout?",
                t("menu.logout"),
                () => {
                    // Show PreLoader
                    f7.preloader.show();
                    axiosAdmin()
                        .post("/auth/logout")
                        .then(function (response) {
                            window.sessionStorage.clear();

                            appStore.updateAuthUser(null);
                            appStore.updateAuthToken(null);
                            appStore.updateExpires(null);
                            appStore.updateEmailVerifiedSetting(false);
                            appStore.updateActiveTabName("dashboard");

                            f7.views.main.router.navigate("/login/");

                            // Hide PreLoader
                            f7.preloader.hide();

                            profileSheetOpened.value = false;
                        })
                        .catch(function (error) {
                            // Hide PreLoader
                            f7.preloader.hide();
                        });
                }
            );
        };

        return {
            device,
            appStore,
            permsArray,
            willSubscriptionModuleVisible,
            appType,
            appSetting,
            user,
            formatDate,
            pageContent,

            tabShowed,

            warehouseChanged,
            langChanged,
            profileSheetOpened,
            logout,
            dateSelectorClicked,
            darkModeClicked,
            viewItem,
            //for dashboard
            filters,
            responseData,
            imageSliderData,
            formatAmountCurrency,
            activeDateSelector,
            serachDateRangePicker,
            currentDate,

            saleSvg,
            numberWithCommas,
            extendedLicense,
            extendedLicenseFaqTitle,
            extendedLicenseMessage,
            faqs,
            faqTitle,
            formatQuantity,
        };
    },
};
</script>
