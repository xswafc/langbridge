<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="appStore.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!settingsStore.topNav"
    />
    <top-nav
      id="topmenu-container"
      class="topmenu-container"
      v-if="settingsStore.topNav"
    />
    <div class="right-menu">
      <div class="avatar-container">
        <el-dropdown
          @command="handleCommand"
          class="right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <el-tooltip :content="userStore.userInfo.name" placement="bottom">
              <img :src="userStore.avatar" class="user-avatar" v-if="userStore.avatar" />
              <img src="@/assets/images/index/avator.svg" class="user-avatar" v-else />
            </el-tooltip>
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <!--  <a target="_blank" href="javascript:">
                <el-dropdown-item>HR 系统</el-dropdown-item>
              </a>
              <a target="_blank" href="javascript:">
                <el-dropdown-item>OA 系统</el-dropdown-item>
              </a> -->
              <el-dropdown-item
                command="setLayout"
                v-if="settingsStore.showSettings"
              >
                <span>布局设置</span>
              </el-dropdown-item>
              <!-- <el-dropdown-item divided command="logout"> -->
              <el-dropdown-item command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <RegistrateDialog ref="RegistrateRef" :title="'客户登记'"/>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import HeaderSearch from "@/components/HeaderSearch";
import RegistrateDialog from '@/views/customer/customerList/RegistrateDialog.vue';
// import RuoYiGit from '@/components/RuoYi/Git'
// import RuoYiDoc from '@/components/RuoYi/Doc'
import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";
import CacheUtils from "@/utils/cache-utils";
import { useRouter } from "vue-router";
import { getVersion } from "@/api/base";

import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import customerStore from "@/store/customer";

const _customerStore = customerStore();

const {
  patientForm,
} = storeToRefs(_customerStore);

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const isDevEnv = computed(() => {
  return "development" === import.meta.env.VITE_APP_ENV;
});
const userName = computed(() => {
  let name = CacheUtils.getItem("curUser").name;
  return name;
});

onMounted(() => {
  checkVersion();
});

const RegistrateRef = ref(null);

const registrateCustomer = () => {
  RegistrateRef.value.open();
}

function toggleSideBar() {
  appStore.toggleSideBar();
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

// 注销
function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      console.log("window", window.location);
      userStore
        .logOut()
        .then(() => {
          location.href = getIndexUrl();
        })
        .catch(() => {
          postLogout();
        });
    })
    .catch(() => {});
}

// 获取首页地址
function getIndexUrl() {
  let url = "/index";
  const currPath = location.href;
  const pos = currPath.indexOf("/pc_");
  if (pos > 0) {
    url = currPath.substring(0, pos);
    // 添加 /pc_ehr 或 /pc_opr 等
    let pos2 = currPath.indexOf("/", pos + 4);
    const pos3 = currPath.indexOf("#", pos + 4);
    if (pos2 == -1 || (pos3 > 0 && pos2 > pos3)) {
      pos2 = pos3;
    }
    if (pos2 > pos) {
      url += currPath.substring(pos, pos2);
    }
  }
  return url;
}

function postLogout() {
  // location.href = '/index';
  // router.push('/index')
  router.push("/login");
}

const emits = defineEmits(["setLayout"]);
function setLayout() {
  emits("setLayout");
}

function toggleTheme() {
  settingsStore.toggleTheme()
}

// 返回首页
function goHome() {
  router.push("/index");
}

// 检查新版本
function checkVersion() {
  if (import.meta.env.VITE_APP_ENV != "production") return;
  const version = import.meta.env.VITE_APP_REL_VERSION;
  version &&
    getVersion({})
      .then((res) => {
        if (res.result) {
          const ver = res.result.version;
          if (ver && ver > version) {
            ElMessageBox.confirm(
              "请刷新您的浏览器缓存（如按键 Ctrl + F5）",
              "发现新版本",
              {
                confirmButtonText: "确定",
                type: "info",
              }
            )
              .then(() => {
                window.location.reload();
              })
              .catch(() => {});
          }
        }
      })
      .catch((err) => {
        if (!err.errHandled) ElMessage.error(err.message);
      });
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: var(--navbar-bg);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    /*  height: 100%; */
    line-height: 50px;
    margin-right: 20px;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }
    .logn-name {
      margin: 0 20px;
      font-size: 14px;
      color: #303133;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 10px;
      height: 100%;
      font-size: 18px;
      color: var(--navbar-text);
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      &.theme-switch-wrapper {
        display: flex;
        align-items: center;

        svg {
          transition: transform 0.3s;
          
          &:hover {
            transform: scale(1.15);
          }
        }
      }
    }
    .incon {
      font-size: 20px;
      color: #000;
    }

    .avatar-container {
      margin-right: 20px;
      margin-top: 3px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .me {
      font-size: 14px;
      padding-right: 5px;
    }
  }
  .cursors {
    cursor: pointer;
  }
}
</style>
