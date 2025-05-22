<template>
  <div :style="{width: isCollapse ? '100%' : '95%'}">
    <el-table :data="tableData">
      <el-table-column prop="Target Word" label="Target Word" width="150" fixed></el-table-column>
      <el-table-column prop="Sense Group" label="Sense Group" width="180"></el-table-column>
      <el-table-column prop="Sentence" label="Sentence" width="200">
        <template #default="scope">
          <!-- 如果需要马赛克处理 -->
          <div v-if="shouldMosaic(scope.row)">
            <img :src="createMosaic(scope.row.Sentence)" alt="Mosaic Text"/>
          </div>
          <!-- 否则正常显示 -->
          <span v-else>{{ scope.row.Sentence }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Total Word Count" label="Total Word Count"></el-table-column>
      <el-table-column prop="Level Distribution" label="Level Distribution" width="110"></el-table-column>
      <el-table-column prop="Familiarity Level" label="Familiarity Level">
        <template #default="scope">
          <el-rate v-model="scope.row['Familiarity Level']" text-color="#ff9900" score-template="{value}" :max="3"></el-rate>
        </template>
      </el-table-column>
      <el-table-column prop="Learning State" label="Learning State">
        <!-- <template #default="scope">
          <el-tag>{{ scope.row['Learning State'] }}</el-tag>
        </template> -->
        <template #default="scope">
          <div class="icon-container">
            <el-icon @click="toggleColor('tag', scope.$index)" :style="{ color: tagColors[scope.$index] }">
              <CollectionTag />
            </el-icon>
            <el-icon @click="toggleColor('notebook', scope.$index)" :style="{ color: notebookColors[scope.$index] }">
              <Notebook />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Operation" label="Operation"  width="200" fixed="right">
        <template #default="scope">
          <div class="custom-link" @click="selectVideo(scope.row)">Play</div>
          <div class="custom-link" @click="selectVideo(scope.row)">Show Context</div>
          <div class="custom-link" @click="selectVideo(scope.row)">View</div>
          <div class="custom-link" @click="selectVideo(scope.row)">More Sentences</div>
          <div class="custom-link" @click="selectVideo(scope.row)">Test</div>
          <div class="custom-link" @click="selectVideo(scope.row)">Cancel Collection</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <CusVideo ref="cusVideoRef" :selected-video="selectedVideo" />
</template>

<script setup>
import { ref } from 'vue';

import CusVideo from '@components/Video.vue'

import { CollectionTag, Notebook } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import homeStore from "@store/home.js";

const _homeStore = homeStore();
const {
  isCollapse,
} = storeToRefs(_homeStore);

const tagColors = ref(['#FFA500', '#FFA500', '#FFA500']); 
const notebookColors = ref(['#8B4513', '#8B4513', '#8B4513']); 

const cusVideoRef = ref(null);
const selectedVideo = ref(null);

const tableData = [
  {
    id: 1,
    "Target Word": "competitive",
    "Sense Group": "a competitive market",
    "Sentence": "In the competitive world of alligator mating, size matters.",
    "Total Word Count": 9,
    "Level Distribution": "C1 2 B2 7",
    "Familiarity Level": 1,
    "Learning State": "tagged",
    src: './test.mp4',
    mosaic: true
  },
]

const toggleColor = (type, index) => {
  if (type === 'tag') {
    tagColors.value[index] = tagColors.value[index] === '#FFA500' ? '#007bff' : '#FFA500'; // 切换颜色
  } else if (type === 'notebook') {
    notebookColors.value[index] = notebookColors.value[index] === '#8B4513' ? '#007bff' : '#8B4513'; // 切换颜色
  }
};

const shouldMosaic = (row) => row.mosaic;

// 创建文本的马赛克图像
function createMosaic(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 30;
  const mosaicSize = 8; // 调整这个值以改变马赛克块大小
  
  context.font = `${fontSize}px Arial`;
  const metrics = context.measureText(text);
  const textWidth = metrics.width;
  
  canvas.width = textWidth;
  canvas.height = fontSize + 10;
  
  // 绘制原始文本
  context.fillStyle = 'black';
  context.fillText(text, 0, fontSize);
  
  // 马赛克处理
  for (let x = 0; x < canvas.width; x += mosaicSize) {
    for (let y = 0; y < canvas.height; y += mosaicSize) {
      const pixelColor = context.getImageData(x, y, 1, 1).data;
      context.fillStyle = `rgba(${pixelColor[0]}, ${pixelColor[1]}, ${pixelColor[2]}, ${pixelColor[3] / 255})`;
      context.fillRect(x, y, mosaicSize, mosaicSize);
    }
  }

  return canvas.toDataURL();
}

// 选择视频并初始化播放器
const selectVideo = (row) => {
  selectedVideo.value = row;
  cusVideoRef.value.selectVideo();
};
</script>

<style scoped>
.icon-container .el-icon {
  cursor: pointer;
  margin-right: 10px;
}

.mosaic-text {
  position: relative;
  display: inline-block;
}

.mosaic-text::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.8) 5px,
    rgba(255, 255, 255, 0.8) 5px,
    rgba(255, 255, 255, 0.8) 10px
  );
}
</style>