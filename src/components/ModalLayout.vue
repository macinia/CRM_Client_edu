<template>
  <div v-if="IsOpen" class="wrapper" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-head">
        <div class="modal-title">
          <slot name="header"></slot>
        </div>

        <button class="close-btn" @click="$emit('close')">
          <img src="@/assets/krest.svg" alt="close" class="close-icon" />
        </button>
      </div>

      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])

defineProps({
  IsOpen: {
    type: Boolean,
    required: true,
  },
})
</script>

<style scoped>
.wrapper {
  position: fixed;
  inset: 0;
  padding: 24px;
  background-color: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: min(960px, 100%);
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-radius: 24px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.modal-head {
  min-height: 76px;
  padding: 18px 20px 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-text);
}

.close-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--color-surface-muted);
  transition: background-color var(--transition-base);
}

.close-btn:hover {
  background-color: var(--color-primary-soft);
}

.close-icon {
  width: 22px;
  height: 22px;
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
}
</style>
