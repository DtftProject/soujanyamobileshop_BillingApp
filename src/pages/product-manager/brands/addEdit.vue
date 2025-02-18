<template>
    <f7-page name="brand-add-edit">
        <f7-navbar
            :title="$t(`${fieldsVar.langKey}.${addEditType}`)"
            :back-link="$t('common.back')"
        >
            <f7-nav-right>
                <f7-button @click="onSubmit">
                    {{ $t("common.save") }}
                </f7-button>
            </f7-nav-right>
        </f7-navbar>

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
                            $t('common.placeholder_default_text', [$t('brand.name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                        v-on:keyup="formData.slug = slugify($event.target.value)"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("brand.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('brand.slug')])
                        "
                        error-message-force
                        :error-message="rules.slug ? rules.slug.message : null"
                        v-model:value="formData.slug"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("brand.slug") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :label="$t('brand.logo')"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.profile_image ? rules.profile_image.message : null
                        "
                    >
                        <template #input>
                            <ImageUpload
                                :formData="formData"
                                folder="brand"
                                @onFileUploaded="
                                    (file) => {
                                        formData.image = file.file;
                                        formData.image_url = file.file_url;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import common from "../../../composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import ImageUpload from "../../../components/form/ImageUpload.vue";
import crud from "@/composable/crud";
import fields from "./fields";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {
            default: {},
        },
        addEditType: {
            default: "add",
        },
    },
    components: {
        CodrajSelect,
        ImageUpload,
    },
    setup(props) {
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const { formatAmountCurrency, appSetting, permsArray, slugify } = common();

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);
        });

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            appStore,
            slugify,
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
