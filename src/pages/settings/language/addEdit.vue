<template>
    <f7-page name="langs-add-edit">
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
                <f7-list strong-ios dividers-ios outline-ios>
                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('langs.name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("langs.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('langs.key')])
                        "
                        error-message-force
                        :error-message="rules.key ? rules.key.message : null"
                        v-model:value="formData.key"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("langs.key") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :label="$t('langs.flag')"
                        :input="false"
                        error-message-force
                        :error-message="rules.image ? rules.image.message : null"
                    >
                        <template #input>
                            <ImageUpload
                                :formData="formData"
                                folder="langs"
                                @onFileUploaded="
                                    (file) => {
                                        formData.image = file.file;
                                        formData.image_url = file.file_url;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="select"
                        v-model:value="formData.enabled"
                        :placeholder="
                            $t('common.select_default_text', [$t('langs.enabled')])
                        "
                        error-message-force
                        :error-message="rules.enabled ? rules.enabled.message : null"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("langs.enabled") }}
                        </template>

                        <option :value="1">
                            {{ $t("common.yes") }}
                        </option>
                        <option :value="0">
                            {{ $t("common.no") }}
                        </option>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted } from "vue";
import ImageUpload from "../../../components/form/ImageUpload.vue";
import crud from "@/composable/crud";
import fields from "./fields";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        warehouses: {
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
        ImageUpload,
    },
    setup(props) {
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);
        });

        return {
            ...crudVariables,
            fieldsVar,
        };
    },
};
</script>
