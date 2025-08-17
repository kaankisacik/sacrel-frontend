import { defineStore } from "pinia";
export const useMenuStore = defineStore("menuStore", () => {
  const isMenuOpen = ref(false);
  const isMobileMenuOpen = ref(false);

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }
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
    isMobileMenuOpen,
    toggleMobileMenu,
    searchValue,
    setSearchValue,
    getSearchValue,
  };
});
