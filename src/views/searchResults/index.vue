<template>
  <div class="container">
    <!-- 左侧视频播放器 -->
    <div class="video-container">
      <CusVideo ref="cusVideoRef" :selected-video="selectedVideo" />
      <div class="youtube-url">
        <p>If you know another better sentence on YouTube, fill the video URL in the blank, then try to search again after one minute.</p>
        <el-input type="textarea" v-model="youtubeUrl" placeholder="Enter YouTube URL"></el-input>
        <el-input type="textarea" v-model="preferredVideoSentence" placeholder="Additional input" style="margin-top: 20px;"></el-input>
        <el-button @click="submitYoutubeUrl" style="margin-top: 20px;">Submit</el-button>
        <el-button @click="research" style="margin-top: 20px;">Research</el-button>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="content-container">
      <!-- 目标单词和原始句子 -->
      <div class="target-word">
        <p><strong>Target Word:</strong> {{ targetWord }}</p>
        <p><strong>Original Sentence:</strong> {{ originalSentence }}</p>
      </div>

      <!-- 视频类型选择 -->
      <div class="d-flex" style="align-items: center;">
        <p style="width: 120px;"><strong>Video Type:</strong></p>
        <el-select v-model="selectedVideoType" placeholder="Select" style="width: 240px;" multiple>
          <el-option label="Online Videos" value="online"></el-option>
          <el-option label="Hilinkus Videos" value="hilinkus"></el-option>
          <el-option label="Local Videos" value="local"></el-option>
        </el-select>
      </div>

      <!-- 句子列表 -->
      <div class="sentence-list">
        <div v-for="(sentence, index) in sentences" :key="index" class="sentence-item">
          <p>{{ index + 1 }}. {{ sentence.text }}</p>
          <el-button @click="editSentence(index)">Edit</el-button>
          <el-button @click="deleteSentence(index)">Delete</el-button>
          <div v-if="sentence.editing">
            <el-input v-model="sentence.text" placeholder="Edit sentence"></el-input>
            <el-button @click="confirmEdit(sentence, index)">Confirm</el-button>
            <el-button @click="cancelEdit(sentence)">Cancel</el-button>
          </div>
          <div class="ratings">
            <el-rate v-model="sentence.rating" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
            <p>Total Word Count: {{ sentence.wordCount }}</p>
            <p>C1: {{ sentence.c1 }} B2: {{ sentence.b2 }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

import CusVideo from '@components/Video.vue'

const youtubeUrl = ref('');
const preferredVideoSentence = ref('');
const targetWord = ref('competitive');
const originalSentence = ref('Some US industries are not as competitive as they have been in the past.');
const selectedVideoType = ref('all');
const cusVideoRef = ref(null);
const selectedVideo = ref('./test.mp4');

// 提交 YouTube 链接
const submitYoutubeUrl = () => {
  // 处理提交逻辑
};

// 研究
const research = () => {
  // 处理研究逻辑
};

// 句子列表数据
const sentences = reactive([
  { text: 'In the competitive world of alligator mating, size matters.', rating: 3, wordCount: 17, c1: 2, b2: 7, editing: false },
  { text: 'Artists are enormously so competitive.', rating: 2, wordCount: 17, c1: 3, b2: 1, editing: false },
  { text: 'The idea of repealing the wealth tax was to make France more competitive and attractive to entrepreneurs.', rating: 4, wordCount: 17, c1: 3, b2: 3, editing: false }
]);

// 编辑句子
const editSentence = (index) => {
  sentences[index].editing = true;
};

// 删除句子
const deleteSentence = (index) => {
  sentences.splice(index, 1);
};

// 确认编辑
const confirmEdit = (sentence) => {
  sentence.editing = false;
  // 更新其他相关数据
};

// 取消编辑
const cancelEdit = (sentence) => {
  sentence.editing = false;
};
</script>

<style scoped>
.container {
  display: flex;
}

.video-container {
  width: 30%;
  padding: 20px;
}

.content-container {
  width: 50%;
  padding: 20px;
}

.target-word {
  margin-bottom: 20px;
}

.sentence-list {
  margin-top: 20px;
}

.sentence-item {
  margin-bottom: 20px;
}

.ratings {
  margin-top: 10px;
}
</style>