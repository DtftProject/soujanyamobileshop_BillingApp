<template>
    <div class="barcode-scan-cart-container-div">
        <f7-button
            @click="openPopup"
            :style="{ visibility: popupOpened ? 'hidden' : 'visible' }"
            icon-ios="f7:barcode_viewfinder"
            icon-md="f7:barcode_viewfinder"
            icon-size="28"
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
                        id="square-barcode-scan-cart"
                        class="square-barcode-scan-cart"
                    >
                        <span
                            v-if="barcodeDataFetching"
                            style="top: 37%; position: absolute; left: 37%"
                        >
                            <f7-preloader size="48" />
                        </span>
                    </div>
                    <f7-link
                        @click="toggleTorch"
                        class="torch-buttons-barcode-cart"
                        :icon-ios="torchedClicked ? 'f7:lightbulb' : 'f7:lightbulb_slash'"
                        :icon-md="torchedClicked ? 'f7:lightbulb' : 'f7:lightbulb_slash'"
                        color="white"
                        icon-size="26"
                    />
                    <f7-link
                        @click="closePopup"
                        class="close-buttons-barcode-cart"
                        icon-ios="f7:multiply"
                        icon-md="f7:multiply"
                        color="white"
                        icon-size="32"
                    />
                    <div class="cart-item-lists">
                        <f7-card v-if="selectedProducts.length > 0">
                            <CartProducts
                                :selectedProducts="selectedProducts"
                                @quantityChanged="
                                    (product) => $emit('quantityChanged', product)
                                "
                                @showDeleteConfirm="
                                    (product) => $emit('showDeleteConfirm', product)
                                "
                            />
                        </f7-card>
                    </div>
                </div>
            </f7-page>
        </f7-popup>
    </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { f7 } from "framework7-vue";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import CartProducts from "@/components/order/cart/CartProducts.vue";
import { axiosAdmin } from "@/common/axiosAdmin";

export default {
    props: ["selectedProducts", "warehouseId", "orderType"],
    components: {
        CartProducts,
    },
    emits: ["opened", "success", "closed", "quantityChanged", "showDeleteConfirm"],
    setup(props, { emit }) {
        const popupOpened = ref(false);
        const squareBox = ref(null);
        const torchedClicked = ref(false);
        const barcodeDataFetching = ref(false);

        onMounted(() => {
            // requestPermissions();
            // openSettings();
        });

        const openPopup = () => {
            emit("opened");

            popupOpened.value = true;

            document.querySelector("body")?.classList.add("barcode-scanner-active");

            scanAllBarcodes();
        };

        const scanAllBarcodes = () => {
            const barcodePromise = scanSingleBarcode();

            barcodePromise.then((response) => {
                const value = response.rawValue;

                if (!barcodeDataFetching.value) {
                    if (value != "") {
                        barcodeDataFetching.value = true;
                        let url = `search-product`;

                        axiosAdmin()
                            .post(url, {
                                order_type: props.orderType,
                                search_term: value,
                                warehouse_id: props.warehouseId,
                            })
                            .then((response) => {
                                if (response.data.length == 1) {
                                    emit("searchValueSelected", response.data[0]);
                                }

                                barcodeDataFetching.value = false;
                                scanAllBarcodes();
                            })
                            .catch((error) => {
                                barcodeDataFetching.value = false;
                                scanAllBarcodes();
                            });
                    }
                }
                // emit("success", response);
                // popupOpened.value = false;
            });
        };

        const closePopup = () => {
            stopScan();

            popupOpened.value = false;

            emit("closed");
        };

        const requestPermissions = async () => {
            const { camera } = await BarcodeScanner.requestPermissions();
            return camera;
        };

        const scanSingleBarcode = async () => {
            return new Promise(async (resolve, reject) => {
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
                                // document
                                //     .querySelector("body")
                                //     ?.classList.remove("barcode-scanner-active");
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

            toggleTorch,
            torchedClicked,
            barcodeDataFetching,
        };
    },
};
</script>

<style scoped>
.barcode-scan-cart-container-div {
    visibility: hidden;
}

.square-barcode-scan-cart {
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

.torch-buttons-barcode-cart {
    position: absolute;
    left: 10%;
    top: 48%;
    background: #1890ff;
    border-radius: 50%;
    padding: 10px;
}

.close-buttons-barcode-cart {
    position: absolute;
    left: 80%;
    top: 48%;
    background: #1890ff;
    border-radius: 50%;
    padding: 5px;
}

.cart-item-lists {
    position: absolute;
    top: 60%;
    width: 100%;
    background: #ffffff;
    overflow: scroll;
    height: calc(100% - 60%);
}
</style>
