import { AnimatePresence, motion as Motion } from 'framer-motion'
import { IoArrowBack, IoClose, IoDownloadOutline, IoLogoWhatsapp } from 'react-icons/io5'
import { formatDisplayDate } from '../utils/format'
import { getDisplayCategoryName, getDisplayItemName, getDisplayUnit, t } from '../utils/i18n'

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-1 text-sm text-stone-800">{value}</p>
    </div>
  )
}

function PreviewModal({ open, details, items, sections, onClose, onGeneratePdf, onShareWhatsApp, language }) {
  const notProvided = t(language, 'app.notProvided')

  return (
    <AnimatePresence>
      {open ? (
        <Motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="flex h-[94svh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[28px] bg-[#f6f2eb] sm:h-[90vh] sm:rounded-[30px]">
            <div className="flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">{t(language, 'preview.screen')}</p>
                <p className="mt-1 text-sm text-stone-600">{t(language, 'preview.reviewDescription')}</p>
              </div>
              <button type="button" onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-xl text-stone-700" aria-label={t(language, 'preview.close')}>
                <IoClose />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:overflow-hidden">
              <aside className="border-b border-stone-200 bg-white/75 p-4 lg:overflow-y-auto lg:border-b-0 lg:border-r">
                <div className="space-y-3">
                  <Motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onClose} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 text-sm font-medium text-stone-700">
                    <IoArrowBack className="text-lg" />
                    {t(language, 'preview.backToEdit')}
                  </Motion.button>
                  <Motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onGeneratePdf} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(38,29,19,0.24)]">
                    <IoDownloadOutline className="text-lg" />
                    {t(language, 'preview.downloadPdf')}
                  </Motion.button>
                  <Motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onShareWhatsApp} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(37,211,102,0.22)]">
                    <IoLogoWhatsapp className="text-lg" />
                    {t(language, 'preview.shareWhatsapp')}
                  </Motion.button>
                </div>
                <div className="mt-6 rounded-[24px] border border-stone-200 bg-[#fbfaf7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">{t(language, 'preview.sheetSummary')}</p>
                  <div className="mt-4 grid gap-3 text-sm text-stone-700">
                    <DetailRow label={t(language, 'preview.service')} value={details.cateringServiceName || notProvided} />
                    <DetailRow label={t(language, 'preview.chef')} value={details.chefName || notProvided} />
                    <DetailRow label={t(language, 'preview.contact')} value={details.contactNumber || notProvided} />
                    <DetailRow label={t(language, 'preview.event')} value={details.eventName || notProvided} />
                    <DetailRow label={t(language, 'preview.date')} value={formatDisplayDate(details.date)} />
                    <DetailRow label={t(language, 'preview.items')} value={t(language, 'app.activeLineItems', { count: items.length })} />
                  </div>
                </div>
              </aside>
              <div className="p-4 sm:p-6 lg:overflow-auto">
                <div className="mb-4 lg:hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">{t(language, 'preview.pdfPreview')}</p>
                  <p className="mt-1 text-sm text-stone-600">{t(language, 'preview.pdfPreviewDescription')}</p>
                </div>
                <div className="mx-auto w-full max-w-[210mm] rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_32px_80px_rgba(60,42,20,0.16)] sm:p-8">
                  <header className="border-b border-stone-200 pb-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">{t(language, 'preview.sheetTitle')}</p>
                    <h2 className="mt-3 font-display text-3xl leading-none text-stone-900 sm:text-4xl">{details.cateringServiceName || t(language, 'chefDetails.cateringServiceName')}</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <DetailRow label={t(language, 'preview.chefName')} value={details.chefName || notProvided} />
                      <DetailRow label={t(language, 'preview.contactNumber')} value={details.contactNumber || notProvided} />
                      <DetailRow label={t(language, 'preview.eventName')} value={details.eventName || notProvided} />
                      <DetailRow label={t(language, 'preview.date')} value={formatDisplayDate(details.date)} />
                    </div>
                  </header>
                  <section className="mt-6">
                    <div className="grid grid-cols-[minmax(0,1fr)_72px_64px] rounded-t-2xl bg-stone-100 px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-600 sm:grid-cols-[minmax(0,1fr)_88px_84px] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]">
                      <span>{t(language, 'preview.itemName')}</span>
                      <span>{t(language, 'preview.quantity')}</span>
                      <span>{t(language, 'preview.unit')}</span>
                    </div>
                    <div className="overflow-hidden rounded-b-2xl border border-t-0 border-stone-200">
                      {sections.map((section, sectionIndex) => (
                        <div key={section.id} className={sectionIndex !== sections.length - 1 ? 'border-b border-stone-200' : ''}>
                          <div className="bg-amber-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800 sm:px-4">
                            {getDisplayCategoryName(language, section.name)}
                          </div>
                          {section.items.map((item, index) => (
                            <div key={item.id} className={`grid grid-cols-[minmax(0,1fr)_72px_64px] px-3 py-3 text-xs text-stone-800 sm:grid-cols-[minmax(0,1fr)_88px_84px] sm:px-4 sm:text-sm ${index !== section.items.length - 1 ? 'border-b border-stone-200' : ''}`}>
                              <span className="pr-2 break-words">{getDisplayItemName(language, item.name)}</span>
                              <span>{item.quantity}</span>
                              <span>{getDisplayUnit(language, item.unit)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default PreviewModal