<template>
    <f7-app v-bind="f7params">
        <f7-panel left cover>
            <f7-view url="/left/" links-view=".view-main"></f7-view>
        </f7-panel>

        <f7-view
            main
            class="safe-areas"
            :url="appStore.isLoggedIn ? '/dashboard/' : '/login/'"
            :ios-dynamic-navbar="false"
        ></f7-view>
    </f7-app>
</template>
<script>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { f7, f7ready } from "framework7-vue";
import { NativeAudio } from "@capacitor-community/native-audio";

import { StatusBar, Style } from "@capacitor/status-bar";
import { useI18n } from "vue-i18n";
import { getDevice } from "framework7/lite-bundle";
import capacitorApp from "../js/capacitor-app.js";
import { useAppStore } from "../stores/appStore";
import routes from "../js/routes.js";

export default {
    setup(props) {
        const instance = getCurrentInstance();
        const { locale } = useI18n();
        const appStore = useAppStore();
        const device = getDevice();

        // Framework7 Parameters
        const f7params = {
            name: "Stockifly", // App name
            theme: "ios", // Automatic theme detection
            darkMode: appStore.isDarkMode,

            // App routes
            routes: routes,

            // Input settings
            input: {
                scrollIntoViewOnFocus: device.capacitor,
                scrollIntoViewCentered: device.capacitor,
            },
            // Capacitor Statusbar settings
            statusbar: {
                iosOverlaysWebView: true,
                androidOverlaysWebView: false,
            },
        };

        const backgroundColor = computed(() => {
            return appStore.isDarkMode ? "#000000" : "#efefef";
        });

        const colorThemeColor = computed(() => {
            return appStore.isDarkMode ? "#1c1c1d" : appStore.themeColor;
        });

        const navbarColor = computed(() => {
            return appStore.isDarkMode ? "#1c1c1d" : appStore.themeColor;
        });

        const walletCardBackground = computed(() => {
            return appStore.isDarkMode ? "#000000" : appStore.themeColor;
        });

        const walletCardBg = computed(() => {
            return appStore.isDarkMode ? "#1c1c1d" : "#ffffff";
        });

        const walletCardTextColor = computed(() => {
            return appStore.isDarkMode ? "#ffffff" : appStore.themeColor;
        });

        onMounted(() => {
            NativeAudio.preload({
                assetPath: "public/assets/sounds/beep.wav",
                assetId: "beep",
                volume: 1.0,
                isUrl: false,
            });

            NativeAudio.preload({
                assetPath: "public/assets/sounds/beep-warning.wav",
                assetId: "beep-warning",
                volume: 1.0,
                isUrl: false,
            });

            // TODO - only call if application is online
            appStore.getAndUpdateAllLangTrans(instance, locale);
            appStore.getAndUpdateAllWarehouses();
            appStore.getAndUpdateAllLangs();
            appStore.updateApp();

            f7.setColorTheme(appStore.themeColor);

            if (appStore.isDarkMode) {
                StatusBar.setStyle({ style: Style.Dark });
                StatusBar.setBackgroundColor({ color: "#1c1c1d" });
            } else {
                StatusBar.setStyle({ style: Style.Dark });
                StatusBar.setBackgroundColor({ color: appStore.themeColor });
            }

            f7ready(() => {
                // Init capacitor APIs (see capacitor-app.js)
                if (device.capacitor) {
                    capacitorApp.init(f7);
                }
                // Call F7 APIs here
            });
        });

        return {
            f7params,
            appStore,
            backgroundColor,
            colorThemeColor,
            navbarColor,
            walletCardBackground,
            walletCardBg,
            walletCardTextColor,
        };
    },
};
</script>

<style>
.page-content {
    background: v-bind("backgroundColor");
}

.login-page {
    background-color: v-bind("backgroundColor");
}

.navbar-inner {
    background-color: v-bind("navbarColor");
}

.navbar a {
    color: white;
}
.waehouse-select-dropdown {
    background-color: v-bind("appStore.themeColor");
    color: white;
}
.lang-select-dropdown {
    background-color: v-bind("appStore.themeColor");
    color: white;
}
.dashboard-button-filter {
    margin-bottom: 8px;
    font-size: 11px;
    padding: 5px 0px 5px 5px;
    justify-content: space-between;
}

.dashboard-button-filter .button {
    width: 100%;
}

.dashboard-button-filter .button {
    width: 100%;
    font-size: 10px;
}

.button :hover {
    color: white;
    background-color: v-bind("appStore.themeColor");
}
.card-size {
    width: 31%;
    display: inline-flex;
    margin: 5px 1px 2px 7px;
}

.menu-card {
    width: 84px;
    display: inline-block;
    margin: 5px 2px 2px 3px;
    height: 88px;
}
.title {
    color: white;
}

.waehouse-select-dropdown .list .item-link .item-inner:before {
    color: white;
}

.lang-select-dropdown li.media-item .item-link .item-title-row:before {
    color: white;
}

.waehouse-select-dropdown .icon-radio:after {
    color: white;
}

.lang-select-dropdown .icon-radio:after {
    color: white;
}

.icon-color {
    width: 32px;
    font-weight: bold;
}

.menu-card .item-subtitle {
    text-align: center;
}

.right .button {
    color: white;
}

.wallet-card-section {
    position: relative;
}

.wallet-card-section:before {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    content: "";
    display: block;
    height: 180px;
    background: v-bind("walletCardBackground");
}

.wallet-card {
    background: v-bind("walletCardBg");
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.09);
    border-radius: 10px;
    padding: 20px 24px;
    position: relative;
    z-index: 1;
}

.wallet-card .wallet-footer {
    border-top: 1px solid #dcdce9;
    padding-top: 20px;
    border-bottom: 1px solid #dcdce9;
}

.wallet-card .wallet-footer .item {
    flex: 1;
    text-align: center;
    margin-bottom: 8px;
}

.wallet-card .wallet-footer .item a {
    display: block;
}

.wallet-card .wallet-footer .item a:active {
    transform: scale(0.94);
}

.wallet-card .wallet-footer .item .icon-wrapper {
    background: v-bind("appStore.themeColor");
    width: 48px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 24px;
    margin-bottom: 8px;
}

.wallet-card .wallet-footer .item strong {
    display: block;
    color: v-bind("walletCardTextColor");
    font-weight: 500;
    font-size: 11px;
    line-height: 1.2em;
}

.date-change-picker .input-with-value {
    text-align: right;
}

.more-stats .item-content {
    padding-left: 0px;
}
</style>
