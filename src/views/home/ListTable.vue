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
          <div v-else-if="scope.row.editing">
            <!-- 可编辑的文本区域 -->
            <div 
              ref="editableDiv"
              contenteditable 
              @mouseup="handleTextSelection(scope.row)"
              v-html="highlightedText(scope.row)"
              style="border: 1px solid #dcdfe6; padding: 5px; min-height: 30px;"
            ></div>
            
            <!-- 标记按钮（浮动显示） -->
            <el-button 
              v-if="showMarkButton"
              size="small"
              @click="markSelectedText(scope.row)"
              style="position: absolute; z-index: 100; margin-top: 6px;"
            >
              Mark
            </el-button>
          </div>
          <div v-else v-html="highlightedText(scope.row)"></div>
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
          <div class="custom-link" @click="showContext(scope.row)">Show Context</div>
          <div class="custom-link" @click="goView(scope.row)">View</div>
          <div class="custom-link" @click="toggleEditMode(scope.$index)">{{ scope.row.editing ? 'Cancel' : 'Mark Words' }}</div>
          <div class="custom-link" @click="clearAllMarks(scope.row)" v-if="scope.row.marked?.length > 0" >Clear All Marks</div>
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
import { ref, nextTick } from 'vue';

import CusVideo from '@components/Video.vue'

import { CollectionTag, Notebook } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import homeStore from "@store/home.js";

import { useRouter } from "vue-router";

const router = useRouter();

const _homeStore = homeStore();
const {
  isCollapse,
} = storeToRefs(_homeStore);

const tagColors = ref(['#FFA500', '#FFA500', '#FFA500']); 
const notebookColors = ref(['#8B4513', '#8B4513', '#8B4513']); 

const cusVideoRef = ref(null);
const selectedVideo = ref(null);

const tableData = ref([
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
    mosaic: true,
    marked: [], 
    editing: false
  },
  {
    id: 2,
    "Target Word": "competitive",
    "Sense Group": "a competitive market",
    "Sentence": "In the competitive world of alligator mating, size matters.",
    "Total Word Count": 9,
    "Level Distribution": "C1 2 B2 7",
    "Familiarity Level": 1,
    "Learning State": "tagged",
    src: './test.mp4',
    mosaic: false,
    marked: [], 
    editing: true
  },
])

// mark
const editableDiv = ref(null);
const showMarkButton = ref(false);
const currentSelection = ref(null);
const currentEditingRow = ref(null);

const toggleColor = (type, index) => {
  if (type === 'tag') {
    tagColors.value[index] = tagColors.value[index] === '#FFA500' ? '#007bff' : '#FFA500'; // 切换颜色
  } else if (type === 'notebook') {
    notebookColors.value[index] = notebookColors.value[index] === '#8B4513' ? '#007bff' : '#8B4513'; // 切换颜色
  }
};

const shouldMosaic = (row) => row.mosaic;
const showContext = (row) => row.mosaic = false;
const goView = (row) => {
  const id = row.id;
  router.push("/sentence/detail/" + id);
};

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

// 切换编辑模式
const toggleEditMode = (index) => {
  tableData.value.forEach((r, i) => {
    r.editing = i === index ? !r.editing : false;
  });
  
  if (tableData.value[index].editing) {
    currentEditingRow.value = index;
    nextTick(() => {
      editableDiv.value.focus();
    });
  } else {
    currentEditingRow.value = null;
  }
  showMarkButton.value = false;
};

// 处理文本选择
const handleTextSelection = () => {
  const selection = window.getSelection();
  if (!selection.toString().trim()) {
    showMarkButton.value = false;
    return;
  }
  
  currentSelection.value = selection;
  showMarkButton.value = true;
};

// 标记选中的文本
const markSelectedText = (row) => {
  if (!currentSelection.value) return;
  
  const selectedText = currentSelection.value.toString();
  const range = currentSelection.value.getRangeAt(0);
  
  // 创建标记的span元素
  const span = document.createElement('span');
  span.style.color = '#3F9EFF';
  span.style.fontWeight = 'bold';
  
  // 替换选中文本
  range.deleteContents();
  span.appendChild(document.createTextNode(selectedText));
  range.insertNode(span);
  
  // 保存标记信息
  const markedText = selectedText;
  if (!row.marked.includes(markedText)) {
    row.marked.push(markedText);
  }
  
  showMarkButton.value = false;
  currentSelection.value = null;
};

// 高亮已标记的文本
const highlightedText = (row) => {
  let text = row.Sentence;
  row.marked.forEach(word => {
    const regex = new RegExp(escapeRegExp(word), 'g');
    text = text.replace(regex, `<span style="color: #3F9EFF; font-weight: bold">${word}</span>`);
  });
  return text;
};

// 转义正则特殊字符
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
// 清除所有标记
const clearAllMarks = (row) => {
  row.marked = [];
};
</script>

<style scoped>
.icon-container .el-icon {
  cursor: pointer;
  margin-right: 10px;
}

[contenteditable] span {
  color: #3F9EFF;
  font-weight: bold;
}
</style>