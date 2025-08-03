<template>
    <f7-page>
        <f7-navbar
            :title="$t(`${fieldsVar.langKey}.${addEditType}`)"
            :back-link="$t('common.back')"
        >
            <f7-nav-right>
                <f7-button @click="onFormSubmit">
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
                            $t('common.placeholder_default_text', [$t('tax.name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("tax.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="select"
                        v-model:value="formData.tax_type"
                        :placeholder="
                            $t('common.select_default_text', [$t('tax.tax_type')])
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("tax.tax_type") }}
                        </template>

                        <option value="single">
                            {{ $t("tax.single") }}
                        </option>
                        <option value="multiple">
                            {{ $t("tax.multiple") }}
                        </option>
                    </f7-list-input>

                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="rules.rate ? rules.rate.message : null"
                        :disabled="formData.tax_type == 'multiple'"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("tax.rate") }}
                        </template>
                        <template #input>
                            <div style="display: flex">
                                <f7-list-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('tax.rate'),
                                        ])
                                    "
                                    v-model:value="formData.rate"
                                    class="rate-input"
                                    :style="{ width: '100%', paddingLeft: '0px' }"
                                />
                                <span
                                    class="margin-t12"
                                    :style="{
                                        width: '30px',
                                        textAlign: 'right',
                                        marginTop: '12px',
                                    }"
                                >
                                    %
                                </span>
                            </div>
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title v-if="formData.tax_type == 'multiple'">
            {{ $t("tax.multiple_tax") }}
        </f7-block-title>
        <f7-card>
            <f7-card-content :padding="false">
                <f7-list
                    v-if="formData.tax_type == 'multiple'"
                    strong-ios
                    dividers-ios
                    outline-ios
                >
                    <f7-list-input
                        v-for="(formField, index) in formFields"
                        :key="formField.id"
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.opening_balance ? rules.opening_balance.message : null
                        "
                    >
                        <template #input>
                            <div style="display: flex">
                                <f7-input
                                    type="text"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('tax.name'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formField.tax_name"
                                />
                                <span>
                                    <f7-input
                                        :label="null"
                                        type="number"
                                        v-model:value="formField.rate"
                                        :placeholder="$t('tax.rate')"
                                        :style="{ width: '100px' }"
                                        @change="
                                            () => {
                                                formData.rate = sumBy(
                                                    formFields,
                                                    function (o) {
                                                        return parseFloat(o.rate);
                                                    }
                                                );
                                            }
                                        "
                                    />
                                </span>
                                <span v-if="addEditType == 'add'">
                                    <f7-button
                                        @click="
                                            () => {
                                                removeFormField(formField);
                                                formData.rate = sumBy(formFields, 'rate');
                                            }
                                        "
                                        class="margin-t6"
                                    >
                                        <f7-icon
                                            f7="minus_circle"
                                            size="20px"
                                            color="blue"
                                        >
                                        </f7-icon>
                                    </f7-button>
                                </span>
                            </div>
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <div
            v-if="formData.tax_type == 'multiple'"
            style="display: flex; justify-content: center"
        >
            <f7-button @click="addFormField" :disabled="addFormButtonStatus">
                {{ $t("tax.add") }}
            </f7-button>
        </div>
    </f7-page>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import crud from "@/composable/crud";
import fields from "./fields";
import { some, sumBy, filter, forEach } from "lodash-es";

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
    },
    setup(props) {
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const { formatAmountCurrency, appSetting, permsArray } = common();
        const removedMultipleTax = ref([]);
        const formFields = ref([]);

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);

            if (props.addEditType == "add") {
                addFormField();
            }

            if (props.addEditType == "edit") {
                forEach(props.item.multiple_tax, (multipleTax) => {
                    formFields.value.push({
                        tax_name: multipleTax.name,
                        rate: multipleTax.rate,
                        id: multipleTax.xid,
                    });
                });
            }
        });

        const addFormButtonStatus = computed(() => {
            if (formFields.value.length == 0) {
                return false;
            } else {
                return (
                    some(formFields.value, { tax_name: "" }) ||
                    some(formFields.value, { tax_name: null }) ||
                    some(formFields.value, { rate: "" }) ||
                    some(formFields.value, { rate: null })
                );
            }
        });

        const addFormField = () => {
            formFields.value.push({
                tax_name: "",
                rate: "",
                id: "",
            });
        };

        const removeFormField = (item) => {
            // console.log(item);
            let index = formFields.value.indexOf(item);
            if (index !== -1) {
                formFields.value.splice(index, 1);
            }

            if (item.id != "") {
                removedMultipleTax.value.push(item.id);
            }
        };

        const onFormSubmit = () => {
            let filtersFormFields = filter(formFields.value, function (newFormField) {
                return (
                    newFormField.tax_name != "" &&
                    newFormField.rate &&
                    newFormField.rate > 0
                );
            });

            crudVariables.formData.value = {
                ...crudVariables.formData.value,
                multiple_taxes: filtersFormFields,
                removed_fields: removedMultipleTax.value,
            };

            crudVariables.onSubmit();
        };

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            appStore,
            formFields,
            addFormButtonStatus,
            removeFormField,
            addFormField,
            sumBy,

            onFormSubmit,
        };
    },
};
</script>

<style>
.rate-input .item-content {
    padding-left: 0px;
}
</style>
