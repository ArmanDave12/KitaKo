export function countWorkdaysFromISOStrings(startISO, endISO) {
  const start = new Date(startISO)
  const end = new Date(endISO)
  let count = 0
  const currentDate = new Date(start)
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0) {
      count++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return count
}

export function formatDateISO(date = new Date()) {
  const dateWithOffset = new Date(date)
  dateWithOffset.setHours(dateWithOffset.getHours() + 8)
  const isoString = dateWithOffset.toISOString()
  return isoString.replace(/\.\d{3}Z$/, (match) => {
    return match.replace('Z', '000Z')
  })
}

export const mensahe = {
  section: (title, ...args) => {
    console.log('')
    console.log('─'.repeat(150))
    console.log(title, ...args)
  },

  end: () => {
    console.log('─'.repeat(150))
    console.log('')
  },

  divider: () => console.log('┈'.repeat(150)),

  success: (msg, ...args) => console.log(`🟢 ${msg}`, ...args),
  error: (msg, ...args) => console.error(`🔴 ${msg}`, ...args),
  warning: (msg, ...args) => console.log(`⚠️  ${msg}`, ...args),
  info: (msg, ...args) => console.log(`ℹ️  ${msg}`, ...args),
  process: (msg, ...args) => console.log(`⚙️  ${msg}`, ...args),

  highlight: (text) => `\x1b[33m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
}
