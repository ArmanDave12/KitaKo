<template>
  <q-card
    flat
    bordered
    class="bg-kitako-dark-2 cyber-inner-card"
    :key="`cutoff-${rerenderTrigger}`"
  >
    <q-card-section class="q-pa-sm">
      <div class="text-overline text-kitako-neon cyber-text">CUTOFF_PERIOD</div>

      <div class="row items-center justify-between q-mt-sm">
        <div class="col-auto">
          <div class="text-body1 text-white">{{ formatDate(cutoffStartDate) }}</div>
        </div>
        <div class="col-auto">
          <div class="text-caption text-grey-6 cyber-text">TO</div>
        </div>
        <div class="col-auto">
          <div class="text-body1 text-white">{{ formatDate(cutoffEndDate) }}</div>
        </div>
      </div>

      <div class="row justify-between q-mt-md">
        <div class="col-auto flex items-center">
          <q-icon name="event" size="16px" color="kitako-neon-bright" class="q-mr-xs" />
          <span class="text-body2">
            <span class="text-white"
              ><b>{{ workdaysCount }}</b></span
            >
            days
          </span>
        </div>

        <!-- Visual indicator for selected cutoff -->
        <div class="col-auto">
          <div class="row items-center">
            <q-badge
              :color="selectedCutoff === '15th' ? 'kitako-neon-bright' : 'grey-8'"
              text-color="white"
              class="q-mr-sm cyber-text"
              >15th</q-badge
            >
            <q-badge
              :color="selectedCutoff === '30th' ? 'kitako-neon-bright' : 'grey-8'"
              text-color="white"
              class="cyber-text"
              >30th</q-badge
            >
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
// Define props
const props = defineProps({
  rerenderTrigger: {
    type: Number,
    required: true,
  },
  selectedCutoff: {
    type: String,
    required: true,
  },
  cutoffStartDate: {
    type: Date,
    required: true,
  },
  cutoffEndDate: {
    type: Date,
    required: true,
  },
  workdaysCount: {
    type: Number,
    required: true,
  },
})

// Import any necessary utility functions
// In a real implementation, you'd import these from your utils or functions folder
const formatDate = (d) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>
