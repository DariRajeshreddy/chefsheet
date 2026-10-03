import { Fragment, memo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { IoAdd, IoRemove, IoTrashOutline } from 'react-icons/io5'
import { UNIT_OPTIONS } from '../data/ingredientCatalog'
import { getDisplayItemName, getDisplayUnit, t } from '../utils/i18n'

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

const adjustQuantityValue = (currentValue, delta) => {
  const parsed = Number.parseFloat(currentValue)

  if (Number.isNaN(parsed)) {
    return delta > 0 ? '1' : ''
  }

  const nextValue = Math.max(0, Math.round((parsed + delta) * 100) / 100)
  if (nextValue === 0) return ''
  return Number.isInteger(nextValue) ? String(nextValue) : String(nextValue)
}

const StepperButton = ({ onClick, disabled, children, label }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-xl text-stone-600 transition hover:border-amber-300 hover:text-amber-700 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-45 shadow-sm active:scale-95"
  >
    {children}
  </button>
)

function IngredientRow({ item, entry, onChange, onEntryChange, onAddEntry, onRemoveEntry, language }) {
  const [focusedField, setFocusedField] = useState('')
  const hasOptions = Boolean(item.sizeOptions?.length)
  const displayName = getDisplayItemName(language, item.name)

  if (item.allowMultipleEntries) {
    return (
      <Motion.article layout id={`ingredient-${item.id}`} className="rounded-[20px] bg-white p-4 ring-1 ring-stone-900/5 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-tight text-stone-900">{displayName}</p>
            <p className="mt-0.5 text-[13px] font-medium text-stone-500">{t(language, 'ingredient.addLinesDescription')}</p>
          </div>
          <button type="button" onClick={() => onAddEntry(item.id)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 text-xs font-medium text-amber-800 transition hover:bg-amber-100">
            <IoAdd className="text-sm" />
            {t(language, 'ingredient.add')}
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {entry.entries.map((line, index) => {
            const isCustomOption = line.option === '__custom__'

            return (
              <Fragment key={line.id}>
                <div className="rounded-[16px] border border-stone-900/5 bg-stone-50/30 px-3.5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">{t(language, 'ingredient.line', { count: index + 1 })}</p>
                    {entry.entries.length > 1 ? (
                      <button type="button" onClick={() => onRemoveEntry(item.id, line.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:border-red-200 hover:text-red-600" aria-label={t(language, 'ingredient.removeLine', { item: item.name, count: index + 1 })}>
                        <IoTrashOutline />
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1">
                      <StepperButton onClick={() => onEntryChange(item.id, line.id, 'quantity', adjustQuantityValue(line.quantity, -1))} disabled={!line.quantity} label={`Decrease ${item.name}`}>
                        <IoRemove />
                      </StepperButton>
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*[.]?[0-9]*"
                        value={line.quantity}
                        onChange={(event) => onEntryChange(item.id, line.id, 'quantity', sanitizeQuantityValue(event.target.value))}
                        onFocus={() => setFocusedField(`quantity-${line.id}`)}
                        onBlur={() => setFocusedField('')}
                        placeholder="0"
                        className="h-11 w-20 rounded-xl border border-stone-200 bg-white px-2 text-center text-base font-semibold text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                      />
                      <StepperButton onClick={() => onEntryChange(item.id, line.id, 'quantity', adjustQuantityValue(line.quantity, 1))} label={`Increase ${item.name}`}>
                        <IoAdd />
                      </StepperButton>
                    </div>

                    <div className="flex h-11 items-center gap-1 rounded-xl border border-stone-200 bg-stone-100/80 p-1 shadow-inner">
                      {UNIT_OPTIONS.map((unit) => {
                        const isSelected = line.unit === unit
                        return (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => onEntryChange(item.id, line.id, 'unit', unit)}
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

                    {hasOptions ? (
                      <select value={line.option} onChange={(event) => onEntryChange(item.id, line.id, 'option', event.target.value)} onFocus={() => setFocusedField(`option-${line.id}`)} onBlur={() => setFocusedField('')} className="h-11 min-w-[130px] rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm">
                        <option value="">{item.optionLabel}</option>
                        {item.sizeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                        {item.allowCustomOption ? <option value="__custom__">{t(language, 'ingredient.other')}</option> : null}
                      </select>
                    ) : null}
                  </div>

                  {hasOptions && isCustomOption ? (
                    <input
                      type="text"
                      value={line.customOption}
                      onChange={(event) => onEntryChange(item.id, line.id, 'customOption', event.target.value)}
                      onFocus={() => setFocusedField(`custom-${line.id}`)}
                      onBlur={() => setFocusedField('')}
                      placeholder={item.customOptionPlaceholder}
                      className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                    />
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
    <Motion.article layout id={`ingredient-${item.id}`} animate={{ scale: focusedField ? 1.01 : 1, y: focusedField ? -2 : 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="rounded-[20px] bg-white p-4 ring-1 ring-stone-900/5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold tracking-tight text-stone-900">{displayName}</p>
          <p className="mt-0.5 text-[13px] font-medium text-stone-500">{hasOptions ? t(language, 'ingredient.variantHint') : t(language, 'ingredient.predefined')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="inline-flex items-center gap-1">
            <StepperButton onClick={() => onChange(item.id, 'quantity', adjustQuantityValue(entry.quantity, -1))} disabled={!entry.quantity} label={`Decrease ${item.name}`}>
              <IoRemove />
            </StepperButton>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.]?[0-9]*"
              value={entry.quantity}
              onChange={(event) => onChange(item.id, 'quantity', sanitizeQuantityValue(event.target.value))}
              onFocus={() => setFocusedField('quantity')}
              onBlur={() => setFocusedField('')}
              placeholder="0"
              className="h-11 w-20 rounded-xl border border-stone-200 bg-white px-2 text-center text-base font-semibold text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
            />
            <StepperButton onClick={() => onChange(item.id, 'quantity', adjustQuantityValue(entry.quantity, 1))} label={`Increase ${item.name}`}>
              <IoAdd />
            </StepperButton>
          </div>

          <div className="flex h-11 items-center gap-1 rounded-xl border border-stone-200 bg-stone-100/80 p-1 shadow-inner">
            {UNIT_OPTIONS.map((unit) => {
              const isSelected = entry.unit === unit
              return (
                <button
                  key={unit}
                  type="button"
                  onClick={() => onChange(item.id, 'unit', unit)}
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

          {hasOptions ? (
            <select value={entry.option} onChange={(event) => onChange(item.id, 'option', event.target.value)} onFocus={() => setFocusedField('option')} onBlur={() => setFocusedField('')} className="h-11 min-w-[130px] rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm">
              <option value="">{item.optionLabel}</option>
              {item.sizeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
              {item.allowCustomOption ? <option value="__custom__">{t(language, 'ingredient.other')}</option> : null}
            </select>
          ) : null}
        </div>
      </div>

      {hasOptions && isCustomOption ? (
        <input
          type="text"
          value={entry.customOption}
          onChange={(event) => onChange(item.id, 'customOption', event.target.value)}
          onFocus={() => setFocusedField('customOption')}
          onBlur={() => setFocusedField('')}
          placeholder={item.customOptionPlaceholder}
          className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-base text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
        />
      ) : null}
    </Motion.article>
  )
}

export default memo(IngredientRow)