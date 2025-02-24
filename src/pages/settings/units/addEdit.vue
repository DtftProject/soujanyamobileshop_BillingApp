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
                            $t('common.placeholder_default_text', [$t('unit.name')])
                        "
                        error-message-force
                        :error-message="rules.name ? rules.name.message : null"
                        v-model:value="formData.name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("unit.name") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="text"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('unit.short_name')])
                        "
                        error-message-force
                        :error-message="
                            rules.short_name ? rules.short_name.message : null
                        "
                        v-model:value="formData.short_name"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("unit.short_name") }}
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
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const { formatAmountCurrency, appSetting, permsArray } = common();
        const warehouseVisible = ref(false);

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
        });

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            formatAmountCurrency,
            permsArray,
            warehouseVisible,
            appStore,
        };
    },
};
</script>
