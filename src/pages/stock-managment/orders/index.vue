<template>
    <f7-page
        infinite
        :infinite-distance="50"
        :infinite-preloader="table.showPreloader"
        @infinite="fetch"
    >
        <f7-navbar
            :title="$t(`menu.${orderPageObject.menuKey}`)"
            :back-link="$t('common.back')"
        >
            <f7-searchbar
                :custom-search="true"
                @searchbar:search="onTableSearch"
                class="searchbar-demo"
                expandable
            />
            <f7-nav-right>
                <f7-link
                    class="searchbar-enable"
                    data-searchbar=".searchbar-demo"
                    icon-ios="f7:search"
                    icon-md="material:search"
                />
                <f7-link icon-only @click="openFilters" class="navbar-action-btn">
                    <f7-icon ios="material:tune" md="material:tune">
                        <span v-if="filterApplied" class="filter-dot-icon"> &nbsp; </span>
                    </f7-icon>
                </f7-link>
                <f7-link
                    icon-ios="f7:plus"
                    icon-md="f7:plus"
                    v-if="
                        permsArray.includes(`${orderPageObject.permission}_create`) ||
                        permsArray.includes('admin')
                    "
                    @click="
                        createItem({
                            warehouses,
                            allUnits,
                            taxes,
                            products,
                            users,
                            orderType: orderPageObject.type,
                        })
                    "
                    class="navbar-action-btn"
                />
            </f7-nav-right>
        </f7-navbar>

        <f7-card v-for="item in table.data" :key="item.xid">
            <f7-card-content :padding="false">
                <f7-list
                    media-list
                    strong-ios
                    dividers-ios
                    class="search-list searchbar-found"
                >
                    <f7-list-item
                        :title="`${item.user.name}`"
                        @click="viewItem({ item })"
                        swipeout
                        :swipeout-opened="swipeOpenItemXid == item.xid"
                        @swipeout:deleted="deleteItem(item.xid)"
                        @swipeout:open="assignSwipeXId(item.xid)"
                        @swipeout:close="assignSwipeXId('')"
                    >
                        <template #header>
                            <span
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    font-size: var(--f7-list-item-text-font-size);
                                    color: var(--f7-list-item-title-text-color);
                                    border-top: 1px solide black;
                                    margin-bottom: 5px;
                                "
                            >
                                <PaymentStatus :paymentStatus="item.payment_status" />
                                <span
                                    style="
                                        color: var(--f7-list-item-text-text-color);
                                        margin-top: 3px;
                                    "
                                    >{{ item.invoice_number }}</span
                                >
                            </span>
                        </template>

                        <template #inner>
                            <span
                                class="margin-t5 margin-b5"
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    font-size: var(--f7-list-item-text-font-size);
                                    color: var(--f7-list-item-text-text-color);
                                "
                            >
                                <span>
                                    {{ $t("invoice.total") }} :
                                    {{ formatAmountCurrency(item.total) }}
                                </span>
                                <span>
                                    {{ $t("payments.paid") }} :
                                    {{ formatAmountCurrency(item.paid_amount) }}
                                </span>
                            </span>
                        </template>
                        <template #text>
                            <div class="margin-t5">
                                <f7-icon f7="calendar" size="18"></f7-icon>
                                {{ formatDateTime(item.order_date) }}
                            </div>
                        </template>

                        <template #after>
                            <f7-link
                                v-if="swipeOpenItemXid != item.xid"
                                @click="
                                    (event) => {
                                        event.stopPropagation();
                                        swipeOpenItemXid = item.xid;
                                    }
                                "
                            >
                                <f7-icon f7="ellipsis_vertical" size="20"></f7-icon>
                            </f7-link>
                        </template>

                        <f7-swipeout-actions right>
                            <f7-swipeout-button @click="viewItem({ item })">
                                {{ $t("common.view") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    permsArray.includes(
                                        `${orderPageObject.permission}_edit`
                                    ) || permsArray.includes('admin')
                                "
                                @click="
                                    editItem({
                                        item,
                                        warehouses,
                                        allUnits,
                                        taxes,
                                        products,
                                        users,
                                        orderType: orderPageObject.type,
                                        addEditType: 'edit',
                                    })
                                "
                            >
                                {{ $t("common.edit") }}
                            </f7-swipeout-button>
                            <f7-swipeout-button
                                v-if="
                                    (permsArray.includes(
                                        `${orderPageObject.permission}_delete`
                                    ) ||
                                        permsArray.includes('admin')) &&
                                    item.payment_status == 'unpaid'
                                "
                                delete
                                :confirm-title="$t('common.delete')"
                                :confirm-text="$t(`${langKey}.delete_message`)"
                            >
                                {{ $t("common.delete") }}
                            </f7-swipeout-button>
                        </f7-swipeout-actions>
                    </f7-list-item>
                </f7-list>
            </f7-card-content>
            <f7-card-footer class="buton-footer-actions">
                <f7-icon
                   class="action-icon"
                    f7="arrow_down_doc"
                    size="20px"
                    color="blue"
                    @click="downloadPdf(item)"
                    title="Download PDF"
                ></f7-icon>
                <f7-icon 
                    @click="pos(item)"
                    f7="printer_fill" 
                    size="20px" 
                    color="blue"
                    title="Print Pos Invoice" 
                    class="action-icon">
                </f7-icon>
                <f7-icon
                  f7="square_arrow_up"
                  size="20px"
                  color="blue"
                  class="action-icon"
                  title="Share Invoice"
                  @click="shareInvoice(item)"
                />

            </f7-card-footer>
          
        </f7-card>

        <f7-sheet
            v-model:opened="filterOpened"
            backdrop
            swipe-to-close
            :style="{ height: '50%' }"
        >
            <f7-toolbar>
                <div class="left">
                    {{ $t("common.filters") }}
                </div>
                <div class="right">
                    <f7-link v-if="filterApplied" @click="clearFilters">
                        {{ $t("common.clear") }}
                    </f7-link>
                </div>
            </f7-toolbar>
            <!-- Scrollable sheet content -->
            <f7-page-content>
                <f7-list
                    strong-ios
                    dividers-ios
                    outline-ios
                    :style="{ marginTop: '0px' }"
                >
                    <f7-list-input :input="false">
                        <template #label>
                            {{ $t(`${orderPageObject.langKey}.user`) }}
                        </template>
                        <template #input :style="{ padding: '0px', margin: '0px' }">
                            <CodrajSelect
                                :placeholder="
                                    $t('common.select_default_text', [
                                        $t(`${orderPageObject.langKey}.user`),
                                    ])
                                "
                                :selectedValue="filters.user_id"
                                :items="users"
                                fieldKey="xid"
                                fieldName="name"
                                className="filter-customer-category-select"
                                @changed="
                                    (newVal) => {
                                        filterOpened = true;
                                        filters.user_id = newVal;
                                        setUrlData();
                                    }
                                "
                                @opened="
                                    () => {
                                        filterOpened = false;
                                    }
                                "
                            />
                        </template>
                    </f7-list-input>
                </f7-list>
            </f7-page-content>
        </f7-sheet>
        <f7-popup v-model:opened="showPopup">
          <f7-page>
            <f7-navbar title="Pos Invoice">
              <f7-nav-right>
                <f7-link popup-close>Close</f7-link>
              </f7-nav-right>
            </f7-navbar>
            <div class="page-content white-page">
            <f7-block >
                <div id="pos-invoice">
                <div style="font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;color: black !important;font-weight: bolder;" v-if="printInvoiceOrder && printInvoiceOrder.xid">
                 <div class="invoice-header" style="border-bottom: 2px dotted rgb(0, 0, 0) !important">
                    <img
                        class="invoice-logo"
                        :src="selectedWarehouse.logo_url"
                        :alt="selectedWarehouse.name"

                    />
                </div>
                <div class="list">
                    <div class="company-details" style="text-align: center;
                        margin-top: 5px;border-bottom: 2px dotted rgb(0, 0, 0) !important">
                        <h2 style="font-weight:bold;">{{ selectedWarehouse.name }}</h2>
                        <p class="company-address">
                            {{ selectedWarehouse.address }}
                        </p>
                        <h4 style="margin-bottom: 0px;font-weight:bold">
                            {{ $t("common.phone") }}: {{ selectedWarehouse.phone }}
                        </h4>
                        <h4 style="font-weight:bold;">{{ $t("common.email") }}: {{ selectedWarehouse.email }}</h4>
                    </div>
                    <div class="tax-invoice-details">
                        <h3 class="tax-invoice-title">{{ $t("sales.tax_invoice") }}</h3>
                        <table class="invoice-customer-details">
                            <tr>
                                <td style="width: 50%">
                                    {{ $t("sales.invoice") }}:
                                    {{ printInvoiceOrder.invoice_number }}
                                </td>
                                <td style="width: 50%">
                                    {{ $t("common.date") }} :
                                    {{ formatDate(printInvoiceOrder.order_date) }}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    {{ $t("stock.customer") }} : {{ printInvoiceOrder.user.name }}
                                </td>
                                
                            </tr>
                            <tr>
                                <td colspan="2">
                                    {{ $t("Customer Address") }} : {{ printInvoiceOrder.user.address }}
                                </td>
                            </tr>
                             <tr>
                                <td colspan="2">
                                    {{ $t("Customer Phone") }} : {{ printInvoiceOrder.user.phone }}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="tax-invoice-items" style="font-size: 12px;">
                        <table style="width: 100%">
                        <thead style="background: #eee">
                            <td style="width: 30%"><b>{{ $t("common.item") }}</b></td>
                            <td
                                :style="{
                                    width: selectedWarehouse.show_mrp_on_invoice
                                        ? '25%'
                                        : '40%',
                                }"
                            >
                                <b>{{ $t("common.rate") }}</b>
                            </td>
                             <td
                                :style="{
                                    width: selectedWarehouse.show_mrp_on_invoice
                                        ? '15%'
                                        : '30%',
                                }"
                            >
                                <b>{{ $t("Tax") }}</b>
                            </td>
                            <td
                                :style="{
                                    width: selectedWarehouse.show_mrp_on_invoice
                                        ? '45%'
                                        : '40%',
                                       textAlign: 'right' 
                                    
                                }"
                            >
                                <b>{{ $t("Amount") }}</b>
                            </td>
                        </thead>
                        <tbody>
                            <tr
                               
                                v-for="(item, index) in printInvoiceOrder.items"
                                :key="item.xid" style="border-bottom: 2px dotted rgb(0, 0, 0) !important" 
                            >
                               <!--  <td>{{ index + 1 }}</td> -->
                                <td>{{ item.product.name }}<span v-if="item.product.category_id!=1">#S/N- {{ item.item_code }}</span><span v-if="item.product.category_id!=1 && item.product.brand"> #Brand {{ item.product.brand.name }}</span></td>
                                <!-- <td>{{ item.quantity + "" + item.unit?.short_name }}</td> -->
                                <td>{{ formatAmountCurrency(item.subtotal-item.total_tax) }}</td>
                                <td>{{Math.round((item.subtotal-(item.subtotal-item.total_tax))*100/(item.subtotal-item.total_tax))}}%</td>
                                <td style="text-align: right;">
                                    {{ formatAmountCurrency(item.subtotal) }}
                                </td>
                                <td colspan="4">
                                    <div style="border-bottom: 2px dotted rgb(0, 0, 0);"></div>
                                  </td>
                            </tr>
                            
                            <tr class="item-row-other">
                                <td
                                    :colspan="
                                        selectedWarehouse.show_mrp_on_invoice ? 2 : 2
                                    "
                                    style="text-align: right"
                                >
                                    {{ $t("Taxable Amount ") }}
                                </td>
                                <td colspan="2" style="text-align: right">

                                    {{ formatAmountCurrency(printInvoiceOrder.subtotal) }}
                                    
                                </td>
                            </tr>
                            <tr class="item-row-other">
                                <td
                                    :colspan="
                                        selectedWarehouse.show_mrp_on_invoice ? 2 : 2
                                    "
                                    style="text-align: right"
                                >
                                    {{ $t("Round Off") }}
                                </td>
                                <td colspan="2" style="text-align: right">
                                    {{ formatAmountCurrency(printInvoiceOrder.adjustement) }}
                                </td>
                            </tr>
                              <tr class="item-row-other">
                                <td
                                    :colspan="
                                        selectedWarehouse.show_mrp_on_invoice ? 2 : 2
                                    "
                                    style="text-align: right"
                                >
                                    {{ $t("Total Amount After Tax") }}
                                </td>
                                <td colspan="2" style="text-align: right">
                                  {{ formatAmountCurrency(printInvoiceOrder.subtotal+printInvoiceOrder.adjustement) }}
                                </td>
                            </tr>
                         <!--    <tr>
                                <div style="border-bottom: 2px dotted #000 !important;margin-top:5px;"></div>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <div class="">
                    <div style="border-bottom: 2px dotted #000 !important;margin-top:5px;"></div>
                    <div style="margin-top:5px;">{{numberToWords(printInvoiceOrder.subtotal+printInvoiceOrder.adjustement)}}</div>
                    <div style="border-bottom: 2px dotted #000 !important;margin-top:5px;"></div>
                </div>
                 <div>
                    <!-- {{order.order_payments}} -->
                    <div style="margin-top: 20px;">
                      <table style="width: 100%" v-for="(item, index) in printInvoiceOrder.order_payments"
                                :key="item.xid">
                            <tr style="text-align: left" > 
                                <td style="width: 50%">
                                    Txns No.
                                </td> 
                                <td>
                                    {{item.payment.payment_number}}
                                </td>
                            </tr>
                            <tr style="text-align: left" >
                                <td>
                                Payment Date
                                </td>
                                <td style="width: 50%">
                                {{ formatDate(item.date) }}
                                </td>
                            </tr> 
                            <tr style="text-align: left" >       
                                <td>
                                    Payment Mode
                                </td>
                                <td>
                                    {{item.payment.payment_mode.name}}
                                </td> 
                             </tr> 
                             <tr>
                                <td colspan="2"><div style="border-bottom: 2px dotted #000 !important;"></div></td>
                              </tr>
                        </table>
                    </div>
            
                    
                </div>
                </div>
                
              <div style="margin-top: 12px;">
                  <strong>T&C:</strong>
                  <ul style="padding-left: 15px; margin: 5px 0;">
                    <li>1. Goods once sold will not be taken
                            back.</li>
                    <li>2. Interest @ 18% p.a. will be charged
                            if the payment is not made with in the stipulated time. for SOUJANYA</li>
                    <li>3. Subject to 'Howrah' Jurisdiction
                            only.</li>
                   
                  </ul>

                  <div style="text-align: center; margin: 5px 0;">
                    ------------------------<br />
                    E.&O.E. | For SOUJANYA<br />
                    ------------------------
                  </div>

                  <strong>Branches:</strong>
                  <ul style="padding-left: 15px; margin: 5px 0;">
                    <li>DOMJUR :<b> +91 9088025716</b></li>
                    <li>BALUHATI :<b> +91 7278248874</b></li>
                    <li>BEGRI CHOWRASTA:<b> +91 9062102077</b></li>
                    <li>FOKOR DOKAN:<b> +91 8695433843</b></li>
                    <li>BEGRI JALTANK:<b> +91 9830377276</b></li>
                    <li>SAMSUNG CAFE:<b> +91 8697007700</b></li>
                  </ul>
                </div>
                 <div style="border-bottom: 2px dotted #000 !important;margin-top:15px;"></div>
                <div class="thanks-details">
                    <h3>This is a computer-generated invoice. 
                    For queries, contact our HELPLINE NO:- +91 8697007700</h3>
                </div>
                </div>
                </div>
                 <!-- <div class="display-flex justify-content-center align-items-center padding">
                  <f7-button fill color="primary" @click="printInvoicepreview(printInvoiceOrder.unique_id)">
                    <f7-icon f7="printer" slot="icon" />
                    {{ $t("common.print_invoice") }}
                  </f7-button>
                </div> -->
            </f7-block>
            </div>
              <f7-toolbar bottom class="custom-toolbar">
                <div class="toolbar-inner">
                  <f7-link @click="printInvoicepreview(printInvoiceOrder.unique_id)">
                    <f7-icon f7="printer"></f7-icon>
                    {{ $t('common.print_invoice') }}
                  </f7-link>
                  </div>
                </f7-toolbar>
                
          </f7-page>
        </f7-popup>
    </f7-page>

 <!--     -->
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { Share } from "@capacitor/share";
import { f7 } from "framework7-vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import datatable from "@/composable/datatable";
import { useAppStore } from "../../../stores/appStore";
import common from "@/composable/common";
import fields from "./fields";
import { axiosAdmin } from "@/common/axiosAdmin";
import CodrajSelect from "@/components/form/CodrajSelect.vue";
import PaymentStatus from "../../../components/order/PaymentStatus.vue";
import { Browser } from '@capacitor/browser';
import { File } from '@awesome-cordova-plugins/file';
import { FileOpener } from '@capacitor-community/file-opener';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



