import { Fragment, memo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { IoAdd, IoTrashOutline } from 'react-icons/io5'
import { UNIT_OPTIONS } from '../data/ingredientCatalog'

const sanitizeQuantityValue = (rawValue) => {
  const normalizedValue = rawValue.replace(/,/g, '.').replace(/[^\d.]/g, '')
  const [integerPart = '', ...decimalParts] = normalizedValue.split('.')
  const decimalPart = decimalParts.join('')

  if (!normalizedValue) return ''
  if (normalizedValue.startsWith('.')) return `0.${decimalPart}`
  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart
}

function IngredientRow({ item, entry, onChange, onEntryChange, onAddEntry, onRemoveEntry }) {
  const [focusedField, setFocusedField] = useState('')
  const hasOptions = Boolean(item.sizeOptions?.length)

  if (item.allowMultipleEntries) {
    return (
      <Motion.article layout id={`ingredient-${item.id}`} className="rounded-2xl border border-stone-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(65,48,25,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-stone-800">{item.name}</p>
            <p className="mt-1 text-xs text-stone-500">Add separate lines for each size or variant needed.</p>
          </div>
          <button type="button" onClick={() => onAddEntry(item.id)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100">
            <IoAdd className="text-base" />
            Add
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {entry.entries.map((line, index) => {
            const isCustomOption = line.option === '__custom__'

            return (
              <Fragment key={line.id}>
                <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Line {index + 1}</p>
                    {entry.entries.length > 1 ? (
                      <button type="button" onClick={() => onRemoveEntry(item.id, line.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:border-red-200 hover:text-red-600" aria-label={`Remove ${item.name} line ${index + 1}`}>
                        <IoTrashOutline />
                      </button>
                    ) : null}
                  </div>
                  <div className={`grid gap-3 sm:items-center ${hasOptions ? 'sm:grid-cols-[120px_150px_110px]' : 'sm:grid-cols-[120px_110px]'}`}>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Quantity</span>
                      <input type="text" inputMode="decimal" pattern="[0-9]*[.]?[0-9]*" value={line.quantity} onChange={(event) => onEntryChange(item.id, line.id, 'quantity', sanitizeQuantityValue(event.target.value))} onFocus={() => setFocusedField(`quantity-${line.id}`)} onBlur={() => setFocusedField('')} placeholder="0" className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400" />
                    </label>
                    {hasOptions ? (
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">{item.optionLabel}</span>
                        <select value={line.option} onChange={(event) => onEntryChange(item.id, line.id, 'option', event.target.value)} onFocus={() => setFocusedField(`option-${line.id}`)} onBlur={() => setFocusedField('')} className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400">
                          <option value="">Select</option>
                          {item.sizeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                          {item.allowCustomOption ? <option value="__custom__">Other</option> : null}
                        </select>
                      </label>
                    ) : null}
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Unit</span>
                      <select value={line.unit} onChange={(event) => onEntryChange(item.id, line.id, 'unit', event.target.value)} onFocus={() => setFocusedField(`unit-${line.id}`)} onBlur={() => setFocusedField('')} className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400">
                        {UNIT_OPTIONS.map((unit) => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {hasOptions && isCustomOption ? (
                    <label className="mt-3 block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Custom Size</span>
                      <input type="text" value={line.customOption} onChange={(event) => onEntryChange(item.id, line.id, 'customOption', event.target.value)} onFocus={() => setFocusedField(`custom-${line.id}`)} onBlur={() => setFocusedField('')} placeholder={item.customOptionPlaceholder} className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400" />
                    </label>
                  ) : null}
                </div>
              </Fragment>
            )
          })}
        </div>
      </Motion.article>
    )
  }

  const isCustomOption = entry.option === '__custom__'

  return (
    <Motion.article layout id={`ingredient-${item.id}`} animate={{ scale: focusedField ? 1.01 : 1, y: focusedField ? -1 : 0 }} transition={{ duration: 0.16, ease: 'easeOut' }} className="rounded-2xl border border-stone-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(65,48,25,0.06)]">
      <div className={`grid gap-3 sm:items-center ${hasOptions ? 'sm:grid-cols-[minmax(0,1fr)_120px_110px_150px]' : 'sm:grid-cols-[minmax(0,1fr)_110px_96px]'}`}>
        <div>
          <p className="text-base font-semibold text-stone-800">{item.name}</p>
          <p className="mt-1 text-xs text-stone-500">{hasOptions ? 'Choose quantity and size for this utensil' : 'Predefined ingredient'}</p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Quantity</span>
          <input type="text" inputMode="decimal" pattern="[0-9]*[.]?[0-9]*" value={entry.quantity} onChange={(event) => onChange(item.id, 'quantity', sanitizeQuantityValue(event.target.value))} onFocus={() => setFocusedField('quantity')} onBlur={() => setFocusedField('')} placeholder="0" className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white" />
        </label>
        {hasOptions ? (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">{item.optionLabel}</span>
            <select value={entry.option} onChange={(event) => onChange(item.id, 'option', event.target.value)} onFocus={() => setFocusedField('option')} onBlur={() => setFocusedField('')} className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white">
              <option value="">Select</option>
              {item.sizeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
              {item.allowCustomOption ? <option value="__custom__">Other</option> : null}
            </select>
          </label>
        ) : null}
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Unit</span>
          <select value={entry.unit} onChange={(event) => onChange(item.id, 'unit', event.target.value)} onFocus={() => setFocusedField('unit')} onBlur={() => setFocusedField('')} className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white">
            {UNIT_OPTIONS.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </label>
      </div>
      {hasOptions && isCustomOption ? (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Custom Size</span>
          <input type="text" value={entry.customOption} onChange={(event) => onChange(item.id, 'customOption', event.target.value)} onFocus={() => setFocusedField('customOption')} onBlur={() => setFocusedField('')} placeholder={item.customOptionPlaceholder} className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:bg-white" />
        </label>
      ) : null}
    </Motion.article>
  )
}

export default memo(IngredientRow)
