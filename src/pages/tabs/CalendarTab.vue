<template>
  <div class="calendar-container">
    <!-- Header with Month Navigation -->
    <div class="calendar-header">
      <div class="month-navigation">
        <div class="month-display">{{ formatMonthHeader() }}</div>
      </div>
      <div class="header-actions">
        <q-btn
          flat
          round
          dense
          color="kitako-neon"
          icon="sync"
          @click="loadDefaultHolidays"
          size="sm"
          class="q-mr-xs"
        />
        <q-btn
          flat
          round
          dense
          color="kitako-neon"
          icon="list"
          @click="openManageDialog"
          size="sm"
        />
      </div>
    </div>

    <!-- Simple Calendar View -->
    <div class="calendar-grid">
      <!-- Calendar header with days of week -->
      <div class="calendar-days-header">
        <div class="day-header" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      </div>

      <!-- Calendar dates -->
      <div class="calendar-dates">
        <!-- Empty cells for offset -->
        <div class="date-cell empty-cell" v-for="n in firstDayOffset" :key="'empty-' + n"></div>

        <!-- Actual date cells - Now Clickable -->
        <div
          v-for="date in daysInMonth"
          :key="date"
          class="date-cell"
          :class="{
            'today-cell': isToday(date),
            'has-holiday': hasHoliday(date),
            'regular-holiday': holidayType(date) === 'regular',
            'special-holiday': holidayType(date) === 'special',
          }"
          @click="selectDate(date)"
        >
          {{ date }}
        </div>
      </div>
    </div>
    <!-- Add Holiday Dialog - Appears when clicking a date -->
    <q-dialog v-model="showAddDialog" persistent position="bottom">
      <q-card class="holiday-dialog">
        <q-bar class="dialog-header">
          <div class="dialog-title">
            <q-icon name="event_available" size="18px" class="q-mr-xs" />
            Add Holiday for {{ formatSelectedDate() }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <!-- Add Holiday Form -->
        <q-card-section class="q-pa-sm">
          <q-form @submit="addHoliday" class="holiday-form">
            <q-input
              v-model="newHoliday.name"
              label="Holiday Name"
              outlined
              dense
              dark
              color="kitako-neon"
              class="form-input"
              :rules="[(val) => !!val || 'Name is required']"
              autofocus
            />

            <q-select
              v-model="newHoliday.type"
              :options="holidayTypes"
              label="Holiday Type"
              outlined
              dense
              dark
              color="kitako-neon"
              class="form-input q-mt-sm"
              emit-value
              map-options
              behavior="menu"
            />

            <q-toggle
              v-model="newHoliday.attended"
              label="I worked during this holiday"
              color="kitako-neon"
              dark
              class="form-toggle q-mt-sm"
            />

            <div class="form-actions q-mt-md">
              <q-btn
                type="submit"
                color="kitako-neon"
                label="Add Holiday"
                unelevated
                class="submit-btn"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Single Holiday Dialog -->
    <q-dialog v-model="showEditDialog" persistent position="bottom">
      <q-card class="holiday-dialog" v-if="currentHoliday">
        <q-bar class="dialog-header">
          <div class="dialog-title">
            <q-icon name="event_available" size="18px" class="q-mr-xs" />
            Edit Holiday: {{ formatDateDisplay(currentHoliday.date) }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <!-- Edit Holiday Form -->
        <q-card-section class="q-pa-sm">
          <q-form @submit="updateHoliday" class="holiday-form">
            <q-input
              v-model="currentHoliday.name"
              label="Holiday Name"
              outlined
              dense
              dark
              color="kitako-neon"
              class="form-input"
              :rules="[(val) => !!val || 'Name is required']"
              autofocus
            />

            <div class="holiday-type-toggle q-my-sm">
              <q-badge
                :color="currentHoliday.type === 'regular' ? 'positive' : 'grey-7'"
                clickable
                class="type-badge q-mr-xs"
                @click="currentHoliday.type = 'regular'"
                label="Regular"
                size="md"
              />
              <q-badge
                :color="currentHoliday.type === 'special' ? 'warning' : 'grey-7'"
                clickable
                class="type-badge"
                @click="currentHoliday.type = 'special'"
                label="Special"
                size="md"
              />
            </div>

            <q-toggle
              v-model="currentHoliday.attended"
              label="I worked during this holiday"
              color="kitako-neon"
              dark
              class="form-toggle q-mt-sm"
            />

            <div class="form-actions q-mt-md">
              <q-btn
                flat
                color="negative"
                label="Delete"
                class="q-mr-sm"
                @click="deleteCurrentHoliday"
              />
              <q-btn
                type="submit"
                color="kitako-neon"
                label="Save Changes"
                unelevated
                class="submit-btn"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Manage Holidays Dialog -->
    <q-dialog v-model="showManageDialog" persistent position="bottom" @hide="onManageDialogClose">
      <q-card class="holiday-dialog">
        <q-bar class="dialog-header">
          <div class="dialog-title">
            <q-icon name="event_available" size="18px" class="q-mr-xs" />
            Manage Holidays {{ selectedDateNum ? '- ' + formatSelectedDate() : '' }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <!-- Holiday List in Dialog -->
        <q-card-section class="dialog-body q-pa-sm">
          <q-scroll-area style="height: 200px" class="holiday-scroll">
            <q-list separator dark dense>
              <q-item
                v-for="holiday in filteredHolidays"
                :key="holiday.id"
                class="holiday-item-dialog"
              >
                <q-item-section>
                  <q-item-label class="dialog-holiday-text">
                    {{ formatDateDisplay(holiday.date) }} - {{ holiday.name }}
                  </q-item-label>
                  <q-item-label caption class="dialog-holiday-subtext">
                    <div class="holiday-type-toggle">
                      <q-badge
                        :color="holiday.type === 'regular' ? 'positive' : 'grey-7'"
                        clickable
                        class="type-badge q-mr-xs"
                        @click="toggleHolidayType(holiday, 'regular')"
                        label="Regular"
                        size="xs"
                      />
                      <q-badge
                        :color="holiday.type === 'special' ? 'warning' : 'grey-7'"
                        clickable
                        class="type-badge"
                        @click="toggleHolidayType(holiday, 'special')"
                        label="Special"
                        size="xs"
                      />
                    </div>
                    {{ holiday.attended ? '- Worked' : '' }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row">
                    <q-btn
                      flat
                      dense
                      round
                      icon="check_circle"
                      :color="holiday.attended ? 'positive' : 'grey-7'"
                      size="sm"
                      class="q-mr-xs"
                      @click="toggleHolidayAttendance(holiday)"
                    />
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      size="sm"
                      @click="deleteHoliday(holiday.id)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Default Holidays Dialog -->
    <q-dialog v-model="showDefaultsDialog" persistent position="bottom">
      <q-card class="holiday-dialog">
        <q-bar class="dialog-header">
          <div class="dialog-title">
            <q-icon name="event" size="18px" class="q-mr-xs" />
            Load Philippine Holidays
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-card-section class="q-pa-md">
          <div class="text-white q-mb-md">
            This will load the standard Philippine holidays for
            <strong>{{ currentYear }}</strong
            >.
          </div>

          <q-checkbox
            v-model="overwriteExisting"
            label="Replace existing holidays"
            color="kitako-neon"
            dark
            class="q-mb-md"
          />

          <div class="row justify-end q-mt-lg">
            <q-btn flat color="grey-7" label="Cancel" v-close-popup class="q-mr-sm" />
            <q-btn
              unelevated
              color="kitako-neon"
              label="Load Holidays"
              @click="loadDefaultHolidays"
              :loading="isLoading"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
// Import dependencies
import { ref, computed, watch, onMounted, nextTick } from 'vue'
// Import the holidays data from a separate file - renamed to holidaysData to avoid conflict
import { holidays as holidaysData, variableDates, companyOverrides } from '../../json/holidays.js'

// Define props with default values
const props = defineProps({
  selectedMonth: { type: Date, required: true },
  selectedMonthStr: { type: String, required: true },
  dailyRate: { type: Number, required: true },
})

// Define emits
const emit = defineEmits(['update:holidayPay', 'update:selectedMonth', 'update:selectedMonthStr'])

// UI state
const showAddDialog = ref(false)
const showManageDialog = ref(false)
const showDefaultsDialog = ref(false)
const showEditDialog = ref(false) // NEW: for editing a single holiday
const overwriteExisting = ref(false)
const isLoading = ref(false)
const lastAction = ref('Component initialized')

// Data - renamed holidays to holidaysList to avoid naming conflict
const holidaysList = ref([])
const holidayDatesMap = ref({})
const selectedDateNum = ref(null)
const currentHoliday = ref(null) // NEW: for editing a single holiday

// Holiday form
const newHoliday = ref({
  id: '',
  name: '',
  date: '',
  type: 'regular',
  attended: false,
})

// Constants
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const holidayTypes = [
  {
    label: 'Regular Holiday',
    value: 'regular',
    description: 'Double pay if worked, with pay if not',
  },
  {
    label: 'Special Holiday',
    value: 'special',
    description: '30% additional if worked, no pay if not',
  },
]

// Get current year
const currentYear = computed(() => {
  return new Date().getFullYear()
})

// First day of the selected month
const firstDayOfMonth = computed(() => {
  const [year, month] = props.selectedMonthStr.split('-').map(Number)
  return new Date(year, month - 1, 1)
})

// Day of week for the first day (0-6, where 0 is Sunday)
const firstDayOffset = computed(() => {
  return firstDayOfMonth.value.getDay()
})

// Number of days in the month
const daysInMonth = computed(() => {
  const [year, month] = props.selectedMonthStr.split('-').map(Number)
  return new Date(year, month, 0).getDate()
})

// Holidays sorted by date
const sortedHolidays = computed(() => {
  return [...holidaysList.value].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA - dateB
  })
})

// NEW: Filtered holidays based on selected date
const filteredHolidays = computed(() => {
  if (!selectedDateNum.value) return sortedHolidays.value

  const dateStr = getDateStringFromNum(selectedDateNum.value)
  return holidaysList.value.filter((h) => {
    const holidayDate = new Date(h.date)
    const selectedDate = new Date(dateStr)
    return (
      holidayDate.getFullYear() === selectedDate.getFullYear() &&
      holidayDate.getMonth() === selectedDate.getMonth() &&
      holidayDate.getDate() === selectedDate.getDate()
    )
  })
})

// Holidays for the current month
const holidaysInSelectedMonth = computed(() => {
  const [year, month] = props.selectedMonthStr.split('-').map(Number)
  return holidaysList.value.filter((holiday) => {
    const holidayDate = new Date(holiday.date)
    return holidayDate.getFullYear() === year && holidayDate.getMonth() + 1 === month
  })
})

// Check if there are holidays in the month
const hasHolidaysInMonth = computed(() => {
  return holidaysInSelectedMonth.value.length > 0
})

// Calculate holiday pay impact
const holidayPayImpact = computed(() => {
  let totalImpact = 0

  holidaysInSelectedMonth.value.forEach((holiday) => {
    if (holiday.type === 'regular') {
      if (holiday.attended) {
        // Regular holiday worked: Additional 100%
        totalImpact += props.dailyRate
      }
    } else if (holiday.type === 'special') {
      if (holiday.attended) {
        // Special holiday worked: Additional 30%
        totalImpact += props.dailyRate * 0.3
      }
    }
  })

  return totalImpact
})

// Watch for changes in holiday pay impact
watch(
  holidayPayImpact,
  (newVal) => {
    emit('update:holidayPay', newVal)
  },
  { immediate: true },
)

// Watch for changes in selectedMonthStr
watch(
  () => props.selectedMonthStr,
  (newVal) => {
    console.log('selectedMonthStr changed to:', newVal)
    // Update the UI when the selectedMonthStr changes
    nextTick(() => {
      lastAction.value = `Month updated to: ${formatMonthHeader()}`
    })
  },
  { immediate: true },
)

// Watch for changes in selectedMonth
watch(
  () => props.selectedMonth,
  (newVal) => {
    console.log('selectedMonth Date object changed to:', newVal)
  },
)

// Format the month name for the header
const formatMonthHeader = (yearParam, monthParam) => {
  let year, month

  // If parameters are provided explicitly, use them
  if (yearParam !== undefined && monthParam !== undefined) {
    year = yearParam
    month = monthParam - 1 // JavaScript months are 0-based
  }
  // Otherwise, parse from the selectedMonthStr prop
  else {
    try {
      ;[year, month] = props.selectedMonthStr.split('-').map(Number)
      month -= 1 // JavaScript months are 0-based
    } catch (error) {
      console.error('Error parsing selectedMonthStr:', error)
      // Fallback to current month if parsing fails
      const now = new Date()
      year = now.getFullYear()
      month = now.getMonth()
    }
  }

  // Format the date as "Month Year"
  const date = new Date(year, month)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

// Create date string from selected date number
const getDateStringFromNum = (dateNum) => {
  const [year, month] = props.selectedMonthStr.split('-').map(Number)
  return `${year}-${month.toString().padStart(2, '0')}-${dateNum.toString().padStart(2, '0')}`
}

// Format the selected date for display
const formatSelectedDate = () => {
  if (!selectedDateNum.value) return ''
  const dateStr = getDateStringFromNum(selectedDateNum.value)
  return formatDateDisplay(dateStr)
}

// Handle date selection - FIXED VERSION
const selectDate = (date) => {
  selectedDateNum.value = date
  const dateStr = getDateStringFromNum(date)

  // Check if there's an existing holiday for this date
  const existingHoliday = holidaysList.value.find((h) => {
    const holidayDate = new Date(h.date)
    const selectedDate = new Date(dateStr)
    return (
      holidayDate.getFullYear() === selectedDate.getFullYear() &&
      holidayDate.getMonth() === selectedDate.getMonth() &&
      holidayDate.getDate() === selectedDate.getDate()
    )
  })

  if (existingHoliday) {
    // FIX: Instead of showing all holidays, open edit dialog for this specific holiday
    currentHoliday.value = { ...existingHoliday }
    showEditDialog.value = true
    lastAction.value = `Editing holiday: ${existingHoliday.name}`
  } else {
    // Otherwise set up new holiday form
    newHoliday.value = {
      id: Date.now().toString(),
      name: '',
      date: dateStr,
      type: 'regular',
      attended: false,
    }
    showAddDialog.value = true
    lastAction.value = `Adding new holiday for: ${formatDateDisplay(dateStr)}`
  }
}

// Handle closing the manage dialog
const onManageDialogClose = () => {
  // Reset the date selection when closing the dialog if it was opened for a specific date
  if (selectedDateNum.value) {
    selectedDateNum.value = null
    lastAction.value = 'Closed holiday manager'
  }
}

// Update current holiday (for edit dialog)
const updateHoliday = () => {
  if (!currentHoliday.value || !currentHoliday.value.id) return

  const index = holidaysList.value.findIndex((h) => h.id === currentHoliday.value.id)
  if (index !== -1) {
    holidaysList.value[index] = { ...currentHoliday.value }
    updateHolidayDatesMap()
    saveHolidaysToStorage()
    showEditDialog.value = false
    lastAction.value = `Updated: ${currentHoliday.value.name}`
  }
}

// Delete current holiday
const deleteCurrentHoliday = () => {
  if (!currentHoliday.value || !currentHoliday.value.id) return

  deleteHoliday(currentHoliday.value.id)
  showEditDialog.value = false
}

// Toggle holiday type (regular/special)
const toggleHolidayType = (holiday, type) => {
  const index = holidaysList.value.findIndex((h) => h.id === holiday.id)
  if (index !== -1) {
    holidaysList.value[index].type = type
    updateHolidayDatesMap()
    saveHolidaysToStorage()
    lastAction.value = `Changed ${holiday.name} to ${type} holiday`
  }
}

// Open the manage holidays dialog
const openManageDialog = () => {
  selectedDateNum.value = null // Clear any date selection
  showManageDialog.value = true
  lastAction.value = 'Opened holiday manager'
}

// Show default holidays dialog
const loadDefaultHolidays = () => {
  if (!showDefaultsDialog.value) {
    showDefaultsDialog.value = true
    lastAction.value = 'Preparing to load holidays...'
    return
  }

  // If dialog is already showing and this is called, actually load the holidays
  isLoading.value = true
  lastAction.value = 'Loading holidays...'

  try {
    const year = currentYear.value
    let newHolidays = []

    // Process holidays from the JS object - now referencing holidaysData
    for (const [key, holiday] of Object.entries(holidaysData)) {
      // Skip variable dates that will be handled differently
      if (holiday.date.includes('Variable')) continue

      // Create the holiday with the correct date for this year
      const dateStr = parseHolidayDate(holiday.date, year)
      if (dateStr) {
        // Check for company overrides
        let holidayType = holiday.type
        if (holiday.type === 'special' && companyOverrides.regular.includes(holiday.name)) {
          holidayType = 'regular'
        }

        newHolidays.push({
          id: key,
          name: holiday.name,
          date: dateStr,
          type: holidayType,
          attended: false,
        })
      }
    }

    // Add variable dates for the current year
    const yearStr = year.toString()
    if (variableDates[yearStr]) {
      for (const [name, date] of Object.entries(variableDates[yearStr])) {
        // Find matching holiday in holidaysData
        const holiday = Object.values(holidaysData).find(
          (h) => h.date.includes('Variable') && h.name.includes(name),
        )
        if (holiday) {
          // Check for company overrides
          let holidayType = holiday.type
          if (holiday.type === 'special' && companyOverrides.regular.includes(holiday.name)) {
            holidayType = 'regular'
          }

          newHolidays.push({
            id: Date.now() + name,
            name: holiday.name,
            date: date,
            type: holidayType,
            attended: false,
          })
        }
      }
    }

    // Handle National Heroes Day (last Monday of August)
    const heroesHoliday = holidaysData.national_heroes_day
    if (heroesHoliday) {
      const lastMondayDate = calculateLastMondayOfAugust(year)
      newHolidays.push({
        id: 'national_heroes_day',
        name: heroesHoliday.name,
        date: lastMondayDate,
        type: heroesHoliday.type,
        attended: false,
      })
    }

    // Either replace or merge with existing holidays
    if (overwriteExisting.value) {
      holidaysList.value = newHolidays
      lastAction.value = `Replaced with ${newHolidays.length} holidays`
    } else {
      // Merge with existing, avoiding duplicates by date
      const existingDates = holidaysList.value.map((h) => h.date)
      const uniqueNewHolidays = newHolidays.filter((h) => !existingDates.includes(h.date))
      holidaysList.value = [...holidaysList.value, ...uniqueNewHolidays]
      lastAction.value = `Added ${uniqueNewHolidays.length} holidays (total: ${holidaysList.value.length})`
    }

    // Update the map and save
    updateHolidayDatesMap()
    saveHolidaysToStorage()
  } catch (error) {
    console.error('Error loading holidays:', error)
    lastAction.value = `Error: ${error.message}`
  } finally {
    showDefaultsDialog.value = false
    isLoading.value = false
  }
}

// Parse holiday date from format like "December 25" to "YYYY-MM-DD"
const parseHolidayDate = (dateDescription, year) => {
  try {
    // Parse standard date format like "December 25"
    const parts = dateDescription.split(' ')
    const monthStr = parts[0]
    const dayStr = parts[1]

    if (!monthStr || !dayStr) return null

    const monthMap = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    }

    const month = monthMap[monthStr]
    if (!month) return null

    const day = dayStr.replace(/[^0-9]/g, '').padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error(`Error parsing date "${dateDescription}":`, error)
    return null
  }
}

// Calculate the last Monday of August
const calculateLastMondayOfAugust = (year) => {
  const lastDay = new Date(year, 8, 0).getDate() // Last day of August
  const lastDayDate = new Date(year, 7, lastDay)
  const lastDayOfWeek = lastDayDate.getDay()
  const daysToSubtract = (lastDayOfWeek + 6) % 7
  const lastMondayDate = lastDayDate.getDate() - daysToSubtract
  return `${year}-08-${lastMondayDate.toString().padStart(2, '0')}`
}

// Check if a given date is today
const isToday = (date) => {
  const today = new Date()
  const [year, month] = props.selectedMonthStr.split('-').map(Number)
  return today.getDate() === date && today.getMonth() === month - 1 && today.getFullYear() === year
}

// Check if a date has a holiday
const hasHoliday = (date) => {
  const [year, month] = props.selectedMonthStr.split('-').map(Number)
  const dateKey = `${year}/${month}/${date}`
  return !!holidayDatesMap.value[dateKey]
}

// Get holiday type for a date
const holidayType = (date) => {
  const [year, month] = props.selectedMonthStr.split('-').map(Number)
  const dateKey = `${year}/${month}/${date}`
  return holidayDatesMap.value[dateKey]?.type || ''
}

// Get text for holiday pay display
const getHolidayPayText = (holiday) => {
  if (holiday.attended) {
    return holiday.type === 'regular' ? '200% Pay' : '130% Pay'
  } else {
    return holiday.type === 'regular' ? '100% Pay (No work)' : 'No Pay (No work)'
  }
}

// Date formatting utilities
const formatDateDisplay = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// Format numbers to show with two decimal places
const formatNum = (n) => {
  return Number(n).toFixed(2)
}

// Update the holidayDatesMap for quick lookups
const updateHolidayDatesMap = () => {
  const newMap = {}
  holidaysList.value.forEach((holiday) => {
    try {
      const dateObj = new Date(holiday.date)
      const key = `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`
      newMap[key] = holiday
    } catch (error) {
      console.error(`Error with holiday date "${holiday.date}":`, error)
    }
  })
  holidayDatesMap.value = newMap
}

// Add a new holiday
const addHoliday = () => {
  // Validate inputs
  if (!newHoliday.value.name || !newHoliday.value.date) return

  // Add holiday
  holidaysList.value.push({
    id: Date.now().toString(),
    name: newHoliday.value.name,
    date: newHoliday.value.date,
    type: newHoliday.value.type,
    attended: newHoliday.value.attended,
  })

  lastAction.value = `Added: ${newHoliday.value.name} on ${newHoliday.value.date}`

  // Update the holiday dates map
  updateHolidayDatesMap()

  // Save to localStorage
  saveHolidaysToStorage()

  // Close dialog
  showAddDialog.value = false
}

// Delete a holiday
const deleteHoliday = (id) => {
  const holidayToDelete = holidaysList.value.find((h) => h.id === id)

  holidaysList.value = holidaysList.value.filter((holiday) => holiday.id !== id)

  if (holidayToDelete) {
    lastAction.value = `Deleted: ${holidayToDelete.name}`
  }

  updateHolidayDatesMap()
  saveHolidaysToStorage()
}

// Toggle holiday attendance
const toggleHolidayAttendance = (holiday) => {
  const index = holidaysList.value.findIndex((h) => h.id === holiday.id)
  if (index !== -1) {
    const newStatus = !holidaysList.value[index].attended
    holidaysList.value[index].attended = newStatus

    lastAction.value = `Attendance for ${holiday.name}: ${newStatus ? 'Worked' : 'Not worked'}`
    saveHolidaysToStorage()
  }
  emit('update:holidayPay', holidayPayImpact.value)
  emit('recalculate')
}

// Save holidays to localStorage
const saveHolidaysToStorage = () => {
  try {
    localStorage.setItem('sahod_holidays', JSON.stringify(holidaysList.value))
  } catch (error) {
    console.error('Error saving holidays:', error)
  }
}

// Save current month to localStorage
const saveCurrentMonthToStorage = () => {
  try {
    localStorage.setItem('sahod_current_month', props.selectedMonthStr)
  } catch (error) {
    console.error('Error saving current month:', error)
  }
}

// Load holidays from localStorage
const loadHolidaysFromStorage = () => {
  try {
    const savedHolidays = localStorage.getItem('sahod_holidays')
    if (savedHolidays) {
      holidaysList.value = JSON.parse(savedHolidays)
      lastAction.value = `Loaded ${holidaysList.value.length} holidays`
      updateHolidayDatesMap()
    } else {
      lastAction.value = 'No saved holidays found'
    }
  } catch (e) {
    console.error('Error parsing saved holidays:', e)
    holidaysList.value = []
    lastAction.value = 'Error loading saved holidays'
  }
}

// Load holidays when component is mounted
onMounted(() => {
  // Log when component is created
  console.log('Calendar component created with month:', props.selectedMonthStr)

  // Load holidays when component is mounted
  loadHolidaysFromStorage()

  // Ensure UI is in sync with the selectedMonthStr prop
  lastAction.value = `Mounted with month: ${formatMonthHeader()}`
  console.log('Mounted with month:', props.selectedMonthStr)

  // Add this to help debug render issues
  nextTick(() => {
    console.log('Calendar fully rendered')
  })
})
</script>

<style scoped>
.calendar-container {
  width: 100%;
  background-color: var(--cyber-dark-3);
  border: 1px solid rgba(177, 74, 237, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

/* Calendar header */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background-color: var(--cyber-dark-2);
  border-bottom: 1px solid rgba(177, 74, 237, 0.2);
}

.month-navigation {
  display: flex;
  align-items: center;
}

.month-display {
  color: var(--kitako-neon);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 0 10px;
  min-width: 120px;
  text-align: center;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  align-items: center;
}

/* Debug info */
.debug-info {
  background-color: rgba(0, 0, 0, 0.2);
  border-left: 3px solid #666;
  margin: 0 10px;
  font-size: 0.7rem;
}

/* Calendar grid */
.calendar-grid {
  padding: 10px;
  background-color: var(--cyber-dark-3);
}

.calendar-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 5px;
}

.day-header {
  color: #aaa;
  font-size: 0.7rem;
  padding: 2px 0;
}

.calendar-dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.date-cell {
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  border-radius: 50%;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-cell:hover:not(.empty-cell) {
  background-color: rgba(177, 74, 237, 0.2);
  transform: scale(1.1);
}

.date-cell:active:not(.empty-cell) {
  background-color: rgba(177, 74, 237, 0.3);
  transform: scale(0.95);
}

.empty-cell {
  background-color: transparent;
  cursor: default;
}

.today-cell {
  border: 1px solid var(--kitako-neon);
}

.has-holiday {
  position: relative;
  font-weight: bold;
}

.has-holiday::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.regular-holiday::after {
  background-color: #21ba45; /* positive color */
}

.special-holiday::after {
  background-color: #f2c037; /* warning color */
}

/* Holiday status */
.holiday-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  color: #aaa;
}

.status-icon {
  margin-bottom: 8px;
}

.status-text {
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.status-hint {
  font-size: 0.7rem;
  color: var(--kitako-neon);
  margin-top: 4px;
  opacity: 0.8;
}

/* Holiday list */
.holiday-list-container {
  padding: 10px;
}

.section-title {
  color: var(--kitako-neon);
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.holiday-list {
  background-color: var(--cyber-dark-3);
  border-radius: 4px;
  overflow: hidden;
}

.holiday-item {
  padding: 6px 8px;
  min-height: 32px;
}

.holiday-date-name {
  font-size: 0.75rem;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
}

.holiday-date {
  color: #eee;
}

.holiday-name {
  color: var(--kitako-neon);
}

.holiday-details {
  margin-top: 2px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
}

.holiday-badge {
  padding: 1px 4px;
  height: 14px;
  margin-right: 4px;
  font-size: 0.6rem;
}

.holiday-pay {
  opacity: 0.8;
}

/* Holiday type toggle in manage dialog */
.holiday-type-toggle {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.type-badge {
  padding: 2px 5px;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-badge:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

/* Pay impact */
.pay-impact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 6px 10px;
  margin-top: 10px;
  border-left: 3px solid #21ba45;
  border-radius: 2px;
}

.impact-label {
  color: var(--kitako-neon);
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.impact-value {
  color: #21ba45;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Dialog */
.holiday-dialog {
  width: 100%;
  max-width: 100%;
  background-color: var(--cyber-dark-2);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  max-height: 80vh;
}

.dialog-header {
  background-color: var(--cyber-dark-1);
  color: var(--kitako-neon-bright);
  border-bottom: 1px solid rgba(177, 74, 237, 0.3);
}

.dialog-title {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.dialog-body {
  padding: 8px;
}

.holiday-item-dialog {
  padding: 4px 6px;
  min-height: 36px;
}

.dialog-holiday-text {
  font-size: 0.75rem;
  color: white;
}

.dialog-holiday-subtext {
  font-size: 0.65rem;
  opacity: 0.7;
}

/* Form */
.holiday-form {
  display: flex;
  flex-direction: column;
}

.form-input {
  margin-bottom: 8px;
}

.form-input :deep(.q-field__control) {
  height: 36px !important;
  min-height: 36px !important;
}

.form-toggle {
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  min-width: 100px;
  min-height: 32px !important;
  font-size: 0.8rem !important;
}

/* Mobile Optimizations */
@media screen and (max-width: 320px) {
  .date-cell {
    height: 24px;
    width: 24px;
    font-size: 0.75rem;
  }

  .day-header {
    font-size: 0.65rem;
  }

  .holiday-item {
    padding: 4px 6px;
  }

  .holiday-date-name {
    font-size: 0.7rem;
  }

  .month-display {
    font-size: 0.8rem;
    min-width: 90px;
  }
}

/* Responsive layout adjustment */
@media screen and (min-width: 400px) {
  .holiday-date-name {
    flex-direction: row;
  }

  .holiday-name {
    margin-left: 4px;
  }
}
</style>
