<template>
  <Icon :icon="tagName" :color="tagColor" :width="size" :height="size" class="custom-icon" />
</template>

<script setup>
import { defineProps } from 'vue';
import { Icon } from '@iconify/vue';

defineProps({
  tagName: {
    type: String,
    default: '',
  },
  tagColor: {
    type: String,
    default: 'black',
  },
  size: {
    type: Number,
    default: 20,
  },
});

</script>

<style scoped>
.custom-icon {
  cursor: pointer;
  margin-right: 5px;
}
</style>