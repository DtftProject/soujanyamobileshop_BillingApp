import BrandIndex from "@/pages/product-manager/brands/index.vue";
import BrandView from "@/pages/product-manager/brands/view.vue";
import BrandAddEdit from "@/pages/product-manager/brands/addEdit.vue";
// import BrandEdit from "@/pages/product-manager/brands/edit.vue";
import CategoryIndex from "@/pages/product-manager/categories/index.vue";
import CategoryView from "@/pages/product-manager/categories/view.vue";
import CategoryAddEdit from "@/pages/product-manager/categories/addEdit.vue";
// import CategoryEdit from "@/pages/product-manager/categories/edit.vue";
import VariationIndex from "@/pages/product-manager/variation/index.vue";
import VariationView from "@/pages/product-manager/variation/view.vue";
import VariationAddEdit from "@/pages/product-manager/variation/addEdit.vue";
// import VariationEdit from "@/pages/product-manager/variation/edit.vue";
import ProductIndex from "@/pages/product-manager/products/index.vue";
import ProductView from "@/pages/product-manager/products/view.vue";
import ProductAddEdit from "@/pages/product-manager/products/addEdit.vue";

export default [
  // Customers
  {
    path: "/brand/",
    component: BrandIndex,
  },
  {
    path: "/brand-view/",
    component: BrandView,
  },
  {
    path: "/brand-create/",
    component: BrandAddEdit,
  },
  {
    path: "/brand-edit/",
    component: BrandAddEdit,
  },
  //   categories
  {
    path: "/category/",
    component: CategoryIndex,
  },
  {
    path: "/category-view/",
    component: CategoryView,
  },
  {
    path: "/category-create/",
    component: CategoryAddEdit,
  },
  {
    path: "/category-edit/",
    component: CategoryAddEdit,
  },
  // variation

  {
    path: "/variation/",
    component: VariationIndex,
  },
  {
    path: "/variation-view/",
    component: VariationView,
  },
  {
    path: "/variation-create/",
    component: VariationAddEdit,
  },
  {
    path: "/variation-edit/",
    component: VariationAddEdit,
  },
  // proudcts

  {
    path: "/product/",
    component: ProductIndex,
  },
  {
    path: "/product-view/",
    component: ProductView,
  },
  {
    path: "/product-create/",
    component: ProductAddEdit,
  },
  {
    path: "/product-edit/",
    component: ProductAddEdit,
  },
];
