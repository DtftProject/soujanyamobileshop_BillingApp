<template>
    <f7-page>
        <f7-navbar :title="$t('menu.profile')" back-link="Back">
            <f7-nav-right>
                <f7-button @click="onSubmit">
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
                            $t('common.placeholder_default_text', [$t('user.name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("user.name") }}
                        </template>
                    </f7-list-input>
                </f7-list>

                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.email')])
                        "
                        error-message-force
                        :error-message="rules.email ? rules.email.message : null"
                        v-model:value="formData.email"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("user.email") }}
                        </template>
                    </f7-list-input>
                </f7-list>

                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.password')])
                        "
                        error-message-force
                        :error-message="rules.password ? rules.password.message : null"
                        v-model:value="formData.password"
                    >
                        <template #label>
                            {{ $t("user.password") }}
                        </template>
                    </f7-list-input>
                </f7-list>

                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.phone')])
                        "
                        error-message-force
                        :error-message="rules.phone ? rules.phone.message : null"
                        v-model:value="formData.phone"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("user.phone") }}
                        </template>
                    </f7-list-input>
                </f7-list>
                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        :label="$t('user.profile_image')"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.profile_image ? rules.profile_image.message : null
                        "
                    >
                        <template #input>
                            <ImageUpload
                                :formData="formData"
                                folder="user"
                                imageField="profile_image"
                                @onFileUploaded="
                                    (file) => {
                                        formData.profile_image = file.file;
                                        formData.profile_image_url = file.file_url;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>
                </f7-list>
                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('user.address')])
                        "
                        error-message-force
                        :error-message="rules.address ? rules.address.message : null"
                        v-model:value="formData.address"
                        resizable
                    >
                        <template #label>
                            {{ $t("user.address") }}
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { f7 } from "framework7-vue";
import { useAppStore } from "@/stores/appStore";
import apiAdmin from "@/composable/apiAdmin";
import ImageUpload from "../../../components/form/ImageUpload.vue";
import common from "@/composable/common";

export default {
    props: {
        f7router: Object,
        f7route: Object,
    },
    components: {
        ImageUpload,
    },
    setup(props) {
        const { t } = useI18n();
        const appStore = useAppStore();
        const { addEditRequestAdmin, loading, rules } = apiAdmin();
        const formData = ref({});

        const { permsArray } = common();

        onMounted(() => {
            const user = appStore.authUser;

            formData.value = {
                name: user.name,
                email: user.email,
                password: "",
                phone: user.phone,
                profile_image: user.profile_image,
                profile_image_url: user.profile_image_url,
            };
        });

        const onSubmit = () => {
            f7.preloader.show();

            addEditRequestAdmin({
                url: "profile",
                data: formData.value,
                successMessage: t("user.profile_updated"),
                success: (res) => {
                    appStore.updateAuthUser(res.user);

                    f7.preloader.hide();
                },
                error: (res) => {
                    f7.preloader.hide();
                },
            });
        };

        return {
            permsArray,
            appStore,
            formData,
            onSubmit,
            loading,
            rules,
        };
    },
};
</script>
