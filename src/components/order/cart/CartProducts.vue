<template>
    <f7-card-content>
        <f7-list media-list strong-ios dividers-ios>
            <f7-list-item
                v-for="product in selectedProducts"
                :key="product.xid"
                :title="product.name"
            >
                <template #media>
                    <img
                        style="border-radius: 8px"
                        :src="product.image_url"
                        width="44"
                        height="44"
                    />
                </template>
                <template #after>
                    {{ formatAmountCurrency(product.subtotal) }}
                </template>
                <template #subtitle> </template>

                <template #inner>
                    <div
                        style="display: flex; justify-content: space-between"
                        class="margin-t10"
                    >
                        <div>
                            <small>
                                {{
                                    `${formatAmountCurrency(
                                        product.single_unit_price
                                    )} x ${product.quantity}`
                                }}
                            </small>
                        </div>
                        <div>
                            <span style="display: flex">
                                <f7-button
                                    @click="
                                        () => {
                                            if (product.quantity == 1) {
                                                $emit('showDeleteConfirm', product);
                                            } else {
                                                product.quantity -= 1;
                                                $emit('quantityChanged', product);
                                            }
                                        }
                                    "
                                >
                                    <f7-icon f7="minus_circle" size="20px" color="blue">
                                    </f7-icon>
                                </f7-button>
                                <div style="margin-top: 2px">
                                    {{ product.quantity }}
                                </div>
                                <f7-button
                                    @click="
                                        () => {
                                            product.quantity += 1;
                                            $emit('quantityChanged', product);
                                        }
                                    "
                                >
                                    <f7-icon
                                        f7="plus_circle_fill"
                                        size="20px"
                                        color="blue"
                                    >
                                    </f7-icon>
                                </f7-button>
                                <f7-button
                                    @click="() => $emit('showDeleteConfirm', product)"
                                >
                                    <f7-icon f7="trash" size="20px" color="blue">
                                    </f7-icon>
                                </f7-button>
                            </span>
                        </div>
                    </div>
                </template>
            </f7-list-item>
        </f7-list>
    </f7-card-content>
</template>

<script>
import common from "@/composable/common";

export default {
    props: {
        selectedProducts: Array,
    },
    emits: ["quantityChanged", "showDeleteConfirm"],
    setup(props, { emit }) {
        const { formatAmountCurrency } = common();

        return {
            formatAmountCurrency,
        };
    },
};
</script>
