import { jsPDF } from 'jspdf'
import { formatDisplayDate, getSheetFileName } from './format'

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN_X = 18
const TOP_MARGIN = 20
const TABLE_HEADER_HEIGHT = 9
const ROW_HEIGHT = 8
const COL_ITEM = 110
const COL_QUANTITY = 32
const COL_UNIT = 32

const drawTableHeader = (doc, y) => {
  doc.setFillColor(238, 232, 224)
  doc.rect(MARGIN_X, y, COL_ITEM + COL_QUANTITY + COL_UNIT, TABLE_HEADER_HEIGHT, 'F')
  doc.setTextColor(55, 48, 41)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Item Name', MARGIN_X + 3, y + 6)
  doc.text('Quantity', MARGIN_X + COL_ITEM + 3, y + 6)
  doc.text('Unit', MARGIN_X + COL_ITEM + COL_QUANTITY + 3, y + 6)
}

const drawTableRow = (doc, y, item) => {
  doc.setDrawColor(230, 225, 218)
  doc.rect(MARGIN_X, y, COL_ITEM, ROW_HEIGHT)
  doc.rect(MARGIN_X + COL_ITEM, y, COL_QUANTITY, ROW_HEIGHT)
  doc.rect(MARGIN_X + COL_ITEM + COL_QUANTITY, y, COL_UNIT, ROW_HEIGHT)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(48, 43, 37)
  doc.text(item.name, MARGIN_X + 3, y + 5.4)
  doc.text(String(item.quantity), MARGIN_X + COL_ITEM + 3, y + 5.4)
  doc.text(item.unit, MARGIN_X + COL_ITEM + COL_QUANTITY + 3, y + 5.4)
}

export const buildPrepSheetPdf = ({ details, items }) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  doc.setFillColor(246, 242, 235)
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F')
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(10, 10, 190, 277, 6, 6, 'F')
  doc.setTextColor(71, 63, 55)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(details.cateringServiceName || 'Chef Prep Sheet', MARGIN_X, TOP_MARGIN)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Chef Prep Sheet', MARGIN_X, TOP_MARGIN + 6)
  doc.setDrawColor(214, 205, 196)
  doc.line(MARGIN_X, TOP_MARGIN + 10, PAGE_WIDTH - MARGIN_X, TOP_MARGIN + 10)

  const meta = [
    ['Chef Name', details.chefName || 'Not provided'],
    ['Contact Number', details.contactNumber || 'Not provided'],
    ['Event Name', details.eventName || 'Not provided'],
    ['Date', formatDisplayDate(details.date)],
  ]

  let currentY = TOP_MARGIN + 18
  meta.forEach(([label, value], index) => {
    const columnOffset = index % 2 === 0 ? 0 : 86
    if (index > 0 && index % 2 === 0) currentY += 14

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(112, 99, 88)
    doc.text(label.toUpperCase(), MARGIN_X + columnOffset, currentY)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(45, 39, 34)
    doc.setFontSize(11)
    doc.text(value, MARGIN_X + columnOffset, currentY + 5.6)
  })

  currentY += 18
  drawTableHeader(doc, currentY)
  currentY += TABLE_HEADER_HEIGHT

  items.forEach((item) => {
    if (currentY + ROW_HEIGHT > PAGE_HEIGHT - 20) {
      doc.addPage()
      doc.setFillColor(246, 242, 235)
      doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F')
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(10, 10, 190, 277, 6, 6, 'F')
      currentY = TOP_MARGIN
      drawTableHeader(doc, currentY)
      currentY += TABLE_HEADER_HEIGHT
    }

    drawTableRow(doc, currentY, item)
    currentY += ROW_HEIGHT
  })

  return {
    doc,
    blob: doc.output('blob'),
    fileName: getSheetFileName(details),
  }
}
