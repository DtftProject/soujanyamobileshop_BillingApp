// Import Vue
import { createApp } from "vue";

// Import Framework7
import Framework7 from "framework7/lite-bundle";

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from "framework7-vue/bundle";
import { createPinia } from "pinia";
import { setupI18n } from "../common/i18n";
import { useAppStore } from "../stores/appStore";

// Import Framework7 Styles
// import "framework7/css/bundle";
import "../css/framework7-bundle.min.css";
// import "../css/framework7-bundle-rtl.min.css";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/app.less";

// Import App Component
import App from "../components/app.vue";

async function bootstrap() {
	// Init Framework7-Vue Plugin
	Framework7.use(Framework7Vue);

	// Init App
	const app = createApp(App);

	// Register Framework7 Vue components
	registerComponents(app);

	app.use(createPinia());

	const { selectedLang, allLangTrans, isDarkMode } = useAppStore();
	const selectedLangKey =
		selectedLang && selectedLang.key ? selectedLang.key : "en";

	let messages = {};
	if (allLangTrans && allLangTrans[selectedLangKey]) {
		messages[selectedLangKey] = allLangTrans[selectedLangKey];
	}

	const i18n = setupI18n({
		legacy: false,
		globalInjection: true,
		locale: selectedLangKey,
		warnHtmlMessage: false,
		messages,
	});

	// Test
	// if (appUrl && appUrl != '') {
	//     await loadLocaleMessages(i18n, appLang);
	// }

	app.config.globalProperties.$i18nObject = i18n;

	app.use(i18n);

	// const layoutType = isDarkMode ? "ltr" : "rtl";
	// document.documentElement.setAttribute("dir", layoutType);

	app.mount("#app");
}

bootstrap();
