<template>
    <f7-page name="home" :page-content="false" @page:reinit="beforeEnter">
        <!-- Top Navbar -->
        <f7-navbar>
            <f7-nav-left>
                <f7-link @click="() => (profileSheetOpened = true)">
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
                            width: '34px',
                            marginLeft: '5px',
                        }"
                    />
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>
                <f7-link popover-open=".waehouse-select-dropdown">
                    {{ appStore.selectedWarehouse.name }}
                    <f7-icon material="expand_more" size="32px"></f7-icon>
                </f7-link>
            </f7-nav-title>
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
            </f7-nav-right>
        </f7-navbar>

        <f7-toolbar bottom tabbar icons>
            <f7-link
                tab-link="#dashboard"
                tab-link-active
                icon-ios="f7:house_fill"
                icon-md="f7:house_fill"
                :text="$t('menu.dashboard')"
            />
            <f7-link
                tab-link="#users"
                icon-ios="material:people_alt"
                icon-md="material:people_alt"
                :text="$t('menu.users')"
            />
            <f7-link
                tab-link="#reports"
                icon-ios="material:signal_cellular_alt"
                icon-md="material:signal_cellular_alt"
                :text="$t('menu.reports')"
            />
            <f7-link
                tab-link="#settings"
                icon-ios="material:settings"
                icon-md="material:settings"
                :text="$t('menu.settings')"
            />
        </f7-toolbar>
        <f7-tabs swipeable @tab:show="tabShowed">
            <f7-tab
                id="dashboard"
                :tab-active="activeTabName == 'dashboard'"
                class="page-content"
                :style="{ overflow: 'auto' }"
            >
                <f7-block>
                    <h1>{{ $t(`menu.dashboard`) }}</h1>
                    <p>
                        This is an example of tabs-layout application. The main point of
                        such tabbed layout is that each tab contains independent view with
                        its own routing and navigation.
                    </p>

                    <p>
                        Each tab/view may have different layout, different navbar type
                        (dynamic, fixed or static) or without navbar like this tab.
                    </p>
                </f7-block>
                <f7-block-title>{{ $t("menu.parties") }}</f7-block-title>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item
                        link="/customer/"
                        :title="$t('menu.customers')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/supplier/"
                        :title="$t('menu.suppliers')"
                    ></f7-list-item>
                </f7-list>
                <f7-block-title>{{ $t("menu.product_manager") }}</f7-block-title>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item
                        link="/brand/"
                        :title="$t('menu.brands')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/category/"
                        :title="$t('menu.categories')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/variation/"
                        :title="$t('menu.variations')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.products')"
                    ></f7-list-item>
                </f7-list>
                <f7-block-title>{{ $t("menu.sales") }}</f7-block-title>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item link="/sales/" :title="$t('menu.sales')"></f7-list-item>
                    <f7-list-item
                        link="/sales_return/"
                        :title="$t('menu.sales_returns')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/payment_in/"
                        :title="$t('menu.payment_in')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/quotation/"
                        :title="$t('menu.quotations')"
                    ></f7-list-item>
                </f7-list>
                <f7-block-title>{{ $t("menu.purchases") }}</f7-block-title>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item
                        link="/purchases/"
                        :title="$t('menu.purchases')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/purchase_return/"
                        :title="$t('menu.purchase_returns')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/payment_out/"
                        :title="$t('menu.payment_out')"
                    ></f7-list-item>
                </f7-list>
                <f7-block-title>{{ $t("menu.expenses") }}</f7-block-title>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item
                        link="/expense_category/"
                        :title="$t('menu.expense_categories')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/expense/"
                        :title="$t('menu.expenses')"
                    ></f7-list-item>
                </f7-list>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item
                        link="/stock-adjustment/"
                        :title="$t('menu.stock_adjustment')"
                    ></f7-list-item>
                </f7-list>
                <f7-block-title>{{ $t("menu.reports") }}</f7-block-title>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item
                        link="/payment/"
                        :title="$t('menu.payments')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/category/"
                        :title="$t('menu.stock_alert')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/variation/"
                        :title="$t('menu.sales_summary')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.stock_summary')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.rate_list')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.product_sales_summary')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.users_reports')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.expense_reports')"
                    ></f7-list-item>
                </f7-list>
                <f7-block-title>{{ $t("menu.settings") }}</f7-block-title>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item
                        link="/language/"
                        :title="$t('menu.languages')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/warehouse/"
                        :title="$t('menu.warehouses')"
                    ></f7-list-item>
                    <f7-list-item link="/role/" :title="$t('menu.roles')"></f7-list-item>
                    <f7-list-item link="/tax/" :title="$t('menu.taxes')"></f7-list-item>
                    <f7-list-item
                        link="/currency/"
                        :title="$t('menu.currencies')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/payment_mode/"
                        :title="$t('menu.payment_modes')"
                    ></f7-list-item>
                    <f7-list-item link="/unit/" :title="$t('menu.units')"></f7-list-item>
                </f7-list>
            </f7-tab>
            <f7-tab
                id="users"
                class="page-content"
                :tab-active="activeTabName == 'users'"
            >
                <f7-block>
                    <h1>{{ $t(`menu.users`) }}</h1>
                </f7-block>

                <f7-block-title>{{ $t("menu.parties") }}</f7-block-title>
                <f7-card>
                    <f7-card-content :padding="false">
                        <f7-list>
                            <f7-list-item
                                link="/customer/"
                                :title="$t('menu.customers')"
                            ></f7-list-item>
                            <f7-list-item
                                link="/supplier/"
                                :title="$t('menu.suppliers')"
                            ></f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>

                <f7-block-title>{{ $t("menu.staff_members") }}</f7-block-title>
                <f7-card>
                    <f7-card-content :padding="false">
                        <f7-list>
                            <f7-list-item
                                link="/staff-members/"
                                :title="$t('menu.staff_members')"
                            />
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>
            <f7-tab
                id="reports"
                class="page-content"
                :tab-active="activeTabName == 'reports'"
            >
                <f7-block>
                    <h1>{{ $t(`menu.reports`) }}</h1>
                </f7-block>
                <f7-list media-list dividers-ios strong-ios>
                    <f7-list-item
                        link="/payment/"
                        :title="$t('menu.payments')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/category/"
                        :title="$t('menu.stock_alert')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/variation/"
                        :title="$t('menu.sales_summary')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.stock_summary')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.rate_list')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.product_sales_summary')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.users_reports')"
                    ></f7-list-item>
                    <f7-list-item
                        link="/product/"
                        :title="$t('menu.expense_reports')"
                    ></f7-list-item>
                </f7-list>
            </f7-tab>
            <f7-tab
                id="settings"
                class="page-content"
                :tab-active="activeTabName == 'settings'"
            >
                <f7-block>
                    <h1>{{ $t(`menu.${activeTabName}`) }}</h1>
                </f7-block>

                <f7-card>
                    <f7-card-content :padding="false">
                        <f7-list>
                            <f7-list-item
                                link="/language/"
                                :title="$t('menu.languages')"
                            ></f7-list-item>
                            <f7-list-item
                                link="/warehouse/"
                                :title="$t('menu.warehouses')"
                            ></f7-list-item>
                            <f7-list-item
                                link="/role/"
                                :title="$t('menu.roles')"
                            ></f7-list-item>
                            <f7-list-item
                                link="/tax/"
                                :title="$t('menu.taxes')"
                            ></f7-list-item>
                            <f7-list-item
                                link="/currency/"
                                :title="$t('menu.currencies')"
                            ></f7-list-item>
                            <f7-list-item
                                link="/payment_mode/"
                                :title="$t('menu.payment_modes')"
                            ></f7-list-item>
                            <f7-list-item
                                link="/unit/"
                                :title="$t('menu.units')"
                            ></f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>
        </f7-tabs>

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
                    radio
                    radio-icon="start"
                    v-for="allLang in appStore.allLangs"
                    :checked="allLang.xid == appStore.selectedLang.xid"
                    :key="allLang.xid"
                    @click="langChanged(allLang)"
                    popover-close
                    :title="allLang.name"
                />
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
                    <f7-link sheet-close>Close</f7-link>
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
import { onMounted, ref, getCurrentInstance, inject } from "vue";
import { f7 } from "framework7-vue";
import { useI18n } from "vue-i18n";
import { axiosAdmin } from "@/common/axiosAdmin";
import { useAppStore } from "@/stores/appStore";

