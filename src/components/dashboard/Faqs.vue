<template>
    <f7-block-title
        v-if="title != ''"
        :style="{ marginTop: '16px', marginBottom: '16px' }"
    >
        {{ title }}
    </f7-block-title>

    <f7-card v-if="faqs.length > 0">
        <f7-card-content>
            <f7-list strong outline-ios dividers-ios inset-md accordion-list>
                <f7-list-item
                    accordion-item
                    v-for="faq in faqs"
                    :title="faq.question"
                    :key="faq.xid"
                >
                    <f7-accordion-content>
                        <f7-block>
                            <div v-html="faq.answer"></div>
                        </f7-block>
                    </f7-accordion-content>
                </f7-list-item>
            </f7-list>
        </f7-card-content>
    </f7-card>
</template>

<script>
export default {
    props: {
        faqs: {
            default: [],
        },
        title: {
            default: "",
        },
    },
};
</script>
