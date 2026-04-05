const UI_TEXT = {
  en: {
    app: {
      language: 'Language',
      heroBadge: 'Mobile-first chef workflow',
      heroTitle: 'Chef Prep Sheet',
      heroDescription: 'Build clean catering prep lists in seconds, preview the final layout, then export a polished PDF ready to send to customers.',
      activeItems: 'Active Items',
      categories: 'Categories',
      quickPicks: 'Quick Picks',
      quickPicksDescription: 'Tap a frequent ingredient to jump straight to it.',
      selectedItems: 'Selected Items',
      selectedItemsEmpty: 'Quantities you enter will appear here for a quick sanity check.',
      noSearchResults: 'No ingredients matched "{term}". Try another search term.',
      moreItems: '+ {count} more item{suffix}',
      addItemsBeforePreview: 'Add at least one ingredient quantity before previewing the sheet.',
      datePastError: 'Event date cannot be in the past.',
      datePastToast: 'Please select today or a future date.',
      missingFieldsPreview: '{fields} {verb} required before preview.',
      fillFieldToContinue: 'Please fill {field} to continue.',
      activeLineItems: '{count} active line items',
      notProvided: 'Not provided',
    },
    pdfBar: {
      readyToReview: 'Ready To Review',
      activeItemsCount: '{count} active item{suffix} in this prep sheet',
      reset: 'Reset',
      generatePdf: 'Generate PDF',
    },
    search: {
      placeholder: 'Search ingredients or spices',
      clear: 'Clear search',
    },
    chefDetails: {
      eyebrow: 'Chef Details',
      title: 'Print-ready header information',
      description: 'These details appear at the top of the preview and the exported PDF.',
      chefName: 'Chef Name',
      chefNamePlaceholder: 'Chef S. Kumar',
      contactNumber: 'Contact Number',
      contactNumberPlaceholder: '98765 43210',
      cateringServiceName: 'Catering Service Name',
      cateringServiceNamePlaceholder: 'Royal Feast Caterers',
      eventName: 'Event Name',
      eventNamePlaceholder: 'Reception Dinner',
      date: 'Date',
    },
    category: {
      itemCount: '{count} items',
      selectedCount: '{count} selected',
      addManualItem: 'Add Manual Item',
      addManualItemDescription: 'Chef can type any extra item name, quantity, and unit for this section.',
      addItem: 'Add item',
      noManualItems: 'No manual items added yet.',
      manualItem: 'Manual item',
      itemName: 'Item Name',
      itemNamePlaceholder: 'Enter item name',
      quantity: 'Quantity',
      unit: 'Unit',
      removeCustomItem: 'Remove custom item from {category}',
    },
    ingredient: {
      add: 'Add',
      addLinesDescription: 'Add separate lines for each size or variant needed.',
      line: 'Line {count}',
      quantity: 'Quantity',
      unit: 'Unit',
      customSize: 'Custom Size',
      select: 'Select',
      other: 'Other',
      predefined: 'Predefined ingredient',
      variantHint: 'Choose quantity and size for this utensil',
      removeLine: 'Remove {item} line {count}',
    },
    preview: {
      screen: 'Preview Screen',
      reviewDescription: 'Review the final sheet before download or sharing.',
      close: 'Close preview',
      backToEdit: 'Back to edit',
      downloadPdf: 'Download PDF',
      shareWhatsapp: 'Share via WhatsApp',
      sheetSummary: 'Sheet Summary',
      pdfPreview: 'PDF Preview',
      pdfPreviewDescription: 'Scroll down to review the full printable sheet.',
      sheetTitle: 'Chef Prep Sheet',
      service: 'Service',
      chef: 'Chef',
      contact: 'Contact',
      event: 'Event',
      date: 'Date',
      items: 'Items',
      chefName: 'Chef Name',
      contactNumber: 'Contact Number',
      eventName: 'Event Name',
      itemName: 'Item Name',
      quantity: 'Quantity',
      unit: 'Unit',
    },
  },
}

const getPathValue = (object, path) =>
  path.split('.').reduce((current, part) => (current && current[part] !== undefined ? current[part] : undefined), object)

const interpolate = (template, replacements = {}) =>
  Object.entries(replacements).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )

export const t = (language, key, replacements = {}) => {
  const template =
    getPathValue(UI_TEXT[language] || UI_TEXT.en, key) ?? getPathValue(UI_TEXT.en, key) ?? key

  return interpolate(template, replacements)
}

export const getCategoryTranslation = () => ''

export const getItemTranslation = () => ''

export const getDisplayCategoryName = (_language, name) => name

export const getDisplayItemName = (_language, name) => name

export const getDisplayUnit = (_language, unit) => unit

export const getRequiredFieldLabel = (language, fieldKey) => t(language, `chefDetails.${fieldKey}`)
export const getChefFieldLabel = (language, fieldKey) => t(language, `chefDetails.${fieldKey}`)

export const getChefFieldPlaceholder = (language, fieldKey) => {
  const key = `chefDetails.${fieldKey}Placeholder`
  const value = getPathValue(UI_TEXT[language] || UI_TEXT.en, key) ?? getPathValue(UI_TEXT.en, key)
  return value || ''
}