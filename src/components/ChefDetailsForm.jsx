export const chefDetailFields = [
  { key: 'chefName', label: 'Chef Name', placeholder: 'Chef S. Kumar', required: true, type: 'text' },
  { key: 'contactNumber', label: 'Contact Number', placeholder: '98765 43210', required: true, type: 'tel' },
  { key: 'cateringServiceName', label: 'Catering Service Name', placeholder: 'Royal Feast Caterers', required: true, type: 'text' },
  { key: 'eventName', label: 'Event Name', placeholder: 'Reception Dinner', required: false, type: 'text' },
  { key: 'date', label: 'Date', placeholder: '', required: false, type: 'date' },
]

const getTodayInputValue = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().split('T')[0]
}

function ChefDetailsForm({ values, onChange, missingFieldKeys = [] }) {
  const minDate = getTodayInputValue()

  return (
    <section id="chef-details-section" className="rounded-[30px] border border-stone-200/80 bg-white/80 p-5 shadow-[0_22px_44px_rgba(60,45,24,0.08)] backdrop-blur sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Chef Details</p>
        <h2 className="mt-2 font-display text-3xl text-stone-900">Print-ready header information</h2>
        <p className="mt-2 text-sm text-stone-600">These details appear at the top of the preview and the exported PDF.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {chefDetailFields.map((field) => {
          const isMissing = missingFieldKeys.includes(field.key)

          return (
            <label key={field.key} className="block">
              <span className="mb-2 block text-sm font-medium text-stone-700">
                {field.label}
                {field.required ? <span className="ml-1 text-amber-700">*</span> : null}
              </span>
              <input
                id={`chef-detail-${field.key}`}
                type={field.type}
                min={field.key === 'date' ? minDate : undefined}
                value={values[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                placeholder={field.placeholder}
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
