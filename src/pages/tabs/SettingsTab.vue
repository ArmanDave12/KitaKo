<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12">
      <q-card flat bordered class="bg-kitako-dark-2 cyber-inner-card">
        <q-card-section class="q-pa-sm">
          <div class="text-overline text-kitako-neon cyber-text">RATE_SETTINGS</div>

          <div class="row q-col-gutter-sm q-mt-md">
            <!-- Daily Rate Setting -->
            <div class="col-12">
              <q-input
                v-model.number="localTempDailyRate"
                type="number"
                label="Daily Rate (₱)"
                outlined
                dense
                color="kitako-neon"
                bg-color="kitako-dark-2"
                dark
                class="cyber-input"
                :rules="[(val) => val > 0 || 'Rate must be greater than 0']"
                step="0.01"
                min="0"
                prefix="₱"
              >
                <template v-slot:append>
                  <q-btn round flat dense icon="edit" color="kitako-neon" @click="openRateEditor" />
                </template>
              </q-input>
            </div>

            <!-- Deductions Settings -->
            <div class="col-12 col-md-6 q-mt-md">
              <q-input
                v-model.number="localTempPpKaltas"
                type="number"
                label="Pag-IBIG/PhilHealth (₱)"
                outlined
                dense
                color="kitako-neon"
                bg-color="kitako-dark-2"
                dark
                class="cyber-input"
                step="0.01"
                min="0"
                prefix="₱"
              >
                <template v-slot:hint>
                  <span class="text-grey-6">15th cutoff deduction</span>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6 q-mt-md">
              <q-input
                v-model.number="localTempSSS"
                type="number"
                label="SSS (₱)"
                outlined
                dense
                color="kitako-neon"
                bg-color="kitako-dark-2"
                dark
                class="cyber-input"
                step="0.01"
                min="0"
                prefix="₱"
              >
                <template v-slot:hint>
                  <span class="text-grey-6">30th cutoff deduction</span>
                </template>
              </q-input>
            </div>
          </div>

          <!-- Save Rate Button -->
          <div class="row justify-center q-mt-lg">
            <q-btn
              color="kitako-neon"
              label="UPDATE RATE SETTINGS"
              class="cyber-btn-primary"
              @click="saveSettings"
              :loading="isUpdatingRate"
              :disable="localTempDailyRate <= 0"
              unelevated
            >
              <template v-slot:loading>
                <q-spinner-dots color="white" />
              </template>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Define props
const props = defineProps({
  tempDailyRate: {
    type: Number,
    required: true,
  },
  tempPpKaltas: {
    type: Number,
    required: true,
  },
  tempSSS: {
    type: Number,
    required: true,
  },
  isUpdatingRate: {
    type: Boolean,
    required: true,
  },
})

// Define emits
const emit = defineEmits([
  'open-rate-editor',
  'save-rate-settings',
  'update:temp-daily-rate',
  'update:temp-pp-kaltas',
  'update:temp-sss',
])

// Local refs for v-model
const localTempDailyRate = ref(props.tempDailyRate)
const localTempPpKaltas = ref(props.tempPpKaltas)
const localTempSSS = ref(props.tempSSS)

// Watch for prop changes to update local refs
watch(
  () => props.tempDailyRate,
  (newVal) => {
    localTempDailyRate.value = newVal
  },
)
watch(
  () => props.tempPpKaltas,
  (newVal) => {
    localTempPpKaltas.value = newVal
  },
)
watch(
  () => props.tempSSS,
  (newVal) => {
    localTempSSS.value = newVal
  },
)

// Watch for local ref changes to emit updates
watch(localTempDailyRate, (newVal) => {
  emit('update:temp-daily-rate', newVal)
})
watch(localTempPpKaltas, (newVal) => {
  emit('update:temp-pp-kaltas', newVal)
})
watch(localTempSSS, (newVal) => {
  emit('update:temp-sss', newVal)
})

// Function to open the rate editor dialog
const openRateEditor = () => {
  emit('open-rate-editor')
}

// Function to save rate settings
const saveSettings = () => {
  if (localTempDailyRate.value <= 0) return
  emit('save-rate-settings')
}
</script>
