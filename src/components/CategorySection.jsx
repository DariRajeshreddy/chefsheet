import { AnimatePresence, motion as Motion } from 'framer-motion'
import { IoChevronDown } from 'react-icons/io5'
import IngredientRow from './IngredientRow'

function CategorySection({ category, items, activeCount, isOpen, onToggle, onChange, onEntryChange, onAddEntry, onRemoveEntry, forceOpen }) {
  const expanded = forceOpen || isOpen

  return (
    <Motion.section layout className="overflow-hidden rounded-[28px] border border-stone-200/80 bg-white/70 shadow-[0_20px_40px_rgba(56,41,20,0.08)] backdrop-blur">
      <button type="button" onClick={() => !forceOpen && onToggle(category.id)} className="relative flex w-full items-center justify-between gap-4 overflow-hidden px-5 py-4 text-left sm:px-6">
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${category.accent}`} />
        <div className="relative">
          <p className="text-lg font-semibold text-stone-900">{category.name}</p>
          <p className="mt-1 text-sm text-stone-600">{items.length} items{activeCount ? ` - ${activeCount} selected` : ''}</p>
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
                <IngredientRow key={item.id} item={item} entry={entry} onChange={onChange} onEntryChange={onEntryChange} onAddEntry={onAddEntry} onRemoveEntry={onRemoveEntry} />
              ))}
            </div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </Motion.section>
  )
}

export default CategorySection
