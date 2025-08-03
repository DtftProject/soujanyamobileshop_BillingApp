<template>
    <f7-page name="category-add-edit">
        <f7-navbar
            :title="$t('subscription_plans.upgrade_plan')"
            :back-link="$t('common.back')"
        >
            <f7-nav-right>
                <f7-button @click="onSubmit">
                    {{ $t("menu.submit") }}
                </f7-button>
            </f7-nav-right>
        </f7-navbar>

        <f7-card>
            <f7-card-content>
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
                            rules.offline_payment_mode_id
                                ? rules.offline_payment_mode_id.message
                                : null
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("offline_request.payment_mode") }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <codraj-select
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t('offline_request.payment_mode'),
                                    ])
                                "
                                :selectedValue="formData.offline_payment_mode_id"
                                :items="paymentModes"
                                fieldKey="xid"
                                fieldName="name"
                                className="payment_mode-select"
                                :sendFullObject="true"
                                @changed="
                                    (newVal) => {
                                        formData.offline_payment_mode_id = newVal.xid;
                                        selectedPaymentMethod = newVal;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-card v-if="selectedPaymentMethod && selectedPaymentMethod.description">
            <f7-card-content>
                <span class="ant-form-text" style="white-space: pre-line">
                    {{ selectedPaymentMethod.description }}
                </span>
            </f7-card-content>
        </f7-card>

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
                            rules.proof_document ? rules.proof_document.message : null
                        "
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("offline_request.proof_document") }}
                        </template>
                        <template #input>
                            <FileUpload
                                :acceptFormat="'image/*,.pdf'"
                                :formData="formData"
                                folder="offline-requests"
                                uploadField="proof_document"
                                @onFileUploaded="
                                    (file) => {
                                        formData.proof_document = file.file;
                                        formData.proof_document_url = file.file_url;
                                    }
                                "
                                @onDeleteFile="
                                    () => {
                                        formData.proof_document = undefined;
                                        formData.proof_document_url = undefined;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>

                    <f7-list-input
                        type="textarea"
                        :placeholder="
                            $t('common.placeholder_default_text', [
                                $t('offline_request.submit_description'),
                            ])
                        "
                        error-message-force
                        :error-message="
                            rules.submit_description
                                ? rules.submit_description.message
                                : null
                        "
                        v-model:value="formData.submit_description"
                        resizable
                    >
                        <template #label>
                            <span class="required-input">*</span>
                            {{ $t("offline_request.submit_description") }}
                        </template></f7-list-input
                    >
                </f7-list>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import { f7 } from "framework7-vue";
import { useI18n } from "vue-i18n";
import common from "@/composable/common";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import apiAdmin from "@/composable/apiAdmin";
import FileUpload from "../../../components/form/FileUpload.vue";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        plan: {
            default: {},
        },
        planType: {
            default: "monthly",
        },
        paymentModes: {
            default: [],
        },
    },
    components: {
        CodrajSelect,
        FileUpload,
    },
    setup(props) {
        const { addEditRequestAdmin, loading, rules } = apiAdmin();
        const appStore = useAppStore();
        const { appSetting, permsArray } = common();
        const { t } = useI18n();
        const formData = ref({
            offline_payment_mode_id: undefined,
            notes: "",
            image: undefined,
            image_url: undefined,
            subscription_plan_id: props.plan.xid,
            plan_type: props.planType,
        });
        const selectedPaymentMethod = ref("");

        onMounted(() => {});

        const onSubmit = () => {
            f7.preloader.show();

            addEditRequestAdmin({
                url: "submit-offline-request",
                data: formData.value,
                success: (res) => {
                    f7.toast
                        .create({
                            text: t("offline_request.request_submited_successfully"),
                            position: "bottom",
                            closeTimeout: 2000,
                        })
                        .open();

                    f7.views.main.router.back();
                    f7.preloader.hide();
                },
                error: (error) => {
                    f7.preloader.hide();
                },
            });
        };

        return {
            appSetting,
            permsArray,
            appStore,

            formData,
            loading,
            rules,
            onSubmit,
            selectedPaymentMethod,
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
