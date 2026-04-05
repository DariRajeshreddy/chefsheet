import { AnimatePresence, motion as Motion } from 'framer-motion'
import { IoAdd, IoChevronDown, IoTrashOutline } from 'react-icons/io5'
import { UNIT_OPTIONS } from '../data/ingredientCatalog'
import { getDisplayCategoryName, getDisplayUnit, t } from '../utils/i18n'
import IngredientRow from './IngredientRow'

const sanitizeQuantityValue = (rawValue) => {
  const normalizedValue = rawValue.replace(/,/g, '.').replace(/[^\d.]/g, '')
  const [integerPart = '', ...decimalParts] = normalizedValue.split('.')
  const decimalPart = decimalParts.join('')

  if (!normalizedValue) return ''
  if (normalizedValue.startsWith('.')) return `0.${decimalPart}`
  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart
}

function CategorySection({
  category,
  items,
  manualItems,
  activeCount,
  isOpen,
  onToggle,
  onChange,
  onEntryChange,
  onAddEntry,
  onRemoveEntry,
  onManualItemAdd,
  onManualItemChange,
  onManualItemRemove,
  forceOpen,
  language,
}) {
  const expanded = forceOpen || isOpen
  const displayCategoryName = getDisplayCategoryName(language, category.name)

  return (
    <Motion.section layout className="overflow-hidden rounded-[28px] border border-stone-200/80 bg-white/70 shadow-[0_20px_40px_rgba(56,41,20,0.08)] backdrop-blur">
      <button type="button" onClick={() => !forceOpen && onToggle(category.id)} className="relative flex w-full items-center justify-between gap-4 overflow-hidden px-5 py-4 text-left sm:px-6">
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${category.accent}`} />
        <div className="relative">
          <p className="text-lg font-semibold text-stone-900">{displayCategoryName}</p>
          <p className="mt-1 text-sm text-stone-600">
            {t(language, 'category.itemCount', { count: items.length })}
            {activeCount ? ` - ${t(language, 'category.selectedCount', { count: activeCount })}` : ''}
          </p>
        </div>
        <Motion.span animate={{ rotate: expanded ? 180 : 0 }} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/80 text-lg text-stone-700 shadow-sm">
          <IoChevronDown />
        </Motion.span>
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <Motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="border-t border-stone-100">
            <div className="space-y-3 px-4 py-4 sm:px-5">
              {items.map(({ item, entry }) => (
                <IngredientRow key={item.id} item={item} entry={entry} onChange={onChange} onEntryChange={onEntryChange} onAddEntry={onAddEntry} onRemoveEntry={onRemoveEntry} language={language} />
              ))}

              <div className="rounded-2xl border border-dashed border-amber-300/80 bg-amber-50/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-stone-900">{t(language, 'category.addManualItem')}</p>
                    <p className="mt-1 text-sm text-stone-600">{t(language, 'category.addManualItemDescription')}</p>
                  </div>
                  <button type="button" onClick={() => onManualItemAdd(category.id)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100">
                    <IoAdd className="text-base" />
                    {t(language, 'category.addItem')}
                  </button>
                </div>

                {manualItems.length ? (
                  <div className="mt-4 space-y-3">
                    {manualItems.map((manualItem) => (
                      <div key={manualItem.id} className="rounded-2xl border border-amber-200 bg-white p-3 shadow-[0_14px_34px_rgba(65,48,25,0.05)]">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{t(language, 'category.manualItem')}</p>
                          <button type="button" onClick={() => onManualItemRemove(category.id, manualItem.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:border-red-200 hover:text-red-600" aria-label={t(language, 'category.removeCustomItem', { category: category.name })}>
                            <IoTrashOutline />
                          </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px_110px] sm:items-center">
                          <label className="block">
                            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">{t(language, 'category.itemName')}</span>
                            <input type="text" value={manualItem.name} onChange={(event) => onManualItemChange(category.id, manualItem.id, 'name', event.target.value)} placeholder={t(language, 'category.itemNamePlaceholder')} className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white" />
                          </label>
                          <label className="block">
                            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">{t(language, 'category.quantity')}</span>
                            <input type="text" inputMode="decimal" pattern="[0-9]*[.]?[0-9]*" value={manualItem.quantity} onChange={(event) => onManualItemChange(category.id, manualItem.id, 'quantity', sanitizeQuantityValue(event.target.value))} placeholder="0" className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white" />
                          </label>
                          <label className="block">
                            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">{t(language, 'category.unit')}</span>
                            <select value={manualItem.unit} onChange={(event) => onManualItemChange(category.id, manualItem.id, 'unit', event.target.value)} className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white">
                              {UNIT_OPTIONS.map((unit) => (
                                <option key={unit} value={unit}>{getDisplayUnit(language, unit)}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-stone-500">{t(language, 'category.noManualItems')}</p>
                )}
              </div>
            </div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </Motion.section>
  )
}

export default CategorySection