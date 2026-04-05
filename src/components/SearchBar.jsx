import { IoCloseCircle, IoSearchOutline } from 'react-icons/io5'

function SearchBar({ value, onChange, pending }) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-stone-400">
        <IoSearchOutline />
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search ingredients or spices"
        className="h-14 w-full rounded-2xl border border-stone-200 bg-white pl-12 pr-12 text-[15px] text-stone-700 shadow-[0_14px_30px_rgba(48,34,16,0.07)] outline-none transition duration-200 placeholder:text-stone-400 focus:border-amber-400 focus:shadow-[0_18px_40px_rgba(174,119,34,0.18)]"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xl text-stone-400 transition hover:text-stone-600"
          aria-label="Clear search"
        >
          <IoCloseCircle />
        </button>
      ) : null}
      {pending ? <span className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-amber-500/70" /> : null}
    </label>
  )
}

export default SearchBar
