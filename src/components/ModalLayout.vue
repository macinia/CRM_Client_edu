<template>
  <div v-if="IsOpen" class="wrapper">
    <div class="modal">
      <div class="modal-head">
        <slot name="header"></slot>
        <button @click="$emit('close')">
          <img src="@/assets/krest.svg" alt="close" class="edit-icon" />
        </button>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: #fffaff;
  width: 960px;
  max-height: 80vh; 
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-size: 32px;
  font-weight: bold;
  background-color: #802e87;
  color: #000000;
}

.modal-head button {
  background: none;
  border: none;
  font-size: 18px;
  color: white;
  cursor: pointer;
}


.modal-content {
  padding: 20px;
  overflow-y: auto;
  max-height: 70vh;
}
.edit-icon {
  width: 48px;
  height: 48px;
}
</style>