export default {
    props: {
        f7router: Object,
        f7route: Object,
        orderType: {
            default: "sales",
        },
    },
    components: {
        CodrajSelect,
        PaymentStatus,
    },
    setup(props) {
        const appStore = useAppStore();
        const fieldsVar = fields(props.orderType);
        const orderPageObject = fieldsVar.orderPageObject;
        const datatableVariables = datatable(fieldsVar);
        const {
            formatAmountCurrency,
            permsArray,
            formatDateTime,
            selectedWarehouse,
            formatDate
        } = common();
        const warehouses = ref([]);
        const taxes = ref([]);
        const allUnits = ref([]);
        const products = ref([]);
        const users = ref([]);
        const showPopup = ref(false);
        const printInvoiceOrder = ref({});
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
                         "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const posInvoiceCssUrl = window.config.pos_invoice_css;
        console.log(posInvoiceCssUrl);
        onMounted(() => {
            const taxesPromise = axiosAdmin().get("taxes?limit=10000");
            const unitsPromise = axiosAdmin().get("units?limit=10000");
            const usersPromise = axiosAdmin().get(
                `${orderPageObject.userType}?limit=10000`
            );
            const productsPromise = axiosAdmin().get(
                `products?fields=id,xid,name,slug,product_type,barcode_symbology,item_code,image,image_url,category_id,x_category_id,category{id,xid,name},brand_id,x_brand_id,brand{id,xid,name},unit_id,x_unit_id,unit{id,xid,name,short_name},description,details{stock_quantitiy_alert,opening_stock,opening_stock_date,wholesale_price,wholesale_quantity,mrp,purchase_price,sales_price,tax_id,x_tax_id,purchase_tax_type,sales_tax_type,current_stock,warehouse_id,x_warehouse_id,status},details:tax{id,xid,name,rate},details:warehouse{id,xid,name},customFields{id,xid,field_name,field_value},warehouse_id,x_warehouse_id,warehouse{id,xid}&order=${encodeURIComponent(
                    "id desc"
                )}&limit=10`
            );
            const warehousesPromise = axiosAdmin().get(
                `warehouses?filters=id ne "${selectedWarehouse.xid}"&hashable=${selectedWarehouse.xid}&limit=10000`
            );

            Promise.all([
                warehousesPromise,
                taxesPromise,
                unitsPromise,
                usersPromise,
                productsPromise,
            ]).then(
                ([
                    warehousesResponse,
                    taxResponse,
                    unitResponse,
                    usersResponse,
                    productsResponse,
                ]) => {
                    warehouses.value = warehousesResponse.data;
                    taxes.value = taxResponse.data;
                    allUnits.value = unitResponse.data;
                    products.value = productsResponse.data;
                    users.value = usersResponse.data;
                    datatableVariables.fetch({
                        page: 1,
                    });
                }
            );
        });

        const shareInvoice = async (item) => {
            f7.preloader.show();
            try {
                const pdfUrl = `https://billing.soujanya360.com/api/v1/pdf/${item.unique_id}/en`;
                console.log(pdfUrl);
                // Download the PDF file
                const response = await fetch(pdfUrl);
                const pdfData = await response.blob();

                const base64String = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(pdfData);
                    reader.onloadend = () => {
                      const base64 = reader.result.split(',')[1];
                      resolve(base64);
                    };
                    reader.onerror = reject;
                });

                console.log(base64String);

                // Generate a unique filename
                const filename = `${item.invoice_number}.pdf`;
                const directory = Capacitor.getPlatform() === 'android' ? Directory.External : Directory.Documents;
                // Write the PDF data to application storage
                const savefile = await Filesystem.writeFile({
                    path: filename,
                    directory,
                    data: base64String,
                    encoding: Encoding.BASE64
                });
                console.log(savefile.uri);
                // Get the local file URI
                // const fileUri = `file://${Filesystem.documentsDirectory}/${filename}`;

                const uri = await Filesystem.getUri({
                    path: filename,
                    directory
                });

                f7.preloader.hide();

                console.log(uri);
            const share_text = `Thank you for your purchase, ${item.user.name}!

            📞 Mobile No.: ${item.user.phone}
            🧾 Invoice No.: ${item.invoice_number}

            You can download your invoice here:
            🔗 ${pdfUrl}

            We appreciate your business. If you have any questions, feel free to reach out!`;

            // Share using Capacitor Share API
            await Share.share({
              title: 'Invoice from Soujanya360',
              text: share_text,
              dialogTitle: 'Share Invoice Link',
            });
            } catch (error) {
                f7.preloader.hide();
                console.error("Error sharing PDF:", error);
            } finally {
                // Hide F7 loader
                f7.preloader.hide();
            }
        };
        const pos = async (order) => {
            var totalMrp = 0;
            var totalTax = 0;
            console.log(order.subtotal);
           order.items.forEach((item) => {
                  totalMrp += item.quantity * item.mrp;
                  totalTax += item.total_tax;
                });

            let savingOnMrp = totalMrp - order.total;
            let savingPercentage =
                totalMrp > 0 ? ((savingOnMrp / totalMrp) * 100).toFixed(2) : 0;
            let totalTaxOnItems = totalTax + order.tax_amount;
            console.log(order);
            printInvoiceOrder.value = {
                 ...order,
                saving_on_mrp: savingOnMrp,
                saving_percentage: savingPercentage,
                total_tax_on_items: totalTaxOnItems,
            }
            showPopup.value = true; 
        }
        const convert_hundred = (n) => {
                let str = "";
                if (n >= 100) {
                  str += ones[Math.floor(n / 100)] + " Hundred ";
                  n %= 100;
                }
                if (n >= 10 && n < 20) {
                  str += teens[n - 10] + " ";
                } else if (n >= 20) {
                  str += tens[Math.floor(n / 10)] + " ";
                  n %= 10;
                }
                if (n > 0 && n < 10) {
                  str += ones[n] + " ";
                }
                return str.trim();
            };
        const numberToWords =(num)=> {
          

              if (!num || isNaN(num)) return "Zero";

              num = Math.floor(num); // Remove decimals
              let result = "";

              if (num >= 1000) {
                result += convert_hundred(Math.floor(num / 1000)) + " Thousand ";
                num %= 1000;
              }

              result += convert_hundred(num);

              return result.trim()+' Only';
        };
        
        const downloadPdf =  async(item)=>{
          f7.preloader.show();
            try {

                const pdfUrl = `https://billing.soujanya360.com/api/v1/pdf/${item.unique_id}/en`;
                const response = await fetch(pdfUrl);
                const blob = await response.blob();
                const fileName = 'pos_invoice.pdf';
                // Convert to Base64
                const base64 = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const result = reader.result;
                    if (typeof result === 'string') {
                      resolve(result.split(',')[1]); // Remove data:... prefix
                    } else {
                      reject('Invalid result');
                    }
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });

                // Write file to device storage
                await Filesystem.writeFile({
                  path: fileName,
                  data: base64,
                  directory: Directory.Data,
                });

                // Get file URI
                const fileUri = await Filesystem.getUri({
                  path: fileName,
                  directory: Directory.Data,
                });

                // Open with native PDF viewer
                await FileOpener.open({
                  filePath: fileUri.uri,
                  contentType: 'application/pdf',
                  openWithDefault: true,
                }); 
            } catch (error) {
                f7.preloader.hide();
                console.error("Error sharing PDF:", error);
            } finally {
                // Hide F7 loader
                f7.preloader.hide();
            }  
        };
        const printInvoicepreview = async(order_id)=>{
            f7.preloader.show();
            try{
                const element = document.getElementById('pos-invoice'); // main wrapper div
                const heightInPx = element.scrollHeight;
                const heightInMm = heightInPx * 0.264583;
                const pdfUrl = `https://billing.soujanya360.com/api/v1/pos-pdf/${order_id}/${heightInMm}`;
                await Browser.open({
                  url: pdfUrl, // Replace with actual receipt ID
                  presentationStyle: 'fullscreen'
                });
                
                // const response = await fetch(pdfUrl);
                // const blob = await response.blob();
                // const fileName = 'pos_invoice.pdf';
                // // Convert to Base64
                // const base64 = await new Promise((resolve, reject) => {
                //   const reader = new FileReader();
                //   reader.onloadend = () => {
                //     const result = reader.result;
                //     if (typeof result === 'string') {
                //       resolve(result.split(',')[1]); // Remove data:... prefix
                //     } else {
                //       reject('Invalid result');
                //     }
                //   };
                //   reader.onerror = reject;
                //   reader.readAsDataURL(blob);
                // });

                // // Write file to device storage
                // await Filesystem.writeFile({
                //   path: fileName,
                //   data: base64,
                //   directory: Directory.Data,
                // });

                // // Get file URI
                // const fileUri = await Filesystem.getUri({
                //   path: fileName,
                //   directory: Directory.Data,
                // });

                // // Open with native PDF viewer
                // await FileOpener.open({
                //   filePath: fileUri.uri,
                //   contentType: 'application/pdf',
                //   openWithDefault: true,
                // });

              
            } catch (error) {
                f7.preloader.hide();
                console.error("Error sharing PDF:", error);
            } finally {
                // Hide F7 loader
                f7.preloader.hide();
            }

        };
        return {
            ...datatableVariables,
            formatAmountCurrency,
            permsArray,
            selectedWarehouse,
            warehouses,
            taxes,
            allUnits,
            products,
            users,
            showPopup,
            formatDateTime,
            formatDate,
            orderPageObject,
            numberToWords,
            convert_hundred,
            downloadPdf,
            pos,
            printInvoicepreview,
            printInvoiceOrder,
            shareInvoice
        };
    },
};
</script>
<style scoped>
    .invoice-header {
    text-align: center;
    
}

