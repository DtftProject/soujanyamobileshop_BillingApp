<template>
    <div>
        <input
            :accept="acceptFormat"
            ref="fileInput"
            type="file"
            class="file-input"
            @change="handleFileUpload"
        />
    </div>
    <div
        :class="formData[uploadField] == undefined ? 'image-preview' : ''"
        :style="{ marginTop: '10px', marginBottom: '10px' }"
    >
        <!-- Image preview or default plus icon -->

        <div
            v-if="formData[uploadField] != undefined"
            style="display: flex; justify-content: flex-start"
        >
            <f7-link class="action-btn" :href="formData[`${uploadField}_url`]" external>
                <f7-icon f7="cloud_download"></f7-icon>
                <span class="margin-l5">
                    {{ $t("common.download") }}
                </span>
            </f7-link>
            <span
                class="action-btn margin-l5 text-red"
                @click="() => $emit('onDeleteFile')"
            >
                <f7-icon f7="trash"></f7-icon>
                <span class="margin-l5">
                    {{ $t("common.delete") }}
                </span>
            </span>
        </div>
        <div
            v-else
            class="default-icon"
            :style="{ textAlign: 'center' }"
            @click="openFileInput"
        >
            <f7-preloader v-if="loading" />
            <div v-else>
                <f7-icon f7="cloud_upload"></f7-icon>
                <span
                    :style="{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginTop: '0px',
                        marginLeft: '10px',
                    }"
                >
                    {{ $t("common.upload") }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { f7 } from "framework7-vue";
import { useI18n } from "vue-i18n";
import { axiosAdmin } from "@/common/axiosAdmin";

export default {
    props: {
        acceptFormat: {
            default: "image/*,.pdf",
            type: String,
        },
        formData: null,
        folder: String,
        uploadField: {
            default: "file",
            type: String,
        },
        url: {
            default: "upload-file",
            type: String,
        },
    },
    emits: ["onFileUploaded", "onDeleteFile"],
    setup(props, { emit }) {
        const { t } = useI18n();
        const fileInput = ref(null);
        const loading = ref(false);

        const handleFileUpload = (event) => {
            const input = event.target;
            if (input.files && input.files[0]) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    // Set the selected image preview
                    // selectedImage.value = e.target.result;
                };

                const formData = new FormData();
                formData.append("file", input.files[0]);
                formData.append("folder", props.folder);

                loading.value = true;

                axiosAdmin()
                    .post(props.url, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => {
                        loading.value = false;

                        emit("onFileUploaded", {
                            file: response.data.file,
                            file_url: response.data.file_url,
                        });
                    })
                    .catch(() => {
                        loading.value = false;
                        f7.toast
                            .create({
                                text: t("messages.uploading_failed"),
                                position: "bottom",
                                closeTimeout: 2000,
                            })
                            .open();
                    });

                // // Read the file as a data URL
                // reader.readAsDataURL(input.files[0]);
            }
        };

        const openFileInput = () => {
            if (!loading.value) {
                fileInput.value.click();
            }
        };

        return {
            fileInput,

            handleFileUpload,
            openFileInput,
            loading,
        };
    },
};
</script>

<style scoped>
/* Add styling as needed */
.file-input {
    display: none; /* Hide the file input */
}

.image-preview {
    position: relative;
    width: 150px; /* Set width as needed */
    height: 40px; /* Set height as needed */
    background-color: #00000005; /* Gray background */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
}

.text-red {
    color: red;
}
.action-btn {
    width: 130px; /* Set width as needed */
    height: 40px; /* Set height as needed */
    background-color: #00000005; /* Gray background */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
}

.dark .image-preview {
    background-color: var(--f7-list-item-border-color);
}

.image-container {
    width: 100%;
    height: 100%;
    border: 1px dashed #d9d9d9;
}

.default-icon {
    color: #666;
    text-align: "center";
}

.dark .default-icon {
    color: #d9d9d9;
}
</style>
