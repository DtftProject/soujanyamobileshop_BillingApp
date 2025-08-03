<template>
    <f7-page>
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
                            $t('common.placeholder_default_text', [
                                $t('payment_mode.name'),
                            ])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("payment_mode.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="select"
                        v-model:value="formData.mode_type"
                        :placeholder="
                            $t('common.select_default_text', [
                                $t('payment_mode.mode_type'),
                            ])
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("payment_mode.mode_type") }}
                        </template>

                        <option value="cash">
                            {{ $t("payment_mode.cash") }}
                        </option>
                        <option value="bank">
                            {{ $t("payment_mode.bank") }}
                        </option>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted } from "vue";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
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
        CodrajSelect,
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
