<template>
    <f7-page>
        <f7-navbar :title="formatAmountCurrency(item.amount)" back-link="Back">
        </f7-navbar>

        <f7-card>
            <f7-card-content :padding="false">
                <f7-list media-list dividers-ios strong-ios outline-ios>
                    <f7-list-item
                        :title="$t('expense.amount')"
                        :subtitle="formatAmountCurrency(item.amount)"
                    />
                    <f7-list-item
                        :title="$t('expense.expense_category')"
                        :subtitle="item.expense_category.name"
                    />
                    <f7-list-item
                        :title="$t('expense.created_by_user')"
                        :subtitle="item.user ? item.user.name : '-'"
                    />

                    <f7-list-item
                        :title="$t('expense.date')"
                        :subtitle="formatDate(item.date)"
                    />
                </f7-list>
            </f7-card-content>
        </f7-card>

        <f7-block-title>
            {{ $t("expense.bill") }}
        </f7-block-title>
        <f7-card>
            <f7-card-content>
                <f7-link
                    v-if="item.bill && item.bill_url && item.bill_url != ''"
                    @click="downloadFile(item.bill_url)"
                    external
                >
                    <f7-icon f7="cloud_download"></f7-icon>
                    <sapn class="margin-l5">
                        {{ $t("common.download") }}
                    </sapn>
                </f7-link>
                <p v-else>-</p>
            </f7-card-content>
        </f7-card>

        <f7-block-title>
            {{ $t("expense.notes") }}
        </f7-block-title>
        <f7-card>
            <f7-card-content>
                <p>{{ item.notes ? item.notes : "-" }}</p>
            </f7-card-content>
        </f7-card>
    </f7-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import common from "@/composable/common";

export default {
    props: {
        f7router: Object,
        f7route: Object,
        item: {},
    },
    setup(props) {
        const { formatAmountCurrency, formatDate } = common();

        onMounted(() => {
            // console.log("hi");
        });

        const downloadFile = (fileUrl) => {
            // Create a hidden anchor element
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = fileUrl;

            // Specify the filename for the downloaded file
            link.download = "your_file_name";

            // Append the anchor element to the document body
            document.body.appendChild(link);

            // Trigger a click event on the anchor element
            link.click();

            // Remove the anchor element from the document body
            document.body.removeChild(link);
        };

        return {
            formatAmountCurrency,
            formatDate,

            downloadFile,
        };
    },
};
</script>
