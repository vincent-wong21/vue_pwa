<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(1)
const sum = ref(0)

const recur = (num) => {
  if (num === 1) return 1
  return num * recur(num - 1)
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div>
    <button type="button" class="btn btn-outline-dark" @click="count++">count is {{ count }}</button>
    <div>{{ recur(count).toString() }}</div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
