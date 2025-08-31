// import type {
//   StoreRegion,
// } from "@medusajs/types";
// import { defineStore } from "pinia";
// export const useRegionStore = defineStore("regionStore", () => {
//   const regionService = useRegion();
//   const currentRegion = ref<StoreRegion | null>(null);
//   const isLoading = ref(false);

//   // Get region data
//   const getRegion = async () => {
//     isLoading.value = true;
//     try {
//       const response = await regionService.getTRRegion();
//       console.log("Current region data:", response);

//       currentRegion.value = response;
      
//     } catch (err) {
//       console.error("Failed to get region:", err);
//       throw err;
//     } finally {
//       isLoading.value = false;
//     }
//   };




//   return {
//     currentRegion,
//     getRegion
//   };
// });
