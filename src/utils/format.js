export const REQUIRED_FIELDS = [
  { key: 'cateringServiceName', label: 'Catering service name' },
  { key: 'chefName', label: 'Chef name' },
  { key: 'contactNumber', label: 'Contact number' },
]

export const formatDisplayDate = (value) => {
  if (!value) return 'Not provided'

  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

export const getSheetFileName = (details) => {
  const source = details.eventName || details.cateringServiceName || details.chefName || 'chef-prep-sheet'
  const slug = source.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${slug || 'chef-prep-sheet'}.pdf`
}

export const getMissingRequiredFields = (details) =>
  REQUIRED_FIELDS.filter(({ key }) => !details[key]?.trim())

export const getWhatsAppText = (details, itemCount) =>
  `Chef Prep Sheet ready for ${details.eventName || details.cateringServiceName}. ${itemCount} item${itemCount === 1 ? '' : 's'} included.`
