<template>
  <q-page class="bg-kitako-dark-1 budget-page">
    <!-- Header with Cyber styling - FIXED: shorter text for mobile -->
    <div class="cyber-page-header q-px-md q-py-sm">
      <div class="row items-center justify-between q-mb-sm">
        <div class="col">
          <div class="text-kitako-neon-bright cyber-glow q-mb-none title-wrap">
            <q-icon name="account_balance_wallet" class="q-mr-xs" />
            <span class="hide-xs">BUDGET_TRACKER</span>
            <span class="xs-only">BUDGET</span>
          </div>
          <div class="text-caption text-grey-5">// Manage funds & expenses</div>
        </div>
        <div class="col-auto">
          <q-badge color="kitako-neon" text-color="white" class="q-pa-xs cyber-badge">
            <span class="cyber-text text-caption blink">SCANNING</span>
          </q-badge>
        </div>
      </div>
      <q-separator dark color="kitako-neon" />
    </div>

    <!-- Main Content -->
    <div class="q-pa-sm q-md-pa-md">
      <!-- Budget Period Selector with Add Button -->
      <q-card dark class="bg-kitako-dark-2 q-mb-md">
        <q-card-section class="bg-kitako-dark-3 q-py-sm">
          <div class="row items-center justify-between">
            <div class="text-subtitle1 text-kitako-neon cyber-text">
              <q-icon name="date_range" class="q-mr-xs" />
              <span class="hide-xs">ACTIVE_BUDGET_PERIOD</span>
              <span class="xs-only">BUDGET</span>
            </div>
            <q-btn
              flat
              round
              dense
              color="kitako-neon"
              icon="add"
              size="sm"
              @click="openNewBudgetDialog"
            >
              <q-tooltip>Add New Budget</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-section class="q-py-sm">
          <div v-if="Object.keys(budgets).length === 0" class="text-center q-pa-sm">
            <div class="text-grey-6 text-caption">NO BUDGET PERIODS FOUND</div>
            <q-btn
              color="kitako-neon"
              class="q-mt-sm"
              icon-right="add"
              label="CREATE BUDGET"
              size="sm"
              @click="openNewBudgetDialog"
            />
          </div>

          <div v-else>
            <q-select
              v-model="currentBudgetId"
              :options="budgetOptions"
              dark
              filled
              dense
              emit-value
              map-options
              option-label="label"
              option-value="value"
              class="cyber-select"
              bg-color="kitako-dark-3"
            >
              <template v-slot:selected>
                <div class="row items-center justify-between full-width">
                  <div class="text-truncate">
                    <div class="text-kitako-neon-bright text-truncate">
                      {{ getCurrentBudget.startDate }} to {{ getCurrentBudget.endDate }}
                    </div>
                    <div class="text-caption text-grey-6 text-truncate">
                      ₱ {{ getCurrentBudget.salary.toLocaleString() }} - {{ getCurrentBudget.note }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.dates }}</q-item-label>
                    <q-item-label caption
                      >₱ {{ scope.opt.salary }} - {{ scope.opt.note }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </q-card-section>
      </q-card>

      <!-- Budget Dashboard (Only show if a budget is selected) -->
      <template v-if="currentBudgetId">
        <!-- Overview Cards - Responsive Grid -->
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Total Budget Card -->
          <div class="col-6 col-md-3">
            <q-card dark class="bg-kitako-dark-2 budget-card">
              <q-card-section class="q-py-sm">
                <div class="text-caption text-grey-5 cyber-text">BUDGET</div>
                <div class="text-h6 text-kitako-neon-bright q-mt-xs cyber-value">
                  ₱{{ getCurrentBudget.salary.toLocaleString() }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Spent Card -->
          <div class="col-6 col-md-3">
            <q-card dark class="bg-kitako-dark-2 budget-card">
              <q-card-section class="q-py-sm">
                <div class="text-caption text-grey-5 cyber-text">SPENT</div>
                <div class="text-h6 text-negative q-mt-xs cyber-value">
                  ₱{{ getTotalSpent.toLocaleString() }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Remaining Card -->
          <div class="col-6 col-md-3">
            <q-card dark class="bg-kitako-dark-2 budget-card">
              <q-card-section class="q-py-sm">
                <div class="text-caption text-grey-5 cyber-text">REMAINING</div>
                <div class="text-h6 text-positive q-mt-xs cyber-value">
                  ₱{{ getRemainingBudget.toLocaleString() }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Days Remaining Card -->
          <div class="col-6 col-md-3">
            <q-card dark class="bg-kitako-dark-2 budget-card">
              <q-card-section class="q-py-sm">
                <div class="text-caption text-grey-5 cyber-text">DAYS LEFT</div>
                <div class="text-h6 text-kitako-neon q-mt-xs cyber-value">
                  {{ getDaysRemaining }}
                </div>
                <div class="text-caption text-kitako-neon q-mt-xs hide-xs">
                  ₱{{ getDailyBudget.toLocaleString() }}/day
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Budget Progress Bar -->
        <q-card dark class="bg-kitako-dark-2 q-mb-md">
          <q-card-section class="q-py-sm">
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-kitako-neon-bright cyber-text">BUDGET PROGRESS</div>
              </div>
              <div class="col-auto text-caption">{{ getSpentPercentage }}% USED</div>
            </div>

            <q-linear-progress
              :value="getTotalSpent / getCurrentBudget.salary"
              :color="getBudgetColor"
              class="cyber-progress q-mt-sm"
              track-color="dark"
              size="15px"
            />

            <div class="row justify-between q-mt-xs">
              <div class="text-caption text-grey-6">
                <q-icon name="event" size="12px" class="q-mr-xs" />
                {{ getCurrentBudget.startDate }}
              </div>
              <div class="text-caption text-grey-6">
                <q-icon name="event" size="12px" class="q-mr-xs" />
                {{ getCurrentBudget.endDate }}
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Mobile Tabs for Expenses and Categories -->
        <div class="mobile-tabs xs-only sm-only">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-kitako-neon"
            active-color="kitako-neon-bright"
            indicator-color="kitako-neon-bright"
            align="justify"
            narrow-indicator
          >
            <q-tab name="expenses" icon="receipt_long" label="Expenses" />
            <q-tab name="categories" icon="pie_chart" label="Categories" />
            <q-tab name="settings" icon="settings" label="Settings" />
          </q-tabs>

          <q-separator dark color="kitako-neon" />

          <q-tab-panels v-model="activeTab" animated class="bg-transparent">
            <!-- Mobile Expenses Panel -->
            <q-tab-panel name="expenses" class="q-pa-none">
              <q-card dark class="bg-kitako-dark-2 transactions-card">
                <q-card-section class="q-pa-none">
                  <q-scroll-area style="height: 300px">
                    <q-list dark separator>
                      <q-item
                        v-if="Object.keys(getCurrentBudget.expenses).length === 0"
                        class="text-center q-pa-md"
                      >
                        <q-item-section>
                          <div class="text-grey-6">NO EXPENSES</div>
                          <q-btn
                            flat
                            color="kitako-neon"
                            class="q-mt-sm"
                            icon-right="add"
                            label="ADD"
                            size="sm"
                            @click="openAddExpenseDialog"
                          />
                        </q-item-section>
                      </q-item>

                      <q-item v-for="expense in sortedExpenses" :key="expense.id" class="q-py-xs">
                        <q-item-section avatar>
                          <q-avatar color="negative" text-color="white" size="24px">
                            <q-icon name="remove" size="xs" />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label lines="1" class="text-truncate">{{
                            expense.category
                          }}</q-item-label>
                          <q-item-label caption lines="1" class="cyber-text text-truncate">
                            {{ expense.note || 'No description' }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <div class="text-negative text-weight-medium">
                            ₱{{ expense.amount.toLocaleString() }}
                          </div>
                          <div class="text-caption text-grey-6">
                            {{ formatDateShort(expense.date) }}
                          </div>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn
                            flat
                            round
                            dense
                            color="negative"
                            icon="delete"
                            size="xs"
                            @click="deleteExpense(expense.id)"
                          >
                            <q-tooltip>Delete</q-tooltip>
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Mobile Categories Panel - UPDATED: Now includes category budgets -->
            <q-tab-panel name="categories" class="q-pa-none">
              <q-card dark class="bg-kitako-dark-2">
                <q-card-section class="bg-kitako-dark-3 q-py-sm">
                  <div class="row items-center justify-between">
                    <div class="text-subtitle1 text-kitako-neon cyber-text">
                      <q-icon name="pie_chart" class="q-mr-xs" />
                      CATEGORY_BUDGETS
                    </div>
                    <q-btn
                      flat
                      round
                      dense
                      color="kitako-neon"
                      icon="tune"
                      @click="openCategoryBudgetDialog"
                    >
                      <q-tooltip>Manage Category Budgets</q-tooltip>
                    </q-btn>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div
                    v-if="
                      !getCurrentBudget.categoryBudgets ||
                      Object.keys(getCurrentBudget.categoryBudgets).length === 0
                    "
                    class="text-center q-pa-sm text-grey-6 text-caption"
                  >
                    <div>NO CATEGORY BUDGETS CONFIGURED</div>
                    <q-btn
                      flat
                      color="kitako-neon"
                      class="q-mt-sm"
                      icon="settings"
                      label="CONFIGURE CATEGORIES"
                      size="sm"
                      @click="openCategoryBudgetDialog"
                    />
                  </div>
                  <div v-else>
                    <div
                      v-for="(budget, category) in getCurrentBudget.categoryBudgets"
                      :key="category"
                      class="q-mb-md category-budget-item"
                    >
                      <div class="row items-center justify-between q-mb-xs">
                        <div class="col cyber-text">
                          {{ category }}
                        </div>
                        <div class="col-auto">
                          <div class="text-weight-medium">
                            ₱{{ budget.toLocaleString() }}
                            <span class="text-grey-6">
                              / ₱{{ (getCategorySpent(category) || 0).toLocaleString() }} spent
                            </span>
                          </div>
                        </div>
                      </div>
                      <q-linear-progress
                        :value="getCategoryProgress(category)"
                        :color="getCategoryColor(getCategoryProgress(category))"
                        class="cyber-progress"
                        track-color="dark"
                        size="15px"
                      />
                      <div class="row justify-between q-mt-xs">
                        <div
                          class="text-caption q-mt-xs"
                          :class="getCategoryTextColor(getCategoryProgress(category))"
                        >
                          {{ (((getCategorySpent(category) || 0) / budget) * 100).toFixed(1) }}%
                          used
                        </div>
                        <div class="text-caption q-mt-xs">
                          ₱{{ (budget - (getCategorySpent(category) || 0)).toLocaleString() }}
                          remaining
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Mobile Settings Panel - Now updated to only show custom category management -->
            <q-tab-panel name="settings" class="q-pa-none">
              <q-card dark class="bg-kitako-dark-2">
                <q-card-section class="bg-kitako-dark-3 q-py-sm">
                  <div class="row items-center justify-between">
                    <div class="text-subtitle1 text-kitako-neon cyber-text">
                      <q-icon name="settings" class="q-mr-xs" />
                      CUSTOM_CATEGORIES
                    </div>
                    <q-btn
                      flat
                      round
                      dense
                      color="kitako-neon"
                      icon="add"
                      @click="openAddCategoryDialog"
                    >
                      <q-tooltip>Add Category</q-tooltip>
                    </q-btn>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="text-caption text-grey-5 q-mb-sm">
                    Add or remove custom expense categories
                  </div>

                  <q-list dark separator class="rounded-borders">
                    <q-item
                      v-for="(category, index) in customCategories"
                      :key="index"
                      class="q-py-xs"
                    >
                      <q-item-section>
                        <q-item-label class="cyber-text">{{ category }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          round
                          dense
                          size="sm"
                          color="negative"
                          icon="delete"
                          @click="deleteCategory(index)"
                        >
                          <q-tooltip>Delete Category</q-tooltip>
                        </q-btn>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="customCategories.length === 0" class="text-center q-pa-md">
                      <q-item-section>
                        <div class="text-grey-6">NO CUSTOM CATEGORIES</div>
                        <q-btn
                          flat
                          color="kitako-neon"
                          class="q-mt-sm"
                          icon-right="add"
                          label="ADD CATEGORY"
                          size="sm"
                          @click="openAddCategoryDialog"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <!-- Desktop Layout (hidden on mobile) -->
        <div class="row q-col-gutter-md gt-sm">
          <!-- Categories Breakdown with Budgets -->
          <div class="col-12 col-md-7">
            <q-card dark class="bg-kitako-dark-2 q-mb-md">
              <q-card-section class="bg-kitako-dark-3 q-py-sm">
                <div class="row items-center justify-between">
                  <div class="text-subtitle1 text-kitako-neon cyber-text">
                    <q-icon name="pie_chart" class="q-mr-xs" />
                    CATEGORY_BUDGETS
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    color="kitako-neon"
                    icon="tune"
                    @click="openCategoryBudgetDialog"
                  >
                    <q-tooltip>Manage Category Budgets</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
              <q-card-section>
                <div
                  v-if="
                    !getCurrentBudget.categoryBudgets ||
                    Object.keys(getCurrentBudget.categoryBudgets).length === 0
                  "
                  class="text-center q-pa-md text-grey-6"
                >
                  <div>NO CATEGORY BUDGETS CONFIGURED</div>
                  <q-btn
                    flat
                    color="kitako-neon"
                    class="q-mt-sm"
                    icon="settings"
                    label="CONFIGURE CATEGORIES"
                    @click="openCategoryBudgetDialog"
                  />
                </div>
                <div v-else>
                  <div
                    v-for="(budget, category) in getCurrentBudget.categoryBudgets"
                    :key="category"
                    class="q-mb-md"
                  >
                    <div class="row items-center justify-between q-mb-xs">
                      <div class="col cyber-text">
                        {{ category }}
                      </div>
                      <div class="col-auto">
                        <div class="row items-center">
                          <div class="text-weight-medium q-mr-sm">
                            ₱{{ budget.toLocaleString() }}
                          </div>
                          <q-chip dense size="sm" outline color="kitako-neon" class="cyber-chip">
                            <q-icon
                              name="trending_down"
                              class="q-mr-xs"
                              size="xs"
                              :color="getCategoryTextColor(getCategoryProgress(category))"
                            />
                            ₱{{ (getCategorySpent(category) || 0).toLocaleString() }}
                          </q-chip>
                          <q-btn
                            flat
                            round
                            dense
                            color="kitako-neon"
                            icon="edit"
                            size="xs"
                            class="q-ml-sm"
                            @click="openEditCategoryBudgetDialog(category, budget)"
                          >
                            <q-tooltip>Edit Budget</q-tooltip>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                    <q-linear-progress
                      :value="getCategoryProgress(category)"
                      :color="getCategoryColor(getCategoryProgress(category))"
                      class="cyber-progress"
                      track-color="dark"
                      size="15px"
                    />
                    <div class="row justify-between q-mt-xs">
                      <div
                        class="text-caption q-mt-xs"
                        :class="getCategoryTextColor(getCategoryProgress(category))"
                      >
                        {{ (((getCategorySpent(category) || 0) / budget) * 100).toFixed(1) }}% used
                      </div>
                      <div class="text-caption q-mt-xs">
                        ₱{{ (budget - (getCategorySpent(category) || 0)).toLocaleString() }}
                        remaining
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Desktop Categories Manager - Now only for custom categories -->
            <q-card dark class="bg-kitako-dark-2">
              <q-card-section class="bg-kitako-dark-3 q-py-sm">
                <div class="row items-center justify-between">
                  <div class="text-subtitle1 text-kitako-neon cyber-text">
                    <q-icon name="category" class="q-mr-xs" />
                    CUSTOM_CATEGORIES
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    color="kitako-neon"
                    icon="add"
                    @click="openAddCategoryDialog"
                  >
                    <q-tooltip>Add Custom Category</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="text-caption text-grey-5 q-mb-sm">
                  Create your own custom expense categories
                </div>
                <div class="row q-col-gutter-sm">
                  <div class="col-4" v-for="(category, index) in customCategories" :key="index">
                    <q-chip
                      square
                      dense
                      class="cyber-chip full-width justify-between"
                      color="kitako-dark-3"
                      text-color="kitako-neon"
                    >
                      <span class="cyber-text text-truncate">{{ category }}</span>
                      <q-btn
                        flat
                        round
                        dense
                        size="xs"
                        color="negative"
                        icon="close"
                        @click="deleteCategory(index)"
                      />
                    </q-chip>
                  </div>

                  <div class="col-12 text-center q-mt-md" v-if="customCategories.length === 0">
                    <div class="text-grey-6">No custom categories defined</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Recent Transactions (Desktop) -->
          <div class="col-12 col-md-5">
            <q-card dark class="bg-kitako-dark-2 transactions-card">
              <q-card-section class="bg-kitako-dark-3 q-py-sm">
                <div class="row items-center justify-between">
                  <div class="text-subtitle1 text-kitako-neon cyber-text">
                    <q-icon name="receipt_long" class="q-mr-xs" />
                    EXPENSES
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    color="kitako-neon"
                    icon="add"
                    @click="openAddExpenseDialog"
                  >
                    <q-tooltip>Add Expense</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
              <q-scroll-area style="height: 320px">
                <q-list dark>
                  <q-item
                    v-if="Object.keys(getCurrentBudget.expenses).length === 0"
                    class="text-center q-py-xl"
                  >
                    <q-item-section>
                      <div class="text-grey-6">NO EXPENSES RECORDED</div>
                      <q-btn
                        flat
                        color="kitako-neon"
                        class="q-mt-sm"
                        icon-right="add"
                        label="ADD EXPENSE"
                        @click="openAddExpenseDialog"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item v-for="expense in sortedExpenses" :key="expense.id" class="q-py-sm">
                    <q-item-section avatar>
                      <q-avatar color="negative" text-color="white" size="28px">
                        <q-icon name="remove" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ expense.category }}</q-item-label>
                      <q-item-label caption class="cyber-text">{{
                        expense.note || 'No description'
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-negative">-₱ {{ expense.amount.toLocaleString() }}</div>
                      <div class="text-caption text-grey-6">{{ formatDate(expense.date) }}</div>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        flat
                        round
                        dense
                        color="negative"
                        icon="delete"
                        @click="deleteExpense(expense.id)"
                      >
                        <q-tooltip>Delete</q-tooltip>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card>
          </div>
        </div>
      </template>
    </div>

    <!-- Add Expense Floating Button (Mobile) -->
    <div v-if="currentBudgetId" class="fixed-bottom-right q-mb-sm q-mr-sm">
      <q-btn
        round
        color="kitako-neon"
        class="cyber-fab pulse-slow"
        icon="add"
        @click="openAddExpenseDialog"
        aria-label="Add Expense"
      >
        <q-tooltip>Add Expense</q-tooltip>
      </q-btn>
    </div>

    <!-- New Budget Dialog -->
    <q-dialog v-model="newBudgetDialog" persistent dark>
      <q-card dark class="bg-kitako-dark-2 dialog-card">
        <q-card-section class="row items-center bg-kitako-dark-3 q-py-sm">
          <div class="text-subtitle1 text-kitako-neon cyber-text">NEW_BUDGET</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="addNewBudget" class="q-gutter-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newBudget.startDate"
                  filled
                  dark
                  dense
                  type="date"
                  label="Start Date *"
                  hint="When did you receive your salary?"
                  bg-color="kitako-dark-3"
                  class="cyber-input"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newBudget.endDate"
                  filled
                  dark
                  dense
                  type="date"
                  label="End Date *"
                  hint="When is your next payday?"
                  bg-color="kitako-dark-3"
                  class="cyber-input"
                  :rules="[
                    (val) => !!val || 'Required',
                    (val) => val > newBudget.startDate || 'Must be after start date',
                  ]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="newBudget.salary"
                  filled
                  dark
                  dense
                  type="number"
                  label="Salary Amount *"
                  prefix="₱"
                  bg-color="kitako-dark-3"
                  class="cyber-input"
                  :rules="[
                    (val) => !!val || 'Required',
                    (val) => val > 0 || 'Must be greater than 0',
                  ]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newBudget.note"
                  filled
                  dark
                  dense
                  label="Budget Note"
                  hint="E.g., October 15 salary"
                  bg-color="kitako-dark-3"
                  class="cyber-input"
                />
              </div>
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" color="dark" v-close-popup class="q-mr-sm" />
              <q-btn label="Add Budget" type="submit" color="kitako-neon" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Expense Dialog -->
    <q-dialog v-model="addExpenseDialog" persistent dark>
      <q-card dark class="bg-kitako-dark-2 dialog-card">
        <q-card-section class="row items-center bg-kitako-dark-3 q-py-sm">
          <div class="text-subtitle1 text-kitako-neon cyber-text">ADD_EXPENSE</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="addExpense" class="q-gutter-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="newExpense.category"
                  :options="allCategories"
                  filled
                  dark
                  dense
                  label="Category *"
                  bg-color="kitako-dark-3"
                  class="cyber-input"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="newExpense.amount"
                  filled
                  dark
                  dense
                  type="number"
                  label="Amount *"
                  prefix="₱"
                  bg-color="kitako-dark-3"
                  class="cyber-input"
                  :rules="[
                    (val) => !!val || 'Required',
                    (val) => val > 0 || 'Must be greater than 0',
                  ]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newExpense.date"
                  filled
                  dark
                  dense
                  type="date"
                  label="Date *"
                  bg-color="kitako-dark-3"
                  class="cyber-input"
                  :rules="[
                    (val) => !!val || 'Required',
                    (val) => isDateInRange(val) || 'Must be within budget period',
                  ]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newExpense.note"
                  filled
                  dark
                  dense
                  label="Note"
                  hint="E.g., Grocery shopping"
                  bg-color="kitako-dark-3"
                  class="cyber-input"
                />
              </div>
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" color="dark" v-close-popup class="q-mr-sm" />
              <q-btn label="Add Expense" type="submit" color="kitako-neon" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Category Dialog -->
    <q-dialog v-model="addCategoryDialog" persistent dark>
      <q-card dark class="bg-kitako-dark-2 dialog-card">
        <q-card-section class="row items-center bg-kitako-dark-3 q-py-sm">
          <div class="text-subtitle1 text-kitako-neon cyber-text">ADD_CATEGORY</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="addCategory" class="q-gutter-sm">
            <q-input
              v-model="newCategory"
              filled
              dark
              dense
              label="Category Name *"
              bg-color="kitako-dark-3"
              class="cyber-input"
              :rules="[
                (val) => !!val || 'Category name is required',
                (val) => !allCategories.includes(val.toUpperCase()) || 'Category already exists',
              ]"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" color="dark" v-close-popup class="q-mr-sm" />
              <q-btn label="Add Category" type="submit" color="kitako-neon" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- IMPROVED: Mobile-friendly Category Budget Setup Dialog -->
    <q-dialog v-model="categoryBudgetDialog" persistent dark>
      <q-card dark class="bg-kitako-dark-2 dialog-card">
        <!-- Header with shorter title for mobile -->
        <q-card-section class="row items-center bg-kitako-dark-3 q-py-sm">
          <div class="text-subtitle1 text-kitako-neon cyber-text">
            <q-icon name="tune" class="q-mr-xs" />
            <span class="hide-xs">MANAGE_CATEGORY_BUDGETS</span>
            <span class="xs-only">CAT_BUDGETS</span>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator dark color="kitako-dark-3" />

        <div class="xs-only sm-only">
          <q-tabs
            v-model="categoryBudgetTab"
            dense
            class="text-kitako-neon"
            active-color="kitako-neon-bright"
            indicator-color="kitako-neon-bright"
            align="justify"
            narrow-indicator
          >
            <q-tab name="select" icon="category" label="Select" />
            <q-tab name="allocate" icon="calculate" label="Allocate" />
          </q-tabs>

          <q-tab-panels v-model="categoryBudgetTab" animated class="bg-transparent">
            <!-- Category Selection Tab -->
            <q-tab-panel name="select" class="q-pa-md">
              <div class="text-subtitle2 text-kitako-neon-bright q-mb-sm">SELECT CATEGORIES</div>
              <div class="row q-col-gutter-xs">
                <div v-for="category in allCategories" :key="category" class="col-6">
                  <q-item
                    tag="label"
                    dense
                    class="cyber-category-selector q-mb-xs"
                    :class="{ selected: selectedCategories.includes(category) }"
                  >
                    <q-item-section avatar top>
                      <q-checkbox
                        v-model="selectedCategories"
                        :val="category"
                        dark
                        color="kitako-neon"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="cyber-text text-truncate">{{ category }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-tab-panel>

            <!-- Budget Allocation Tab -->
            <q-tab-panel name="allocate" class="q-pa-md">
              <div class="text-subtitle2 text-kitako-neon-bright q-mb-sm">ALLOCATE BUDGETS</div>
              <div v-if="selectedCategories.length === 0" class="text-center q-py-xl text-grey-6">
                Select categories first
                <div class="q-mt-md">
                  <q-btn
                    outline
                    color="kitako-neon"
                    icon="arrow_back"
                    label="GO BACK"
                    @click="categoryBudgetTab = 'select'"
                  />
                </div>
              </div>
              <div v-else>
                <div
                  v-for="category in selectedCategories"
                  :key="`budget-${category}`"
                  class="q-mb-md"
                >
                  <div class="text-caption cyber-text q-mb-xs">{{ category }}</div>
                  <q-input
                    v-model.number="categoryBudgets[category]"
                    filled
                    dark
                    dense
                    type="number"
                    prefix="₱"
                    bg-color="kitako-dark-3"
                    class="cyber-input"
                    hide-bottom-space
                  >
                    <template v-slot:append>
                      <div class="row no-wrap">
                        <q-btn
                          round
                          flat
                          dense
                          icon="remove"
                          @click="decreaseBudget(category)"
                          :disable="categoryBudgets[category] <= 100"
                        />
                        <q-btn round flat dense icon="add" @click="increaseBudget(category)" />
                      </div>
                    </template>
                  </q-input>

                  <!-- Quick percentage buttons -->
                  <!-- <div class="row q-col-gutter-xs q-mt-xs">
                    <div class="col-3">
                      <q-btn
                        dense
                        flat
                        color="kitako-neon"
                        class="full-width"
                        @click="setCategoryPercentage(category, 0.1)"
                      >
                        10%
                      </q-btn>
                    </div>
                    <div class="col-3">
                      <q-btn
                        dense
                        flat
                        color="kitako-neon"
                        class="full-width"
                        @click="setCategoryPercentage(category, 0.25)"
                      >
                        25%
                      </q-btn>
                    </div>
                    <div class="col-3">
                      <q-btn
                        dense
                        flat
                        color="kitako-neon"
                        class="full-width"
                        @click="setCategoryPercentage(category, 0.5)"
                      >
                        50%
                      </q-btn>
                    </div>
                    <div class="col-3">
                      <q-btn
                        dense
                        flat
                        color="kitako-neon"
                        class="full-width"
                        @click="setCategoryPercentage(category, 0.75)"
                      >
                        75%
                      </q-btn>
                    </div>
                  </div> -->
                </div>

                <!-- Back button -->
                <div class="row justify-center no-wrap q-gutter-x-xs">
                  <q-btn
                    outline
                    color="kitako-neon"
                    icon="arrow_back"
                    label="CATEGORIES"
                    class="col-auto"
                    size="sm"
                    @click="categoryBudgetTab = 'select'"
                  />
                  <q-btn
                    color="kitako-neon"
                    icon="save"
                    label="SAVE BUDGETS"
                    @click="saveCategoryBudgets"
                    size="sm"
                    :disable="getTotalCategoryBudget > getCurrentBudget.salary"
                    class="col-auto"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <!-- Desktop Layout (hidden on mobile) -->
        <div class="gt-sm q-pa-md">
          <div class="text-caption text-grey-5 q-mb-md">
            Select categories you want to track and allocate budget amounts to each. Total category
            budgets should not exceed your total budget of ₱{{
              getCurrentBudget.salary.toLocaleString()
            }}.
          </div>

          <!-- Desktop columns layout -->
          <div class="row q-col-gutter-md">
            <!-- Category Selection Column -->
            <div class="col-12 col-md-5">
              <div class="text-subtitle1 text-kitako-neon q-mb-sm">SELECT CATEGORIES</div>
              <q-card dark class="bg-kitako-dark-3 q-pa-sm" style="height: 400px">
                <q-scroll-area style="height: 380px">
                  <div class="row q-col-gutter-sm">
                    <div v-for="category in allCategories" :key="category" class="col-6">
                      <q-item
                        tag="label"
                        dense
                        class="cyber-category-selector q-mb-sm"
                        :class="{ selected: selectedCategories.includes(category) }"
                      >
                        <q-item-section avatar top>
                          <q-checkbox
                            v-model="selectedCategories"
                            :val="category"
                            dark
                            color="kitako-neon"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="cyber-text">{{ category }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </q-scroll-area>
              </q-card>
            </div>

            <!-- Budget Allocation Column -->
            <div class="col-12 col-md-7">
              <div class="text-subtitle1 text-kitako-neon q-mb-sm">ALLOCATE BUDGETS</div>
              <q-card dark class="bg-kitako-dark-3 q-pa-sm" style="height: 400px">
                <q-scroll-area style="height: 380px">
                  <div class="q-pa-sm">
                    <div
                      v-if="selectedCategories.length === 0"
                      class="text-center q-py-xl text-grey-6"
                    >
                      Select categories from the left panel
                    </div>
                    <div v-else class="row q-col-gutter-md">
                      <div
                        v-for="category in selectedCategories"
                        :key="`budget-${category}`"
                        class="col-12 col-xl-6"
                      >
                        <q-input
                          v-model.number="categoryBudgets[category]"
                          filled
                          dark
                          dense
                          type="number"
                          :label="`${category} Budget`"
                          prefix="₱"
                          bg-color="kitako-dark-2"
                          class="cyber-input"
                        >
                          <template v-slot:append>
                            <q-btn
                              round
                              flat
                              dense
                              icon="remove"
                              @click="decreaseBudget(category)"
                              :disable="categoryBudgets[category] <= 100"
                            />
                            <q-btn round flat dense icon="add" @click="increaseBudget(category)" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                </q-scroll-area>
              </q-card>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- IMPROVED: Edit Single Category Budget Dialog - More compact for mobile -->
    <q-dialog v-model="editCategoryBudgetDialog" persistent dark>
      <q-card dark class="bg-kitako-dark-2 dialog-card">
        <q-card-section class="row items-center bg-kitako-dark-3 q-py-sm">
          <div class="text-subtitle1 text-kitako-neon cyber-text">EDIT_BUDGET</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-h6 cyber-text q-mb-md text-kitako-neon-bright text-center">
            {{ editingCategory }}
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model.number="editingCategoryBudget"
                filled
                dark
                type="number"
                label="Budget Amount"
                prefix="₱"
                bg-color="kitako-dark-3"
                class="cyber-input"
              >
                <template v-slot:append>
                  <q-btn
                    round
                    flat
                    dense
                    icon="remove"
                    @click="editingCategoryBudget = Math.max(0, editingCategoryBudget - 500)"
                    :disable="editingCategoryBudget <= 500"
                  />
                  <q-btn round flat dense icon="add" @click="editingCategoryBudget += 500" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Quick percentage buttons -->
          <div class="row q-col-gutter-xs q-mt-sm">
            <div class="col-3">
              <q-btn
                dense
                flat
                color="kitako-neon"
                class="full-width"
                @click="editingCategoryBudget = Math.round(getCurrentBudget.salary * 0.1)"
              >
                10%
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn
                dense
                flat
                color="kitako-neon"
                class="full-width"
                @click="editingCategoryBudget = Math.round(getCurrentBudget.salary * 0.25)"
              >
                25%
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn
                dense
                flat
                color="kitako-neon"
                class="full-width"
                @click="editingCategoryBudget = Math.round(getCurrentBudget.salary * 0.5)"
              >
                50%
              </q-btn>
            </div>
            <div class="col-3">
              <q-btn
                dense
                flat
                color="kitako-neon"
                class="full-width"
                @click="editingCategoryBudget = Math.round(getCurrentBudget.salary * 0.75)"
              >
                75%
              </q-btn>
            </div>
          </div>

          <q-separator dark color="kitako-dark-3" class="q-my-md" />

          <!-- Current spending info cards -->
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-card dark dense class="bg-kitako-dark-3">
                <q-card-section class="q-pa-sm text-center">
                  <div class="text-caption">SPENT</div>
                  <div class="text-h6 text-negative">
                    ₱{{ (getCategorySpent(editingCategory) || 0).toLocaleString() }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6">
              <q-card dark dense class="bg-kitako-dark-3">
                <q-card-section class="q-pa-sm text-center">
                  <div class="text-caption">REMAINING</div>
                  <div class="text-h6 text-positive">
                    ₱{{
                      (
                        editingCategoryBudget - (getCategorySpent(editingCategory) || 0)
                      ).toLocaleString()
                    }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="q-mt-sm">
            <div class="row items-center justify-between q-mb-xs">
              <div class="text-caption">Usage</div>
              <div
                class="text-caption"
                :class="
                  getCategoryTextColor(
                    (getCategorySpent(editingCategory) || 0) / editingCategoryBudget,
                  )
                "
              >
                {{
                  (
                    ((getCategorySpent(editingCategory) || 0) / editingCategoryBudget) *
                    100
                  ).toFixed(1)
                }}%
              </div>
            </div>
            <q-linear-progress
              :value="(getCategorySpent(editingCategory) || 0) / editingCategoryBudget"
              :color="
                getCategoryColor((getCategorySpent(editingCategory) || 0) / editingCategoryBudget)
              "
              class="cyber-progress"
              track-color="dark"
              size="15px"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-kitako-dark-3 q-py-sm">
          <q-space />
          <q-btn label="Cancel" color="dark" v-close-popup class="q-mr-sm" />
          <q-btn label="Save" color="kitako-neon" @click="saveEditedCategoryBudget" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Mobile tab state
const activeTab = ref('expenses')
const categoryBudgetTab = ref('select') // NEW: Tab for category budget dialog

// Default expense categories
const defaultCategories = [
  'HOUSING',
  'FOOD',
  'TRANSPORTATION',
  'UTILITIES',
  'ENTERTAINMENT',
  'SAVINGS',
  'SHOPPING',
  'HEALTH',
  'EDUCATION',
  'DEBT',
  'GIFTS',
  'OTHER',
]

// Custom categories
const customCategories = ref([])

// All categories combined
const allCategories = computed(() => {
  return [...defaultCategories, ...customCategories.value]
})

// State variables
const budgets = ref({})
const currentBudgetId = ref(null)
const categoryStats = ref([])
const newBudgetDialog = ref(false)
const addExpenseDialog = ref(false)
const addCategoryDialog = ref(false)
const nextExpenseId = ref(1)
const newCategory = ref('')

// NEW: Category budget variables
const categoryBudgetDialog = ref(false)
const editCategoryBudgetDialog = ref(false)
const selectedCategories = ref([])
const categoryBudgets = reactive({})
const editingCategory = ref('')
const editingCategoryBudget = ref(0)

// Form models
const newBudget = ref({
  startDate: '',
  endDate: '',
  salary: 0,
  note: '',
  expenses: {},
  categoryBudgets: {}, // NEW: Added category budgets to budget model
})

const newExpense = ref({
  category: null,
  amount: 0,
  date: new Date().toISOString().substring(0, 10),
  note: '',
})

// Initialize from localStorage on component mount
onMounted(() => {
  loadBudgetsFromStorage()
  loadCategoriesFromStorage()

  // Set current budget to the most recent one if available
  if (Object.keys(budgets.value).length > 0) {
    // Sort budget keys by start date (descending) and take the first one
    const sortedBudgetKeys = Object.keys(budgets.value).sort(
      (a, b) => new Date(budgets.value[b].startDate) - new Date(budgets.value[a].startDate),
    )
    currentBudgetId.value = sortedBudgetKeys[0]
    generateCategoryStats()
  }
})

// Watch for changes to budgets and save to localStorage
watch(
  budgets,
  () => {
    saveBudgetsToStorage()
    generateCategoryStats()
  },
  { deep: true },
)

// Watch for changes to custom categories and save to localStorage
watch(
  customCategories,
  () => {
    saveCategoriesToStorage()
  },
  { deep: true },
)

// Computed properties
const budgetOptions = computed(() => {
  return Object.keys(budgets.value)
    .map((key) => ({
      label: `${budgets.value[key].startDate} to ${budgets.value[key].endDate}`,
      value: key,
      dates: `${budgets.value[key].startDate} to ${budgets.value[key].endDate}`,
      salary: budgets.value[key].salary.toLocaleString(),
      note: budgets.value[key].note,
    }))
    .sort((a, b) => {
      return new Date(budgets.value[b.value].startDate) - new Date(budgets.value[a.value].startDate)
    })
})

const getCurrentBudget = computed(() => {
  if (!currentBudgetId.value || !budgets.value[currentBudgetId.value]) {
    return { expenses: {}, salary: 0, startDate: '', endDate: '', categoryBudgets: {} }
  }

  // Don't modify here - just return what exists
  return budgets.value[currentBudgetId.value]
})
function ensureCategoryBudgetsExists() {
  if (
    currentBudgetId.value &&
    budgets.value[currentBudgetId.value] &&
    !budgets.value[currentBudgetId.value].categoryBudgets
  ) {
    budgets.value[currentBudgetId.value].categoryBudgets = {}
  }
}
const getTotalSpent = computed(() => {
  if (!currentBudgetId.value) return 0

  const expenses = getCurrentBudget.value.expenses
  return Object.values(expenses).reduce((total, expense) => total + expense.amount, 0)
})

const getRemainingBudget = computed(() => {
  return getCurrentBudget.value.salary - getTotalSpent.value
})

const getSpentPercentage = computed(() => {
  if (getCurrentBudget.value.salary === 0) return 0
  return ((getTotalSpent.value / getCurrentBudget.value.salary) * 100).toFixed(1)
})

const getBudgetColor = computed(() => {
  const ratio = getTotalSpent.value / getCurrentBudget.value.salary
  if (ratio > 0.9) return 'negative'
  if (ratio > 0.7) return 'warning'
  return 'positive'
})

const getDaysRemaining = computed(() => {
  if (!currentBudgetId.value) return 0

  const today = new Date()
  const endDate = new Date(getCurrentBudget.value.endDate)

  // If we're past the end date, return 0
  if (today > endDate) return 0

  // Calculate days between today and end date
  const diffTime = endDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
})

const getDaysProgress = computed(() => {
  if (!currentBudgetId.value) return 0

  const startDate = new Date(getCurrentBudget.value.startDate)
  const endDate = new Date(getCurrentBudget.value.endDate)
  const today = new Date()

  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24))

  // Ensure we don't return negative or > 1 values
  return Math.min(Math.max(elapsedDays / totalDays, 0), 1)
})

const getDailyBudget = computed(() => {
  if (getDaysRemaining.value === 0) return 0
  return getRemainingBudget.value / getDaysRemaining.value
})

const sortedExpenses = computed(() => {
  if (!currentBudgetId.value) return []

  const expenses = getCurrentBudget.value.expenses
  return Object.keys(expenses)
    .map((id) => ({
      id,
      ...expenses[id],
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

// NEW: Total of all category budgets
const getTotalCategoryBudget = computed(() => {
  let total = 0
  for (const category in categoryBudgets) {
    total += categoryBudgets[category] || 0
  }
  return total
})

// Methods
function loadBudgetsFromStorage() {
  try {
    const storedBudgets = localStorage.getItem('kitako-budgets')
    if (storedBudgets) {
      budgets.value = JSON.parse(storedBudgets)

      // Find the highest expense ID across all budgets
      let maxId = 0
      Object.values(budgets.value).forEach((budget) => {
        Object.keys(budget.expenses).forEach((id) => {
          maxId = Math.max(maxId, parseInt(id))
        })

        // Ensure every budget has a categoryBudgets property
        if (!budget.categoryBudgets) {
          budget.categoryBudgets = {}
        }
      })
      nextExpenseId.value = maxId + 1
    }
  } catch (error) {
    console.error('Error loading budgets from localStorage:', error)
    budgets.value = {}
  }
}

function saveBudgetsToStorage() {
  try {
    localStorage.setItem('kitako-budgets', JSON.stringify(budgets.value))
  } catch (error) {
    console.error('Error saving budgets to localStorage:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to save data to local storage',
      icon: 'error',
    })
  }
}

function loadCategoriesFromStorage() {
  try {
    const storedCategories = localStorage.getItem('kitako-categories')
    if (storedCategories) {
      customCategories.value = JSON.parse(storedCategories)
    }
  } catch (error) {
    console.error('Error loading categories from localStorage:', error)
    customCategories.value = []
  }
}

function saveCategoriesToStorage() {
  try {
    localStorage.setItem('kitako-categories', JSON.stringify(customCategories.value))
  } catch (error) {
    console.error('Error saving categories to localStorage:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to save categories to local storage',
      icon: 'error',
    })
  }
}

function openNewBudgetDialog() {
  // Initialize with today's date
  const today = new Date().toISOString().substring(0, 10)

  // Guess the next payday (15 days from now for bimonthly or end of month)
  let endDate = new Date()
  const currentDay = endDate.getDate()

  if (currentDay < 15) {
    // If before the 15th, next payday is probably the 15th
    endDate.setDate(15)
  } else {
    // If after the 15th, next payday is probably the end of the month or 1st of next month
    endDate.setMonth(endDate.getMonth() + 1)
    endDate.setDate(0) // Last day of current month
  }

  newBudget.value = {
    startDate: today,
    endDate: endDate.toISOString().substring(0, 10),
    salary: 0,
    note: '',
    expenses: {},
    categoryBudgets: {},
  }

  newBudgetDialog.value = true
}

function addNewBudget() {
  const budgetId = new Date().getTime().toString()

  budgets.value[budgetId] = {
    startDate: newBudget.value.startDate,
    endDate: newBudget.value.endDate,
    salary: newBudget.value.salary,
    note: newBudget.value.note,
    expenses: {},
    categoryBudgets: {}, // NEW: Initialize category budgets
  }

  currentBudgetId.value = budgetId
  newBudgetDialog.value = false

  $q.notify({
    color: 'positive',
    message: 'New budget period added',
    icon: 'check_circle',
    position: 'bottom',
  })

  // After creating a new budget, prompt user to set up category budgets
  openCategoryBudgetDialog()
}

function openAddExpenseDialog() {
  if (!currentBudgetId.value) {
    $q.notify({
      color: 'warning',
      message: 'Please select or create a budget first',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }

  // Initialize with today's date (or the budget's date range if today is outside it)
  const today = new Date()
  const startDate = new Date(getCurrentBudget.value.startDate)
  const endDate = new Date(getCurrentBudget.value.endDate)

  let defaultDate = today
  if (today < startDate) {
    defaultDate = startDate
  } else if (today > endDate) {
    defaultDate = endDate
  }

  newExpense.value = {
    category: null,
    amount: 0,
    date: defaultDate.toISOString().substring(0, 10),
    note: '',
  }

  addExpenseDialog.value = true
}

function addExpense() {
  const expenseId = nextExpenseId.value++

  if (!budgets.value[currentBudgetId.value].expenses) {
    budgets.value[currentBudgetId.value].expenses = {}
  }

  budgets.value[currentBudgetId.value].expenses[expenseId] = {
    category: newExpense.value.category,
    amount: newExpense.value.amount,
    date: newExpense.value.date,
    note: newExpense.value.note,
  }

  // Make a temporary copy of the budgets object to trigger the deep watcher
  budgets.value = { ...budgets.value }

  addExpenseDialog.value = false

  $q.notify({
    color: 'positive',
    message: 'Expense added successfully',
    icon: 'check_circle',
    position: 'bottom',
  })
}

function openAddCategoryDialog() {
  newCategory.value = ''
  addCategoryDialog.value = true
}

function addCategory() {
  // Convert to uppercase for consistency
  const categoryName = newCategory.value.toUpperCase()

  // Check if category already exists
  if (allCategories.value.includes(categoryName)) {
    $q.notify({
      color: 'negative',
      message: 'Category already exists',
      icon: 'error',
      position: 'bottom',
    })
    return
  }

  // Add the new category
  customCategories.value.push(categoryName)

  // Close dialog
  addCategoryDialog.value = false

  $q.notify({
    color: 'positive',
    message: 'Category added successfully',
    icon: 'check_circle',
    position: 'bottom',
  })

  // If budget exists, prompt to add this category to the budget
  if (currentBudgetId.value) {
    $q.dialog({
      dark: true,
      title: 'Add Budget for Category',
      message: `Do you want to set a budget for your new "${categoryName}" category?`,
      ok: 'Yes',
      cancel: 'No',
    }).onOk(() => {
      openEditCategoryBudgetDialog(categoryName, 0)
    })
  }
}

function deleteCategory(index) {
  const categoryToDelete = customCategories.value[index]

  $q.dialog({
    dark: true,
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete the category "${categoryToDelete}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // Remove the category
    customCategories.value.splice(index, 1)

    // If this category has a budget allocation, also remove it
    if (
      currentBudgetId.value &&
      budgets.value[currentBudgetId.value].categoryBudgets &&
      budgets.value[currentBudgetId.value].categoryBudgets[categoryToDelete]
    ) {
      delete budgets.value[currentBudgetId.value].categoryBudgets[categoryToDelete]

      // Make a temporary copy of the budgets object to trigger the deep watcher
      budgets.value = { ...budgets.value }
    }

    $q.notify({
      color: 'positive',
      message: 'Category deleted',
      icon: 'delete',
      position: 'bottom',
    })
  })
}

function deleteExpense(expenseId) {
  $q.dialog({
    dark: true,
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this expense?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    delete budgets.value[currentBudgetId.value].expenses[expenseId]

    // Make a temporary copy of the budgets object to trigger the deep watcher
    budgets.value = { ...budgets.value }

    $q.notify({
      color: 'positive',
      message: 'Expense deleted',
      icon: 'delete',
      position: 'top-right',
    })
  })
}

function generateCategoryStats() {
  if (!currentBudgetId.value) {
    categoryStats.value = []
    return
  }

  const expenses = getCurrentBudget.value.expenses
  const stats = {}

  // Sum up expenses by category
  Object.values(expenses).forEach((expense) => {
    if (!stats[expense.category]) {
      stats[expense.category] = 0
    }
    stats[expense.category] += expense.amount
  })

  // Convert to array for rendering
  categoryStats.value = Object.keys(stats)
    .map((category) => ({
      name: category,
      amount: stats[category],
    }))
    .sort((a, b) => b.amount - a.amount)
}

// Helper functions
function getCategoryColor(ratio) {
  if (ratio > 0.9) return 'negative'
  if (ratio > 0.7) return 'warning'
  return 'positive'
}

function getCategoryTextColor(ratio) {
  if (ratio > 0.9) return 'text-negative'
  if (ratio > 0.7) return 'text-warning'
  return 'text-positive'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-PH', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}

function formatDateShort(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-PH', {
    month: '2-digit',
    day: '2-digit',
  })
}

function isDateInRange(dateString) {
  if (!currentBudgetId.value) return true

  const date = new Date(dateString)
  const startDate = new Date(getCurrentBudget.value.startDate)
  const endDate = new Date(getCurrentBudget.value.endDate)

  return date >= startDate && date <= endDate
}

// NEW: Category Budget Functions
function openCategoryBudgetDialog() {
  if (!currentBudgetId.value) {
    $q.notify({
      color: 'warning',
      message: 'Please select or create a budget first',
      icon: 'warning',
      position: 'bottom',
    })
    return
  }

  // Initialize the selection with current categories that have budgets
  const currentBudgetCategories = getCurrentBudget.value.categoryBudgets || {}
  selectedCategories.value = Object.keys(currentBudgetCategories)

  // Initialize the budget amounts
  Object.keys(categoryBudgets).forEach((key) => delete categoryBudgets[key])
  Object.keys(currentBudgetCategories).forEach((category) => {
    categoryBudgets[category] = currentBudgetCategories[category]
  })

  // Reset to the first tab for mobile view
  categoryBudgetTab.value = 'select'

  categoryBudgetDialog.value = true
}

function openEditCategoryBudgetDialog(category, budget) {
  editingCategory.value = category
  editingCategoryBudget.value = budget
  editCategoryBudgetDialog.value = true
}

function saveEditedCategoryBudget() {
  if (!currentBudgetId.value) return

  // Ensure the budget has a categoryBudgets property
  if (!budgets.value[currentBudgetId.value].categoryBudgets) {
    budgets.value[currentBudgetId.value].categoryBudgets = {}
  }

  // Update the budget for this category
  budgets.value[currentBudgetId.value].categoryBudgets[editingCategory.value] =
    editingCategoryBudget.value

  // Make a temporary copy of the budgets object to trigger the deep watcher
  budgets.value = { ...budgets.value }

  editCategoryBudgetDialog.value = false

  $q.notify({
    color: 'positive',
    message: `Budget updated for ${editingCategory.value}`,
    icon: 'check_circle',
    position: 'bottom',
  })
}

function saveCategoryBudgets() {
  if (!currentBudgetId.value) return

  // Check if total doesn't exceed the budget
  if (getTotalCategoryBudget.value > getCurrentBudget.value.salary) {
    $q.notify({
      color: 'negative',
      message: 'Total category budgets exceed your total budget',
      icon: 'error',
      position: 'bottom',
    })
    return
  }

  // Initialize the categoryBudgets object if it doesn't exist
  if (!budgets.value[currentBudgetId.value].categoryBudgets) {
    budgets.value[currentBudgetId.value].categoryBudgets = {}
  }

  // Remove any categories not selected
  const currentCategories = Object.keys(budgets.value[currentBudgetId.value].categoryBudgets)
  currentCategories.forEach((category) => {
    if (!selectedCategories.value.includes(category)) {
      delete budgets.value[currentBudgetId.value].categoryBudgets[category]
    }
  })

  // Add or update selected categories
  selectedCategories.value.forEach((category) => {
    budgets.value[currentBudgetId.value].categoryBudgets[category] = categoryBudgets[category] || 0
  })

  // Make a temporary copy of the budgets object to trigger the deep watcher
  budgets.value = { ...budgets.value }

  categoryBudgetDialog.value = false

  $q.notify({
    color: 'positive',
    message: 'Category budgets saved successfully',
    icon: 'check_circle',
    position: 'bottom',
  })
}

function resetCategoryBudgets() {
  // Reset all budget amounts to zero
  selectedCategories.value.forEach((category) => {
    categoryBudgets[category] = 0
  })

  $q.notify({
    color: 'info',
    message: 'Budget amounts reset to zero',
    icon: 'refresh',
    position: 'bottom',
  })
}

function autoAllocateBudgets() {
  const totalBudget = getCurrentBudget.value.salary
  const categories = selectedCategories.value

  if (categories.length === 0) return

  // Auto-allocate based on common financial wisdom (approximate percentages)
  const percentages = {
    HOUSING: 0.3,
    FOOD: 0.15,
    TRANSPORTATION: 0.1,
    UTILITIES: 0.1,
    ENTERTAINMENT: 0.05,
    SAVINGS: 0.1,
    SHOPPING: 0.05,
    HEALTH: 0.05,
    EDUCATION: 0.05,
    DEBT: 0.1,
    GIFTS: 0.03,
    OTHER: 0.02,
  }

  // Calculate proportional budget for each selected category
  const selectedPercentages = {}
  let totalPercentage = 0

  // First, get all the percentages for selected categories
  categories.forEach((category) => {
    if (percentages[category]) {
      selectedPercentages[category] = percentages[category]
      totalPercentage += percentages[category]
    } else {
      // For custom categories, assign a default percentage
      selectedPercentages[category] = 0.05
      totalPercentage += 0.05
    }
  })

  // Then normalize the percentages to ensure they sum to 1
  for (const category in selectedPercentages) {
    selectedPercentages[category] = selectedPercentages[category] / totalPercentage
  }

  // Finally, calculate the budget amount for each category
  categories.forEach((category) => {
    categoryBudgets[category] = Math.round(totalBudget * selectedPercentages[category])
  })

  $q.notify({
    color: 'positive',
    message: 'Budgets automatically allocated',
    icon: 'auto_awesome',
    position: 'bottom',
  })
}

// NEW: Helper functions for category budgets
function getCategorySpent(category) {
  if (!currentBudgetId.value) return 0

  const expenses = getCurrentBudget.value.expenses
  let total = 0

  // Sum up all expenses for this category
  Object.values(expenses).forEach((expense) => {
    if (expense.category === category) {
      total += expense.amount
    }
  })

  return total
}

function getCategoryProgress(category) {
  if (!currentBudgetId.value || !getCurrentBudget.value.categoryBudgets) return 0

  const categoryBudget = getCurrentBudget.value.categoryBudgets[category]
  if (!categoryBudget || categoryBudget === 0) return 0

  return (getCategorySpent(category) || 0) / categoryBudget
}

function increaseBudget(category) {
  if (!categoryBudgets[category]) categoryBudgets[category] = 0

  // Increase by 5% of total budget or 500, whichever is larger
  const increment = Math.max(500, Math.round(getCurrentBudget.value.salary * 0.05))
  categoryBudgets[category] += increment
}

function decreaseBudget(category) {
  if (!categoryBudgets[category]) return

  // Decrease by 5% of total budget or 500, whichever is larger
  const decrement = Math.max(500, Math.round(getCurrentBudget.value.salary * 0.05))
  categoryBudgets[category] = Math.max(0, categoryBudgets[category] - decrement)
}

// NEW: Set category budget as percentage of total budget
function setCategoryPercentage(category, percentage) {
  if (!categoryBudgets[category]) categoryBudgets[category] = 0
  categoryBudgets[category] = Math.round(getCurrentBudget.value.salary * percentage)
}
</script>

<style>
/* Base styles */
.budget-page {
  position: relative;
  min-height: 100vh;
}

.cyber-page-header {
  border-bottom: 1px solid rgba(177, 74, 237, 0.3);
}

/* Title fix for small screens */
.title-wrap {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  line-height: 1.2;
  white-space: normal;
  word-break: break-word;
}

/* Card styles */
.budget-card {
  border: 1px solid rgba(177, 74, 237, 0.2);
  transition: all 0.3s ease;
  height: 100%;
}

.budget-card:hover {
  border-color: var(--kitako-neon);
  box-shadow: 0 0 15px rgba(177, 74, 237, 0.2);
  transform: translateY(-2px);
}

.transactions-card {
  border: 1px solid rgba(177, 74, 237, 0.2);
  height: 100%;
}

/* Progress bars */
.cyber-progress {
  height: 10px;
  border-radius: 0;
  border: 1px solid rgba(177, 74, 237, 0.3);
  overflow: hidden;
}

/* Text styles */
.cyber-value {
  font-family: var(--cyber-font);
  letter-spacing: 1px;
}

.cyber-text {
  font-family: var(--cyber-font);
  letter-spacing: 0.5px;
}

.cyber-btn {
  font-family: var(--cyber-font);
  letter-spacing: 1px;
}

.cyber-chip {
  font-family: var(--cyber-font);
  letter-spacing: 0.5px;
  border: 1px solid var(--kitako-neon);
}

/* Dialog styles */
.dialog-card {
  width: 100%;
  max-width: 450px;
}

/* Input controls */
.cyber-select .q-field__control {
  border: 1px solid rgba(177, 74, 237, 0.3);
}

.cyber-input .q-field__control {
  border: 1px solid rgba(177, 74, 237, 0.3);
}

/* Mobile-specific styles */
.mobile-tabs {
  background-color: var(--kitako-dark-2);
  margin-bottom: 1rem;
}

/* Fab button */
.cyber-fab {
  border: 2px solid rgba(177, 74, 237, 0.8);
  box-shadow: 0 0 15px rgba(177, 74, 237, 0.5);
}

.fixed-bottom-right {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
}

/* Cyberpunk glitch effect on hover */
.cyber-glow:hover {
  animation: textGlitch 0.5s linear forwards;
}

@keyframes textGlitch {
  0% {
    text-shadow: 0 0 10px var(--kitako-neon-bright);
    transform: translateX(0);
  }
  10% {
    text-shadow:
      2px 0 2px rgba(217, 101, 255, 0.8),
      -2px 0 2px rgba(0, 255, 255, 0.8);
    transform: translateX(2px);
  }
  20% {
    text-shadow:
      -2px 0 2px rgba(217, 101, 255, 0.8),
      2px 0 2px rgba(0, 255, 255, 0.8);
    transform: translateX(-2px);
  }
  30% {
    text-shadow: 0 0 10px var(--kitako-neon-bright);
    transform: translateX(0);
  }
  100% {
    text-shadow: 0 0 10px var(--kitako-neon-bright);
  }
}

/* NEW: Category selector styles */
.cyber-category-selector {
  border: 1px solid rgba(177, 74, 237, 0.3);
  background-color: var(--kitako-dark-3);
  transition: all 0.2s ease;
}

.cyber-category-selector:hover {
  border-color: var(--kitako-neon);
}

.cyber-category-selector.selected {
  border-color: var(--kitako-neon);
  background-color: rgba(177, 74, 237, 0.2);
  box-shadow: 0 0 8px rgba(177, 74, 237, 0.3);
}

.category-budget-item {
  padding: 10px;
  background-color: var(--kitako-dark-3);
  border: 1px solid rgba(177, 74, 237, 0.2);
  transition: all 0.3s ease;
}

.category-budget-item:hover {
  border-color: var(--kitako-neon);
  box-shadow: 0 0 10px rgba(177, 74, 237, 0.2);
}

/* NEW: Ensure text truncation in tight spaces */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* MOBILE SPECIFIC - Reduce padding in tight spaces */
@media (max-width: 599px) {
  .q-card-section {
    padding: 10px;
  }

  .q-item {
    min-height: 40px; /* Reduce minimum height of items */
  }

  .dialog-card {
    width: 98%; /* Nearly full width for small screens */
  }

  /* Fix tiny screens (320px) */
  .cyber-category-selector {
    padding: 4px 8px;
  }

  .cyber-category-selector .q-checkbox {
    margin-right: 4px;
  }

  .cyber-category-selector .q-item-label {
    font-size: 0.8rem; /* Smaller text */
  }

  /* Tighter inputs for small screens */
  .q-input input {
    font-size: 0.9rem;
  }
}

/* Quasar responsive utilities */
@media (max-width: 599px) {
  .hide-xs {
    display: none !important;
  }
}
@media (min-width: 600px) {
  .xs-only {
    display: none !important;
  }
}
@media (max-width: 1023px) {
  .gt-sm {
    display: none !important;
  }
}
@media (min-width: 1024px) {
  .sm-only {
    display: none !important;
  }
}
</style>
