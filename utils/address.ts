export function compareAddresses(address1?: any, address2?: any) {
  const fields = [
    'first_name',
    'last_name',
    'address_1',
    'company',
    'postal_code',
    'city',
    'country_code',
    'province',
    'phone',
  ]

  if (!address1 && !address2) return true
  if (!address1 || !address2) return false

  return fields.every(field => address1[field] === address2[field])
}
