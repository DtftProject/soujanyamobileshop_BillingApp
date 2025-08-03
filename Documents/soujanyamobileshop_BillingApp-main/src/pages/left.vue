<template>
    <f7-page>
        <f7-navbar :sliding="false">
            <f7-nav-left class="navbar-profile">
                <img
                    :src="
                        appStore &&
                        appStore.authUser &&
                        appStore.authUser.profile_image_url
                            ? appStore.authUser.profile_image_url
                            : ''
                    "
                    alt=""
                />
            </f7-nav-left>
            <f7-nav-title>{{ appStore.authUser?.name }}</f7-nav-title>
            <f7-nav-right>
                <f7-link
                    class="panel-close"
                    @click="logout"
                    icon-ios="material:logout"
                    icon-md="material:logout"
                    :style="{ width: '24px' }"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-block-title>{{ $t("menu.product_manager") }}</f7-block-title>
        <f7-list media-list dividers-ios strong-ios>
            <f7-list-item link="/brand/" :title="$t('menu.brands')"></f7-list-item>
            <f7-list-item link="/category/" :title="$t('menu.categories')"></f7-list-item>
            <f7-list-item
                link="/variation/"
                :title="$t('menu.variations')"
            ></f7-list-item>
            <f7-list-item link="/product/" :title="$t('menu.products')"></f7-list-item>
        </f7-list>
        <f7-block-title>{{ $t("menu.expenses") }}</f7-block-title>
        <f7-list media-list dividers-ios strong-ios>
            <f7-list-item
                link="/expense_category/"
                :title="$t('menu.expense_categories')"
            ></f7-list-item>
            <f7-list-item link="/expense/" :title="$t('menu.expenses')"></f7-list-item>
        </f7-list>
        <f7-list media-list dividers-ios strong-ios>
            <f7-list-item
                link="/stock-adjustment/"
                :title="$t('menu.stock_adjustment')"
            ></f7-list-item>
        </f7-list>
        <f7-list media-list dividers-ios strong-ios>
            <f7-list-item
                @click="logout"
                class="panel-close"
                link="#"
                :title="$t('menu.logout')"
            />
        </f7-list>
    </f7-page>
</template>

<script>
import { f7 } from "framework7-vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/appStore";
import { axiosAdmin } from "@/common/axiosAdmin";

export default {
    setup(props) {
        const appStore = useAppStore();
        const { t } = useI18n();

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
                        })
                        .catch(function (error) {
                            // Hide PreLoader
                            f7.preloader.hide();
                        });
                }
            );
        };

        return {
            logout,

            appStore,
        };
    },
};
</script>
