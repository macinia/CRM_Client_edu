<template>
  <form class="ui-form" @submit.prevent="handleSubmit">
    <div
      class="form-grid"
      :style="{
        gridTemplateColumns: columns === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))',
      }"
    >
      <slot
        name="before-fields"
        :form="modelValue"
        :errors="errors"
        :set-field-value="setFieldValue"
      />

      <template v-for="field in visibleFields" :key="field.name">
        <div
          class="form-field"
          :class="{
            'full-width': field.fullWidth || field.type === 'textarea',
          }"
        >
          <template v-if="isCustomField(field)">
            <slot
              :name="`field-${field.name}`"
              :field="field"
              :form="modelValue"
              :value="getFieldValue(field.name)"
              :error="errors?.[field.name]"
              :set-field-value="setFieldValue"
            />
          </template>

          <template v-else>
            <label :for="field.name" class="form-label">
              {{ field.label }}
              <span v-if="field.required" class="required-mark">*</span>
            </label>

            <textarea
              v-if="field.type === 'textarea'"
              :id="field.name"
              :value="getFieldValue(field.name)"
              :placeholder="field.placeholder || ''"
              :rows="field.rows || 4"
              :disabled="field.disabled"
              :readonly="field.readonly"
              class="form-control textarea"
              :class="{ invalid: errors?.[field.name] }"
              @input="setFieldValue(field.name, $event.target.value)"
            />

            <select
              v-else-if="field.type === 'select'"
              :id="field.name"
              :value="getFieldValue(field.name)"
              :disabled="field.disabled"
              class="form-control"
              :class="{ invalid: errors?.[field.name] }"
              @change="setFieldValue(field.name, $event.target.value)"
            >
              <option value="">
                {{ field.placeholder || 'Выберите значение' }}
              </option>

              <option
                v-for="option in field.options || []"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <input
              v-else
              :id="field.name"
              :type="field.type || 'text'"
              :value="getFieldValue(field.name)"
              :placeholder="field.placeholder || ''"
              :disabled="field.disabled"
              :readonly="field.readonly"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :inputmode="field.inputmode"
              class="form-control"
              :class="[
                {
                  invalid: errors?.[field.name],
                  'color-input': field.type === 'color',
                },
              ]"
              @input="setFieldValue(field.name, getInputValue(field, $event.target.value))"
            />

            <div v-if="field.description" class="field-description">
              {{ field.description }}
            </div>

            <div v-if="errors?.[field.name]" class="field-error">
              {{ errors[field.name] }}
            </div>
          </template>
        </div>
      </template>

      <slot
        name="after-fields"
        :form="modelValue"
        :errors="errors"
        :set-field-value="setFieldValue"
      />
    </div>

    <div v-if="formError" class="form-error">
      {{ formError }}
    </div>

    <div v-if="showActions" class="form-actions">
      <slot
        name="actions"
        :form="modelValue"
        :errors="errors"
        :set-field-value="setFieldValue"
        :submit="handleSubmit"
      >
        <button type="submit" class="submit-btn" :disabled="submitDisabled || disabled">
          {{ submitLabel }}
        </button>
      </slot>
    </div>
  </form>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  formError: {
    type: String,
    default: '',
  },
  submitLabel: {
    type: String,
    default: 'Сохранить',
  },
  submitDisabled: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const slots = useSlots()

const visibleFields = computed(() => {
  return props.fields.filter((field) => !field.hidden)
})

function getFieldValue(name) {
  return props.modelValue?.[name] ?? ''
}

function setFieldValue(name, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [name]: value,
  })
}

function getInputValue(field, value) {
  if (field.type === 'number') {
    return value === '' ? '' : Number(value)
  }

  return value
}

function isCustomField(field) {
  return field.type === 'slot' || Boolean(slots[`field-${field.name}`])
}

function handleSubmit() {
  emit('submit', props.modelValue)
}
</script>

<style scoped>
.ui-form {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  gap: 18px 16px;
}

.form-field {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.required-mark {
  color: var(--color-danger);
  margin-left: 2px;
}

.form-control {
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
    box-shadow var(--transition-base),
    background-color var(--transition-base);
}

.form-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.form-control::placeholder {
  color: var(--color-text-muted);
}

.form-control.textarea {
  min-height: 104px;
  padding: 12px 14px;
  resize: vertical;
}

.form-control.color-input {
  min-height: 52px;
  padding: 6px;
  cursor: pointer;
}

.form-control.invalid {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.08);
}

.field-description {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.field-error {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-danger);
}

.form-error {
  margin-top: 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-danger);
}

.form-actions {
  margin-top: 20px;
}

.submit-btn {
  width: 100%;
  min-height: 50px;
  border-radius: 14px;
  background-color: var(--color-primary);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  transition:
    background-color var(--transition-base),
    transform var(--transition-base);
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
