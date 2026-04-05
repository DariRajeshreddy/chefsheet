import { motion as Motion } from 'framer-motion'
import { IoEyeOutline, IoRefreshOutline } from 'react-icons/io5'
import { t } from '../utils/i18n'

function PDFGenerator({ activeCount, onPreview, onClear, disabled, language }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-stone-200/70 bg-[rgba(248,244,237,0.86)] px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-[26px] sm:border sm:px-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">{t(language, 'pdfBar.readyToReview')}</p>
          <p className="mt-1 text-sm text-stone-700">{t(language, 'pdfBar.activeItemsCount', { count: activeCount, suffix: activeCount === 1 ? '' : 's' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Motion.button type="button" whileTap={{ scale: 0.96 }} onClick={onClear} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 text-sm font-medium text-stone-700 transition hover:border-stone-400">
            <IoRefreshOutline className="text-lg" />
            {t(language, 'pdfBar.reset')}
          </Motion.button>
          <Motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onPreview} disabled={disabled} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-stone-900 px-5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(38,29,19,0.24)] transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none">
            <IoEyeOutline className="text-lg" />
            {t(language, 'pdfBar.generatePdf')}
          </Motion.button>
        </div>
      </div>
    </div>
  )
}

export default PDFGenerator