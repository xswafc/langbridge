<template>
  <div class="form-container">
    <div class="d-flex" style="margin-bottom: 20px; margin-left: 100px;">
      <span class="cus-label">Adding Picture or capture the screen image.</span>
      <el-button @click="handleCapture" style="margin-left: 16px;">Screen Capture</el-button>
      <div v-if="isSelecting" class="selection-area" ref="selectionArea"></div>
    
      <el-dialog v-model="dialogVisible" title="截图结果">
        <img :src="screenshotData" style="max-width: 100%;" />
        <div v-if="recognizedText" class="text-result">
          <h4>识别结果：</h4>
          <p>{{ recognizedText }}</p>
        </div>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onScreenshotComplete">识别文字</el-button>
        </template>
      </el-dialog>
    </div>

    <div class="d-flex" style="margin-bottom: 20px; margin-left: 100px;">
      <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none">
      <el-icon size="20" @click="triggerFileSelect" style="cursor: pointer;"><CirclePlusFilled /></el-icon>
      <span class="cus-label" style="margin-left: 16px;">Add Picture</span>
    </div>

    <el-form label-width="240px">
      <el-form-item label="Original Language:">
        <el-select v-model="originalLanguage" placeholder="Select">
          <el-option label="English" value="en"></el-option>
          <el-option label="Spanish" value="es"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Target Content:">
        <el-input v-model="targetContent" placeholder="Enter target content"></el-input>
      </el-form-item>

      <el-form-item label="Sentence:">
        <el-input type="textarea" v-model="recognizedText" placeholder="Enter sentence"></el-input>
        <el-button @click="handleCapture" style="margin-top: 16px;">Sentence Example</el-button>
      </el-form-item>

      <el-form-item label="Translation Language:">
        <el-select v-model="translationLanguage" placeholder="Select">
          <el-option label="Spanish" value="es"></el-option>
          <el-option label="English" value="en"></el-option>
        </el-select>
        <el-button @click="handleCapture" style="margin-left: 16px;">Translate</el-button>
      </el-form-item>

      <el-form-item>
        <span class="cus-label">Please input a short description about the sentences.</span>
        <el-input type="textarea" v-model="description" placeholder="Enter description"></el-input>
        <el-button @click="handleCapture" style="margin-top: 16px;">Advanced Search</el-button>
      </el-form-item>

      <el-form-item label="Local File Path:">
        <el-input v-model="localFilePath" placeholder="Enter local file path"></el-input>
        <el-button @click="setFilePath" style="margin-left: 20px;">Set</el-button>
      </el-form-item>

      <el-form-item>
        <div style="display: flex; flex-direction: column;">
          <span class="cus-label">If you know a perfect sentence contained the target word on YouTube, fill the video URL in the blank, and we will show you this sentence first.</span>
          <div class="d-flex">
            <el-input v-model="youtubeUrl" placeholder="Enter YouTube URL" style="width: 500px;"></el-input>
            <el-button @click="submit" style="margin-left: 20px;">Submit</el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-input type="textarea" v-model="additionalInput" placeholder="Additional input"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import { createWorker } from 'tesseract.js';
import { ElMessage } from 'element-plus';

import { CirclePlusFilled } from '@element-plus/icons-vue';

// 页面初始化变量
const originalLanguage = ref('');
const targetContent = ref('');
const translationLanguage = ref('');
const description = ref('');
const localFilePath = ref('');
const youtubeUrl = ref('');
const additionalInput = ref('');

// 截图相关
const isSelecting = ref(false);
const startPos = ref({ x: 0, y: 0 });
const selectionArea = ref(null);
const screenshotData = ref('');
const dialogVisible = ref(false);
const recognizedText = ref('');

const setFilePath = () => {
  console.log('File path set:', this.localFilePath);
}

const handleCapture = () => {
  isSelecting.value = true;
  document.addEventListener('mousedown', onMouseDown);
}

const onMouseDown = (e) => {
  startPos.value = { x: e.clientX, y: e.clientY };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e) => {
  if (!isSelecting.value) return;
  
  const area = selectionArea.value;
  const x = Math.min(e.clientX, startPos.value.x);
  const y = Math.min(e.clientY, startPos.value.y);
  const width = Math.abs(e.clientX - startPos.value.x);
  const height = Math.abs(e.clientY - startPos.value.y);
  
  area.style.left = `${x}px`;
  area.style.top = `${y}px`;
  area.style.width = `${width}px`;
  area.style.height = `${height}px`;
};

const onMouseUp = async () => {
  isSelecting.value = false;
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  
  const area = selectionArea.value;
  const rect = area.getBoundingClientRect();
  
  try {
    const canvas = await html2canvas(document.body, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      scale: 1,
      logging: false,
      useCORS: true,
    });
    
    screenshotData.value = canvas.toDataURL('image/png');
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error('截图失败: ' + error.message);
  }
};

const recognizeText = async (imageUrl) => {
  try {
    ElMessage.info('正在识别文字，请稍候...');
    
    const worker = await createWorker({
      workerPath: process.env.NODE_ENV === 'production' 
        ? 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/worker.min.js'
        : '/js/worker.min.js',
      langPath: '/tessdata',
      corePath: '/js/tesseract-core.wasm.js',
      gzip: false,
    });
    
    await worker.load();
    await worker.loadLanguage('eng+fra');
    await worker.initialize('eng+fra');
    const { data: { text } } = await worker.recognize(imageUrl);

    await worker.terminate();

    return text;
  } catch (error) {
    ElMessage.error('文字识别失败: ' + error.message);
    throw error;
  }
};

// 在截图完成后调用
const onScreenshotComplete = async () => {
  try {
    const text = await recognizeText(screenshotData.value);
    recognizedText.value = text;
    ElMessage.success('文字识别完成');
  } catch (error) {
    console.error('OCR Error:', error);
  }
};


// 触发文件选择
const fileInput = ref(null);
const triggerFileSelect = () => {
  fileInput.value.click();
};
// 处理文件选择
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件');
    return;
  }

  recognizedText.value = '';

  try {
    const text = await recognizeText(file);
    recognizedText.value = text;
    ElMessage.success('识别成功');
  } catch (error) {
    ElMessage.error(`识别失败: ${error.message}`);
  } finally {
    // 重置输入，允许重复选择同一文件
    e.target.value = '';
  }
};

const submit = () => {
}
</script>

<style scoped>
.form-container {
  padding: 20px;
}
.cus-label {
  color: #606266;
}
.el-input {
  --el-input-width: 240px;
  height: 36px; 
}
.el-select {
  --el-select-width: 240px;
}

.selection-area {
  position: fixed;
  border: 2px dashed #409EFF;
  background-color: rgba(64, 158, 255, 0.1);
  z-index: 9999;
  pointer-events: none;
}

.text-result {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>