.invoice-logo {
    width: 200px;
}



.company-address {
    white-space: pre;
    margin-bottom: 0px;
}

.tax-invoice-details {
}

.invoice-customer-details {
    width: 100%;
    margin-bottom: 5px;
}

.tax-invoice-title {
    text-align: center;
    margin-top: 5px;
}

.tax-invoice-items {
    margin-top: 10px;
}



.tax-invoice-totals {
    margin-top: 5px;
    border-top: 2px dotted #ddd !important;
    border-bottom: 2px dotted #ddd !important;
}

.paid-amount-deatils {
    margin-top: 10px;
    text-align: center;
}

.paid-amount-row {
    border-top: 2px dotted #ddd !important;
    border-bottom: 2px dotted #ddd !important;
}

.thanks-details {
    margin-top: 5px;
    text-align: center;
}

.barcode-details {
    margin-top: 10px;
    text-align: center;
}

.footer-button {
    text-align: center !important;
}

.discount-details {
    padding: 5px 0px;
    border-top: 2px dotted #ddd !important;
    border-bottom: 2px dotted #ddd !important;
}

.discount-details p {
    margin-bottom: 0px;
}

.invoice-header {
    text-align: center;
    border-bottom: 1px dotted #ddd !important;
}

.invoice-logo {
    width: 200px;
}


.company-address {
    white-space: pre;
    margin-bottom: 0px;
}

.tax-invoice-details {
}

.invoice-customer-details {
    width: 100%;
    margin-bottom: 5px;
}

.tax-invoice-title {
    text-align: center;
    margin-top: 5px;
}

.tax-invoice-items {
    margin-top: 10px;
}



.tax-invoice-totals {
    margin-top: 5px;
    border-top: 2px dotted #ddd !important;
    border-bottom: 2px dotted #ddd !important;
}

.paid-amount-deatils {
    margin-top: 10px;
    text-align: center;
}

.paid-amount-row {
    border-top: 2px dotted #ddd !important;
    border-bottom: 2px dotted #ddd !important;
}

.thanks-details {
    margin-top: 5px;
    text-align: center;
}

.barcode-details {
    margin-top: 10px;
    text-align: center;
}

.footer-button {
    text-align: center !important;
}

.discount-details {
    padding: 5px 0px;
    border-top: 2px dotted #ddd !important;
    border-bottom: 2px dotted #ddd !important;
}

.discount-details p {
    margin-bottom: 0px;
}


</style>
