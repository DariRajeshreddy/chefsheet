import { useDeferredValue, useEffect, useState, useTransition } from 'react'
import { IoDocumentTextOutline, IoSparklesOutline } from 'react-icons/io5'
import CategorySection from './components/CategorySection'
import ChefDetailsForm from './components/ChefDetailsForm'
import PDFGenerator from './components/PDFGenerator'
import PreviewModal from './components/PreviewModal'
import SearchBar from './components/SearchBar'
import { frequentIngredients, ingredientCatalog } from './data/ingredientCatalog'
import { usePrepSheetStore } from './store/usePrepSheetStore'
import { getMissingRequiredFields, getWhatsAppText } from './utils/format'

const getTodayInputValue = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().split('T')[0]
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, startTransition] = useTransition()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [missingFieldKeys, setMissingFieldKeys] = useState([])
  const deferredSearch = useDeferredValue(searchTerm)

  const {
    ingredients,
    chefDetails,
    categoryOpenState,
    updateIngredient,
    updateIngredientEntry,
    addIngredientEntry,
    removeIngredientEntry,
    updateChefDetails,
    toggleCategory,
    clearAll,
  } = usePrepSheetStore()

  useEffect(() => {
    if (!toastMessage) return undefined

    const timeoutId = window.setTimeout(() => {
      setToastMessage('')
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const trimmedSearch = deferredSearch.trim().toLowerCase()
  const getIngredientEntry = (item) =>
    ingredients[item.id] ??
    (item.allowMultipleEntries
      ? {
          entries: [
            {
              id: `${item.id}-fallback`,
              quantity: '',
              unit: item.defaultUnit,
              option: '',
              customOption: '',
            },
          ],
        }
      : {
          quantity: '',
          unit: item.defaultUnit,
          option: '',
          customOption: '',
        })

  const getItemDisplayName = (item, entry) => {
    const selectedOption = entry.option === '__custom__' ? entry.customOption.trim() : entry.option
    return selectedOption ? `${item.name} (${selectedOption})` : item.name
  }

  const scrollToChefField = (fieldKey) => {
    const fieldElement = document.getElementById(`chef-detail-${fieldKey}`)
    const detailsSection = document.getElementById('chef-details-section')

    detailsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    window.setTimeout(() => {
      fieldElement?.focus()
      fieldElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 220)
  }

  const filteredCategories = ingredientCatalog
    .map((category) => {
      const items = category.items
        .filter((item) => item.name.toLowerCase().includes(trimmedSearch))
        .map((item) => ({ item, entry: getIngredientEntry(item) }))

      return {
        ...category,
        items,
        activeCount: items.reduce((count, { item, entry }) => {
          if (item.allowMultipleEntries) {
            return count + entry.entries.filter((line) => line.quantity !== '').length
          }

          return count + (entry.quantity !== '' ? 1 : 0)
        }, 0),
      }
    })
    .filter((category) => category.items.length > 0)

  const activeItems = ingredientCatalog.flatMap((category) =>
    category.items.flatMap((item) => {
      const entry = getIngredientEntry(item)

      if (item.allowMultipleEntries) {
        return entry.entries
          .filter((line) => line.quantity !== '')
          .map((line) => ({
            id: line.id,
            name: getItemDisplayName(item, line),
            quantity: line.quantity,
            unit: line.unit,
            categoryName: category.name,
          }))
      }

      if (entry.quantity === '') return []

      return [
        {
          id: item.id,
          name: getItemDisplayName(item, entry),
          quantity: entry.quantity,
          unit: entry.unit,
          categoryName: category.name,
        },
      ]
    }),
  )

  const quickItems = frequentIngredients.slice(0, 8)
  const missingFields = getMissingRequiredFields(chefDetails)

  const openPreview = () => {
    const todayInputValue = getTodayInputValue()
    if (!activeItems.length) {
      setValidationMessage('Add at least one ingredient quantity before previewing the sheet.')
      setToastMessage('Add at least one ingredient quantity before previewing the sheet.')
      return
    }

    if (chefDetails.date && chefDetails.date < todayInputValue) {
      setMissingFieldKeys(['date'])
      setValidationMessage('Event date cannot be in the past.')
      setToastMessage('Please select today or a future date.')
      scrollToChefField('date')
      return
    }

    if (missingFields.length) {
      const nextMissingKeys = missingFields.map((field) => field.key)
      setMissingFieldKeys(nextMissingKeys)
      setValidationMessage(`${missingFields.map((field) => field.label).join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required before preview.`)
      setToastMessage(`Please fill ${missingFields[0].label.toLowerCase()} to continue.`)
      scrollToChefField(missingFields[0].key)
      return
    }

    setMissingFieldKeys([])
    setValidationMessage('')
    setToastMessage('')
    setPreviewOpen(true)
  }

  const loadPdfBuilder = async () => {
    const module = await import('./utils/pdf')
    return module.buildPrepSheetPdf
  }

  const downloadPdf = async () => {
    const buildPrepSheetPdf = await loadPdfBuilder()
    const { doc, fileName } = buildPrepSheetPdf({ details: chefDetails, items: activeItems })
    doc.save(fileName)
  }

  const shareOnWhatsApp = async () => {
    const buildPrepSheetPdf = await loadPdfBuilder()
    const { blob, fileName, doc } = buildPrepSheetPdf({ details: chefDetails, items: activeItems })
    const text = getWhatsAppText(chefDetails, activeItems.length)
    const file = new File([blob], fileName, { type: 'application/pdf' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: 'Chef Prep Sheet', text, files: [file] })
      return
    }

    doc.save(fileName)
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${text} PDF downloaded separately for attachment.`)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleSearchChange = (value) => {
    startTransition(() => {
      setSearchTerm(value)
    })
  }

  const handleChefDetailsChange = (key, value) => {
    updateChefDetails(key, value)

    if (missingFieldKeys.includes(key) && value.trim()) {
      setMissingFieldKeys((currentKeys) => currentKeys.filter((currentKey) => currentKey !== key))
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,237,194,0.45),_transparent_32%),linear-gradient(180deg,_#f8f4ed_0%,_#f5efe7_44%,_#f7f3ee_100%)] px-4 pb-28 pt-4 text-stone-800 sm:px-6 lg:px-8">
      {toastMessage ? (
        <div className="fixed left-1/2 top-4 z-[70] w-[min(92vw,30rem)] -translate-x-1/2 rounded-2xl border border-amber-300 bg-stone-950 px-4 py-3 text-sm font-medium text-amber-50 shadow-[0_18px_45px_rgba(28,20,12,0.35)]">
          {toastMessage}
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl">
        <PDFGenerator
          activeCount={activeItems.length}
          onPreview={openPreview}
          onClear={() => {
            clearAll()
            setValidationMessage('')
            setToastMessage('')
            setMissingFieldKeys([])
          }}
          disabled={!activeItems.length}
        />

        <main className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[32px] border border-white/60 bg-stone-900 px-5 py-6 text-white shadow-[0_28px_70px_rgba(40,30,20,0.34)] sm:px-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-stone-100">
                    <IoSparklesOutline />
                    Mobile-first chef workflow
                  </p>
                  <h1 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">Chef Prep Sheet</h1>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300 sm:text-base">
                    Build clean catering prep lists in seconds, preview the final layout, then export a polished PDF ready to send to customers.
                  </p>
                </div>
                <div className="grid min-w-[220px] grid-cols-2 gap-3 self-stretch">
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-300">Active Items</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{activeItems.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-300">Categories</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{ingredientCatalog.length}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <SearchBar value={searchTerm} onChange={handleSearchChange} pending={isSearching} />
              </div>
              {validationMessage ? (
                <div className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                  {validationMessage}
                </div>
              ) : null}
            </section>

            <section className="rounded-[28px] border border-stone-200/80 bg-white/75 p-5 shadow-[0_22px_44px_rgba(55,40,20,0.08)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-xl text-amber-700">
                  <IoDocumentTextOutline />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Quick Picks</p>
                  <p className="mt-1 text-sm text-stone-600">Tap a frequent ingredient to jump straight to it.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleSearchChange(item.name)
                      requestAnimationFrame(() => {
                        document.getElementById(`ingredient-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      })
                    }}
                    className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-700 transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </section>

            <div className="space-y-4">
              {filteredCategories.length ? (
                filteredCategories.map((category) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    items={category.items}
                    activeCount={category.activeCount}
                    isOpen={categoryOpenState[category.id]}
                    onToggle={toggleCategory}
                    onChange={updateIngredient}
                    onEntryChange={updateIngredientEntry}
                    onAddEntry={addIngredientEntry}
                    onRemoveEntry={removeIngredientEntry}
                    forceOpen={Boolean(trimmedSearch)}
                  />
                ))
              ) : (
                <section className="rounded-[28px] border border-dashed border-stone-300 bg-white/70 px-6 py-10 text-center text-stone-600">
                  No ingredients matched "{searchTerm}". Try another search term.
                </section>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-[30px] border border-stone-200/80 bg-white/80 p-5 shadow-[0_22px_44px_rgba(60,45,24,0.08)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Selected Items</p>
              <div className="mt-4 space-y-3">
                {activeItems.length ? (
                  activeItems.slice(0, 8).map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
                      <div>
                        <p className="font-medium text-stone-800">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.categoryName}</p>
                      </div>
                      <p className="text-sm font-semibold text-stone-700">{item.quantity} {item.unit}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-6 text-sm text-stone-500">
                    Quantities you enter will appear here for a quick sanity check.
                  </div>
                )}
              </div>
              {activeItems.length > 8 ? (
                <p className="mt-3 text-xs text-stone-500">+ {activeItems.length - 8} more item{activeItems.length - 8 === 1 ? '' : 's'}</p>
              ) : null}
            </section>

            <ChefDetailsForm values={chefDetails} onChange={handleChefDetailsChange} missingFieldKeys={missingFieldKeys} />
          </div>
        </main>
      </div>

      <PreviewModal
        open={previewOpen}
        details={chefDetails}
        items={activeItems}
        onClose={() => setPreviewOpen(false)}
        onGeneratePdf={downloadPdf}
        onShareWhatsApp={shareOnWhatsApp}
      />
    </div>
  )
}

export default App