export default {
    props: {
        f7router: Object,
    },
    setup(props) {
        const instance = getCurrentInstance();
        const { t, locale } = useI18n();
        const appStore = useAppStore();
        const activeTabName = ref("dashboard");
        const profileSheetOpened = ref(false);

        onMounted(() => {});

        const beforeEnter = (route) => {
            // console.log(route, "dashboard");
            // route.options.loaded = true;
            // Check if the page was previously loaded
            // const isPageLoaded = route.options.loaded;
            // if (!isPageLoaded) {
            //     // Mark the page as loaded to prevent refreshing on back navigation
            //     route.options.loaded = true;
            // }
        };

        const tabShowed = (tabb) => {
            const listItemContainer = f7.$(`.page-current .page-content`);
            if (listItemContainer) {
                listItemContainer.scrollTop(0, 300);
            }

            activeTabName.value = tabb.target.id;
        };

        const warehouseChanged = (warehouse) => {
            appStore.updateSelectedWarehouse(warehouse);

            f7.toast
                .create({
                    text: t(`${langKey.value}.created`),
                    position: "bottom",
                    closeTimeout: 2000,
                })
                .open();

            // Todo: refetch the dashboard
        };

        const langChanged = (lang) => {
            appStore.updateSelectedLang(lang, instance, locale);

            // Todo: refetch the dashboard
        };

        const darkModeClicked = () => {
            const isDarkMode = appStore.isDarkMode;

            appStore.updateIsDarkMode(!isDarkMode);
            f7.setDarkMode(!isDarkMode);
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
            appStore,

            activeTabName,
            tabShowed,
            beforeEnter,

            warehouseChanged,
            langChanged,

            profileSheetOpened,
            logout,

            darkModeClicked,
        };
    },
};
</script>
