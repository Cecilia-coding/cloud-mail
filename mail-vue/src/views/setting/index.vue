<template>
  <div class="box">
    <div class="container">
      <div class="title">{{$t('profile')}}</div>
      <div class="item">
        <div>{{$t('username')}}</div>
        <div>
          <span v-if="setNameShow" class="edit-name-input">
            <el-input v-model="accountName"  ></el-input>
            <span class="edit-name" @click="setName">
             {{$t('save')}}
            </span>
          </span>
          <span v-else class="user-name">
            <span >{{ userStore.user.name }}</span>
            <span class="edit-name" @click="showSetName">
             {{$t('change')}}
            </span>
          </span>
        </div>
      </div>
      <div class="item">
        <div>{{$t('emailAccount')}}</div>
        <div>{{ userStore.user.email }}</div>
      </div>
      <div class="item">
        <div>{{$t('password')}}</div>
        <div>
          <el-button type="primary" @click="pwdShow = true">{{$t('changePwdBtn')}}</el-button>
        </div>
      </div>
    </div>

    <!-- 🎭 ✦ 隐身伪装印籍 · 遥测反向投毒工坊 (Telemetry Decoy Workshop) -->
    <div class="codex-decoy-card">
      <div class="decoy-header">
        <div class="decoy-titles">
          <div class="decoy-main-title">
            <span class="fleuron">✦</span> 隐身伪装印籍 · 遥测反向投毒工坊
          </div>
          <div class="decoy-sub-title">DECOY PERSONAS & TELEMETRY SPOOFING MATRIX</div>
        </div>
        <div class="decoy-active-badge">
          <span class="pulse-dot"></span>
          <span>当前伪装: <strong>{{ activePersona.name }}</strong></span>
        </div>
      </div>

      <div class="decoy-desc-box">
        <span class="fleuron-bullet">❖</span>
        <span>
          当邮件中潜伏着营销追踪器（如 Anthropic/Claude、Customer.io、SendGrid）或 1x1 隐形透明像素时，隐私护盾除了就地切断本地探测外，还支持调用 Cloudflare 边缘计算集群，伪装成奇异设备身份（如三星智能冰箱、小天才手表、塞班机皇）向对方投掷虚假遥测数据，彻底击溃发信方的受众画像聚类，且 0 泄露真实家庭 IP。
        </span>
      </div>

      <!-- Personas Grid -->
      <div class="personas-grid">
        <div
          v-for="p in DECOY_PERSONAS"
          :key="p.key"
          class="persona-tile"
          :class="{ 'is-selected': selectedPersonaKey === p.key }"
          @click="selectPersona(p.key)"
        >
          <div class="tile-top">
            <div class="tile-title-group">
              <span class="tile-emoji">{{ p.emoji }}</span>
              <span class="tile-name">{{ p.name }}</span>
            </div>
            <div class="tile-seal">
              <span v-if="selectedPersonaKey === p.key" class="seal-active">✦ 已启用</span>
              <span v-else class="seal-inactive">选择</span>
            </div>
          </div>

          <div class="tile-badge-row">
            <span class="tile-badge">{{ p.badge }}</span>
            <span class="tile-res">{{ p.resolution }}</span>
          </div>

          <div class="tile-specs">
            <Icon icon="solar:cpu-linear" width="13" height="13" />
            <span>{{ p.specs }}</span>
          </div>

          <div class="tile-desc">
            {{ p.description }}
          </div>

          <div class="tile-footer">
            <div class="ua-preview" :title="p.userAgent">
              <code>UA: {{ p.userAgent.slice(0, 38) }}...</code>
            </div>
            <button class="tile-btn copy-btn" @click.stop="copyText(p.userAgent, '已复制该设备真实 User-Agent')">
              <Icon icon="solar:copy-linear" width="12" height="12" />
              复制 UA
            </button>
          </div>
        </div>
      </div>

      <!-- Live Test Range (靶场实测) -->
      <div class="live-test-range">
        <div class="test-range-header">
          <span class="range-title"><span class="fleuron">❖</span> 靶场实测 · 向指定测试服务器发射伪装诱饵</span>
          <span class="range-sub">通过 Cloudflare 边缘节点代理向目标发送假探针，验证发信方后台捕获的 User-Agent</span>
        </div>

        <div class="test-input-row">
          <el-input
            v-model="testTargetUrl"
            placeholder="输入目标追踪器或 Webhook URL (例如: https://webhook.site/...)"
            class="target-url-input"
            clearable
          >
            <template #prepend>目标 URL</template>
          </el-input>
          <button
            class="fire-probe-btn"
            :disabled="fireLoading"
            @click="dispatchTestProbe"
          >
            <span v-if="fireLoading" class="loading-spin">✦</span>
            <Icon v-else icon="solar:plain-linear" width="15" height="15" />
            <span>{{ fireLoading ? '边缘节点发射中...' : `以 [${activePersona.shortName}] 身份发射诱饵` }}</span>
          </button>
        </div>

        <!-- Preset buttons -->
        <div class="preset-links">
          <span class="preset-label">快速靶场:</span>
          <button class="preset-btn" @click="testTargetUrl = defaultWebhookUrl">填入 Webhook.site 测试靶场</button>
          <a :href="defaultWebhookDashboard" target="_blank" rel="noopener noreferrer" class="preset-link-btn">
            打开 Webhook 实时接收大盘 ↗
          </a>
        </div>

        <!-- Probe Response Terminal Card -->
        <div v-if="lastProbeResult" class="probe-result-terminal">
          <div class="terminal-header">
            <span class="terminal-dot green"></span>
            <span class="terminal-title">✦ 诱饵发送响应回报 · Cloudflare Edge Response</span>
            <span class="terminal-status">HTTP {{ lastProbeResult.statusCode }} {{ lastProbeResult.statusText }}</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-row">
              <span class="term-lbl">目标端点:</span>
              <span class="term-val">{{ lastProbeResult.targetUrl }}</span>
            </div>
            <div class="terminal-row">
              <span class="term-lbl">伪装身份:</span>
              <span class="term-val highlight">{{ lastProbeResult.personaName }}</span>
            </div>
            <div class="terminal-row">
              <span class="term-lbl">回传 UA:</span>
              <span class="term-val code">{{ lastProbeResult.userAgent }}</span>
            </div>
            <div class="terminal-row">
              <span class="term-lbl">中继节点:</span>
              <span class="term-val node">{{ lastProbeResult.node || 'Cloudflare Edge Datacenter (美国/东京)' }}</span>
            </div>
            <div class="terminal-row note">
              <span class="term-lbl">安全保证:</span>
              <span class="term-val green">真实客户端 IP 0 泄露，发件人后台已记录所选奇异设备开信指纹！</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="language">
      <div class="title">{{$t('language')}}</div>
      <el-select
          :model-value="langSelect"
          class="language-select"
          placeholder="Select"
          @change="changeLang"
      >
        <el-option label="中文" value="zh" @pointerdown.prevent.stop="changeLang('zh')"/>
        <el-option label="English" value="en" @pointerdown.prevent.stop="changeLang('en')"/>
      </el-select>
    </div>
    <div class="del-email" v-perm="'my:delete'">
      <div class="title">{{$t('deleteUser')}}</div>
      <div style="color: var(--regular-text-color);">
        {{$t('delAccountMsg')}}
      </div>
      <div>
        <el-button type="primary" @click="deleteConfirm">{{$t('deleteUserBtn')}}</el-button>
      </div>
    </div>
    <el-dialog v-model="pwdShow" :title="$t('changePassword')" width="340">
      <div class="update-pwd">
        <el-input type="password" :placeholder="$t('newPassword')" v-model="form.password" autocomplete="off" @keyup.enter="submitPwd"/>
        <el-input type="password" :placeholder="$t('confirmPassword')" v-model="form.newPwd" autocomplete="off" @keyup.enter="submitPwd"/>
        <el-button type="primary" :loading="setPwdLoading" @click="submitPwd">{{$t('save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import {reactive, ref, computed, defineOptions} from 'vue'
import {resetPassword, userDelete} from "@/request/my.js";
import {useUserStore} from "@/store/user.js";
import router from "@/router/index.js";
import {accountSetName} from "@/request/account.js";
import {useAccountStore} from "@/store/account.js";
import {useI18n} from "vue-i18n";
import {useSettingStore} from "@/store/setting.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {Icon} from "@iconify/vue";
import {
  DECOY_PERSONAS,
  getActivePersonaKey,
  setActivePersonaKey,
  getActivePersona
} from "@/utils/decoy-personas.js";
import {fireDecoyProbe} from "@/request/privacy.js";

const { t } = useI18n()
const accountStore = useAccountStore()
const settingStore = useSettingStore()
const userStore = useUserStore();
const setPwdLoading = ref(false)
const setNameShow = ref(false)
const accountName = ref(null)
const langSelect = ref(settingStore.lang)

// 🎭 Decoy Personas Matrix State
const selectedPersonaKey = ref(getActivePersonaKey())
const activePersona = computed(() => {
  return DECOY_PERSONAS.find(p => p.key === selectedPersonaKey.value) || DECOY_PERSONAS[0];
})

const defaultWebhookUrl = 'https://webhook.site/fb5e79e2-651d-4e6f-aa3d-2fc5ffe4378d'
const defaultWebhookDashboard = 'https://webhook.site/#!/view/fb5e79e2-651d-4e6f-aa3d-2fc5ffe4378d'
const testTargetUrl = ref(defaultWebhookUrl)
const fireLoading = ref(false)
const lastProbeResult = ref(null)

function selectPersona(key) {
  selectedPersonaKey.value = key
  setActivePersonaKey(key)
  const p = DECOY_PERSONAS.find(item => item.key === key)
  ElMessage.success({
    message: `✦ 已切换全局伪装身份为「${p.name}」`,
    plain: true
  })
}

function copyText(txt, msg = '已复制') {
  if (!txt) return;
  navigator.clipboard.writeText(txt).then(() => {
    ElMessage.success({ message: msg, plain: true })
  })
}

async function dispatchTestProbe() {
  if (!testTargetUrl.value || !/^https?:\/\//i.test(testTargetUrl.value.trim())) {
    ElMessage.warning({ message: '请输入有效的 http / https 目标 URL', plain: true })
    return
  }

  fireLoading.value = true
  try {
    const res = await fireDecoyProbe(testTargetUrl.value.trim(), selectedPersonaKey.value)
    if (res && res.data) {
      lastProbeResult.value = res.data
      ElMessage.success({
        message: `✦ 诱饵已发射！目标服务器已捕获「${res.data.personaName}」身份`,
        plain: true
      })
    }
  } catch (err) {
    ElMessage.error({
      message: '诱饵发射异常: ' + (err?.message || '网络错误'),
      plain: true
    })
  } finally {
    fireLoading.value = false
  }
}

defineOptions({
  name: 'setting'
})

function showSetName() {
  accountName.value = userStore.user.name
  setNameShow.value = true
}

function setName() {
  if (!accountName.value) {
    ElMessage({
      message: t('emptyUserNameMsg'),
      type: 'error',
      plain: true,
    })
    return;
  }

  setNameShow.value = false
  let name = accountName.value

  if (name === userStore.user.name) {
    return
  }

  userStore.user.name = accountName.value

  accountSetName(userStore.user.account.accountId,name).then(() => {
    ElMessage({
      message: t('saveSuccessMsg'),
      type: 'success',
      plain: true,
    })

    accountStore.changeUserAccountName = name

  }).catch(() => {
    userStore.user.name = name
  })
}

function changeLang(lang) {
  let setting = {}
  try {
    setting = JSON.parse(localStorage.getItem('setting') || '{}')
  } catch (e) {
    setting = {}
  }
  localStorage.setItem('setting', JSON.stringify({...setting, lang}))
  window.location.reload()
}

const pwdShow = ref(false)
const form = reactive({
  password: '',
  newPwd: '',
})

const deleteConfirm = () => {
  ElMessageBox.confirm(t('delAccountConfirm'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(() => {
    userDelete().then(() => {
      localStorage.removeItem('token');
      router.replace('/login');
      ElMessage({
        message: t('delSuccessMsg'),
        type: 'success',
        plain: true,
      })
    })
  })
}

function submitPwd() {
  if (setPwdLoading.value) return

  if (!form.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (form.password.length < 6) {
    ElMessage({
      message: t('pwdLengthMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (form.password !== form.newPwd) {
    ElMessage({
      message: t('confirmPwdFailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  setPwdLoading.value = true
  resetPassword(form.password).then(() => {
    ElMessage({
      message: t('saveSuccessMsg'),
      type: 'success',
      plain: true,
    })
    pwdShow.value = false
    setPwdLoading.value = false
    form.password = ''
    form.newPwd = ''
  }).catch(() => {
    setPwdLoading.value = false
  })
}
</script>
<style scoped lang="scss">
.box {
  padding: 40px 40px;

  @media (max-width: 767px) {
    padding: 24px 16px;
  }

  .update-pwd {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    font-family: var(--font-mincho), serif;
    letter-spacing: 0.05em;
  }

  .container {
    font-size: 14px;
    display: grid;
    gap: 20px;
    margin-bottom: 36px;
    padding: 24px;
    background: var(--card-bg, #ffffff);
    border: 1px solid var(--el-border-color, #dcd0e4);
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(43, 35, 56, 0.02);

    .item {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 80px;
      position: relative;
      align-items: center;

      .user-name {
        display: grid;
        grid-template-columns: auto 1fr;
        span:first-child {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .edit-name-input {
        position: absolute;
        bottom: -6px;
        .el-input {
          width: min(200px,calc(100vw - 222px));
        }
      }

      .edit-name {
        color: var(--el-color-primary, #8a486b);
        padding-left: 10px;
        cursor: pointer;
        font-weight: 500;
      }

      @media (max-width: 767px) {
        gap: 20px;
        grid-template-columns: 70px 1fr;
      }

      div:first-child {
        font-weight: bold;
        color: var(--el-text-color-regular);
      }

      div:last-child {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  /* 🎭 ✦ 隐身伪装印籍 · 遥测反向投毒工坊 (Telemetry Decoy Card) */
  .codex-decoy-card {
    margin-bottom: 36px;
    background: var(--card-bg, #ffffff);
    border: 1px solid var(--el-border-color, #dcd0e4);
    border-radius: 12px;
    padding: 26px 28px;
    box-shadow: 0 4px 16px rgba(43, 35, 56, 0.03);
    position: relative;

    .decoy-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;

      .decoy-titles {
        .decoy-main-title {
          font-family: var(--font-mincho), serif;
          font-size: 19px;
          font-weight: 700;
          color: var(--el-text-color-primary, #2b2338);
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 6px;

          .fleuron {
            color: #b38848;
          }
        }

        .decoy-sub-title {
          font-family: var(--font-serif), Georgia, serif;
          font-style: italic;
          font-size: 11.5px;
          color: #b38848;
          letter-spacing: 0.12em;
          margin-top: 3px;
        }
      }

      .decoy-active-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(138, 72, 107, 0.08);
        border: 1px solid rgba(138, 72, 107, 0.25);
        color: var(--el-color-primary, #8a486b);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12.5px;

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8a486b;
          box-shadow: 0 0 6px rgba(138, 72, 107, 0.6);
          animation: badge-pulse 2s infinite ease-in-out;
        }

        strong {
          color: #2b2338;
          margin-left: 2px;
        }
      }
    }

    .decoy-desc-box {
      background: rgba(179, 136, 72, 0.06);
      border: 1px solid rgba(179, 136, 72, 0.22);
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 12.5px;
      line-height: 1.7;
      color: #635773;
      margin-bottom: 22px;
      display: flex;
      gap: 8px;
      align-items: flex-start;

      .fleuron-bullet {
        color: #b38848;
        font-size: 13px;
        flex-shrink: 0;
        margin-top: 2px;
      }
    }

    /* Personas Grid */
    .personas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 16px;
      margin-bottom: 28px;

      .persona-tile {
        background: #ffffff;
        border: 1px solid var(--el-border-color, #dcd0e4);
        border-radius: 10px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: relative;

        &:hover {
          transform: translateY(-2px);
          border-color: #8a486b;
          box-shadow: 0 6px 18px rgba(138, 72, 107, 0.1);
        }

        &.is-selected {
          border-color: #8a486b;
          background: linear-gradient(180deg, rgba(138, 72, 107, 0.04) 0%, #ffffff 100%);
          box-shadow: 0 4px 16px rgba(138, 72, 107, 0.14), inset 0 0 0 1px #8a486b;

          .tile-seal .seal-active {
            background: #8a486b;
            color: #ffffff;
            border-color: #8a486b;
          }
        }

        .tile-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;

          .tile-title-group {
            display: flex;
            align-items: center;
            gap: 8px;

            .tile-emoji {
              font-size: 20px;
              line-height: 1;
            }

            .tile-name {
              font-family: var(--font-mincho), serif;
              font-weight: 700;
              font-size: 13.5px;
              color: var(--el-text-color-primary, #2b2338);
              letter-spacing: 0.03em;
            }
          }

          .tile-seal {
            flex-shrink: 0;

            .seal-active {
              font-size: 10.5px;
              padding: 2px 8px;
              border-radius: 12px;
              background: #8a486b;
              color: #ffffff;
              font-weight: 600;
              letter-spacing: 0.05em;
            }

            .seal-inactive {
              font-size: 10.5px;
              padding: 2px 8px;
              border-radius: 12px;
              border: 1px solid var(--el-border-color, #dcd0e4);
              color: #9589a3;
            }
          }
        }

        .tile-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;

          .tile-badge {
            font-size: 11px;
            background: rgba(179, 136, 72, 0.1);
            color: #946927;
            padding: 2px 7px;
            border-radius: 4px;
            font-family: monospace;
          }

          .tile-res {
            font-size: 11px;
            color: #9589a3;
            font-family: monospace;
          }
        }

        .tile-specs {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #635773;
        }

        .tile-desc {
          font-size: 12px;
          line-height: 1.55;
          color: #7a6e87;
          flex: 1;
        }

        .tile-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px dashed var(--el-border-color-lighter, #ece4f2);

          .ua-preview {
            flex: 1;
            overflow: hidden;

            code {
              font-size: 10.5px;
              font-family: monospace;
              color: #9589a3;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
            }
          }

          .copy-btn {
            font-size: 11px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px;
            border-radius: 4px;
            border: 1px solid var(--el-border-color, #dcd0e4);
            background: #ffffff;
            color: #635773;
            cursor: pointer;
            flex-shrink: 0;

            &:hover {
              color: var(--el-color-primary, #8a486b);
              border-color: var(--el-color-primary, #8a486b);
            }
          }
        }
      }
    }

    /* Live Fire Range */
    .live-test-range {
      background: rgba(43, 35, 56, 0.02);
      border: 1px solid var(--el-border-color, #dcd0e4);
      border-radius: 10px;
      padding: 20px;

      .test-range-header {
        margin-bottom: 14px;

        .range-title {
          display: block;
          font-family: var(--font-mincho), serif;
          font-size: 14px;
          font-weight: 700;
          color: #2b2338;
          letter-spacing: 0.04em;

          .fleuron {
            color: #b38848;
            margin-right: 4px;
          }
        }

        .range-sub {
          font-size: 11.5px;
          color: #9589a3;
          margin-top: 2px;
          display: block;
        }
      }

      .test-input-row {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
        flex-wrap: wrap;

        .target-url-input {
          flex: 1;
          min-width: 280px;
        }

        .fire-probe-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 6px;
          border: 1px solid #8a486b;
          background: #8a486b;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.04em;

          &:hover:not(:disabled) {
            background: #723755;
            box-shadow: 0 4px 12px rgba(138, 72, 107, 0.25);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .loading-spin {
            animation: spin 1s infinite linear;
          }
        }
      }

      .preset-links {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 11.5px;
        margin-bottom: 14px;
        flex-wrap: wrap;

        .preset-label {
          color: #9589a3;
        }

        .preset-btn {
          background: none;
          border: none;
          color: #8a486b;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;

          &:hover {
            color: #723755;
          }
        }

        .preset-link-btn {
          color: #b38848;
          text-decoration: none;
          display: inline-flex;
          align-items: center;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .probe-result-terminal {
        background: #201a29;
        border: 1px solid #3d314f;
        border-radius: 8px;
        overflow: hidden;
        margin-top: 12px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);

        .terminal-header {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #17131e;
          padding: 8px 14px;
          border-bottom: 1px solid #332842;

          .terminal-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3ecf8e;
            box-shadow: 0 0 6px rgba(62, 207, 142, 0.6);
          }

          .terminal-title {
            font-family: var(--font-mincho), serif;
            font-size: 12px;
            color: #e5daf0;
            flex: 1;
            letter-spacing: 0.05em;
          }

          .terminal-status {
            font-size: 11px;
            font-family: monospace;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(62, 207, 142, 0.15);
            color: #3ecf8e;
          }
        }

        .terminal-body {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12px;

          .terminal-row {
            display: flex;
            gap: 10px;
            line-height: 1.5;

            .term-lbl {
              color: #a496b8;
              width: 72px;
              flex-shrink: 0;
            }

            .term-val {
              color: #dfd5eb;
              word-break: break-all;

              &.highlight {
                color: #f7ca7d;
                font-weight: 600;
              }

              &.code {
                font-family: monospace;
                font-size: 11px;
                color: #cbb4de;
              }

              &.node {
                color: #79c0ff;
              }

              &.green {
                color: #7ee787;
              }
            }

            &.note {
              margin-top: 4px;
              padding-top: 6px;
              border-top: 1px dashed rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
    }
  }

  .language {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;

    .language-select {
      width: 100px;
    }
  }

  .del-email {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

@keyframes badge-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
