<template>
  <div class="row q-col-gutter-sm">
    <!-- Absence Card -->
    <div class="col-12">
      <q-card flat bordered class="bg-kitako-dark-2 cyber-inner-card">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between">
            <div class="text-body1 text-kitako-neon">
              <q-icon
                :name="absentCount > 0 ? 'error' : 'check_circle'"
                :color="absentCount > 0 ? 'negative' : 'positive'"
                size="18px"
                class="q-mr-xs"
              />
              ABSENCES
            </div>
            <q-btn
              color="kitako-neon"
              icon="edit"
              size="sm"
              flat
              round
              @click="openAbsentDialog"
              class="cyber-btn-small"
            />
          </div>

          <div class="row items-center justify-center q-mt-md">
            <div class="text-center">
              <div class="text-h3 text-kitako-neon-bright cyber-text q-mb-xs">
                {{ absentCount }}
              </div>
              <div class="text-caption text-grey-6">
                {{ absentCount === 1 ? 'Day Absent' : 'Days Absent' }}
              </div>
            </div>
          </div>

          <!-- Absence impact -->
          <div v-if="absentCount > 0" class="q-mt-md">
            <q-banner dense class="bg-dark cyber-banner border-warning">
              <div class="text-body2">
                <span class="cyber-text text-warning">DEDUCTION: </span>
                <span class="text-negative">₱{{ formatNum(absentCount * dailyRate) }}</span>
              </div>
            </q-banner>
          </div>

          <!-- Perfect attendance -->
          <div v-else class="q-mt-md">
            <q-banner dense class="bg-dark cyber-banner border-success">
              <div class="text-body2">
                <span class="cyber-text text-positive">PERFECT_ATTENDANCE = TRUE 🎯</span>
              </div>
            </q-banner>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
// Define props
const props = defineProps({
  absentCount: {
    type: Number,
    required: true,
  },
  dailyRate: {
    type: Number,
    required: true,
  },
})

// Define emits
const emit = defineEmits(['open-absent-dialog'])

// Format numbers to show with two decimal places
const formatNum = (n) => {
  return Number(n).toFixed(2)
}

// Function to open the absence dialog
const openAbsentDialog = () => {
  emit('open-absent-dialog')
}
</script>
