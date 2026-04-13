<template>
  <ModalLayout :IsOpen="isOpenModalEditSalary" @close="handleClose">
    <template #header>
      <span>Последняя выплата</span>
    </template>

    <div class="salary-modal-top">
      <div class="teacher-name">{{ salaryData?.teacherName || 'Преподаватель' }}</div>
      <div class="teacher-period">
        Текущий расчётный период: {{ salaryData?.periodLabel || '—' }}
      </div>
    </div>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Сохранить"
      :columns="1"
      @submit="saveSalaryRecord"
    />
  </ModalLayout>
</template>

<script setup>
import { ref, watch } from 'vue'

import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

const props = defineProps({
  isOpenModalEditSalary: {
    type: Boolean,
    required: true,
  },
  salaryData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['closeModalEditSalary', 'saveSalaryRecord'])

const errors = ref({})
const formError = ref('')

const fields = [
  {
    name: 'lastPaymentDate',
    label: 'Дата последней выплаты',
    type: 'date',
    required: true,
    fullWidth: true,
  },
  {
    name: 'lastPaymentAmount',
    label: 'Сумма последней выплаты',
    type: 'number',
    placeholder: 'Введите сумму',
    required: true,
    min: 0,
    step: 1,
    fullWidth: true,
  },
]

function createInitialForm() {
  return {
    teacherId: null,
    organizationId: 0,
    color: '#E8E3FA',
    lastPaymentDate: '',
    lastPaymentAmount: '',
  }
}

const form = ref(createInitialForm())

watch(
  () => props.salaryData,
  (value) => {
    errors.value = {}
    formError.value = ''

    if (!value || !Object.keys(value).length) {
      form.value = createInitialForm()
      return
    }

    form.value = {
      teacherId: value.teacherId ?? null,
      organizationId: value.organizationId ?? 0,
      color: value.color ?? '#E8E3FA',
      lastPaymentDate: value.lastPaymentDate ?? '',
      lastPaymentAmount: value.lastPaymentAmount ?? 0,
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
  emit('closeModalEditSalary')
}

function validateForm() {
  errors.value = {}
  formError.value = ''

  if (!form.value.lastPaymentDate) {
    errors.value.lastPaymentDate = 'Укажите дату последней выплаты'
  }

  if (form.value.lastPaymentAmount === '' || Number(form.value.lastPaymentAmount) < 0) {
    errors.value.lastPaymentAmount = 'Введите корректную сумму'
  }

  return Object.keys(errors.value).length === 0
}

function saveSalaryRecord() {
  if (!validateForm()) {
    formError.value = 'Проверьте заполнение полей формы'
    return
  }

  emit('saveSalaryRecord', {
    teacherId: Number(form.value.teacherId),
    organizationId: Number(form.value.organizationId) || 0,
    color: form.value.color,
    lastPaymentDate: form.value.lastPaymentDate,
    lastPaymentAmount: Number(form.value.lastPaymentAmount),
  })
}
</script>

<style scoped>
.salary-modal-top {
  margin-bottom: 18px;
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background-color: var(--color-surface-muted);
}

.teacher-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text);
}

.teacher-period {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
}
</style>
