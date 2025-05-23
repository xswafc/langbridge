<template>
  <div class="custom-rate">
    <span v-for="(item, index) in max" :key="index" @click="handleClick(index)">
      <Icon 
        :icon="filledIndexes.includes(index) ? 'mdi:heart' : 'mdi:heart-outline'" 
        :color="filledIndexes.includes(index) ? '#FF0000' : '#D3D3D3'"
        width="20"
        height="20"
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