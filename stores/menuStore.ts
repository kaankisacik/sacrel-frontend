import { defineStore } from "pinia";
export const useMenuStore = defineStore("menuStore", () => {
  const isMenuOpen = ref(false);
  const searchValue = ref("");

  function setSearchValue(value: string) {
    searchValue.value = value;
  }

  function getSearchValue() {
    return searchValue.value;
  }

  const setIsMenuOpen = (value: boolean) => {
    isMenuOpen.value = value;
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    searchValue,
    setSearchValue,
    getSearchValue,
  };
});
