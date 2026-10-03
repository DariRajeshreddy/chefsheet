import { AnimatePresence, motion as Motion } from 'framer-motion'
import { IoAdd, IoChevronDown, IoFolderOpenOutline, IoFolderOutline, IoTrashOutline } from 'react-icons/io5'
import { UNIT_OPTIONS } from '../data/ingredientCatalog'
import { getDisplayCategoryName, getDisplayUnit, t } from '../utils/i18n'
import IngredientRow from './IngredientRow'

const sanitizeQuantityValue = (rawValue) => {
  const normalizedValue = rawValue.replace(/,/g, '.').replace(/[^\d.]/g, '')
  const [integerPart = '', ...decimalParts] = normalizedValue.split('.')
  
  if (!normalizedValue) return ''
  
  if (decimalParts.length > 0) {
    const decimalPart = decimalParts.join('')
    const intPart = integerPart || '0'
    return `${intPart}.${decimalPart}`
  }
  
  return integerPart
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
    <Motion.section layout className="mb-4 overflow-hidden rounded-[28px] bg-white/70 backdrop-blur-xl ring-1 ring-stone-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <button type="button" onClick={() => !forceOpen && onToggle(category.id)} className="group flex w-full items-center justify-between gap-4 bg-white/90 px-5 py-4 text-left transition-colors hover:bg-white">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 shadow-sm ring-1 ring-amber-200/50">
            {expanded ? <IoFolderOpenOutline className="text-[22px]" /> : <IoFolderOutline className="text-[22px]" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold tracking-tight text-stone-900">{displayCategoryName}</p>
            <p className="mt-0.5 text-[13px] font-medium text-stone-500">
              {t(language, 'category.itemCount', { count: items.length })}
              {activeCount ? <span className="text-amber-600"> • {t(language, 'category.selectedCount', { count: activeCount })} selected</span> : ''}
            </p>
          </div>
        </div>
        <Motion.span animate={{ rotate: expanded ? 180 : 0 }} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-50 text-stone-500 ring-1 ring-stone-900/5 transition-colors group-hover:bg-stone-100 group-hover:text-stone-700">
          <IoChevronDown className="text-base" />
        </Motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <Motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="border-t border-stone-900/5 bg-stone-50/30">
            <div className="px-4 py-4">
              <div className="space-y-3">
                {items.map(({ item, entry }) => (
                  <IngredientRow key={item.id} item={item} entry={entry} onChange={onChange} onEntryChange={onEntryChange} onAddEntry={onAddEntry} onRemoveEntry={onRemoveEntry} language={language} />
                ))}
              </div>

              <div className="mt-5 border-t border-dashed border-amber-200/60 pt-4">
                <div className="flex items-center justify-between gap-3 px-1">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{t(language, 'category.manualItem')}</p>
                    <p className="mt-0.5 text-[13px] text-stone-500">{t(language, 'category.addManualItemDescription')}</p>
                  </div>
                  <button type="button" onClick={() => onManualItemAdd(category.id)} className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-amber-300/50 bg-amber-50/80 px-4 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 shadow-sm active:scale-95">
                    <IoAdd className="text-lg" />
                    {t(language, 'category.addItem')}
                  </button>
                </div>

                {manualItems.length ? (
                  <div className="mt-4 space-y-3">
                    {manualItems.map((manualItem) => (
                      <div key={manualItem.id} className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-stone-900/5 transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between gap-3">
                          <input type="text" value={manualItem.name} onChange={(event) => onManualItemChange(category.id, manualItem.id, 'name', event.target.value)} placeholder={t(language, 'category.itemNamePlaceholder')} className="h-11 min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm" />
                          <button type="button" onClick={() => onManualItemRemove(category.id, manualItem.id)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-lg text-stone-500 transition hover:border-red-200 hover:text-red-600 hover:bg-red-50 shadow-sm active:scale-95" aria-label={t(language, 'category.removeCustomItem', { category: category.name })}>
                            <IoTrashOutline />
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <input type="text" inputMode="decimal" pattern="[0-9]*[.]?[0-9]*" value={manualItem.quantity} onChange={(event) => onManualItemChange(category.id, manualItem.id, 'quantity', sanitizeQuantityValue(event.target.value))} placeholder="0" className="h-11 w-20 rounded-xl border border-stone-200 bg-white px-2 text-center text-base font-semibold text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm" />
                          <div className="flex h-11 items-center gap-1 rounded-xl border border-stone-200 bg-stone-100/80 p-1 shadow-inner">
                            {UNIT_OPTIONS.map((unit) => {
                              const isSelected = manualItem.unit === unit
                              return (
                                <button
                                  key={unit}
                                  type="button"
                                  onClick={() => onManualItemChange(category.id, manualItem.id, 'unit', unit)}
                                  className={`flex h-full items-center justify-center rounded-lg px-3 text-[15px] font-medium transition-all ${
                                    isSelected
                                      ? 'bg-white text-stone-800 shadow-[0_1px_3px_rgba(0,0,0,0.1)] ring-1 ring-black/5'
                                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
                                  }`}
                                >
                                  {getDisplayUnit(language, unit)}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-stone-500">{t(language, 'category.noManualItems')}</p>
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