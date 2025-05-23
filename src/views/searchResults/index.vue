<template>
  <div class="container">
    <!-- 左侧视频播放器 -->
    <div class="video-container">
      <CusVideo ref="cusVideoRef" :selected-video="selectedVideo" :position="'bottom'" />
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
        <div class="flex-between">
          <p><strong>Target Word:</strong> {{ targetWord.lemma }}</p>
          <div class="d-flex">
            <CustomRateHeart v-model="targetWord.stars" />
            <TagIcon :tagName="'mdi:tag'" :color="tagWordColor" @click="toggleWordTagColor" />
            <TagIcon :tagName="'mdi:notebook'" :color="notebookWordColor" @click="toggleNotebookWordColor" />
            <el-icon :size="20" style="cursor: pointer;" @click="deleteWord"><DeleteFilled /></el-icon>
          </div>
        </div>
        
        <div class="flex-between">
          <p style="max-width: 60%;"><strong>Original Sentence:</strong> {{ originalSentence.text }}</p>
          <div class="d-flex">
            <CustomRateStar v-model="originalSentence.stars"/>
            <TagIcon :tagName="'mdi:tag'" :color="tagSenColor" @click="toggleSenTagColor" />
            <TagIcon :tagName="'mdi:notebook'" :color="notebookSenColor" @click="toggleNotebookSenColor" />
            <el-icon :size="20" style="cursor: pointer;" @click="deleteSentence"><DeleteFilled /></el-icon>
          </div>
        </div>
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
        <div v-for="(sentence, index) in results" :key="sentence.sentenceId" class="sentence-item flex-between">
          <div class="left">
            <div class="d-flex">
              <span style="margin-right: 16px;">{{ index + 1 }}</span>
              <div v-if="sentence.editable" class="sentence-content">
                {{ sentence.sentenceText }}
              </div>
              <el-input
                v-else
                type="textarea"
                :rows="2"
                placeholder="Edit sentence..."
                v-model="sentence.sentenceText"
                @blur="confirmEdit"
                @keyup.enter="confirmEdit"
              ></el-input>
            </div>
            <div class="d-flex">
              <div style="margin: 16px;">
                <TagIcon :tagName="'mdi:pen'" :color="sentence.editable ? 'black' : '#FFA500'" @click="toggleEditColor(sentence)" />
                <TagIcon :tagName="'streamline:paragraph-solid'" :color="sentence.editable ? 'black' : '#FFA500'" @click="toggleEditColor(sentence)" />
              </div>
              <div v-if="!sentence.editable" class="controls">
                <el-button type="primary" size="small" @click="confirmEdit">Confirm</el-button>
                <el-button type="danger" size="small" @click="cancelEdit">Cancel</el-button>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="d-flex">
              <el-icon :size="20" style="margin-right: 8px;"><VideoPlay /></el-icon>
              <TagIcon :tagName="sentence.editable ? 'material-symbols:visibility-rounded' : 'material-symbols:visibility-off-rounded'" :color="'black'" :size="24" @click="toggleEditColor(sentence)" />
              <CustomRateStar v-model="sentence.stars"/>
              <TagIcon :tagName="'mdi:tag'" :color="tagSenColor" @click="toggleSenTagColor" />
              <TagIcon :tagName="'mdi:notebook'" :color="notebookSenColor" @click="toggleNotebookSenColor" />
              <el-icon :size="20" style="cursor: pointer;" @click="deleteSentence"><DeleteFilled /></el-icon>
            </div>
            <div>Total Word Count: {{ sentence.wordNum }}</div>
            <div><span v-for="item in sentence.wordLevels" :key="item.level">{{ item.level }}: {{ item.num }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

import CusVideo from '@components/Video.vue'
import CustomRateHeart from '@components/CustomRateHeart.vue';
import CustomRateStar from '@components/CustomRateStar.vue';
import TagIcon from '@components/TagIcon.vue';

import { DeleteFilled, VideoPlay } from '@element-plus/icons-vue';


const youtubeUrl = ref('');
const preferredVideoSentence = ref('');
const targetWord = ref({
  "lemma": "repeal", //目标词（经过归一化后的词元）
  "stars": 2, //目标词收藏星级，为空表示未收藏
  "studyStatus": 0, //目标词学习状态，0-未掌握，1-已掌握，为空表示未收藏
  "senseInfo": {  //目标词在原句中的义项信息，用于点击加号按钮后的弹窗展示，为空时不展示加号按钮
  "senseGroup": "xxx", //小意群（短语）
  "senseGroupVideo": "xxx"
  }
});
const originalSentence = ref({
  text: 'Some US industries are not as competitive as they have been in the past.',
  stars: 2,
  studyStatus: 0
});
const selectedVideoType = ref('all');
const cusVideoRef = ref(null);
const selectedVideo = ref({
  src: './test.mp4'
});

// 初始化颜色状态
const tagWordColor = ref('black');
const tagSenColor = ref('black');
const notebookWordColor = ref('black');
const notebookSenColor = ref('black');

// 切换标签图标颜色
const toggleWordTagColor = () => {
  tagWordColor.value = tagWordColor.value === 'black' ? 'red' : 'black';
};

const toggleSenTagColor = () => {
  tagSenColor.value = tagSenColor.value === 'black' ? '#FFA500' : 'black';
}

const toggleEditColor = (sentence) => {
  sentence.editable = !sentence.editable;
}

// 切换笔记本图标颜色
const toggleNotebookWordColor = () => {
  notebookWordColor.value = notebookWordColor.value === 'black' ? 'red' : 'black';
};

const toggleNotebookSenColor = () => {
  notebookSenColor.value = notebookSenColor.value === 'black' ? '#FFA500' : 'black';
};

const deleteWord = () => {

}
const deleteSentence = () => {}

// 提交 YouTube 链接
const submitYoutubeUrl = () => {
  // 处理提交逻辑
};

// 研究
const research = () => {
  // 处理研究逻辑
};

// 句子列表数据
const results = reactive([
  {
    "sentenceId": "1",  //句子id
    "sentenceText": "The idea of repealing the wealth tax was to make France more competitive and attractive to entrepreneurs.",  //句子文本
    "source": 1, //句子来源，1-在线视频，2-本地视频，3-收藏的手输句子
    "currentTargetWord": "repealing", //当前目标词在本句内的形态，与外层targetWord对象的lemma字段值可能不一致，收藏句子时需要传递此值而非lemma
    "collectedTargetWord": "attractive", //仅当本句是已收藏状态时此字段有值，表示最初收藏时关联的是哪个目标词
    "collectionId": "xxx", //收藏id，仅当本句是已收藏状态时此字段有值，用于取消收藏等相关的操作
    "videoUrl": "xxx", //在线视频播放地址，仅针对在线视频
    "videoLocalPath": "xxx", //本地视频文件路径，仅针对本地视频
    "startTime": 65000, //句子在视频中的开始时间戳，单位毫秒，用于播放定位
    "endTime": 68000, //句子在视频中的结束时间戳，单位毫秒，用于播放定位
    "stars": 2, //句子收藏星级
    "studyStatus": 0, //句子学习状态，0-未掌握，1-已掌握
    "wordNum": 8, //句内单词总数
    "wordLevels": [ //单词难度列表
      {
        "level": "B2", //难度
        "num": 2 //此难度的单词数
      }
    ],
    "editable": true //文本和时间戳是否可编辑
  },
  {
    "sentenceId": "2",  //句子id
    "sentenceText": "The idea of repealing the ",  //句子文本
    "source": 1, //句子来源，1-在线视频，2-本地视频，3-收藏的手输句子
    "currentTargetWord": "repealing", //当前目标词在本句内的形态，与外层targetWord对象的lemma字段值可能不一致，收藏句子时需要传递此值而非lemma
    "collectedTargetWord": "attractive", //仅当本句是已收藏状态时此字段有值，表示最初收藏时关联的是哪个目标词
    "collectionId": "xxx", //收藏id，仅当本句是已收藏状态时此字段有值，用于取消收藏等相关的操作
    "videoUrl": "xxx", //在线视频播放地址，仅针对在线视频
    "videoLocalPath": "xxx", //本地视频文件路径，仅针对本地视频
    "startTime": 65000, //句子在视频中的开始时间戳，单位毫秒，用于播放定位
    "endTime": 68000, //句子在视频中的结束时间戳，单位毫秒，用于播放定位
    "stars": 2, //句子收藏星级
    "studyStatus": 0, //句子学习状态，0-未掌握，1-已掌握
    "wordNum": 8, //句内单词总数
    "wordLevels": [ //单词难度列表
      {
        "level": "B2", //难度
        "num": 2 //此难度的单词数
      }
    ],
    "editable": true, //文本和时间戳是否可编辑
  }
]);

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

<style scoped lang="scss">
.container {
  display: flex;
}

.video-container {
  width: 30%;
  padding: 20px;
}

.content-container {
  width: 70%;
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
  align-items: flex-start;
  .controls {
    margin-top: 16px;
  }
  .right {
    width: 30%;
    margin-left: 20px;
  }
}

.ratings {
  margin-top: 10px;
}

.iconify {
  cursor: pointer;
  margin-right: 10px;
}

</style>