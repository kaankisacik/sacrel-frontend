// Fix API type
export interface BaseRegionCountryWithRegionId {
  id: string
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
  region_id: string
}

export function getCountryFromCountryCode(countries?: BaseRegionCountryWithRegionId[], countryCode?: string) {
  if (!countryCode)
    return

  return countries?.find(country => country?.iso_2 === countryCode)
}

export function getCountriesFromRegions(regions?: any[]) {
  if (!regions) {
    return []
  }
  return regions
    .map((region: any) => region.countries)
    .flat()
    .sort((a, b) => {
      if (!a?.name || !b?.name) {
        return 0
      }
      return a.name.localeCompare(b.name)
    }) as BaseRegionCountryWithRegionId[]
}
