<template>
    <f7-page>
        <f7-navbar :title="$t('menu.company')" :back-link="$t('common.back')">
            <f7-nav-right>
                <f7-button @click="onSubmit">
                    {{ $t("common.save") }}
                </f7-button>
            </f7-nav-right>
        </f7-navbar>

        <f7-toolbar top tabbar>
            <f7-link tab-link="#tab-1" tab-link-active>
                {{ $t("warehouse.basic_details") }}
            </f7-link>
            <f7-link tab-link="#tab-2"> {{ $t("setup_company.logo_settings") }}</f7-link>
        </f7-toolbar>
        <f7-tabs>
            <f7-tab id="tab-1" tab-active>
                <f7-card>
                    <f7-card-content :padding="false">
                        <f7-list strong-ios dividers-ios outline-ios>
                            <f7-list-input
                                type="text"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('company.name'),
                                    ])
                                "
                                error-message-force
                                :error-message="rules.name ? rules.name.message : null"
                                v-model:value="formData.name"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.name") }}
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                type="text"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('company.short_name'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.short_name ? rules.short_name.message : null
                                "
                                v-model:value="formData.short_name"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.short_name") }}
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                type="text"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('company.email'),
                                    ])
                                "
                                error-message-force
                                :error-message="rules.email ? rules.email.message : null"
                                v-model:value="formData.email"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.email") }}
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                type="text"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('company.phone'),
                                    ])
                                "
                                error-message-force
                                :error-message="rules.phone ? rules.phone.message : null"
                                v-model:value="formData.phone"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.phone") }}
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                type="textarea"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('company.address'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.address ? rules.address.message : null
                                "
                                v-model:value="formData.address"
                                :label="$t('company.address')"
                                resizable
                            ></f7-list-input>
                            <f7-list-input
                                type="select"
                                v-model:value="formData.left_sidebar_theme"
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('company.left_sidebar_theme'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.left_sidebar_theme
                                        ? rules.left_sidebar_theme.message
                                        : null
                                "
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.left_sidebar_theme") }}
                                </template>

                                <option key="dark" value="dark">
                                    {{ $t("company.dark") }}
                                </option>
                                <option key="light" value="light">
                                    {{ $t("company.light") }}
                                </option>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('company.primary_color')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.primary_color
                                        ? rules.primary_color.message
                                        : null
                                "
                            >
                                <template #input>
                                    <f7-list-input
                                        type="colorpicker"
                                        readonly
                                        :color-picker-params="{
                                            targetEl: '.wheel-picker-target',
                                        }"
                                        :placeholder="
                                            $t('common.placeholder_default_text', [
                                                $t('company.primary_color'),
                                            ])
                                        "
                                        v-model:value="wheePickerValue"
                                    >
                                        <template #media>
                                            <i
                                                :style="{
                                                    backgroundColor: wheePickerValue.hex,
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '6px',
                                                    boxSizing: 'border-box',
                                                }"
                                                class="wheel-picker-target"
                                            ></i>
                                        </template>
                                    </f7-list-input>
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.currency_id ? rules.currency_id.message : null
                                "
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.currency") }}
                                </template>
                                <template
                                    #input
                                    :style="{ padding: '0px', margin: '0px' }"
                                >
                                    <CodrajSelect
                                        :placeholder="
                                            $t('common.select_default_text', [
                                                $t('company.currency'),
                                            ])
                                        "
                                        :selectedValue="formData.currency_id"
                                        :items="currencies"
                                        fieldKey="xid"
                                        fieldName="name"
                                        className="currency-select"
                                        @changed="
                                            (newVal) => (formData.currency_id = newVal)
                                        "
                                    />
                                </template>
                            </f7-list-input>

                            <template v-if="permsArray.includes('admin')">
                                <f7-list-input
                                    :input="false"
                                    error-message-force
                                    :error-message="
                                        rules.warehouse_id
                                            ? rules.warehouse_id.message
                                            : null
                                    "
                                >
                                    <template #label>
                                        <span class="required-input">*</span>
                                        {{ $t("warehouse.warehouse") }}
                                    </template>
                                    <template
                                        #input
                                        :style="{ padding: '0px', margin: '0px' }"
                                    >
                                        <CodrajSelect
                                            :placeholder="
                                                $t('common.select_default_text', [
                                                    $t('warehouse.warehouse'),
                                                ])
                                            "
                                            :selectedValue="formData.warehouse_id"
                                            :items="warehouses"
                                            fieldKey="xid"
                                            fieldName="name"
                                            className="warehouse-select"
                                            @changed="
                                                (newVal) =>
                                                    (formData.warehouse_id = newVal)
                                            "
                                        />
                                    </template>
                                </f7-list-input>
                            </template>
                            <f7-list-input
                                type="select"
                                v-model:value="formData.rtl"
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('company.layout'),
                                    ])
                                "
                                error-message-force
                                :error-message="rules.rtl ? rules.rtl.message : null"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.layout") }}
                                </template>

                                <option value="1">
                                    {{ $t("company.rtl") }}
                                </option>
                                <option value="0">
                                    {{ $t("company.ltr") }}
                                </option>
                            </f7-list-input>

                            <f7-list-input
                                type="select"
                                v-model:value="formData.shortcut_menus"
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('company.shortcut_menu_Placement'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.shortcut_menus
                                        ? rules.shortcut_menus.message
                                        : null
                                "
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.shortcut_menu_Placement") }}
                                </template>
                                <option value="top_bottom">
                                    {{ $t("company.top_and_bottom") }}
                                </option>
                                <option value="top">
                                    {{ $t("company.top_header") }}
                                </option>
                                <option value="bottom">
                                    {{ $t("company.bottom_corner") }}
                                </option>
                            </f7-list-input>

                            <f7-list-input
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.lang_id ? rules.lang_id.message : null
                                "
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.language") }}
                                </template>
                                <template
                                    #input
                                    :style="{ padding: '0px', margin: '0px' }"
                                >
                                    <CodrajSelect
                                        :placeholder="
                                            $t('common.select_default_text', [
                                                $t('company.language'),
                                            ])
                                        "
                                        :selectedValue="formData.lang_id"
                                        :items="allLangs"
                                        fieldKey="xid"
                                        fieldName="name"
                                        className="language-select"
                                        @changed="(newVal) => (formData.lang_id = newVal)"
                                    />
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                type="select"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('company.auto_detect_timezone'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.auto_detect_timezone
                                        ? rules.auto_detect_timezone.message
                                        : null
                                "
                                v-model:value="formData.auto_detect_timezone"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.auto_detect_timezone") }}
                                </template>
                                <option value="1">
                                    {{ $t("common.yes") }}
                                </option>
                                <option value="0">
                                    {{ $t("common.no") }}
                                </option>
                            </f7-list-input>
                            <f7-list-input
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.timezone ? rules.timezone.message : null
                                "
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.default_timezone") }}
                                </template>
                                <template
                                    #input
                                    :style="{ padding: '0px', margin: '0px' }"
                                >
                                    <span>
                                        <select name="timezone">
                                            <option
                                                v-for="timezone in timezones"
                                                :key="timezone.key"
                                                :value="timezone.key"
                                            >
                                                {{ timezone }}
                                            </option>
                                        </select>
                                    </span>
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                type="select"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('company.app_debug'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.app_debug ? rules.app_debug.message : null
                                "
                                v-model:value="formData.app_debug"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.app_debug") }}
                                </template>
                                <option value="1">
                                    {{ $t("common.yes") }}
                                </option>
                                <option value="0">
                                    {{ $t("common.no") }}
                                </option>
                            </f7-list-input>
                            <f7-list-input
                                type="select"
                                :placeholder="
                                    $t('common.placeholder_default_text', [
                                        $t('company.update_app_notification'),
                                    ])
                                "
                                error-message-force
                                :error-message="
                                    rules.update_app_notification
                                        ? rules.update_app_notification.message
                                        : null
                                "
                                v-model:value="formData.update_app_notification"
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.update_app_notification") }}
                                </template>

                                <option value="1">
                                    {{ $t("common.yes") }}
                                </option>
                                <option value="0">
                                    {{ $t("common.no") }}
                                </option>
                            </f7-list-input>

                            <f7-list-input
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.date_format ? rules.date_format.message : null
                                "
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.date_format") }}
                                </template>
                                <template
                                    #input
                                    :style="{ padding: '0px', margin: '0px' }"
                                >
                                    <span>
                                        <select name="date_format">
                                            <option
                                                v-for="dates in dateFormats"
                                                :key="dates.key"
                                                :value="dates.key"
                                            >
                                                {{
                                                    `(${dates}) => ` +
                                                    dayjsObject().format(dates)
                                                }}
                                            </option>
                                        </select>
                                    </span>
                                </template>
                            </f7-list-input>

                            <f7-list-input
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.time_format ? rules.time_format.message : null
                                "
                            >
                                <template #label>
                                    <span class="required-input">*</span>
                                    {{ $t("company.time_format") }}
                                </template>
                                <template
                                    #input
                                    :style="{ padding: '0px', margin: '0px' }"
                                >
                                    <span>
                                        <select name="time_format">
                                            <option
                                                v-for="timeFormat in timeFormats"
                                                :key="timeFormat.key"
                                                :value="timeFormat.key"
                                            >
                                                {{
                                                    `(${timeFormat}) => ` +
                                                    dayjsObject().format(timeFormat)
                                                }}
                                            </option>
                                        </select>
                                    </span>
                                </template>
                            </f7-list-input>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>
            <f7-tab id="tab-2">
                <f7-card>
                    <f7-card-content :padding="false">
                        <f7-list strong-ios dividers-ios outline-ios>
                            <f7-list-input
                                :label="$t('company.dark_logo')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.dark_logo ? rules.dark_logo.message : null
                                "
                            >
                                <template #input>
                                    <ImageUpload
                                        :formData="formData"
                                        folder="company"
                                        imageField="dark_logo"
                                        @onFileUploaded="
                                            (file) => {
                                                formData.dark_logo = file.file;
                                                formData.dark_logo_url = file.file_url;
                                            }
                                        "
                                    />
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('company.light_logo')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.light_logo ? rules.light_logo.message : null
                                "
                            >
                                <template #input>
                                    <ImageUpload
                                        :formData="formData"
                                        folder="company"
                                        imageField="light_logo"
                                        @onFileUploaded="
                                            (file) => {
                                                formData.light_logo = file.file;
                                                formData.light_logo_url = file.file_url;
                                            }
                                        "
                                    />
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('company.small_dark_logo')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.small_dark_logo
                                        ? rules.small_dark_logo.message
                                        : null
                                "
                            >
                                <template #input>
                                    <ImageUpload
                                        :formData="formData"
                                        folder="company"
                                        imageField="small_dark_logo"
                                        @onFileUploaded="
                                            (file) => {
                                                formData.small_dark_logo = file.file;
                                                formData.small_dark_logo_url =
                                                    file.file_url;
                                            }
                                        "
                                    />
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('company.small_light_logo')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.small_light_logo
                                        ? rules.small_light_logo.message
                                        : null
                                "
                            >
                                <template #input>
                                    <ImageUpload
                                        :formData="formData"
                                        folder="company"
                                        imageField="small_light_logo"
                                        @onFileUploaded="
                                            (file) => {
                                                formData.small_light_logo = file.file;
                                                formData.small_light_logo_url =
                                                    file.file_url;
                                            }
                                        "
                                    />
                                </template>
                            </f7-list-input>
                            <f7-list-input
                                :label="$t('company.login_image')"
                                :input="false"
                                error-message-force
                                :error-message="
                                    rules.login_image ? rules.login_image.message : null
                                "
                            >
                                <template #input>
                                    <ImageUpload
                                        :formData="formData"
                                        folder="company"
                                        imageField="login_image"
                                        @onFileUploaded="
                                            (file) => {
                                                formData.login_image = file.file;
                                                formData.login_image_url = file.file_url;
                                            }
                                        "
                                    />
                                </template>
                            </f7-list-input>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>
        </f7-tabs>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { f7 } from "framework7-vue";
import { useAppStore } from "@/stores/appStore";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import apiAdmin from "@/composable/apiAdmin";
import ImageUpload from "../../../components/form/ImageUpload.vue";
import common from "@/composable/common";
import { axiosAdmin } from "@/common/axiosAdmin";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    components: {
        CodrajSelect,
        ImageUpload,
    },
    setup(props) {
        const { t } = useI18n();
        const appStore = useAppStore();
        const { addEditRequestAdmin, loading, rules } = apiAdmin();
        const formData = ref({});
        const dateFormats = ref([]);
        const timeFormats = ref([]);
        const warehouses = ref([]);
        const currencies = ref([]);
        const timezones = ref([]);
        const allLangs = ref([]);
        const { permsArray, dayjsObject } = common();
        const warehouseUrl = "warehouses?limit=10000";
        const currencyUrl = "currencies?limit=10000";
        const timezoneUrl = "timezones";
        const langUrl = "all-langs";
        const wheePickerValue = ref({ hex: "#00ff00" });

        onMounted(() => {
            f7.preloader.show();

            const warehousesPromise = axiosAdmin().get(warehouseUrl);
            const timezonePromise = axiosAdmin().get(timezoneUrl);
            const currencyPromise = axiosAdmin().get(currencyUrl);
            const langPromise = axiosAdmin().get(langUrl);

            Promise.all([
                warehousesPromise,
                currencyPromise,
                timezonePromise,
                langPromise,
            ]).then(
                ([
                    warehousesResponse,
                    currenciesResponse,
                    timezonesResponse,
                    langResponse,
                ]) => {
                    warehouses.value = warehousesResponse.data;
                    currencies.value = currenciesResponse.data;
                    timezones.value = timezonesResponse.data.timezones;
                    dateFormats.value = timezonesResponse.data.date_formates;
                    timeFormats.value = timezonesResponse.data.time_formates;
                    allLangs.value = langResponse.data.langs;

                    setFormData();

                    f7.preloader.hide();
                }
            );
        });

        const setFormData = () => {
            const company = appStore.appSetting;

            formData.value = {
                name: company.name,
                short_name: company.short_name,
                email: company.email,
                phone: company.phone,
                address: company.address,
                left_sidebar_theme: company.left_sidebar_theme,
                dark_logo: company.dark_logo,
                dark_logo_url: company.dark_logo_url,
                light_logo: company.light_logo,
                light_logo_url: company.light_logo_url,
                small_dark_logo: company.small_dark_logo,
                small_light_logo: company.small_light_logo,
                small_dark_logo_url: company.small_dark_logo_url,
                small_light_logo_url: company.small_light_logo_url,
                login_image: company.login_image,
                login_image_url: company.login_image_url,
                shortcut_menus: company.shortcut_menus,
                rtl: company.rtl,
                currency_id: company.x_currency_id,
                lang_id: company.x_lang_id,
                warehouse_id: company.x_warehouse_id,
                timezone: company.timezone,
                date_format: company.date_format,
                time_format: company.time_format,
                auto_detect_timezone: company.auto_detect_timezone,
                app_debug: company.app_debug,
                update_app_notification: company.update_app_notification,
                _method: "PUT",
            };

            wheePickerValue.value.hex = company.primary_color;
        };

        const onSubmit = () => {
            f7.preloader.show();

            const company = appStore.appSetting;
            var newFormData = {
                ...formData.value,
                primary_color: wheePickerValue.value.hex,
            };

            addEditRequestAdmin({
                url: `companies/${company.xid}`,
                data: newFormData,
                successMessage: t("company.updated"),
                success: (res) => {
                    appStore.updateApp();

                    f7.preloader.hide();
                },
                error: (res) => {
                    f7.preloader.hide();
                },
            });
        };

        return {
            permsArray,
            warehouses,
            currencies,
            timezones,
            dateFormats,
            timeFormats,
            allLangs,
            appStore,
            formData,
            dayjsObject,
            wheePickerValue,
            onSubmit,
            loading,
            rules,
        };
    },
};
</script>
