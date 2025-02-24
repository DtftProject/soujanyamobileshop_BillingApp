<template>
    <f7-page name="expense-category-add-edit">
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
                            $t('common.placeholder_default_text', [
                                $t('expense_category.name'),
                            ])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("expense_category.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('expense_category.description'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.description ? rules.description.message : null
                        "
                        v-model:value="formData.description"
                        :label="$t('expense_category.description')"
                        resizable
                    ></f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
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
