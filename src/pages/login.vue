<template>
    <f7-page no-toolbar no-navbar no-swipeback login-screen class="login-page">
        <div style="height: 100vh; width: 100%" v-if="dataFetching">
            <f7-preloader
                color="#04994e"
                style="
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                "
            />
        </div>
        <div v-else>
            <div class="login-page-logo">
                <img src="../assets/new_logo.jpg" style="width: 150px" />
                <!-- <img :src="globalSetting.light_logo_url" /> -->
            </div>

            <div
                v-if="onRequestSend && onRequestSend.error && onRequestSend.error != ''"
                class="login-error-message"
            >
                {{ onRequestSend?.error }}
            </div>

            <f7-list strong-ios dividers-ios>
                <f7-list-input
                    type="email"
                    v-model:value="formData.email"
                    :placeholder="
                        $t('common.placeholder_default_text', [$t('user.email_phone')])
                    "
                    :label="$t('user.email_phone')"
                    :error-message="rules.email ? rules.email.message : null"
                    :error-message-force="true"
                ></f7-list-input>

                <f7-list-input
                    v-model:value="formData.password"
                    required
                    :label="$t('user.password')"
                    :placeholder="
                        $t('common.placeholder_default_text', [$t('user.password')])
                    "
                    :error-message="rules.password ? rules.password.message : null"
                    :error-message-force="true"
                    type="password"
                ></f7-list-input>
            </f7-list>

            <div style="margin: 16px">
                <f7-button class="btn" preloader :loading="loading" @click="login" fill>
                    {{ $t("menu.login") }}
                </f7-button>
            </div>

            <!-- <div :style="{ textAlign: 'center', marginTop: '10px' }">
                Haven't any account?
                <f7-button href="#" @click.prevent="goToRegister()"> Register </f7-button>
                <a href="#" @click.prevent="loginAnotherCompany">
                    Login With Another Company
                </a>
            </div> -->
        </div>
    </f7-page>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import { f7, f7ready } from "framework7-vue";
import { useI18n } from "vue-i18n";
import { find } from "lodash-es";
import { useAppStore } from "../stores/appStore";
import { axiosBase } from "../common/axiosBase";
import apiAdmin from "../composable/apiAdmin";
import { locale } from "dayjs";

export default {
    setup() {
        const instance = getCurrentInstance();
        const { t, locale } = useI18n();
        const appStore = useAppStore();
        const appUrl = ref("billing.soujanya360.com");
        const urlPrefixOptions = ref(["http://", "https://"]);
        const urlPrefix = ref("https://");
        const errorMessage = ref("");
        const appBaseUrl = ref(appStore.appUrl);
        const formData = ref({
            email: "",
            password: "",
        });
        const onRequestSend = ref({
            error: "",
            success: "",
        });
        const globalSetting = ref(appStore.globalSetting);
        const dataFetching = ref(true);

        const { addEditRequestAdmin, loading, rules } = apiAdmin();
        const showPicker = ref(false);
        // const router = useRouter();

        onMounted(() => {
            appStore.updateAppUrl("https://billing.soujanya360.com");
            getAndSetLangMessage();
        });

        const getAndSetLangMessage = () => {
            // Show PreLoader
            // f7.preloader.show();

            const appPromise = axiosBase(appBaseUrl.value).get("/app");
            const langPromise = axiosBase(appBaseUrl.value).get("/all-langs");
            const langTransPromise = axiosBase(appBaseUrl.value).get("/lang-trans");

            Promise.all([appPromise, langPromise, langTransPromise]).then(
                ([appResponse, langResponse, langTransResponse]) => {
                    const golbalAppSettingData = appResponse.data.app;
                    const allLangs = langResponse.data.langs;
                    const appLang = find(allLangs, [
                        "xid",
                        golbalAppSettingData.x_lang_id,
                    ]);

                    appStore.updateAllLangTrans(langTransResponse.data.data);
                    appStore.updateAllLangs(langResponse.data.langs);
                    appStore.updateSelectedLang(appLang, instance, locale);
                    // appStore.updateAppUrl(baseUrl);
                    appStore.updateGlobalSetting(golbalAppSettingData);
                    appStore.updateActiveTabName("dashboard");

                    // appBaseUrl.value = baseUrl;
                    globalSetting.value = golbalAppSettingData;

                    // Hide PreLoader
                    // f7.preloader.hide();

                    dataFetching.value = false;
                }
            );
        };

        const login = () => {
            onRequestSend.value = {
                error: "",
                success: false,
            };

            addEditRequestAdmin({
                url: "auth/login",
                data: formData.value,
                success: (response) => {
                    const user = response.user;

                    if (user.is_superadmin && user.user_type == "super_admins") {
                        onRequestSend.value = {
                            error: "This app is not for superadmin",
                            success: false,
                        };
                    } else {
                        onRequestSend.value = {
                            error: false,
                            success: t("messages.login_success"),
                        };

                        appStore.updateAuthUser(user);
                        appStore.updateSelectedWarehouse(user.warehouse);
                        appStore.updateAuthToken(response.token);
                        appStore.updateExpires(response.expires_in);
                        appStore.updateVisibleSubscriptionModules(
                            response.visible_subscription_modules
                        );
                        appStore.updateAppSetting(response.app);
                        appStore.updateEmailVerifiedSetting(
                            response.email_setting_verified
                        );
                        appStore.updateAddMenus(response.shortcut_menus.credentials);
                        // router.push({
                        //     name: "app.dashboard.index",
                        //     params: { success: true },
                        // });

                        f7.views.main.router.history = ["/dashboard/"];
                        f7.views.main.router.initialUrl = "/dashboard/";
                        f7.views.main.router.navigate("/dashboard/");
                    }
                },
                error: (err) => {
                    onRequestSend.value = {
                        error: err.error.message ? err.error.message : "",
                        success: false,
                    };
                },
            });
        };

        const loginAnotherCompany = () => {
            appUrl.value = "";
            urlPrefix.value = "https://";
            loading.value = false;
            rules.value = {};
            errorMessage.value = "";
            onRequestSend.value = {
                error: "",
                success: "",
            };

            formData.value = {
                email: "",
                password: "",
            };

            globalSetting.value = {};
            appBaseUrl.value = "";

            appStore.updateAppUrl(null);
            appStore.updateAppSetting(null);
        };
        const goToRegister = () => {
            f7.views.main.router.navigate("/register/");
        };

        return {
            showPicker,
            appUrl,
            urlPrefix,
            urlPrefixOptions,
            appBaseUrl,
            loading,
            errorMessage,
            onRequestSend,
            formData,
            rules,
            globalSetting,

            login,
            loginAnotherCompany,
            goToRegister,

            dataFetching,
        };
    },
};
</script>
