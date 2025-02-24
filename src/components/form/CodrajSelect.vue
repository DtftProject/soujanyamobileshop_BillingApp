<template>
    <div
        class="list"
        :style="{
            padding: '0',
            margin: '0',
        }"
    >
        <ul
            :style="{
                padding: '0',
                margin: '0',
            }"
        >
            <li>
                <a
                    ref="smartSelectRef"
                    href="#"
                    :class="`item-link smart-select ${className}`"
                    :style="{
                        padding: '0',
                        margin: '0',
                    }"
                    data-open-in="popup"
                    :data-searchbar="true"
                    :data-searchbar-placeholder="placeholder"
                    data-close-on-select="true"
                    @smartselect:close="closed"
                    data-set-value-text="false"
                    data-scroll-to-selected-item="true"
                    @click="opened"
                    allow-clear
                >
                    <select :name="className" :multiple="multiple">
                        <option
                            v-for="item in items"
                            :value="item[fieldKey]"
                            :selected="
                                multiple
                                    ? selectedValue.includes(item[fieldKey])
                                    : item[fieldKey] == selectedValue
                            "
                        >
                            {{ item[fieldName] }}
                        </option>
                    </select>
                    <div
                        class="item-content"
                        :style="{
                            padding: '0',
                            margin: '0',
                        }"
                    >
                        <div
                            class="item-inner"
                            :style="{
                                paddingBottom: '0px',
                                paddingTop: '0px',
                            }"
                        >
                            <div
                                class="item-after"
                                :style="{
                                    maxWidth: '100%',
                                    width: '100%',
                                    padding: '0px',
                                }"
                            >
                                {{
                                    selectedValue == "" || selectedValue.legnth == 0
                                        ? placeholder
                                        : selectedValueName
                                }}
                            </div>
                        </div>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { f7 } from "framework7-vue";
import { find, forEach, trimEnd } from "lodash-es";

export default {
    props: {
        items: {
            default: [],
        },
        selectedValue: {
            default: "",
        },
        fieldKey: "xid",
        fieldName: "name",
        placeholder: "Select...",
        className: "warehouse-select",
        sendFullObject: {
            default: 0,
        },
        multiple: {
            default: false,
        },
    },
    emits: ["closed", "opened", "changed"],
    setup(props, { emit }) {
        const smartSelectRef = ref(null);
        const selectedValueName = ref("");

        onMounted(() => {
            if (props.selectedValue != "") {
                let findItem = find(props.items, [props.fieldKey, props.selectedValue]);
                if (findItem != undefined) {
                    selectedValueName.value = findItem[props.fieldName];
                }
            }
        });

        const closed = () => {
            let selectedVal = f7.smartSelect.get(`.${props.className}`).getValue();

            if (props.multiple) {
                var newStringValue = "";

                forEach(selectedVal, (newSelectedVal) => {
                    let findItem = find(props.items, [props.fieldKey, newSelectedVal]);
                    if (findItem != undefined) {
                        newStringValue += findItem[props.fieldName] + ",";
                    }
                });

                selectedValueName.value = trimEnd(newStringValue, ",");

                emit("changed", selectedVal);
            } else {
                let findItem = find(props.items, [props.fieldKey, selectedVal]);
                if (findItem != undefined) {
                    selectedValueName.value = findItem[props.fieldName];
                }
                emit("changed", props.sendFullObject == 1 ? findItem : selectedVal);
            }
        };

        const opened = () => {
            emit("opened");
        };

        watch(
            () => props.selectedValue,
            (newVal, oldVal) => {
                if (props.multiple) {
                    var newStringValue = "";

                    forEach(newVal, (newSelectedVal) => {
                        let findItem = find(props.items, [
                            props.fieldKey,
                            newSelectedVal,
                        ]);
                        if (findItem != undefined) {
                            newStringValue += findItem[props.fieldName] + ",";
                        }
                    });

                    selectedValueName.value = trimEnd(newStringValue, ",");
                } else {
                    if (newVal != "") {
                        let findItem = find(props.items, [props.fieldKey, newVal]);

                        if (findItem != undefined) {
                            selectedValueName.value = findItem[props.fieldName];
                        }
                    }
                }
            }
        );

        return {
            smartSelectRef,
            selectedValueName,

            closed,
            opened,
            find,
        };
    },
};
</script>
