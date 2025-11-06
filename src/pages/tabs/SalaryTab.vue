<template>
  <q-card
    flat
    bordered
    class="bg-kitako-dark-2 cyber-inner-card pulse-border"
    :key="`salary-${rerenderTrigger}`"
  >
    <q-card-section class="q-pa-sm">
      <div class="text-overline text-kitako-neon cyber-text">SALARY_BREAKDOWN</div>

      <div class="q-mt-sm">
        <!-- Salary Item -->
        <div class="salary-item row justify-between items-center q-py-xs">
          <span class="text-body2 text-grey-6">Gross_Pay:</span>
          <span class="text-body1 text-white">₱{{ formatNum(grossPay) }}</span>
        </div>

        <!-- Holiday Pay -->
        <div v-if="holidayPay > 0" class="salary-item row justify-between items-center q-py-xs">
          <span class="text-body2 text-grey-6">Holiday_Pay:</span>
          <span class="text-positive text-body1">+₱{{ formatNum(holidayPay) }}</span>
        </div>

        <!-- Absence deduction -->
        <div v-if="absentCount > 0" class="salary-item row justify-between items-center q-py-xs">
          <span class="text-body2 text-grey-6">Absence:</span>
          <span class="text-negative text-body1">-₱{{ formatNum(absentCount * dailyRate) }}</span>
        </div>

        <!-- Fixed deduction -->
        <div class="salary-item row justify-between items-center q-py-xs">
          <span class="text-body2 text-grey-6">
            {{ selectedCutoff === '15th' ? 'Pag-IBIG/PhilHealth:' : 'SSS:' }}
          </span>
          <span class="text-negative text-body1">-₱{{ formatNum(fixedDeductionAmount) }}</span>
        </div>

        <!-- Total deduction -->
        <div class="salary-item row justify-between items-center q-py-xs">
          <span class="text-body2 text-grey-6">Total_Deductions:</span>
          <span class="text-negative text-body1">-₱{{ formatNum(totalDeduction) }}</span>
        </div>

        <q-separator dark color="kitako-neon" class="q-my-sm" />

        <!-- Net pay -->
        <div class="salary-item row justify-between items-center q-pt-xs">
          <span class="cyber-text text-kitako-neon text-weight-bold">NET_PAY:</span>
          <span class="text-h6 text-kitako-neon-bright text-weight-bold cyber-pay"
            >₱{{ formatNum(netPay) }}</span
          >
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
  grossPay: {
    type: Number,
    required: true,
  },
  absentCount: {
    type: Number,
    required: true,
  },
  dailyRate: {
    type: Number,
    required: true,
  },
  fixedDeductionAmount: {
    type: Number,
    required: true,
  },
  totalDeduction: {
    type: Number,
    required: true,
  },
  netPay: {
    type: Number,
    required: true,
  },
  holidayPay: {
    type: Number,
    default: 0,
  },
})

// Format numbers to show with two decimal places
const formatNum = (n) => {
  return Number(n).toFixed(2)
}
</script>
