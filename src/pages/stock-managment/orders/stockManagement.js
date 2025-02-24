import { ref, reactive, computed, watch, nextTick } from "vue";
import { f7 } from "framework7-vue";
import { NativeAudio } from "@capacitor-community/native-audio";
import { axiosAdmin } from "@/common/axiosAdmin";
import { useI18n } from "vue-i18n";
import { debounce, find, includes, sumBy } from "lodash-es";
import common from "../../../composable/common";
import crud from "../../../composable/crud";

const stockManagement = (addEditType, addEditItem, fieldsVar) => {
	const { formData, loading, rules, onSubmit, initCrud, formDataLoaded } =
		crud(addEditType, addEditItem);

	const { formatAmount, selectedWarehouse, dayjs, appSetting } = common();
	const { t } = useI18n();
	const selectedProducts = ref([]);
	const selectedProductIds = ref([]);
	const removedOrderItemsIds = ref([]);
	const state = reactive({
		orderSearchTerm: undefined,
		productFetching: false,
		products: [],
	});

	const taxes = ref([]);
	const productsAmount = ref({
		subtotal: 0,
		tax: 0,
	});

	// AddEdit
	const addEditVisible = ref(false);
	const addEditFormSubmitting = ref(false);
	const addEditFormData = ref({});
	const addEditRules = ref([]);
	const addEditPageTitle = ref("");
	const editOrderDisable = ref(false);

	const orderType = ref(fieldsVar.initData.order_type);
	const allOrderStatus = fieldsVar.allOrderStatus;

	const orderPageObject = ref(fieldsVar.orderPageObject);

	const totalQuantity = computed(() => {
		return sumBy(selectedProducts.value, "quantity");
	});

	const setFormData = () => {
		initCrud(fieldsVar);
	};

	const fetchProducts = debounce((value) => {
		fetchAllSearchedProduct(value);
	}, 300);

	const fetchAllSearchedProduct = (value) => {
		state.products = [];

		if (value != "") {
			state.productFetching = true;
			let url = `search-product`;

			axiosAdmin()
				.post(url, {
					order_type: orderPageObject.value.type,
					search_term: value,
					warehouse_id: formData.value.warehouse_id,
				})
				.then((response) => {
					// if (response.data.length == 1) {
					// 	searchValueSelected("", { product: response.data[0] });
					// } else {
					state.products = response.data;
					// }

					state.productFetching = false;
				});
		}
	};

	const inputValueChanged = (keydownEvent) => {
		nextTick(() => {
			if (keydownEvent.keyCode == 13) {
				fetchAllSearchedProduct(keydownEvent.target.value);
			}
		});
	};

	const searchValueSelected = (value, option) => {
		const newProduct = option.product;

		if (!includes(selectedProductIds.value, newProduct.xid)) {
			selectedProductIds.value.push(newProduct.xid);

			selectedProducts.value.push({
				...newProduct,
				sn: selectedProducts.value.length + 1,
				unit_price: formatAmount(newProduct.unit_price),
				tax_amount: formatAmount(newProduct.tax_amount),
				subtotal: formatAmount(newProduct.subtotal),
			});
			state.orderSearchTerm = undefined;
			// state.products = [];
			recalculateFinalTotal();

			// var audioObj = new Audio(appSetting.value.beep_audio_url);
			// audioObj.play();

			NativeAudio.play({
				assetId: "beep",
				// time: 6.0 - seek time
			});
		} else {
			const newProductSelection = find(selectedProducts.value, [
				"xid",
				newProduct.xid,
			]);
			console.log(newProductSelection);
			if (
				newProductSelection &&
				(newProductSelection.quantity <
					newProductSelection.stock_quantity ||
					orderPageObject.value.type == "purchases" ||
					orderPageObject.value.type == "sales-returns" ||
					orderPageObject.value.type == "quotations")
			) {
				const newResults = [];
				var foundRecord = {};

				selectedProducts.value.map((selectedProduct) => {
					var newQuantity = selectedProduct.quantity;

					if (selectedProduct.xid == newProduct.xid) {
						newQuantity += 1;
						selectedProduct.quantity = newQuantity;
						foundRecord = selectedProduct;
					}

					newResults.push(selectedProduct);
				});
				selectedProducts.value = newResults;

				// var audioObj = new Audio(appSetting.value.beep_audio_url);
				// audioObj.play();

				NativeAudio.play({
					assetId: "beep",
					// time: 6.0 - seek time
				});

				state.orderSearchTerm = undefined;
				// state.products = [];

				quantityChanged(foundRecord);
			} else {
				state.orderSearchTerm = undefined;
				// state.products = [];

				NativeAudio.play({
					assetId: "beep-warning",
					// time: 6.0 - seek time
				});

				f7.toast
					.create({
						text: t(`common.out_of_stock`),
						position: "bottom",
						closeTimeout: 2000,
					})
					.open();
			}
		}

		// const isProductAlreadyAdded = find(selectedProducts.value, ['xid', newProduct.xid]);

		// if (isProductAlreadyAdded == undefined) {
		//     selectedProductIds.value.push(newProduct.xid);

		//     selectedProducts.value.push({
		//         ...newProduct,
		//         sn: selectedProducts.value.length + 1,
		//         unit_price: formatAmount(newProduct.unit_price),
		//         tax_amount: formatAmount(newProduct.tax_amount),
		//         subtotal: formatAmount(newProduct.subtotal),
		//     });
		// }

		// recalculateFinalTotal();
	};

	const recalculateValues = (product) => {
		var quantityValue = parseFloat(product.quantity);
		var maxQuantity = parseFloat(product.stock_quantity);
		var orderItemId = product.item_id;
		const unitPrice = parseFloat(product.unit_price);

		// Check if entered quantity value is greater
		quantityValue =
			quantityValue > maxQuantity &&
			(orderPageObject.value.type == "sales" ||
				orderPageObject.value.type == "purchase-returns")
				? maxQuantity
				: quantityValue;

		// Discount Amount
		const discountRate = product.discount_rate;
		const totalDiscount =
			discountRate > 0 ? (discountRate / 100) * unitPrice : 0;
		const totalPriceAfterDiscount = unitPrice - totalDiscount;

		var taxAmount = 0;
		var subtotal = totalPriceAfterDiscount;
		var singleUnitPrice = unitPrice;

		// Tax Amount
		if (product.tax_rate > 0) {
			if (product.tax_type == "inclusive") {
				singleUnitPrice =
					(totalPriceAfterDiscount * 100) / (100 + product.tax_rate);
				taxAmount = singleUnitPrice * (product.tax_rate / 100);
			} else {
				taxAmount = totalPriceAfterDiscount * (product.tax_rate / 100);
				subtotal = totalPriceAfterDiscount + taxAmount;
				singleUnitPrice = totalPriceAfterDiscount;
			}
		}

		const newObject = {
			...product,
			total_discount: totalDiscount * quantityValue,
			subtotal: subtotal * quantityValue,
			quantity: quantityValue,
			total_tax: taxAmount * quantityValue,
			max_quantity: maxQuantity,
			single_unit_price: singleUnitPrice,
		};

		return newObject;
	};

	const quantityChanged = (record) => {
		const newResults = [];

		selectedProducts.value.map((selectedProduct) => {
			if (selectedProduct.xid == record.xid) {
				const newValueCalculated = recalculateValues(record);
				newResults.push(newValueCalculated);
			} else {
				newResults.push(selectedProduct);
			}
		});
		selectedProducts.value = newResults;

		recalculateFinalTotal();
	};

	const recalculateFinalTotal = () => {
		let total = 0;
		let taxAmount = 0;
		selectedProducts.value.map((selectedProduct) => {
			total += selectedProduct.subtotal;
		});
		const discountAmount =
			formData.value.discount != ""
				? parseFloat(formData.value.discount)
				: 0;
		const taxRate =
			formData.value.tax_rate != ""
				? parseFloat(formData.value.tax_rate)
				: 0;

		selectedProducts.value.map((selectedProduct) => {
			taxAmount += selectedProduct.total_tax;
		});
		productsAmount.value.subtotal = total;
		productsAmount.value.tax = taxAmount;

		total = total - discountAmount;

		const tax = total * (taxRate / 100);

		total = total + parseFloat(formData.value.shipping);

		formData.value.subtotal = formatAmount(total + tax);
		formData.value.tax_amount = formatAmount(tax);
		formData.value.discount = discountAmount;
	};

	const calculateProductAmount = () => {
		let total = 0;
		let taxAmount = 0;
		selectedProducts.value.map((selectedProduct) => {
			total += selectedProduct.subtotal;
		});

		selectedProducts.value.map((selectedProduct) => {
			taxAmount += selectedProduct.total_tax;
		});
		productsAmount.value.subtotal = total;
		productsAmount.value.tax = taxAmount;
	};

	const showDeleteConfirm = (product) => {
		// Delete selected product and rearrange SN
		const newResults = [];
		let counter = 1;
		selectedProducts.value.map((selectedProduct) => {
			if (
				product.item_id &&
				product.item_id != "" &&
				product.item_id != null &&
				product.item_id == selectedProduct.item_id &&
				selectedProduct.item_id != null
			) {
				removedOrderItemsIds.value = [
					...removedOrderItemsIds.value,
					selectedProduct.item_id,
				];
			}

			if (selectedProduct.xid != product.xid) {
				newResults.push({
					...selectedProduct,
					sn: counter,
					single_unit_price: formatAmount(
						selectedProduct.single_unit_price
					),
					tax_amount: formatAmount(selectedProduct.tax_amount),
					subtotal: formatAmount(selectedProduct.subtotal),
				});

				counter++;
			}
		});
		selectedProducts.value = newResults;

		// Remove deleted product id from lists
		const filterProductIdArray = selectedProductIds.value.filter(
			(newId) => {
				return newId != product.xid;
			}
		);
		selectedProductIds.value = filterProductIdArray;
		recalculateFinalTotal();
	};

	const taxChanged = (value, option) => {
		formData.value.tax_rate = value == undefined ? 0 : option.tax.rate;
		recalculateFinalTotal();
	};

	const editItem = (product) => {
		addEditFormData.value = {
			id: product.xid,
			discount_rate: product.discount_rate,
			unit_price: product.unit_price,
			tax_id: product.x_tax_id,
			tax_type: product.tax_type == null ? undefined : product.tax_type,
		};
		addEditVisible.value = true;
		addEditPageTitle.value = product.name;
	};

	// For Add Edit
	const onAddEditSubmit = () => {
		const record = selectedProducts.value.filter(
			(selectedProduct) => selectedProduct.xid == addEditFormData.value.id
		);

		const selecteTax = taxes.value.filter(
			(tax) => tax.xid == addEditFormData.value.tax_id
		);

		const taxType =
			addEditFormData.value.tax_type != undefined
				? addEditFormData.value.tax_type
				: "exclusive";

		const newData = {
			...record[0],
			discount_rate: parseFloat(addEditFormData.value.discount_rate),
			unit_price: parseFloat(addEditFormData.value.unit_price),
			tax_id: addEditFormData.value.tax_id,
			tax_rate: selecteTax[0] ? selecteTax[0].rate : 0,
			tax_type: taxType,
		};
		quantityChanged(newData);
		onAddEditClose();
	};

	const onAddEditClose = () => {
		addEditFormData.value = {};
		addEditVisible.value = false;
	};

	// watch(route, (newVal, oldVal) => {
	//     console.log(newVal.params.type);
	//     orderType.value = newVal.params.type;
	//     formData.value = {
	//         ...formData.value,
	//         order_type: newVal.params.type,
	//     };
	// });

	return {
		setFormData,
		state,
		orderType,
		allOrderStatus,
		orderPageObject,
		selectedProducts,
		selectedProductIds,
		productsAmount,
		taxes,

		fetchProducts,
		searchValueSelected,
		recalculateValues,
		quantityChanged,
		recalculateFinalTotal,
		showDeleteConfirm,
		taxChanged,
		editItem,

		// Add Edit
		addEditVisible,
		addEditFormData,
		addEditFormSubmitting,
		addEditRules,
		addEditPageTitle,
		editOrderDisable,
		onAddEditSubmit,
		onAddEditClose,
		removedOrderItemsIds,

		calculateProductAmount,
		inputValueChanged,

		formData,
		loading,
		rules,
		onSubmit,
		initCrud,
		formDataLoaded,

		totalQuantity,
	};
};

export default stockManagement;
