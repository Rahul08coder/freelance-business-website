// Chhupe control characters (null byte jaise). Tab aur line break yahan nahi hain.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const LINE_BREAKS = /[\r\n\t]+/g

// Single-line fields: control chars hatao, line break ko space banao.
// undefined/null ko '' maante hain, taaki "required" ka saaf message mile.
export function cleanLine(value) {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') return value // galat type: Zod reject karega
  return value.replace(CONTROL_CHARS, '').replace(LINE_BREAKS, ' ')
}

// Multi-line fields: line break rehne do, control chars hatao.
export function cleanMultiline(value) {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') return value
  return value.replace(CONTROL_CHARS, '')
}