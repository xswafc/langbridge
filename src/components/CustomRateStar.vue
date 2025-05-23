<template>
  <div class="custom-rate">
    <span v-for="(item, index) in max" :key="index" @click="handleClick(index)">
      <Icon 
        :icon="filledIndexes.includes(index) ? 'mdi:star' : 'mdi:star-outline'" 
        :color="filledIndexes.includes(index) ? '#FFA500' : '#D3D3D3'"
        width="24"
        height="24"
      />
    </span>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 3,
  },
});

const emit = defineEmits(['update:modelValue']);

const filledIndexes = computed(() => Array.from({ length: props.modelValue }, (_, i) => i));

const handleClick = (index) => {
  emit('update:modelValue', index + 1);
};
</script>

<style scoped>
.custom-rate span {
  cursor: pointer;
  margin-right: 5px;
}
</style>