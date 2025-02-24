<template>
    <f7-page name="category-add-edit">
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
                        :input="false"
                        error-message-force
                        :error-message="
                            rules.expense_category_id
                                ? rules.expense_category_id.message
                                : null
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("expense.expense_category") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('expense.expense_category'),
                                    ])
                                "
                                :selectedValue="formData.expense_category_id"
                                :items="expenseCateogries"
                                fieldKey="xid"
                                fieldName="name"
                                className="expense-category-select"
                                @changed="
                                    (newVal) => (formData.expense_category_id = newVal)
                                "
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        v-if="
                            addEditType == 'add' ||
                            (addEditType == 'edit' && formData.date)
                        "
                        error-message-force
                        :error-message="rules.date ? rules.date.message : null"
                        type="datepicker"
                        :placeholder="
                            $t('common.select_default_text', [$t('expense.date')])
                        "
                        readonly
                        :calendar-params="{
                            locale: 'en-GB',
                            value: formData.date ? [formData.date] : [],
                            timePicker: true,
                            formatValue: (allValues) => {
                                let newFormat = formatValueFunciton(allValues);
                                if (newFormat && newFormat[1]) {
                                    formData.date = newFormat[1];
                                }
                                return newFormat && newFormat[0] ? newFormat[0] : '';
                            },
                        }"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("expense.date") }}
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :input="false"
                        error-message-force
                        :error-message="rules.amount ? rules.amount.message : null"
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("expense.amount") }}
                        </template>
                        <template #input>
                            <div style="display: flex">
                                <span class="input-prefix">
                                    {{ appSetting.currency.symbol }}
                                </span>
                                <f7-input
                                    type="number"
                                    :placeholder="
                                        $t('common.placeholder_default_text', [
                                            $t('expense.amount'),
                                        ])
                                    "
                                    :style="{ width: '100%' }"
                                    v-model:value="formData.amount"
                                />
                            </div>
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        v-if="permsArray.includes('admin')"
                        :input="false"
                        error-message-force
                        :error-message="rules.user_id ? rules.user_id.message : null"
                    >
                        <template #label>
                            {{ $t("expense.user") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [$t('expense.user')])
                                "
                                :selectedValue="formData.user_id"
                                :items="staffMembers"
                                fieldKey="xid"
                                fieldName="name"
                                className="expense-user-select"
                                @changed="(newVal) => (formData.user_id = newVal)"
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        :label="$t('expense.bill')"
                        :input="false"
                        error-message-force
                        :error-message="rules.bill ? rules.bill.message : null"
                    >
                        <template #input>
                            <FileUpload
                                :acceptFormat="'image/*,.pdf'"
                                :formData="formData"
                                folder="expenses"
                                uploadField="bill"
                                @onFileUploaded="
                                    (file) => {
                                        formData.bill = file.file;
                                        formData.bill_url = file.file_url;
                                    }
                                "
                                @onDeleteFile="
                                    () => {
                                        formData.bill = undefined;
                                        formData.bill_url = undefined;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [$t('expense.notes')])
                        "
                        error-message-force
                        :error-message="rules.notes ? rules.notes.message : null"
                        v-model:value="formData.notes"
                        :label="$t('expense.notes')"
                        resizable
                    ></f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import crud from "@/composable/crud";
import fields from "./fields";
import FileUpload from "../../../components/form/FileUpload.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        expenseCateogries: {
            default: [],
        },
        staffMembers: {
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
        FileUpload,
    },
    setup(props) {
        const appStore = useAppStore();
        const crudVariables = crud(props.addEditType, props.item);
        const fieldsVar = fields();
        const { appSetting, permsArray, formatValueFunciton } = common();

        onMounted(() => {
            crudVariables.initCrud(fieldsVar);
        });

        return {
            ...crudVariables,
            fieldsVar,
            appSetting,
            permsArray,
            appStore,

            formatValueFunciton,
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
