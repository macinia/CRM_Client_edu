<template>
  <ModalLayout :IsOpen="isOpenModalEditReport" @close="handleClose">
    <template #header>
      <span>Информация</span>
    </template>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Сохранить"
      :columns="1"
      @submit="saveReport"
    >
      <template #after-fields>
        <div class="report-items-block">
          <div class="report-items-title">Предмет / Тариф</div>

          <div v-for="(row, index) in form.items" :key="index" class="report-row">
            <div class="report-row-grid">
              <div class="report-field">
                <label :for="`subject-${index}`" class="report-label">Предмет</label>
                <select :id="`subject-${index}`" v-model="row.subjectId" class="report-control">
                  <option value="">Выберите предмет</option>
                  <option
                    v-for="subject in subjectOptions"
                    :key="subject.value"
                    :value="subject.value"
                  >
                    {{ subject.label }}
                  </option>
                </select>
              </div>

              <div class="report-field">
                <label :for="`tariff-${index}`" class="report-label">Тариф</label>
                <select :id="`tariff-${index}`" v-model="row.tariffId" class="report-control">
                  <option value="">Выберите тариф</option>
                  <option v-for="tariff in tariffOptions" :key="tariff.value" :value="tariff.value">
                    {{ tariff.label }}
                  </option>
                </select>
              </div>
            </div>

            <button
              v-if="form.items.length > 1"
              type="button"
              class="remove-row-btn"
              @click="removeRow(index)"
            >
              ×
            </button>
          </div>

          <button type="button" class="add-row-btn" @click="addRow">Добавить строку</button>
        </div>
      </template>
    </UiFormBuilder>
  </ModalLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

import { useFinancesStore } from '@/stores/finances'
import { useSubjectsStore } from '@/stores/subjects'

const props = defineProps({
  isOpenModalEditReport: {
    type: Boolean,
    required: true,
  },
  clientData: {
    type: Object,
    default: () => ({}),
  },
  reportItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['closeModalEditReport', 'saveReport'])

const financesStore = useFinancesStore()
const subjectsStore = useSubjectsStore()

const { tariffs } = storeToRefs(financesStore)
const { subjects } = storeToRefs(subjectsStore)

const errors = ref({})
const formError = ref('')

const fields = [
  {
    name: 'balance',
    label: 'Баланс',
    type: 'number',
    placeholder: 'Введите баланс',
    required: true,
    fullWidth: true,
    step: 1,
  },
]

function createEmptyRow() {
  return {
    subjectId: '',
    tariffId: '',
  }
}

function createInitialForm() {
  return {
    clientId: null,
    organizationId: 0,
    balance: '',
    items: [createEmptyRow()],
  }
}

const form = ref(createInitialForm())

const subjectOptions = computed(() => {
  return subjects.value.map((subject) => ({
    value: subject.id,
    label: subject.name.trim(),
  }))
})

const tariffOptions = computed(() => {
  return tariffs.value.map((tariff) => ({
    value: tariff.id,
    label: tariff.title,
  }))
})

watch(
  () => [props.clientData, props.reportItems],
  ([clientData, reportItems]) => {
    errors.value = {}
    formError.value = ''

    if (!clientData || !Object.keys(clientData).length) {
      form.value = createInitialForm()
      return
    }

    form.value = {
      clientId: clientData.id ?? null,
      organizationId: clientData.organizationId ?? 0,
      balance: clientData.balance ?? 0,
      items:
        Array.isArray(reportItems) && reportItems.length
          ? reportItems.map((item) => ({
              subjectId: item.subjectId ?? '',
              tariffId: item.tariffId ?? '',
            }))
          : [createEmptyRow()],
    }
  },
  { immediate: true, deep: true },
)

function resetErrors() {
  errors.value = {}
  formError.value = ''
}

function handleClose() {
  resetErrors()
  emit('closeModalEditReport')
}

function addRow() {
  form.value.items.push(createEmptyRow())
}

function removeRow(index) {
  if (form.value.items.length === 1) return
  form.value.items.splice(index, 1)
}

function validateForm() {
  errors.value = {}
  formError.value = ''

  if (form.value.balance === '' || form.value.balance === null) {
    errors.value.balance = 'Введите баланс'
  }

  for (const row of form.value.items) {
    const hasSubject = Boolean(row.subjectId)
    const hasTariff = Boolean(row.tariffId)

    if (hasSubject !== hasTariff) {
      formError.value = 'Для каждой строки нужно заполнить и предмет, и тариф'
      return false
    }
  }

  return Object.keys(errors.value).length === 0
}

function saveReport() {
  if (!validateForm()) {
    if (!formError.value && Object.keys(errors.value).length) {
      formError.value = 'Проверьте заполнение полей формы'
    }
    return
  }

  emit('saveReport', {
    clientId: form.value.clientId,
    organizationId: form.value.organizationId,
    balance: Number(form.value.balance),
    items: form.value.items
      .filter((item) => item.subjectId && item.tariffId)
      .map((item) => ({
        subjectId: Number(item.subjectId),
        tariffId: Number(item.tariffId),
      })),
  })
}
</script>

<style scoped>
.report-items-block {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.report-items-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-text);
}

.report-row {
  display: flex;
  align-items: end;
  gap: 10px;
}

.report-row-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.report-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.report-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
}

.report-control {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.report-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.add-row-btn {
  width: 100%;
  min-height: 46px;
  border-radius: 14px;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 800;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.add-row-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.remove-row-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  align-self: end;
  background-color: #f44336;
  color: #ffffff;
  font-size: 22px;
  line-height: 1;
}

@media (max-width: 700px) {
  .report-row {
    flex-direction: column;
    align-items: stretch;
  }

  .report-row-grid {
    grid-template-columns: 1fr;
  }

  .remove-row-btn {
    width: 100%;
  }
}
</style>
