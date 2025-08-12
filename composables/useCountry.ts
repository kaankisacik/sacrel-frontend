export const useCountry = () => {
  const countryCodeFromCookie = useCookie('country_code', {
    maxAge: 60 * 60 * 24 * 365,
  })
  const country = useState<any>('country', () => undefined)

  const setCountry = (newCountry?: any) => {
    if (!newCountry)
      return null
    country.value = newCountry
    countryCodeFromCookie.value = newCountry.iso_2
  }

  return {
    countryCode: computed(() => countryCodeFromCookie.value || undefined),
    country: readonly(country),
    setCountry: setCountry,
  }
}

export const useCountries = async () => {
  const NuxtApp = useNuxtApp()
  const countries = ref<any[] | undefined>(NuxtApp.payload.data['countries'])

  if (!countries.value) {
    const medusa = useMedusaClient()
    
    try {
      const { regions } = await medusa.store.region.list()
      countries.value = regions || []
    } catch (error: any) {
      console.error('Error fetching regions:', error)
      countries.value = []
    }
  }

  return countries
}
