<template>
	<div class="switchLang">
		
	</div>
</template>

<script>
import { support_language } from '@/plugins/i18n/config.js';
import { translate } from '@/plugins/i18n/translate.js';
export default {
   data: () => ({
		langList: [],
		isFirst: true
	}),
   methods: {
      async changeLocale(lang) {
			if (this.$i18n.locale === lang) return;
			const routeInfo = this.$router.resolve({ params: { locale: lang }});
			await translate.changeLanguage(lang).then(res => res);
			this.$router.push(routeInfo.location);
		}
   },
   mounted() {
      this.langList = support_language;
   },
   watch: {
		$route(val, oldVal) {
         if (this.isFirst) {
            this.isFirst = false;
            return;
         }
			if (val.params.locale !== oldVal.params.locale) {
				location.reload();
			}
		}
	}
}
</script>