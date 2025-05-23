<template>
  <div style="margin-top: 20px;">
    <!-- 视频播放器 -->
    <div v-if="selectedVideo">
      <div :class="position === 'bottom' ? '' : 'd-flex'" style="align-items: anchor-center;">
        <video ref="videoPlayer" controls :src="selectedVideo.src" @timeupdate="onTimeUpdate" style="width: 400px;"></video>
        <div class="d-flex">
          <el-button :style="{marginLeft: position === 'bottom' ? '' : '20px'}" @click="selectVideo"><el-icon style="margin-right: 8px;"><VideoPlay /></el-icon>Play</el-button>
          <el-button style="margin-left: 20px;" @click="selectVideo"><el-icon style="margin-right: 8px;"><CaretRight /></el-icon>Watch in YouTube</el-button>
        </div>
      </div>
      <div class="controls">
        <div style="margin: 10px 0;">
          <span>{{ formatTime(rangeValue[0]) }} - {{ formatTime(rangeValue[1]) }}</span>
        </div>
        <div class="d-flex" style="align-items: center;">
          <el-button size="small" round @click="playCustomRange">play</el-button>
          <el-slider range class="custom-slider" v-model="rangeValue" :max="duration" :step="1" @change="onRangeChange"></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';
import { ElButton, ElSlider } from 'element-plus';
import { VideoPlay, CaretRight } from '@element-plus/icons-vue'

const props = defineProps({
  selectedVideo: {
    type: Object,
    default: null,
  },
  position: {
    type: String,
    default: 'right'
  }
});

const videoPlayer = ref(null);
const duration = ref(0);
const rangeValue = ref([0, 0]);

// 选择视频并初始化播放器
const selectVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.src = props.selectedVideo.src; // 设置视频源
    videoPlayer.value.load(); // 加载视频资源
    videoPlayer.value.addEventListener('loadedmetadata', () => {
      duration.value = Math.floor(videoPlayer.value.duration);
      rangeValue.value = [0, duration.value]; // 设置整个视频时长为默认值
      autoPlayVideo(); // 自动播放视频
    });
  }
};

// 自动播放视频的方法
const autoPlayVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = rangeValue.value[0]; // 设置开始时间为用户选择的时间或默认0秒
    videoPlayer.value.play().then(() => {
      // 播放成功后的逻辑
    }).catch((error) => {
      console.log("自动播放被阻止:", error);
    });
  }
};

// 播放自定义范围内的视频
const playCustomRange = () => {
  if (videoPlayer.value && rangeValue.value[0] < rangeValue.value[1]) {
    videoPlayer.value.currentTime = rangeValue.value[0];
    videoPlayer.value.play().then(() => {
      videoPlayer.value.addEventListener('timeupdate', checkEnd);
    });
  }
};

// 检查是否到达结束时间
const checkEnd = () => {
  if (videoPlayer.value.currentTime >= rangeValue.value[1]) {
    videoPlayer.value.pause();
    videoPlayer.value.removeEventListener('timeupdate', checkEnd);
  }
};

// 当范围改变时调用此方法
const onRangeChange = (value) => {
  rangeValue.value = value;
};

// 监听视频加载元数据以获取总时长
const onTimeUpdate = () => {
  if (videoPlayer.value) {
    duration.value = Math.floor(videoPlayer.value.duration);
  }
};

// 格式化时间显示
const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

defineExpose({ selectVideo });
</script>

<style scoped>
.controls {
  margin-top: 10px;
}
.controls span {
  margin-right: 10px;
}
/* 调整 el-slider 的宽度 */
.custom-slider {
  margin-left: 20px;
  width: 330px; /* 或者任何你想要的宽度 */
}
</style>