<template>
    <f7-list-item
        v-for="item in items"
        :key="item.value"
        @click="valueSelected(item.value)"
    >
        <span style="font-size: 15px; font-weight: 500; color: var(--title-color)">
            <f7-radio
                :name="nameKey"
                :value="item.value"
                :checked="selectedValue == item.value"
            />
            {{ item.name }}
        </span>
    </f7-list-item>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { f7 } from "framework7-vue";
import { find } from "lodash-es";

export default {
    props: {
        items: {
            default: [],
        },
        selectedValue: {
            default: "",
        },
        nameKey: "radio",
    },
    emits: ["select", "opened"],
    setup(props, { emit }) {
        onMounted(() => {
            // if (props.selectedValue != "") {
            //     let findItem = find(props.items, [props.fieldKey, props.selectedValue]);
            //     if (findItem != undefined) {
            //         selectedValueName.value = findItem[props.fieldName];
            //     }
            // }
        });

        const valueSelected = (value) => {
            emit("select", value);
        };

        // watch(
        //     () => props.selectedValue,
        //     (newVal, oldVal) => {
        //         if (newVal != "") {
        //             let findItem = find(props.items, [props.fieldKey, newVal]);
        //             if (findItem != undefined) {
        //                 selectedValueName.value = findItem[props.fieldName];
        //             }
        //         }
        //     }
        // );

        return {
            valueSelected,
        };
    },
};
</script>
