<template>
  <q-page padding class="bg-kitako-dark-1">
    <!-- App Header - Simplified & Streamlined -->
    <div class="cyber-header q-mb-xs">
      <div class="row justify-between items-center">
        <div class="col">
          <div class="text-subtitle1 text-kitako-neon-bright cyber-text">SAHOD_VIEWER</div>
          <div class="text-caption text-grey-5">
            <span class="text-kitako-neon cyber-text">₱{{ dailyRate.toFixed(2) }}</span>
          </div>
        </div>
        <div class="col-auto">
          <q-btn flat round size="sm" color="kitako-neon" icon="more_vert" class="q-ml-sm">
            <q-menu>
              <q-list style="min-width: 120px" class="bg-kitako-dark-2">
                <q-item clickable v-close-popup class="text-white" @click="saveData">
                  <q-item-section avatar>
                    <q-icon name="save" color="kitako-neon" />
                  </q-item-section>
                  <q-item-section>Save</q-item-section>
                </q-item>
                <q-item clickable v-close-popup class="text-white" @click="directPrint">
                  <q-item-section avatar>
                    <q-icon name="print" color="kitako-neon" />
                  </q-item-section>
                  <q-item-section>Print</q-item-section>
                </q-item>
                <q-item clickable v-close-popup class="text-white" @click="showHelp">
                  <q-item-section avatar>
                    <q-icon name="help" color="kitako-neon" />
                  </q-item-section>
                  <q-item-section>Help</q-item-section>
                </q-item>
                <q-item clickable v-close-popup class="text-white" @click="resetAll">
                  <q-item-section avatar>
                    <q-icon name="refresh" color="grey-7" />
                  </q-item-section>
                  <q-item-section>Reset</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Main Card with Collapsible Sections -->
    <q-card flat bordered class="bg-kitako-dark cyber-card">
      <!-- Month & Cutoff Selection - Always Visible -->
      <q-card-section class="q-pt-sm q-pb-xs q-px-sm bg-kitako-dark">
        <div class="row q-col-gutter-xs">
          <!-- Month Selector (Simplified) -->
          <div class="col-7">
            <q-input
              v-model="selectedMonthStr"
              type="month"
              dense
              outlined
              color="kitako-neon"
              bg-color="kitako-dark-2"
              dark
              class="cyber-input-xs"
              stack-label
              label="Month"
            ></q-input>
          </div>

          <!-- Cutoff Selector (Simplified) -->
          <div class="col-5">
            <q-select
              v-model="selectedCutoff"
              :options="cutoffOptions"
              dense
              outlined
              color="kitako-neon"
              bg-color="kitako-dark-2"
              dark
              class="cyber-select-xs"
              stack-label
              label="Cutoff"
              emit-value
              map-options
            >
              <template v-slot:append>
                <q-badge
                  color="kitako-neon-bright"
                  text-color="kitako-dark"
                  v-if="isAutoSelected"
                  class="q-ml-xs"
                  size="xs"
                >
                  <q-icon name="auto_awesome" size="8px" />
                </q-badge>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <!-- Bottom Navigation Bar (replaces tabs) -->
      <div class="bottom-nav-bar">
        <q-tabs
          v-model="activeSection"
          dense
          class="text-white bg-kitako-dark-2"
          active-color="kitako-neon-bright"
          indicator-color="kitako-neon-bright"
          narrow-indicator
          no-caps
        >
          <q-tab name="overview" icon="dashboard" />
          <q-tab name="salary" icon="payments" />
          <q-tab name="calendar" icon="calendar_today" />
          <q-tab name="settings" icon="settings" />
        </q-tabs>
      </div>

      <!-- Content Sections -->
      <q-separator dark color="kitako-neon" />

      <q-tab-panels
        v-model="activeSection"
        animated
        class="bg-kitako-dark text-white q-px-xs"
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <!-- OVERVIEW SECTION (combines period & absence) -->
        <q-tab-panel name="overview" class="q-pa-xs">
          <div class="overview-header q-mb-xs">
            <div class="text-caption text-kitako-neon">OVERVIEW</div>
          </div>

          <!-- Period Info Card -->
          <q-card flat bordered class="cyber-inner-card q-mb-sm bg-kitako-dark-2">
            <q-card-section class="q-py-xs">
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-grey-6">Cutoff Period</div>
                  <div class="text-body2">
                    {{ formatDate(cutoffStartDate) }} to {{ formatDate(cutoffEndDate) }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-chip
                    size="sm"
                    dense
                    color="kitako-neon"
                    text-color="white"
                    class="cyber-chip q-ml-sm"
                    >{{ workdaysCount }} days</q-chip
                  >
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Absence Card -->
          <q-card flat bordered class="cyber-inner-card q-mb-sm bg-kitako-dark-2">
            <q-card-section class="q-pa-sm">
              <div class="row items-center justify-between">
                <div class="col">
                  <div class="text-caption text-grey-6">Absences</div>
                  <div class="row items-baseline">
                    <div class="text-h5 text-white q-mr-sm">{{ absentCount }}</div>
                    <div class="text-caption text-grey-5">day(s)</div>
                  </div>
                </div>
                <div class="col-auto" v-if="absentCount > 0">
                  <div class="text-right">
                    <div class="text-caption text-grey-6">Deduction</div>
                    <div class="text-subtitle2 text-negative">
                      ₱{{ formatNum(absentCount * dailyRate) }}
                    </div>
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn
                    round
                    flat
                    dense
                    color="kitako-neon"
                    icon="edit"
                    class="cyber-btn-small"
                    @click="openAbsentDialog"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Net Pay Summary Card -->
          <q-card
            flat
            bordered
            class="cyber-inner-card q-mb-xs cyber-net-pay-card bg-kitako-dark-2"
          >
            <q-card-section class="q-pa-sm">
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-grey-6">NET PAY</div>
                  <div class="text-h4 text-kitako-neon-bright cyber-text cyber-pay">
                    ₱{{ formatNum(netPay) }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn
                    flat
                    dense
                    round
                    color="kitako-neon"
                    icon="expand_more"
                    @click="expandPayDetails = !expandPayDetails"
                    :class="expandPayDetails ? 'rotate-180' : ''"
                    class="transition-transform"
                  />
                </div>
              </div>
            </q-card-section>

            <!-- Expandable Pay Details -->
            <q-slide-transition>
              <div v-show="expandPayDetails">
                <q-separator dark color="kitako-dark-1" />
                <q-card-section class="q-pa-xs q-px-sm">
                  <div class="row no-wrap justify-between items-center q-py-xs salary-item">
                    <div class="text-caption">Gross Pay:</div>
                    <div class="text-body2">₱{{ formatNum(grossPay) }}</div>
                  </div>
                  <div
                    class="row no-wrap justify-between items-center q-py-xs salary-item"
                    v-if="holidayPay > 0"
                  >
                    <div class="text-caption">Holiday Pay:</div>
                    <div class="text-body2 text-positive">+₱{{ formatNum(holidayPay) }}</div>
                  </div>
                  <div
                    class="row no-wrap justify-between items-center q-py-xs salary-item"
                    v-if="absentCount > 0"
                  >
                    <div class="text-caption">Absence:</div>
                    <div class="text-body2 text-negative">
                      -₱{{ formatNum(absentCount * dailyRate) }}
                    </div>
                  </div>
                  <div class="row no-wrap justify-between items-center q-py-xs salary-item">
                    <div class="text-caption">
                      {{ selectedCutoff === '15th' ? 'Pag-IBIG/PhilHealth:' : 'SSS:' }}
                    </div>
                    <div class="text-body2 text-negative">
                      -₱{{ formatNum(fixedDeductionAmount) }}
                    </div>
                  </div>
                  <div class="row no-wrap justify-between items-center q-py-xs salary-item">
                    <div class="text-caption">Total Deductions:</div>
                    <div class="text-body2 text-negative">-₱{{ formatNum(totalDeduction) }}</div>
                  </div>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </q-tab-panel>

        <!-- SALARY SECTION -->
        <q-tab-panel name="salary" class="q-pa-xs">
          <div class="overview-header q-mb-xs">
            <div class="text-caption text-kitako-neon">SALARY BREAKDOWN</div>
          </div>

          <!-- Salary Card -->
          <q-card flat bordered class="cyber-inner-card q-mb-sm bg-kitako-dark-2">
            <q-card-section class="q-py-sm q-px-md">
              <!-- Salary Breakdown -->
              <div class="row justify-between items-center q-py-xs salary-item">
                <div class="col text-body2">Daily Rate</div>
                <div class="col-auto text-body2">₱{{ formatNum(dailyRate) }}</div>
              </div>
              <div class="row justify-between items-center q-py-xs salary-item">
                <div class="col text-body2">Working Days</div>
                <div class="col-auto text-body2">{{ workdaysCount }} days</div>
              </div>
              <div class="row justify-between items-center q-py-xs salary-item">
                <div class="col text-body2">Base Amount</div>
                <div class="col-auto text-body2">₱{{ formatNum(workdaysCount * dailyRate) }}</div>
              </div>
              <div
                class="row justify-between items-center q-py-xs salary-item"
                v-if="holidayPay > 0"
              >
                <div class="col text-body2">Holiday Pay</div>
                <div class="col-auto text-body2 text-positive">+₱{{ formatNum(holidayPay) }}</div>
              </div>
              <q-separator dark color="kitako-dark-1" class="q-my-xs" />
              <div class="row justify-between items-center q-py-xs salary-item">
                <div class="col text-body2 text-weight-medium">Gross Pay</div>
                <div class="col-auto text-subtitle1">₱{{ formatNum(grossPay) }}</div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Deductions Card -->
          <q-card flat bordered class="cyber-inner-card q-mb-sm bg-kitako-dark-2">
            <q-card-section class="q-py-sm q-px-md">
              <div class="text-caption text-grey-6 q-mb-xs">DEDUCTIONS</div>

              <div
                class="row justify-between items-center q-py-xs salary-item"
                v-if="absentCount > 0"
              >
                <div class="col text-body2">Absence ({{ absentCount }} days)</div>
                <div class="col-auto text-body2 text-negative">
                  -₱{{ formatNum(absentCount * dailyRate) }}
                </div>
              </div>
              <div class="row justify-between items-center q-py-xs salary-item">
                <div class="col text-body2">
                  {{ selectedCutoff === '15th' ? 'Pag-IBIG/PhilHealth' : 'SSS' }}
                </div>
                <div class="col-auto text-body2 text-negative">
                  -₱{{ formatNum(fixedDeductionAmount) }}
                </div>
              </div>
              <q-separator dark color="kitako-dark-1" class="q-my-xs" />
              <div class="row justify-between items-center q-py-xs salary-item">
                <div class="col text-body2 text-weight-medium">Total Deductions</div>
                <div class="col-auto text-subtitle1 text-negative">
                  ₱{{ formatNum(totalDeduction) }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Net Pay Card -->
          <q-card
            flat
            bordered
            class="cyber-inner-card q-mb-xs cyber-net-pay-card pulse-border bg-kitako-dark-2"
          >
            <q-card-section class="q-py-sm q-px-md">
              <div class="row justify-between items-center">
                <div class="col text-subtitle1 text-weight-medium">NET PAY</div>
                <div class="col-auto text-h4 text-kitako-neon-bright cyber-text cyber-pay">
                  ₱{{ formatNum(netPay) }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Quick Actions for Salary Tab -->
          <div class="row q-mt-md">
            <div class="col-6 q-pr-xs">
              <q-btn
                outline
                color="grey-7"
                icon="calculate"
                no-caps
                class="full-width"
                label="Recalculate"
                size="sm"
                @click="updateAllCalculations"
              />
            </div>
            <div class="col-6 q-pl-xs">
              <q-btn
                unelevated
                color="kitako-neon"
                icon="print"
                no-caps
                class="full-width cyber-btn-primary"
                label="Print"
                size="sm"
                @click="directPrint"
              />
            </div>
          </div>
        </q-tab-panel>

        <!-- CALENDAR SECTION -->
        <q-tab-panel name="calendar" class="q-pa-xs">
          <div class="overview-header q-mb-xs">
            <div class="text-caption text-kitako-neon">CALENDAR</div>
          </div>

          <CalendarTab
            @recalculate="updateAllCalculations"
            :selectedMonth="selectedMonth"
            :selectedMonthStr="selectedMonthStr"
            :dailyRate="dailyRate"
            @update:holiday-pay="holidayPay = $event"
          />
        </q-tab-panel>

        <!-- SETTINGS SECTION -->
        <q-tab-panel name="settings" class="q-pa-xs">
          <div class="overview-header q-mb-xs">
            <div class="text-caption text-kitako-neon">SETTINGS</div>
          </div>

          <!-- Daily Rate Card -->
          <q-card flat bordered class="cyber-inner-card q-mb-sm bg-kitako-dark-2">
            <q-card-section class="q-py-sm">
              <div class="row items-center justify-between">
                <div class="col">
                  <div class="text-caption text-grey-6">Daily Rate</div>
                  <div class="text-h5 text-kitako-neon-bright">₱{{ formatNum(tempDailyRate) }}</div>
                </div>
                <div class="col-auto">
                  <q-btn
                    outline
                    color="kitako-neon"
                    icon="edit"
                    dense
                    size="sm"
                    @click="openRateEditor"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Deductions Settings Card -->
          <q-card flat bordered class="cyber-inner-card q-mb-sm bg-kitako-dark-2">
            <q-card-section class="q-py-sm q-px-md">
              <div class="text-caption text-grey-6 q-mb-sm">DEDUCTION SETTINGS</div>

              <div class="row q-mb-sm">
                <div class="col-12">
                  <q-input
                    v-model.number="tempPpKaltas"
                    type="number"
                    label="15th (Pag-IBIG/PhilHealth)"
                    outlined
                    dense
                    color="kitako-neon"
                    bg-color="kitako-dark-3"
                    dark
                    class="cyber-input-sm"
                    prefix="₱"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <q-input
                    v-model.number="tempSSS"
                    type="number"
                    label="30th (SSS)"
                    outlined
                    dense
                    color="kitako-neon"
                    bg-color="kitako-dark-3"
                    dark
                    class="cyber-input-sm"
                    prefix="₱"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Save Settings Button -->
          <div class="row q-mt-md">
            <div class="col-12">
              <q-btn
                unelevated
                color="kitako-neon"
                icon="save"
                label="Save Settings"
                class="full-width cyber-btn-primary"
                :loading="isUpdatingRate"
                @click="saveRateSettings"
              />
            </div>
          </div>

          <!-- Additional Actions -->
          <div class="row q-mt-md q-gutter-sm justify-center">
            <q-btn
              flat
              color="grey-6"
              icon="backup"
              label="Save All Data"
              no-caps
              size="sm"
              @click="saveData"
            />
            <q-btn
              flat
              color="grey-6"
              icon="refresh"
              label="Reset All"
              no-caps
              size="sm"
              @click="resetAll"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Loading Toast Notification (No X button, forced waiting) -->
    <q-dialog v-model="showUpdateToast" persistent>
      <q-card class="bg-kitako-dark-2 toast-card loading-toast">
        <q-card-section class="q-py-md q-px-md">
          <div class="row items-center">
            <div class="col-12 text-center">
              <q-spinner color="kitako-neon-bright" size="2em" class="q-mb-sm spinner-glow" />
              <div class="text-kitako-neon-bright cyber-text q-mb-sm loading-text">
                Processing update
                <span class="loading-dots">...</span>
              </div>
              <div class="text-grey-6 text-caption">
                Recalculating financial data for {{ selectedCutoff }} cutoff
              </div>
              <div class="q-mt-sm">
                <q-linear-progress
                  indeterminate
                  size="xs"
                  color="kitako-neon"
                  class="cyber-progress"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Absence Edit Dialog -->
    <q-dialog v-model="showAbsentDialog" persistent>
      <q-card class="bg-kitako-dark-2 absence-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2 text-kitako-neon-bright cyber-text">
            <q-icon name="edit" size="18px" class="q-mr-xs" />
            Edit Absences
          </div>
          <q-space />
          <q-btn icon="close" color="kitako-neon-bright" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-xs q-px-sm">
          <div class="row">
            <div class="col-12 text-center">
              <div class="row justify-around items-center">
                <div class="col-auto">
                  <q-btn
                    round
                    color="kitako-neon"
                    icon="remove"
                    @click="decrementAbsent"
                    :disable="tempAbsentCount <= 0"
                    class="cyber-stepper-btn"
                  />
                </div>
                <div class="col-auto">
                  <div class="text-h2 text-kitako-neon-bright cyber-text absence-number">
                    {{ tempAbsentCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn
                    round
                    color="kitako-neon"
                    icon="add"
                    @click="incrementAbsent"
                    :disable="tempAbsentCount >= workdaysCount"
                    class="cyber-stepper-btn"
                  />
                </div>
              </div>
              <div class="text-caption text-grey-5 q-mt-xs">Number of absences</div>
            </div>
          </div>

          <div v-if="tempAbsentCount > 0" class="text-center q-mt-sm">
            <div class="text-caption text-kitako-neon">Deduction Amount:</div>
            <div class="text-subtitle2 text-negative">
              ₱{{ formatNum(tempAbsentCount * dailyRate) }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="between" class="q-py-sm q-px-md">
          <q-btn
            flat
            label="CANCEL"
            color="grey-7"
            v-close-popup
            @click="cancelAbsentEdit"
            class="text-caption absence-btn"
          />
          <q-btn
            unelevated
            label="SAVE"
            color="kitako-neon"
            class="cyber-btn-primary absence-btn"
            v-close-popup
            @click="saveAbsentCount"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Rate Edit Dialog -->
    <q-dialog v-model="showRateDialog" persistent>
      <q-card class="bg-kitako-dark-2 rate-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2 text-kitako-neon-bright cyber-text">
            <q-icon name="payments" size="18px" class="q-mr-xs" />
            Edit Daily Rate
          </div>
          <q-space />
          <q-btn icon="close" color="kitako-neon-bright" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-xs q-px-md">
          <div class="row justify-center">
            <div class="col-12">
              <div class="text-center q-mb-md">
                <q-input
                  v-model.number="tempRateInput"
                  type="number"
                  label="Daily Rate"
                  outlined
                  color="kitako-neon"
                  bg-color="kitako-dark-3"
                  dark
                  class="cyber-input-large"
                  :rules="[(val) => val > 0 || 'Rate must be greater than 0']"
                  step="0.01"
                  min="0"
                  prefix="₱"
                />
              </div>

              <div class="text-center q-mt-sm">
                <div class="text-caption text-grey-5">
                  This rate will be used to calculate your salary.
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="between" class="q-py-sm q-px-md">
          <q-btn
            flat
            label="CANCEL"
            color="grey-7"
            v-close-popup
            @click="cancelRateEdit"
            class="text-caption rate-btn"
          />
          <q-btn
            unelevated
            label="APPLY"
            color="kitako-neon"
            class="cyber-btn-primary rate-btn"
            v-close-popup
            @click="applyRate"
            :disable="tempRateInput <= 0"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Help Dialog -->
    <q-dialog v-model="showHelpDialog">
      <q-card class="bg-kitako-dark-2" style="width: 90%; max-width: 500px">
        <q-card-section class="row items-center q-pb-xs">
          <div class="text-subtitle2 text-kitako-neon-bright cyber-text">
            <q-icon name="help" size="18px" class="q-mr-xs" />
            SAHOD_VIEWER Help
          </div>
          <q-space />
          <q-btn icon="close" color="kitako-neon-bright" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="text-white">
            <p class="text-body2">
              <span class="text-kitako-neon">SAHOD_VIEWER</span> helps you track your payroll
              information for both 15th and 30th cutoff periods.
            </p>

            <div class="text-caption text-kitako-neon q-mb-xs q-mt-md">Main Features:</div>
            <ul class="text-body2 q-ml-md">
              <li>View and select cutoff periods (15th or 30th)</li>
              <li>Calculate salary based on your daily rate</li>
              <li>Track absences and see deduction impacts</li>
              <li>Save your payroll data locally</li>
              <li>Print payroll reports</li>
            </ul>

            <div class="text-caption text-kitako-neon q-mb-xs q-mt-md">Quick Tips:</div>
            <ul class="text-body2 q-ml-md">
              <li>Use the Settings tab to customize your daily rate</li>
              <li>Switch between tabs to view different information</li>
              <li>Edit absences by clicking the edit button in the Absences tab</li>
              <li>Save your data regularly using the SAVE button</li>
            </ul>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-py-md">
          <q-btn
            unelevated
            label="GOT IT"
            color="kitako-neon"
            class="cyber-btn-primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Printable Content (Hidden) -->
    <div style="display: none">
      <div id="mobilePayrollReport" class="mobile-print-content">
        <div class="print-header">
          <div class="print-title">PAYROLL REPORT</div>
          <div class="print-subtitle">
            {{ selectedCutoff }} Cutoff - {{ formatMonthDisplay(selectedMonthStr) }}
          </div>
        </div>

        <div class="print-section">
          <div class="print-row">
            <div class="print-label">Cutoff Period</div>
            <div class="print-info">
              {{ formatDate(cutoffStartDate) }} to {{ formatDate(cutoffEndDate) }}
            </div>
          </div>
          <div class="print-row">
            <div class="print-label">Work days:</div>
            <div class="print-value">{{ workdaysCount }}</div>
          </div>
        </div>

        <div class="print-section">
          <div class="print-row">
            <div class="print-label">Daily Rate:</div>
            <div class="print-value">₱{{ formatNum(dailyRate) }}</div>
          </div>
          <div class="print-row">
            <div class="print-label">Absent:</div>
            <div class="print-value">{{ absentCount }} days</div>
          </div>
        </div>

        <div class="print-section">
          <div class="print-section-title">Salary Breakdown</div>

          <div class="print-row">
            <div class="print-label">Gross Pay:</div>
            <div class="print-value">₱{{ formatNum(grossPay) }}</div>
          </div>

          <div class="print-row" v-if="holidayPay > 0">
            <div class="print-label">Holiday Pay:</div>
            <div class="print-value positive">+₱{{ formatNum(holidayPay) }}</div>
          </div>

          <div class="print-row" v-if="absentCount > 0">
            <div class="print-label">Absence:</div>
            <div class="print-value negative">-₱{{ formatNum(absentCount * dailyRate) }}</div>
          </div>

          <div class="print-row">
            <div class="print-label">
              {{ selectedCutoff === '15th' ? 'Pag-IBIG/PhilHealth:' : 'SSS:' }}
            </div>
            <div class="print-value negative">-₱{{ formatNum(fixedDeductionAmount) }}</div>
          </div>

          <div class="print-row">
            <div class="print-label">Total Deductions:</div>
            <div class="print-value negative">-₱{{ formatNum(totalDeduction) }}</div>
          </div>

          <div class="print-total-row">
            <div class="print-total-label">NET PAY:</div>
            <div class="print-total-value">₱{{ formatNum(netPay) }}</div>
          </div>
        </div>

        <div class="print-footer">
          <div>Generated on: {{ formatCurrentDate() }}</div>
          <div>KITAKO v1.2.5</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { formatDateISO, countWorkdaysFromISOStrings, mensahe } from '../functions/script'

// Import component files
import CalendarTab from './tabs/CalendarTab.vue'

// Constants for default values
const DEFAULT_DAILY_RATE = 846.15
const DEFAULT_PP_KALTAS = 750 // 15th day of month deduction
const DEFAULT_SSS = 1100 // 30th day of month deduction
const emit = defineEmits(['update:holidayPay', 'recalculate'])
// Rate and deductions as refs instead of constants so they can be modified
const dailyRate = ref(DEFAULT_DAILY_RATE)
const ppKaltas = ref(DEFAULT_PP_KALTAS)
const SSS = ref(DEFAULT_SSS)

// Variables for rate editing
const tempDailyRate = ref(DEFAULT_DAILY_RATE)
const tempPpKaltas = ref(DEFAULT_PP_KALTAS)
const tempSSS = ref(DEFAULT_SSS)
const tempRateInput = ref(DEFAULT_DAILY_RATE)
const showRateDialog = ref(false)
const isUpdatingRate = ref(false)

// Active section for bottom navigation
const activeSection = ref('overview')

// Rerender trigger - a simple counter to force components to update
const rerenderTrigger = ref(0)

// UI state variables
const expandPayDetails = ref(false)

// Dropdown options for cutoff periods with explicit value/label structure
const cutoffOptions = [
  { label: '15th', value: '15th' },
  { label: '30th', value: '30th' },
]

// Determine the default cutoff based on current date
const getCurrentDefaultCutoff = () => {
  const today = new Date()
  const currentDay = today.getDate()
  return currentDay > 10 && currentDay <= 31 ? '30th' : '15th'
}

// State for cutoff selection
const selectedCutoff = ref(getCurrentDefaultCutoff())
const isAutoSelected = ref(true)
const showUpdateToast = ref(false)

// For month selection
const currentDate = new Date()
const selectedMonth = ref(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
const selectedMonthStr = ref(formatMonthYear(selectedMonth.value))

// Direct date values
const cutoffStartDate = ref(new Date())
const cutoffEndDate = ref(new Date())
const workdaysCount = ref(0)
const grossPay = ref(0)
const fixedDeductionAmount = ref(0)
const totalDeduction = ref(0)
const netPay = ref(0)

// Holiday pay tracking
const holidayPay = ref(0)

// Absence tracking
const absentCount = ref(0)
const tempAbsentCount = ref(0)
const showAbsentDialog = ref(false)

// Help dialog
const showHelpDialog = ref(false)

// Open rate editor dialog
function openRateEditor() {
  tempRateInput.value = tempDailyRate.value
  showRateDialog.value = true
}

// Cancel rate edit
function cancelRateEdit() {
  tempRateInput.value = tempDailyRate.value
}

// Apply the rate from the dialog to the temp value
function applyRate() {
  if (tempRateInput.value > 0) {
    tempDailyRate.value = tempRateInput.value
  }
}

// Save rate settings
function saveRateSettings() {
  if (tempDailyRate.value <= 0) return

  isUpdatingRate.value = true

  // Simulate a delay to show loading
  setTimeout(() => {
    // Apply the new rate and deduction values
    dailyRate.value = tempDailyRate.value
    ppKaltas.value = tempPpKaltas.value
    SSS.value = tempSSS.value

    // Save to localStorage
    localStorage.setItem('sahod_daily_rate', dailyRate.value.toString())
    localStorage.setItem('sahod_pp_kaltas', ppKaltas.value.toString())
    localStorage.setItem('sahod_sss', SSS.value.toString())

    // Update calculations with new rate
    updateAllCalculations()

    // Show success toast
    showUpdateToast.value = true
    setTimeout(() => {
      showUpdateToast.value = false
    }, 2000)

    isUpdatingRate.value = false

    // Go back to overview tab after saving
    activeSection.value = 'overview'
  }, 1000)
}

// Direct print method
function directPrint() {
  // Get the printable content
  const printContent = document.getElementById('mobilePayrollReport')

  // Create a new window for printing
  const printWindow = window.open('', '_blank')

  if (!printWindow) {
    alert('Please allow pop-ups for this website to print reports.')
    return
  }

  // Create a simple document with minimal HTML
  printWindow.document.write(`
    <html>
      <head>
        <title>Payroll Report - ${selectedCutoff.value} ${formatMonthDisplay(selectedMonthStr.value)}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; padding: 15px; color: #000; }
          .print-header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .print-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .print-subtitle { font-size: 14px; color: #666; }
          .print-section { margin: 15px 0; padding-bottom: 10px; border-bottom: 1px solid #eee; }
          .print-section-title { font-weight: bold; margin-bottom: 10px; font-size: 14px; }
          .print-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 13px; }
          .print-label { flex: 1; }
          .print-value, .print-info { text-align: right; }
          .negative { color: #C10015; }
          .print-total-row { display: flex; justify-content: space-between; margin: 10px 0 0; font-weight: bold; font-size: 16px; padding-top: 5px; border-top: 1px solid #eee; }
          .print-footer { margin-top: 20px; font-size: 11px; color: #666; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        ${printContent.outerHTML}
      </body>
    </html>
  `)

  // Wait for content to load then print
  printWindow.document.close()
  printWindow.onload = function () {
    printWindow.print()
    printWindow.onafterprint = function () {
      printWindow.close()
    }
  }
}

// Open help dialog
function showHelp() {
  showHelpDialog.value = true
}

// Format month for display
function formatMonthDisplay(monthStr) {
  if (!monthStr) return ''

  const [year, month] = monthStr.split('-').map(Number)
  const date = new Date(year, month - 1)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

// Format current date
function formatCurrentDate() {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Open absent edit dialog
function openAbsentDialog() {
  tempAbsentCount.value = absentCount.value
  showAbsentDialog.value = true
}

// Increment absent count in dialog
function incrementAbsent() {
  if (tempAbsentCount.value < workdaysCount.value) {
    tempAbsentCount.value++
  }
}

// Decrement absent count in dialog
function decrementAbsent() {
  if (tempAbsentCount.value > 0) {
    tempAbsentCount.value--
  }
}

// Cancel absent edit
function cancelAbsentEdit() {
  tempAbsentCount.value = absentCount.value
}

// Save absent count from dialog
function saveAbsentCount() {
  absentCount.value = tempAbsentCount.value

  // Save to localStorage
  localStorage.setItem('sahod_absent_count', absentCount.value.toString())

  // Update financial calculations
  updateAllCalculations()

  // Switch to overview section after editing absences
  activeSection.value = 'overview'
}

// CORE FUNCTION: Updates all calculated values at once
function updateAllCalculations() {
  console.log('Running updateAllCalculations with selectedCutoff:', selectedCutoff.value)

  // Calculate cutoff dates
  const dates = getCutoffDates()
  cutoffStartDate.value = new Date(dates.start)
  cutoffEndDate.value = new Date(dates.end)

  console.log('New cutoff start:', formatDate(cutoffStartDate.value))
  console.log('New cutoff end:', formatDate(cutoffEndDate.value))

  // Calculate workdays
  workdaysCount.value = countWorkdays(cutoffStartDate.value, cutoffEndDate.value)
  console.log('Workdays:', workdaysCount.value)

  // Update fixed deduction based on cutoff - use refs instead of constants
  fixedDeductionAmount.value = selectedCutoff.value === '15th' ? ppKaltas.value : SSS.value
  console.log('Fixed deduction:', fixedDeductionAmount.value)

  // Calculate gross pay - use daily rate ref
  grossPay.value = workdaysCount.value * dailyRate.value

  // Add holiday pay to gross pay
  grossPay.value += holidayPay.value

  // Calculate deductions - use daily rate ref
  const absenceDeduction = absentCount.value * dailyRate.value
  totalDeduction.value = absenceDeduction + fixedDeductionAmount.value

  // Calculate net pay
  netPay.value = Math.max(0, grossPay.value - totalDeduction.value)

  // Force a reactivity update by incrementing the rerender trigger
  rerenderTrigger.value++
  console.log('Updated rerenderTrigger to:', rerenderTrigger.value)
}

// Get cutoff date range based on selected month and cutoff period
function getCutoffDates() {
  const year = selectedMonth.value.getFullYear()
  const month = selectedMonth.value.getMonth()

  // FIXED: Ensure we're handling month boundaries correctly
  let startDate, endDate

  if (selectedCutoff.value === '15th') {
    // 15th cutoff: From the 26th of the previous month to the 10th of the current month
    // Handle previous month correctly, especially for January
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year

    startDate = new Date(prevYear, prevMonth, 26)
    endDate = new Date(year, month, 10)
  } else {
    // 30th cutoff: From the 11th to the 25th of the current month
    startDate = new Date(year, month, 11)
    endDate = new Date(year, month, 25)
  }

  console.log('Generated cutoff dates:', {
    cutoff: selectedCutoff.value,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  })

  return {
    start: startDate,
    end: endDate,
  }
}

function formatMonthYear(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function saveData() {
  // Save all data to localStorage including the rate settings
  localStorage.setItem('sahod_absent_count', absentCount.value.toString())
  localStorage.setItem('sahod_selected_cutoff', selectedCutoff.value)
  localStorage.setItem('sahod_selected_month', selectedMonthStr.value)
  localStorage.setItem('sahod_daily_rate', dailyRate.value.toString())
  localStorage.setItem('sahod_pp_kaltas', ppKaltas.value.toString())
  localStorage.setItem('sahod_sss', SSS.value.toString())
  localStorage.setItem('sahod_holiday_pay', holidayPay.value.toString())

  // Show success toast
  showUpdateToast.value = true
  setTimeout(() => {
    showUpdateToast.value = false
  }, 2000)
}

function resetAll() {
  if (confirm('Reset all data including absences and rate settings?')) {
    // Reset absence data
    absentCount.value = 0
    selectedMonth.value = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    selectedMonthStr.value = formatMonthYear(selectedMonth.value)
    selectedCutoff.value = getCurrentDefaultCutoff() // Use the automatic selection function
    isAutoSelected.value = true // Reset the auto flag
    holidayPay.value = 0 // Reset holiday pay

    // Reset rate settings to defaults
    dailyRate.value = DEFAULT_DAILY_RATE
    ppKaltas.value = DEFAULT_PP_KALTAS
    SSS.value = DEFAULT_SSS
    tempDailyRate.value = DEFAULT_DAILY_RATE
    tempPpKaltas.value = DEFAULT_PP_KALTAS
    tempSSS.value = DEFAULT_SSS

    // Save to localStorage
    localStorage.setItem('sahod_absent_count', '0')
    localStorage.setItem('sahod_daily_rate', DEFAULT_DAILY_RATE.toString())
    localStorage.setItem('sahod_pp_kaltas', DEFAULT_PP_KALTAS.toString())
    localStorage.setItem('sahod_sss', DEFAULT_SSS.toString())
    localStorage.setItem('sahod_holiday_pay', '0')

    // Run calculations after a brief delay
    nextTick(() => {
      updateAllCalculations()
    })

    // Show success toast
    showUpdateToast.value = true
    setTimeout(() => {
      showUpdateToast.value = false
    }, 2000)
  }
}

// Utils for date calculations
function countWorkdays(start, end) {
  let count = 0
  const d = new Date(start)
  while (d <= end) {
    const dow = d.getDay()
    if (dow !== 0) count++ // exclude Sunday
    d.setDate(d.getDate() + 1)
  }
  return count
}

function toInputString(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

function formatDate(d) {
  return toInputString(d)
}

function formatDateReadable(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatNum(n) {
  return Number(n).toFixed(2)
}

// Handle month changes
function handleMonthChange() {
  console.log('Month changed to:', selectedMonthStr.value)
  const [year, month] = selectedMonthStr.value.split('-').map(Number)
  selectedMonth.value = new Date(year, month - 1, 1)

  // Update all calculated values after Vue has updated the reactive state
  nextTick(() => {
    updateAllCalculations()
  })
}

// Load data from localStorage
function loadSavedData() {
  // Load absence and cutoff data
  const savedCount = localStorage.getItem('sahod_absent_count')
  if (savedCount !== null) {
    absentCount.value = parseInt(savedCount, 10) || 0
  }

  const savedCutoff = localStorage.getItem('sahod_selected_cutoff')
  if (savedCutoff) {
    selectedCutoff.value = savedCutoff
  }

  const savedMonth = localStorage.getItem('sahod_selected_month')
  if (savedMonth) {
    selectedMonthStr.value = savedMonth
    const [year, month] = savedMonth.split('-').map(Number)
    selectedMonth.value = new Date(year, month - 1, 1)
  }

  // Load rate settings
  const savedRate = localStorage.getItem('sahod_daily_rate')
  if (savedRate !== null) {
    const rate = parseFloat(savedRate)
    dailyRate.value = rate || DEFAULT_DAILY_RATE
    tempDailyRate.value = dailyRate.value
  }

  const savedPpKaltas = localStorage.getItem('sahod_pp_kaltas')
  if (savedPpKaltas !== null) {
    const ppk = parseFloat(savedPpKaltas)
    ppKaltas.value = ppk || DEFAULT_PP_KALTAS
    tempPpKaltas.value = ppKaltas.value
  }

  const savedSSS = localStorage.getItem('sahod_sss')
  if (savedSSS !== null) {
    const sss = parseFloat(savedSSS)
    SSS.value = sss || DEFAULT_SSS
    tempSSS.value = SSS.value
  }

  // Load holiday pay data
  const savedHolidayPay = localStorage.getItem('sahod_holiday_pay')
  if (savedHolidayPay !== null) {
    holidayPay.value = parseFloat(savedHolidayPay) || 0
  }
}

// WATCHERS - Critical for reactive updates

// Watch for cutoff changes
watch(
  selectedCutoff,
  (newValue) => {
    console.log('Cutoff watcher triggered:', newValue)

    // Check if auto or manual selection
    if (newValue !== getCurrentDefaultCutoff()) {
      isAutoSelected.value = false
    } else {
      isAutoSelected.value = true
    }

    // Show loading notification - shorter for better mobile experience
    showUpdateToast.value = true

    // Simulate processing time (2 seconds)
    setTimeout(() => {
      showUpdateToast.value = false
    }, 2000)

    // Use nextTick to ensure Vue has updated the DOM before calculations
    nextTick(() => {
      updateAllCalculations()
    })
  },
  { immediate: false },
)

// Watch for month changes - use the existing handler
watch(selectedMonthStr, handleMonthChange, { immediate: false })

watch(holidayPay, (newVal) => {
  updateAllCalculations()
})

// Initialize with current month's cutoff
onMounted(() => {
  console.log('Component mounted')
  // Load saved data
  loadSavedData()
  // Call this once at the start to set up all initial values
  nextTick(() => {
    updateAllCalculations()
  })
})
</script>

<style>
/* Mobile-first design with extra small screen support */
:root {
  --cyber-neon-main: rgba(177, 74, 237, 0.9);
  --cyber-neon-glow: rgba(177, 74, 237, 0.4);
  --cyber-dark-1: #121212;
  --cyber-dark-2: #1e1e1e;
  --cyber-dark-3: #252525;
  --cyber-text-primary: rgba(255, 255, 255, 0.87);
  --cyber-text-secondary: rgba(255, 255, 255, 0.6);
}

/* Base styles optimized for very small screens */
.cyber-text {
  letter-spacing: 0.5px;
}

.q-page {
  padding: 8px !important;
  padding-bottom: 50px !important; /* Space for bottom navigation */
}

@media screen and (max-width: 320px) {
  .q-page {
    padding: 6px !important;
    padding-bottom: 48px !important;
  }

  /* Further reduce spacing on very small screens */
  .q-px-sm {
    padding-left: 6px !important;
    padding-right: 6px !important;
  }

  .q-py-sm {
    padding-top: 6px !important;
    padding-bottom: 6px !important;
  }

  .q-mb-sm {
    margin-bottom: 6px !important;
  }

  .q-mt-sm {
    margin-top: 6px !important;
  }
}

/* Card styles */
.cyber-card {
  border: 1px solid var(--cyber-dark-2);
  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.5),
    0 0 10px var(--cyber-neon-glow) !important;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.cyber-inner-card {
  border: 1px solid rgba(177, 74, 237, 0.2) !important;
  transition: all 0.3s;
  box-shadow: none !important;
  margin-bottom: 8px;
}

/* Bottom Navigation Bar */
.bottom-nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.4);
}

.bottom-nav-bar .q-tabs {
  height: 48px;
}

.bottom-nav-bar .q-tab {
  padding: 0;
  min-height: 48px;
}

.bottom-nav-bar .q-tab__icon {
  font-size: 1.4rem;
}

/* Header style */
.cyber-header {
  border-left: 3px solid var(--kitako-neon);
  padding: 8px 0 8px 10px;
  margin-bottom: 8px;
}

.overview-header {
  border-left: 2px solid var(--kitako-neon);
  padding: 4px 0 4px 8px;
  margin-bottom: 4px;
}

.cyber-badge {
  border: 1px solid rgba(177, 74, 237, 0.3);
}

.cyber-chip {
  font-size: 0.7rem !important;
  height: 18px !important;
  padding: 0 4px !important;
}

/* Extra small input styles */
.cyber-input-xs .q-field__control,
.cyber-select-xs .q-field__control {
  background-color: var(--cyber-dark-2) !important;
  border: 1px solid rgba(177, 74, 237, 0.3) !important;
  min-height: 32px !important;
  padding: 0 8px;
}

.cyber-input-xs .q-field__label,
.cyber-select-xs .q-field__label {
  font-size: 0.7rem;
}

.cyber-input-xs .q-field__native,
.cyber-select-xs .q-field__native {
  padding: 0;
  font-size: 0.8rem;
}

.cyber-input-sm .q-field__control {
  min-height: 36px !important;
}

/* Rate input styles */
.cyber-input-large .q-field__control {
  min-height: 48px !important;
  padding: 0 10px;
}
.cyber-input-large .q-field__native {
  font-size: 1.15rem;
}

/* Tab panel styling */
.q-tab-panel {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 6px;
  padding-right: 6px;
}

/* Button styles */
.cyber-btn-primary {
  box-shadow: 0 0 8px rgba(177, 74, 237, 0.4);
  min-height: 32px !important;
  font-size: 0.8rem !important;
}

.cyber-btn-small {
  min-height: 24px;
  min-width: 24px;
  padding: 0;
}

/* Stepper button styles */
.cyber-stepper-btn {
  box-shadow: 0 0 15px rgba(177, 74, 237, 0.3);
  transition: all 0.2s ease;
  min-height: 32px !important;
  min-width: 32px !important;
  height: 32px !important;
  width: 32px !important;
}

/* Banner styles */
.cyber-banner {
  border-left: 3px solid orange;
  padding: 6px 8px;
}

/* Special effects */
.pulse-border {
  position: relative;
  overflow: hidden;
}

.pulse-border::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 1px solid var(--kitako-neon);
  opacity: 0;
  z-index: 1;
  animation: pulse-border 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse-border {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
  }
}

.cyber-pay {
  text-shadow: 0 0 10px rgba(217, 101, 255, 0.8);
}

/* Salary items styling */
.salary-item {
  padding: 3px 0;
  border-bottom: 1px solid rgba(177, 74, 237, 0.1);
}

.salary-item:last-child {
  border-bottom: none;
}

/* Loading toast styles */
.toast-card.loading-toast {
  max-width: 280px;
  min-width: 220px;
  border: 1px solid var(--kitako-neon);
  box-shadow: 0 0 15px rgba(177, 74, 237, 0.4);
}

.spinner-glow {
  animation: spinner-pulse 2s infinite;
}

@keyframes spinner-pulse {
  0% {
    opacity: 0.6;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

.loading-text {
  position: relative;
}

.loading-dots {
  display: inline-block;
  animation: loading-dots 1.5s infinite;
}

@keyframes loading-dots {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

.cyber-progress {
  height: 2px !important;
  border-radius: 1px;
  overflow: hidden;
  box-shadow: 0 0 8px rgba(177, 74, 237, 0.6);
}

/* Absence dialog styling for very small screens */
.absence-dialog,
.rate-dialog {
  width: 260px;
  max-width: 95%;
}

.absence-dialog .absence-number {
  font-size: 3rem !important;
  line-height: 1 !important;
  margin: 0 !important;
  padding: 0 !important;
}

.absence-dialog .q-btn.absence-btn,
.rate-dialog .q-btn.rate-btn {
  min-height: 30px !important;
  font-size: 0.8rem !important;
  border-radius: 4px !important;
}

.absence-dialog .q-btn.absence-btn.cyber-btn-primary,
.rate-dialog .q-btn.rate-btn.cyber-btn-primary {
  min-width: 60px !important;
}

/* Print styles */
.mobile-print-content {
  /* Hidden in normal view, only visible when printing */
  background-color: white;
  color: black;
  padding: 15px;
  font-family: Arial, sans-serif;
}

/* Special print styles for print content */
.print-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.print-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.print-subtitle {
  font-size: 14px;
  color: #666;
}

.print-section {
  margin: 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.print-section-title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 14px;
}

.print-row {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  font-size: 13px;
}

.print-label {
  flex: 1;
}

.print-value,
.print-info {
  text-align: right;
}

.print-info {
  flex: 1;
}

.negative {
  color: #c10015;
}

.positive {
  color: #21ba45;
}

.print-total-row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 0;
  font-weight: bold;
  font-size: 16px;
  padding-top: 5px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.print-footer {
  margin-top: 20px;
  font-size: 11px;
  color: #666;
  display: flex;
  justify-content: space-between;
}

/* Special classes for small screens */
@media screen and (max-width: 320px) {
  .text-h4 {
    font-size: 1.5rem !important;
    line-height: 1.3 !important;
  }

  .text-h5 {
    font-size: 1.25rem !important;
    line-height: 1.3 !important;
  }

  .text-subtitle1 {
    font-size: 1rem !important;
    line-height: 1.3 !important;
  }

  .text-subtitle2 {
    font-size: 0.9rem !important;
    line-height: 1.3 !important;
  }

  .text-body1,
  .text-body2 {
    font-size: 0.8rem !important;
    line-height: 1.3 !important;
  }

  .text-caption {
    font-size: 0.7rem !important;
    line-height: 1.2 !important;
  }

  /* Tighter spacing for dialogs */
  .absence-dialog .q-card-section,
  .rate-dialog .q-card-section {
    padding: 6px 10px !important;
  }

  .absence-dialog .q-card-actions,
  .rate-dialog .q-card-actions {
    padding: 6px 10px !important;
  }
}

/* Transitions */
.transition-transform {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
