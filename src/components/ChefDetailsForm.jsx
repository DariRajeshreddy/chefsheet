import { getChefFieldLabel, getChefFieldPlaceholder, t } from '../utils/i18n'

export const chefDetailFields = [
  { key: 'chefName', required: true, type: 'text' },
  { key: 'contactNumber', required: true, type: 'tel' },
  { key: 'cateringServiceName', required: true, type: 'text' },
  { key: 'eventName', required: false, type: 'text' },
  { key: 'date', required: false, type: 'date' },
]

const getTodayInputValue = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().split('T')[0]
}

function ChefDetailsForm({ values, onChange, missingFieldKeys = [], language }) {
  const minDate = getTodayInputValue()

  return (
    <section id="chef-details-section" className="rounded-[30px] border border-stone-200/80 bg-white/80 p-5 shadow-[0_22px_44px_rgba(60,45,24,0.08)] backdrop-blur sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">{t(language, 'chefDetails.eyebrow')}</p>
        <h2 className="mt-2 font-display text-3xl text-stone-900">{t(language, 'chefDetails.title')}</h2>
        <p className="mt-2 text-sm text-stone-600">{t(language, 'chefDetails.description')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {chefDetailFields.map((field) => {
          const isMissing = missingFieldKeys.includes(field.key)

          return (
            <label key={field.key} className="block">
              <span className="mb-2 block text-sm font-medium text-stone-700">
                {getChefFieldLabel(language, field.key)}
                {field.required ? <span className="ml-1 text-amber-700">*</span> : null}
              </span>
              <input
                id={`chef-detail-${field.key}`}
                type={field.type}
                min={field.key === 'date' ? minDate : undefined}
                value={values[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                placeholder={getChefFieldPlaceholder(language, field.key)}
                className={`h-13 w-full rounded-2xl border px-4 text-base text-stone-800 outline-none transition focus:bg-white ${
                  isMissing
                    ? 'border-amber-400 bg-amber-50/60 focus:border-amber-500'
                    : 'border-stone-200 bg-stone-50 focus:border-amber-400'
                }`}
              />
            </label>
          )
        })}
      </div>
    </section>
  )
}

export default ChefDetailsForm