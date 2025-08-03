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

        <f7-list strong-ios dividers-ios outline-ios>
            <f7-list-input
                type="text"
                :placeholder="
                    $t('common.placeholder_default_text', [$t('variation.name')])
                "
                error-message-force
                :error-message="rules.name ? rules.name.message : null"
                v-model:value="formData.name"
            >
                <template #label>
                    <span class="required-input">*</span>
                    {{ $t("variation.name") }}
                </template>
            </f7-list-input>
        </f7-list>
        <f7-block-title>
            {{ $t("variation.variation_values") }}
        </f7-block-title>
        <f7-list strong-ios dividers-ios outline-ios>
            <f7-list-input
                v-for="(formField, index) in formFields"
                :key="formField.id"
                :input="false"
                error-message-force
                :error-message="rules.value ? rules.value.message : null"
            >
                <template #input>
                    <div style="display: flex">
                        <span>
                            <f7-input
                                :label="null"
                                type="text"
                                v-model:value="formField.name"
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('variation.value'),
                                    ])
                                "
                                :style="{ width: '250px' }"
                            />
                        </span>
                        <span>
                            <f7-button
                                @click="
                                    () => {
                                        removeFormField(formField);
                                    }
                                "
                            >
                                <f7-icon f7="minus_circle" size="20px" color="blue">
                                </f7-icon>
                            </f7-button>
                        </span>
                    </div>
                </template>
            </f7-list-input>
            <p v-if="rules.value" style="color: red">
                {{ rules.value.message }}
            </p>
        </f7-list>

        <div style="display: flex; justify-content: center">
            <f7-button @click="addFormField" :disabled="addFormButtonStatus">
                {{ $t("variation.add_new_value") }}
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
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const { formatAmountCurrency, appSetting, permsArray } = common();
        const warehouseVisible = ref(false);
        const removedVariations = ref([]);
        const formFields = ref([
            {
                name: "",
                id: "",
            },
        ]);

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);

            if (
                props.addEditType == "add" ||
                (props.addEditType == "edit" && !props.item.is_walkin_customer)
            ) {
                warehouseVisible.value = true;
            }

            if (props.addEditType == "add") {
                crudVariables.formData.value = {
                    ...crudVariables.formData.value,
                    warehouse_id: appStore.selectedWarehouse.xid,
                };
            }
            // if (props.addEditType == "edit") {
            //     forEach(props.item.multiple_tax, (multipleTax) => {
            //         formFields.value.push({
            //             name: multipleTax.rate,
            //             id: multipleTax.xid,
            //         });
            //     });
            // }
        });

        const addFormButtonStatus = computed(() => {
            if (formFields.value.length == 0) {
                return false;
            } else {
                return (
                    some(formFields.value, { name: "" }) ||
                    some(formFields.value, { name: null })
                );
            }
        });

        const addFormField = () => {
            formFields.value.push({
                name: "",
                id: "",
            });
        };

        const removeFormField = (item) => {
            let index = formFields.value.indexOf(item);
            if (index !== -1) {
                formFields.value.splice(index, 1);
            }

            if (item.id != "") {
                removedVariations.value.push(item.id);
            }
        };

        const onFormSubmit = () => {
            var filtersFormFields = forEach(formFields.value, function (newFormField) {
                if (newFormField.name != "" && newFormField.name);
            });

            crudVariables.formData.value = {
                ...crudVariables.formData.value,
                value: filtersFormFields,
                removed_variations: removedVariations.value,
            };

            crudVariables.onSubmit();
        };

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            warehouseVisible,
            appStore,
            formFields,
            addFormButtonStatus,
            removeFormField,
            addFormField,

            onFormSubmit,
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
