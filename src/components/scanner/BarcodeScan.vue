<template>
    <div class="barcode-scan-container-div">
        <f7-button
            tonal
            @click="openPopup"
            icon-ios="f7:camera"
            icon-md="f7:camera"
            :style="{ visibility: popupOpened ? 'hidden' : 'visible' }"
        />

        <f7-popup
            v-model:opened="popupOpened"
            :close-by-outside-click="false"
            :close-by-backdrop-click="false"
            :backdrop="false"
        >
            <f7-page>
                <div style="height: 100%; visibility: visible">
                    <div
                        ref="squareBox"
                        id="square-barcode-scan"
                        class="square-barcode-scan"
                    />
                    <f7-link
                        @click="toggleTorch"
                        class="torch-buttons-barcode"
                        :icon-ios="torchedClicked ? 'f7:lightbulb' : 'f7:lightbulb_slash'"
                        :icon-md="torchedClicked ? 'f7:lightbulb' : 'f7:lightbulb_slash'"
                        color="white"
                        icon-size="26"
                    />
                    <f7-link
                        @click="closePopup"
                        class="close-buttons-barcode"
                        icon-ios="f7:multiply"
                        icon-md="f7:multiply"
                        color="white"
                        icon-size="32"
                    />
                </div>
            </f7-page>
        </f7-popup>
    </div>
</template>

<script>
import { onMounted, ref, nextTick } from "vue";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

export default {
    props: {
        item: Object,
    },
    emits: ["success"],
    setup(props, { emit }) {
        const popupOpened = ref(false);
        const squareBox = ref(null);
        const torchedClicked = ref(false);

        onMounted(() => {
            // requestPermissions();
            // openSettings();
        });

        const openPopup = () => {
            popupOpened.value = true;

            const barcodePromise = scanSingleBarcode();

            barcodePromise.then((response) => {
                emit("success", response);

                popupOpened.value = false;
            });
        };

        const closePopup = () => {
            stopScan();

            popupOpened.value = false;
        };

        const requestPermissions = async () => {
            const { camera } = await BarcodeScanner.requestPermissions();
            return camera;
        };

        const scanSingleBarcode = async () => {
            return new Promise(async (resolve, reject) => {
                document.querySelector("body")?.classList.add("barcode-scanner-active");

                const listener = await BarcodeScanner.addListener(
                    "barcodeScanned",
                    async (result) => {
                        const squareElementBoundingClientRect = squareBox.value.getBoundingClientRect();

                        const scaledRect = squareElementBoundingClientRect
                            ? {
                                  left:
                                      squareElementBoundingClientRect.left *
                                      window.devicePixelRatio,
                                  right:
                                      squareElementBoundingClientRect.right *
                                      window.devicePixelRatio,
                                  top:
                                      squareElementBoundingClientRect.top *
                                      window.devicePixelRatio,
                                  bottom:
                                      squareElementBoundingClientRect.bottom *
                                      window.devicePixelRatio,
                                  width:
                                      squareElementBoundingClientRect.width *
                                      window.devicePixelRatio,
                                  height:
                                      squareElementBoundingClientRect.height *
                                      window.devicePixelRatio,
                              }
                            : undefined;

                        const detectionCornerPoints = scaledRect
                            ? [
                                  [scaledRect.left, scaledRect.top],
                                  [scaledRect.left + scaledRect.width, scaledRect.top],
                                  [
                                      scaledRect.left + scaledRect.width,
                                      scaledRect.top + scaledRect.height,
                                  ],
                                  [scaledRect.left, scaledRect.top + scaledRect.height],
                              ]
                            : undefined;

                        const cornerPoints = result.barcode.cornerPoints;

                        if (detectionCornerPoints && cornerPoints) {
                            if (
                                detectionCornerPoints[0][0] > cornerPoints[0][0] ||
                                detectionCornerPoints[0][1] > cornerPoints[0][1] ||
                                detectionCornerPoints[1][0] < cornerPoints[1][0] ||
                                detectionCornerPoints[1][1] > cornerPoints[1][1] ||
                                detectionCornerPoints[2][0] < cornerPoints[2][0] ||
                                detectionCornerPoints[2][1] < cornerPoints[2][1] ||
                                detectionCornerPoints[3][0] > cornerPoints[3][0] ||
                                detectionCornerPoints[3][1] < cornerPoints[3][1]
                            ) {
                                return;
                            } else {
                                await listener.remove();
                                document
                                    .querySelector("body")
                                    ?.classList.remove("barcode-scanner-active");
                                await BarcodeScanner.stopScan();

                                resolve(result.barcode);
                            }
                        }
                    }
                );

                await BarcodeScanner.startScan();
            });
        };

        const stopScan = async () => {
            // Make all elements in the WebView visible again
            document.querySelector("body")?.classList.remove("barcode-scanner-active");

            // Remove all listeners
            await BarcodeScanner.removeAllListeners();

            // Stop the barcode scanner
            await BarcodeScanner.stopScan();
        };

        const toggleTorch = async () => {
            await BarcodeScanner.toggleTorch();

            torchedClicked.value = !torchedClicked.value;
        };

        return {
            popupOpened,
            openPopup,
            closePopup,
            squareBox,

            torchedClicked,
            toggleTorch,
        };
    },
};
</script>

<style scoped>
.barcode-scan-container-div {
    visibility: hidden;
}

.square-barcode-scan {
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
    border-radius: 16px;
    width: 200px;
    height: 200px;
    border: 2px solid white;
    box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
}

.torch-buttons-barcode {
    position: absolute;
    left: 10%;
    top: 48%;
    background: #1890ff;
    border-radius: 50%;
    padding: 10px;
}

.close-buttons-barcode {
    position: absolute;
    left: 80%;
    top: 48%;
    background: #1890ff;
    border-radius: 50%;
    padding: 5px;
}
</style>
