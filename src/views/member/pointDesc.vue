<template>
   <section class="pointDesc_section">
      <div class="wrap" v-if="hasPointData">
			<div class="introBox">
				<div class="topBlock">
					<img :src="pointData.feature_image.url" alt="">
					<p>{{ pointData.title }}</p>
				</div>
				<ul class="descList" v-if="metaList.length !== 0">
					<li 
						v-for="(item,index) in metaList"
						:key="index">
						<div>{{ item.key }}</div>
						<div class="colon">:</div>
						<div>{{ item.value }}</div>
					</li>
				</ul>
			</div>
			<div class="content" v-html="pointData.content"></div>
		</div>
		<div id="loading" v-if="isLoading"></div>
   </section>
</template>

<script>
import { pointApi } from '@/api/point.js';
import _ from 'lodash';
export default {
   name: 'pointDesc',
   metaInfo() {
      return { 
         title: this.$i18n.t('page.pointDesc.title'),
      }
   },
   data: () => ({
      pointId: 0,
      pointData: {},
      isLoading: false
   }),
   computed: {
      hasPointData() {
         return !(_.isEmpty(this.pointData));
      },
      metaList() {
         if (!this.hasPointData) return [];
         return this.pointData.meta;
      }
   },
   methods: {
      async getPointInfo(pointId) {
         this.isLoading = true;
         let { info } = await pointApi.pointInfo({ point_id: [pointId], full_info: true });
         this.pointData = info.results.point_information[0];
         this.isLoading = false;
      }
   },
   mounted() {
      let pointId = parseInt(this.$route.params.point_id);
      this.getPointInfo(pointId);
   },
   watch: {
      $route(to) {
         let pointId = parseInt(to.params.point_id);
         this.getPointInfo(pointId);
      }
   }
}
</script>

<style lang="scss" src="./scss/pointDesc.scss" scoped></style>