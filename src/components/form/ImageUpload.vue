<template>
    <div :style="{ marginTop: '10px', marginBottom: '10px' }">
        <!-- Hidden file input -->
        <input
            ref="fileInput"
            accept="image/*"
            type="file"
            class="file-input"
            @change="handleFileUpload"
        />

        <!-- Image preview or default plus icon -->
        <div class="image-preview" @click="openFileInput">
            <f7-preloader v-if="loading" />
            <template v-else>
                <div v-if="formData[imageField] != undefined" class="image-container">
                    <img
                        :src="formData[`${imageField}_url`]"
                        alt="Selected Image"
                        :style="{ width: '100px', height: '100px' }"
                    />
                </div>
                <div v-else class="default-icon" :style="{ textAlign: 'center' }">
                    <f7-icon f7="photo"></f7-icon>
                    <div :style="{ fontSize: '14px', marginTop: '8px' }">
                        {{ $t("common.upload") }}
                    </div>
                </div>
            </template>
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
        formData: null,
        folder: String,
        imageField: {
            default: "image",
            type: String,
        },
        url: {
            default: "upload-file",
            type: String,
        },
    },
    emits: ["onFileUploaded"],
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
                formData.append("image", input.files[0]);
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
    width: 100px; /* Set width as needed */
    height: 100px; /* Set height as needed */
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
