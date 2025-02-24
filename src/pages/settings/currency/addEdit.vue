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
                            $t('common.placeholder_default_text', [$t('currency.name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("currency.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('currency.symbol')])
                        "
                        error-message-force
                        :error-message="rules.symbol ? rules.symbol.message : null"
                        v-model:value="formData.symbol"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("currency.symbol") }}
                        </template>
                    </f7-list-input>
                    <f7-list-input
                        type="select"
                        v-model:value="formData.position"
                        :placeholder="
                            $t('common.select_default_text', [$t('currency.position')])
                        "
                        error-message-force
                        :error-message="rules.position ? rules.position.message : null"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("currency.position") }}
                        </template>

                        <option value="front">
                            {{ $t("currency.front") }}
                            ({{ $t("currency.front_position_example") }})
                        </option>
                        <option value="behind">
                            {{ $t("currency.behind") }}
                            ({{ $t("currency.behind_position_example") }})
                        </option>
                    </f7-list-input>
                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('currency.code')])
                        "
                        error-message-force
                        :error-message="rules.code ? rules.code.message : null"
                        v-model:value="formData.code"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("currency.code") }}
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import common from "@/composable/common";
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
