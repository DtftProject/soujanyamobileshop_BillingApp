<template>
    <f7-page no-toolbar no-navbar no-swipeback login-screen class="login-page">
        <div class="login-page-logo">
            <img src="../assets/logo.png" style="width: 150px" />
        </div>

        <div
            v-if="onRequestSend && onRequestSend.error && onRequestSend.error != ''"
            class="login-error-message"
        >
            {{ onRequestSend?.error }}
        </div>

        <f7-list strong-ios dividers-ios>
            <f7-list-input
                type="text"
                v-model:value="formData.company_name"
                :placeholder="
                    $t('common.placeholder_default_text', [$t('user.company_name')])
                "
                :label="$t('user.company_name')"
                :error-message="rules.company_name ? rules.company_name.message : null"
                :error-message-force="true"
            ></f7-list-input>
            <f7-list-input
                type="email"
                v-model:value="formData.company_email"
                :placeholder="
                    $t('common.placeholder_default_text', [$t('front_website.email')])
                "
                :label="$t('front_website.email')"
                :error-message="rules.company_email ? rules.company_email.message : null"
                :error-message-force="true"
            ></f7-list-input>
            <f7-list-input
                type="number"
                v-model:value="formData.company_phone"
                :placeholder="
                    $t('common.placeholder_default_text', [$t('front_website.phone')])
                "
                :label="$t('front_website.phone')"
                :error-message="rules.company_phone ? rules.company_phone.message : null"
                :error-message-force="true"
            ></f7-list-input>
            <f7-list-input
                type="text"
                v-model:value="formData.shop_name"
                :placeholder="
                    $t('common.placeholder_default_text', [$t('front_website.shop_name')])
                "
                :label="$t('front_website.shop_name')"
                :error-message="rules.shop_name ? rules.shop_name.message : null"
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
            <f7-list-input
                v-model:value="formData.confirm_password"
                required
                :label="$t('user.confirm_password')"
                :placeholder="
                    $t('common.placeholder_default_text', [$t('user.confirm_password')])
                "
                :error-message="
                    rules.confirm_password ? rules.confirm_password.message : null
                "
                :error-message-force="true"
                type="password"
            ></f7-list-input>
        </f7-list>

        <div style="margin: 16px">
            <f7-button class="btn" preloader :loading="loading" @click="onSubmit" fill>
                {{ $t("front_website.register") }}
            </f7-button>
        </div>
        <div style="text-align: center">
            <f7-button @click="goToLogin()" icon-ios="f7:arrow_left">{{
                $t("Back To Login")
            }}</f7-button>
        </div>
    </f7-page>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
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
            company_name: "",
            company_email: "",
            company_phone: "",
            shop_name: "",
            password: "",
            confirm_password: "",
            condition: "on",
        });
        const onRequestSend = ref({
            error: "",
            success: "",
        });
        const globalSetting = ref(appStore.globalSetting);

        const { addEditRequestAdmin, loading, rules } = apiAdmin();
        const showPicker = ref(false);
        // const router = useRouter();

        const onSubmit = () => {
            onRequestSend.value = {
                error: "",
                success: false,
            };

            addEditRequestAdmin({
                url: "new-register",
                data: { ...formData.value, condition: ["dddd"] },
                success: (response) => {
                    onRequestSend.value = {
                        error: "",
                        success: true,
                    };
                    f7.views.main.router.navigate("/login/");
                },
                error: (err) => {
                    onRequestSend.value = {
                        error: err.error.message ? err.error.message : "",
                        success: false,
                    };
                },
            });
        };

        const goToLogin = () => {
            formData.value.company_name = "";
            formData.value.company_email = "";
            formData.value.company_phone = "";
            formData.value.password = "";
            formData.value.confirm_password = "";
            formData.value.shop_name = "";
            formData.value.condition = [];
            onRequestSend.value = {
                error: "",
                success: false,
            };
            rules.value = {};
            // emit("addSuccess");
            f7.views.main.router.navigate("/login/");
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
            onSubmit,
            goToLogin,
        };
    },
};
</script>
