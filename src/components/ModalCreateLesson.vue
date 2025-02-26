<template>
  <div v-if="isOpen" class="modal">
    <h2>Создать занятие</h2>
    <button @click="$emit('close')">Закрыть</button>
  </div>
</template>

<script setup>
defineProps({ isOpen: Boolean });
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
