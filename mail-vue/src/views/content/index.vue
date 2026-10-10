<template>
  <div class="box">
    <div class="header-actions">
      <div class="back-link" @click="handleBack">
        <Icon icon="material-symbols-light:arrow-back-ios-new" width="16" height="16"/>
        <span>返回清單</span>
      </div>
      <div class="action-divider"></div>
      <Icon v-perm="'email:delete'" class="icon" icon="uiw:delete" width="16" height="16" @click="handleDelete"/>
      <span class="star" v-if="emailStore.contentData.showStar">
        <Icon class="icon" @click="changeStar" v-if="email.isStar" icon="fluent-color:star-16" width="20" height="20"/>
        <Icon class="icon" @click="changeStar" v-else icon="solar:star-line-duotone" width="18" height="18"/>
      </span>
      <Icon class="icon" v-if="emailStore.contentData.showReply" v-perm="'email:send'"  @click="openReply" icon="la:reply" width="21" height="21" />
      <Icon class="icon" v-if="emailStore.contentData.showReply" v-perm="'email:send'"  @click="openForward" icon="iconoir:arrow-up-right" width="20" height="20" />
    </div>
    <div></div>
    <el-scrollbar class="scrollbar">
      <div class="container codex-epistle-card">
        <div class="epistle-crest">
          <span class="crest-line"></span>
          <span class="crest-symbol">✦ 函牘抄件 · EPISTLE DOSSIER ✦</span>
          <span class="crest-line"></span>
        </div>
        <div class="email-title">
          {{ email.subject }}
        </div>
        <div class="content">
          <div class="email-info">
            <div>
              <div class="send"><span class="send-source">{{$t('from')}}</span>
                <div class="send-name">
                  <span class="send-name-title">{{ email.name }}</span>
                  <span class="send-email-text"><{{ email.sendEmail }}></span>
                </div>
              </div>
              <div class="receive"><span class="source">{{$t('recipient')}}</span><span class="receive-email">{{  formateReceive(email.recipient) }}</span></div>
              <div class="date">
                <div>{{ formatDetailDate(email.createTime) }}</div>
              </div>
            </div>
            <el-alert v-if="email.status === 3" :closable="false" :title="toMessage(email.message)" class="email-msg" type="error" show-icon />
            <el-alert v-if="email.status === 4" :closable="false" :title="$t('complained')" class="email-msg" type="warning" show-icon />
            <el-alert v-if="email.status === 5" :closable="false" :title="$t('delayed')" class="email-msg" type="warning" show-icon />
          </div>
          <!-- 🛡️ 隐身安全防追踪横幅 -->
          <div class="privacy-shield-bar" :class="{ 'is-secure': privacyAudit.isClean }">
            <div class="shield-main">
              <Icon class="shield-icon" :icon="privacyAudit.isClean ? 'solar:shield-check-bold-duotone' : 'solar:shield-warning-bold-duotone'" width="18" height="18" />
              <div class="shield-text">
                <span v-if="privacyAudit.beaconsCount > 0" class="shield-highlight">
                  已拦截 {{ privacyAudit.beaconsCount }} 枚隐形追踪信标
                </span>
                <span v-if="privacyAudit.blockedImagesCount > 0">
                  <span v-if="privacyAudit.beaconsCount > 0"> · </span>
                  {{ privacyAudit.blockedImagesCount }} 张外链图片已沙箱隔离
                </span>
                <span v-if="privacyAudit.isClean">
                  隐身保护生效中 · 未发现隐藏信标与追踪器
                </span>
              </div>
            </div>
            <div class="shield-actions">
              <!-- 🎭 替身伪装下拉选择器 (支持分邮箱独立花活) -->
              <el-dropdown trigger="click" @command="handleSelectPersona">
                <button class="shield-btn persona-btn" :class="{ 'is-custom-bound': effectivePersonaInfo.isCustom }" title="点击切换反向投毒伪装设备">
                  <span class="persona-emoji">{{ activePersona.emoji }}</span>
                  <span class="persona-label">
                    <span v-if="effectivePersonaInfo.isCustom" class="custom-mailbox-tag">[{{ currentMailboxTag || '本箱' }} 专享]</span>
                    {{ activePersona.key === 'silent_block' ? '🛡️ 绝对静默 (禁发探针)' : (activePersona.key === 'native_real' ? '原生未替身' : `替身: ${activePersona.shortName}`) }}
                  </span>
                  <Icon icon="solar:alt-arrow-down-linear" width="11" height="11" />
                </button>
                <template #dropdown>
                  <el-dropdown-menu class="codex-dropdown-menu persona-dropdown">
                    <div class="dropdown-header-note">
                      <div class="note-title-line">
                        <span class="fleuron">✦</span>
                        <span class="note-title">设备指纹与替身矩阵 (47 款设备)</span>
                      </div>
                      <div class="note-target-line" v-if="currentRecipientEmail">
                        <span>配属邮箱：</span>
                        <span class="target-email" :title="currentRecipientEmail">{{ currentRecipientEmail }}</span>
                        <span class="target-badge" :class="effectivePersonaInfo.isCustom ? 'badge-custom' : 'badge-inherit'">
                          {{ effectivePersonaInfo.isCustom ? '★ 独立专享' : '跟随全局' }}
                        </span>
                      </div>
                    </div>

                    <!-- 如果当前邮箱是专属绑定，提供一键恢复跟随全局 -->
                    <div v-if="effectivePersonaInfo.isCustom && currentRecipientEmail" class="dropdown-reset-bar">
                      <el-dropdown-item command="__INHERIT_GLOBAL__" class="reset-item">
                        <Icon icon="solar:restart-linear" width="13" height="13" />
                        <span>恢复跟随全局默认花活</span>
                      </el-dropdown-item>
                    </div>

                    <el-scrollbar max-height="340px">
                      <el-dropdown-item
                        v-for="p in DECOY_PERSONAS"
                        :key="p.key"
                        :command="p.key"
                        :class="{ 'is-active-persona': activePersonaKey === p.key }"
                      >
                        <span class="dropdown-emoji">{{ p.emoji }}</span>
                        <div class="dropdown-item-content">
                          <span class="dropdown-name">{{ p.name }}</span>
                          <span class="dropdown-badge">{{ p.badge }}</span>
                        </div>
                        <span v-if="activePersonaKey === p.key" class="dropdown-active-seal">✦</span>
                      </el-dropdown-item>
                    </el-scrollbar>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <button class="shield-btn log-btn" @click="showTrackerLog = true" v-if="privacyAudit.beaconsCount > 0 || privacyAudit.blockedImagesCount > 0">
                <Icon icon="solar:document-text-linear" width="14" height="14" />
                防御报告
              </button>
              <button class="shield-btn" @click="toggleLoadImages" v-if="privacyAudit.blockedImagesCount > 0 && !allowImagesForCurrent">
                <Icon icon="solar:gallery-wide-linear" width="14" height="14" />
                显示图片
              </button>
              <button class="shield-btn" @click="trustSender" v-if="privacyAudit.blockedImagesCount > 0 && !allowImagesForCurrent && email.sendEmail && !isSenderTrusted(email.sendEmail)">
                <Icon icon="solar:user-check-rounded-linear" width="14" height="14" />
                信任发件人
              </button>
              <span class="shield-loaded-tip" v-else-if="allowImagesForCurrent && privacyAudit.blockedImagesCount > 0">
                <Icon icon="solar:check-circle-linear" width="14" height="14" />
                已放行外链图片
              </span>
            </div>
          </div>
          <el-scrollbar class="htm-scrollbar" :class="!email.attList?.length ? 'bottom-distance' : ''">
            <ShadowHtml class="shadow-html" :html="privacyAudit.safeHtml" v-if="email.content" />
            <pre v-else class="email-text" >{{email.text}}</pre>
          </el-scrollbar>
          <div class="att" v-if="email.attList?.length > 0">
            <div class="att-title">
              <span>{{$t('attachments')}}</span>
              <span>{{$t('attCount',{total: email.attList.length})}}</span>
            </div>
            <div class="att-box">

              <div class="att-item" v-for="att in email.attList" :key="att.attId">
                <div class="att-icon" @click="showImage(att.key)">
                  <Icon v-bind="getIconByName(att.filename)" />
                </div>
                <div class="att-name" @click="showImage(att.key)">
                  {{ att.filename }}
                </div>
                <div class="att-size">{{ formatBytes(att.size) }}</div>
                <div class="opt-icon att-icon">
                  <Icon v-if="isImage(att.filename)" icon="hugeicons:view" width="22" height="22" @click="showImage(att.key)"/>
                  <a :href="cvtR2Url(att.key)" download>
                    <Icon icon="system-uicons:push-down" width="22" height="22"/>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- Antique Codex Letter Colophon Footer -->
          <div class="epistle-colophon-footer">
            <span class="footer-fleuron">❖</span>
            <span class="footer-text">EX ARCHIVUM EPISTOLARUM · 雲端手抄密匣</span>
            <span class="footer-fleuron">❖</span>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <el-image-viewer
        v-if="showPreview"
        :url-list="srcList"
        show-progress
        @close="showPreview = false"
    />
    <!-- 🛡️ 隐身防御审计详情弹窗 -->
    <el-dialog
      v-model="showTrackerLog"
      title="✦ 密匣隐身安全防御日志 · Security Telemetry"
      class="codex-audit-dialog"
      width="640px"
    >
      <div class="audit-modal-content">
        <div class="audit-summary-cards">
          <div class="summary-card danger">
            <span class="card-num">{{ privacyAudit.beaconsCount }}</span>
            <span class="card-label">已拔除追踪信标</span>
          </div>
          <div class="summary-card warning">
            <span class="card-num">{{ privacyAudit.blockedImagesCount }}</span>
            <span class="card-label">已沙箱隔离图片</span>
          </div>
          <div class="summary-card clean">
            <span class="card-num">100%</span>
            <span class="card-label">IP 泄露防御率</span>
          </div>
        </div>

        <div class="audit-section" v-if="privacyAudit.detectedTrackers?.length > 0">
          <div class="section-title-row">
            <div class="section-title">
              <span class="fleuron">❖</span> 拦截并销毁的追踪信标（网络请求未发出）：
            </div>
            <button
              class="poison-all-btn"
              :disabled="poisonAllLoading || activePersonaKey === 'silent_block'"
              @click="poisonAllTrackers"
            >
              <span v-if="activePersonaKey === 'silent_block'">🛡️ 绝对静默中 (已封禁外发探针)</span>
              <span v-else-if="poisonAllLoading" class="loading-spin">✦</span>
              <template v-else>
                <Icon icon="solar:shield-star-linear" width="13" height="13" />
                <span>以 [{{ activePersona.shortName }}] 身份一键投毒全部信标</span>
              </template>
            </button>
          </div>

          <div class="tracker-item" v-for="(trk, idx) in privacyAudit.detectedTrackers" :key="idx">
            <div class="item-header">
              <span class="tracker-type">{{ typeof trk === 'string' ? '隐形追踪信标' : trk.type }}</span>
              <span class="tracker-status">已就地拔除</span>
            </div>
            <div class="tracker-url">
              <code>{{ typeof trk === 'string' ? trk : trk.url }}</code>
              <button class="copy-url-btn" @click="copyTrackerUrl(typeof trk === 'string' ? trk : trk.url)">复制</button>
              <button
                class="poison-single-btn"
                :disabled="poisoningMap[typeof trk === 'string' ? trk : trk.url] || activePersonaKey === 'silent_block'"
                @click="poisonSingleTracker(typeof trk === 'string' ? trk : trk.url)"
              >
                <span v-if="activePersonaKey === 'silent_block'">🛡️ 绝对静默</span>
                <span v-else-if="poisoningMap[typeof trk === 'string' ? trk : trk.url]">投毒中...</span>
                <span v-else-if="poisonedSuccessMap[typeof trk === 'string' ? trk : trk.url]">✓ 已投毒</span>
                <span v-else>🎯 反向投毒</span>
              </button>
            </div>
            <div
              class="poison-feedback-tag"
              v-if="poisonedFeedbackMap[typeof trk === 'string' ? trk : trk.url]"
            >
              <span class="fleuron">✦</span> {{ poisonedFeedbackMap[typeof trk === 'string' ? trk : trk.url] }}
            </div>
            <div class="tracker-reason" v-if="trk.reason">
              判定特征：{{ trk.reason }}
            </div>
          </div>
        </div>

        <div class="audit-section" v-if="privacyAudit.blockedImages?.length > 0">
          <div class="section-title">
            <span class="fleuron">❖</span> 已沙箱隔离的外部图片（防止加载探测）：
          </div>
          <div class="tracker-item is-image" v-for="(imgUrl, idx) in privacyAudit.blockedImages" :key="idx">
            <div class="tracker-url">
              <code>{{ imgUrl }}</code>
            </div>
            <div class="tracker-reason">
              状态：已替换为本地占位，阻止外部主机获取开信时间与客户端指纹
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import ShadowHtml from '@/components/shadow-html/index.vue'
import {computed, reactive, ref, watch, onMounted, onUnmounted} from "vue";
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {emailDelete, emailRead} from "@/request/email.js";
import {Icon} from "@iconify/vue";
import {useEmailStore} from "@/store/email.js";
import {useAccountStore} from "@/store/account.js";
import {formatDetailDate} from "@/utils/day.js";
import {starAdd, starCancel} from "@/request/star.js";
import {getExtName, formatBytes} from "@/utils/file-utils.js";
import {cvtR2Url,toOssDomain} from "@/utils/convert.js";
import {getIconByName} from "@/utils/icon-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {allEmailDelete} from "@/request/all-email.js";
import {useUiStore} from "@/store/ui.js";
import {useI18n} from "vue-i18n";
import {EmailUnreadEnum} from "@/enums/email-enum.js";
import {inspectAndSanitizeHtml, isSenderTrusted, addTrustedSender} from "@/utils/privacy-shield.js";
import {
  DECOY_PERSONAS,
  getActivePersonaKey,
  setActivePersonaKey,
  getEffectivePersona,
  setAccountPersona,
  removeAccountPersona
} from "@/utils/decoy-personas.js";
import {fireDecoyProbe} from "@/request/privacy.js";

const uiStore = useUiStore();
const settingStore = useSettingStore();
const accountStore = useAccountStore();
const emailStore = useEmailStore();
const router = useRouter()
const email = computed(() => emailStore.contentData.email || {
  emailId: 0,
  attList: [],
  content: '',
  text: '',
  recipient: '[]',
})
const showPreview = ref(false)
const srcList = reactive([])
const allowImagesForCurrent = ref(false)
const showTrackerLog = ref(false)

// 📬 当前邮件所归属的邮箱地址与人格解析 (支持多重人格矩阵)
const currentRecipientEmail = computed(() => {
  if (accountStore.currentAccount?.email) {
    return accountStore.currentAccount.email.toLowerCase().trim();
  }
  if (email.value?.recipient) {
    try {
      const rec = typeof email.value.recipient === 'string'
        ? JSON.parse(email.value.recipient)
        : email.value.recipient;
      if (Array.isArray(rec) && rec.length > 0 && rec[0]?.address) {
        return rec[0].address.toLowerCase().trim();
      }
    } catch (e) {}
  }
  return '';
});

const currentMailboxTag = computed(() => {
  if (accountStore.currentAccount?.name) {
    return accountStore.currentAccount.name;
  }
  if (currentRecipientEmail.value) {
    return currentRecipientEmail.value.split('@')[0];
  }
  return '';
});

const effectivePersonaInfo = computed(() => {
  return getEffectivePersona(currentRecipientEmail.value);
});

// 🎭 Decoy Persona & Telemetry Poisoning State (响应当前邮箱独立规则)
const activePersonaKey = ref(effectivePersonaInfo.value.personaKey);

watch(
  () => [email.value?.emailId, currentRecipientEmail.value],
  () => {
    activePersonaKey.value = effectivePersonaInfo.value.personaKey;
  },
  { immediate: true }
);

const activePersona = computed(() => {
  return DECOY_PERSONAS.find(p => p.key === activePersonaKey.value) || DECOY_PERSONAS[0];
});

function handleSelectPersona(key) {
  if (key === '__INHERIT_GLOBAL__') {
    if (currentRecipientEmail.value) {
      removeAccountPersona(currentRecipientEmail.value);
      activePersonaKey.value = getActivePersonaKey();
      ElMessage.success({
        message: `✦ 邮箱 [${currentRecipientEmail.value}] 已恢复为「跟随全局默认花活」`,
        plain: true
      });
    }
    return;
  }

  activePersonaKey.value = key;
  const p = DECOY_PERSONAS.find(item => item.key === key);

  if (currentRecipientEmail.value) {
    setAccountPersona(currentRecipientEmail.value, key);
    let msg = `✦ 已为当前邮箱 [${currentRecipientEmail.value}] 绑定专属花活「${p ? p.name : key}」`;
    if (key === 'silent_block') {
      msg = `✦ 已为当前邮箱 [${currentRecipientEmail.value}] 启用「🛡️ 绝对静默模式」：彻底封禁出站探针`;
    } else if (key === 'native_real') {
      msg = `✦ 已为当前邮箱 [${currentRecipientEmail.value}] 切换为「真实本机直出 (不使用替身)」`;
    }
    ElMessage.success({ message: msg, plain: true });
  } else {
    setActivePersonaKey(key);
    let msg = `✦ 已切换全局伪装身份为「${p ? p.name : key}」`;
    if (key === 'silent_block') {
      msg = '✦ 已切换为「🛡️ 绝对静默模式」：彻底封禁出站探针，0 IP 暴露，绝对安全';
    } else if (key === 'native_real') {
      msg = '✦ 已恢复为「真实本机直出 (不使用替身)」';
    }
    ElMessage.success({ message: msg, plain: true });
  }
}

const poisoningMap = reactive({});
const poisonedSuccessMap = reactive({});
const poisonedFeedbackMap = reactive({});
const poisonAllLoading = ref(false);

async function poisonSingleTracker(url) {
  if (!url) return;
  if (activePersonaKey.value === 'silent_block') {
    ElMessage.info({
      message: '✦ 当前处于绝对静默拦截模式：已封禁向外发送任何探测请求，保持 0 网络痕迹。',
      plain: true
    });
    poisonedFeedbackMap[url] = '绝对静默模式：已在本地及边缘封禁外发请求，未向追踪器发送任何数据 (0 IP 暴露)';
    return;
  }
  poisoningMap[url] = true;
  try {
    const res = await fireDecoyProbe(url, activePersonaKey.value);
    poisonedSuccessMap[url] = true;
    const personaTitle = res?.data?.personaName || activePersona.value.name;
    const isNative = activePersonaKey.value === 'native_real';
    poisonedFeedbackMap[url] = isNative
      ? `原生探针已送达！目标后台记录设备：真实本机指纹 (HTTP ${res?.data?.statusCode || 200})`
      : `假遥测已送达！目标后台记录设备：${personaTitle} (HTTP ${res?.data?.statusCode || 200})`;
    ElMessage.success({
      message: isNative ? '✦ 探针已从边缘送达！目标记录为你本机的真实 User-Agent' : `✦ 诱饵已从 Cloudflare 边缘送达！目标记录为「${personaTitle}」`,
      plain: true
    });
  } catch (err) {
    ElMessage.error({
      message: '投毒失败: ' + (err?.message || '网络异常'),
      plain: true
    });
  } finally {
    poisoningMap[url] = false;
  }
}

async function poisonAllTrackers() {
  const trackers = privacyAudit.value.detectedTrackers || [];
  if (!trackers.length) return;
  if (activePersonaKey.value === 'silent_block') {
    ElMessage.info({
      message: '✦ 当前处于绝对静默拦截模式：已禁止向目标发送任何网络探针（0 外发流量，绝对安全）。',
      plain: true
    });
    return;
  }
  poisonAllLoading.value = true;
  try {
    const promises = trackers.map(trk => {
      const url = typeof trk === 'string' ? trk : trk.url;
      return poisonSingleTracker(url);
    });
    await Promise.allSettled(promises);
    ElMessage.success({
      message: `✦ 已完成对全部 ${trackers.length} 枚追踪器的反向投毒！`,
      plain: true
    });
  } finally {
    poisonAllLoading.value = false;
  }
}

function copyTrackerUrl(url) {
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success({ message: '已复制追踪器目标 URL', plain: true });
  });
}

const privacyAudit = computed(() => {
  const raw = formatImage(email.value.content);
  return inspectAndSanitizeHtml(raw, {
    allowExternalImages: allowImagesForCurrent.value,
    senderEmail: email.value.sendEmail
  });
});

function toggleLoadImages() {
  allowImagesForCurrent.value = true;
}

function trustSender() {
  if (email.value.sendEmail) {
    addTrustedSender(email.value.sendEmail);
    allowImagesForCurrent.value = true;
    ElMessage.success({
      message: `已将 ${email.value.sendEmail} 设为信任发件人`,
      plain: true
    });
  }
}

watch(() => email.value.emailId, () => {
  allowImagesForCurrent.value = false;
})

const { t } = useI18n()
watch(() => accountStore.currentAccountId, () => {
  handleBack()
})

let readRequesting = false

function tryMarkRead() {
  if (!emailStore.contentData.showUnread || readRequesting) return
  const current = email.value
  if (!current?.emailId || current.unread !== EmailUnreadEnum.UNREAD) return

  // 等详情数据就绪（detailMap 已写入，或正文已有内容）再标已读
  const full = emailStore.detailMap[current.emailId]
  const detailReady = !!full || !!(current.content || current.text)
  if (!detailReady) return

  readRequesting = true
  const emailId = current.emailId
  current.unread = EmailUnreadEnum.READ
  if (emailStore.detailMap[emailId]) {
    emailStore.detailMap[emailId].unread = EmailUnreadEnum.READ
  }
  emailStore.markListRead(emailId)
  emailRead([emailId]).finally(() => {
    readRequesting = false
  })
}

watch(
  () => [
    email.value?.emailId,
    email.value?.content,
    email.value?.text,
    emailStore.detailMap[email.value?.emailId]
  ],
  () => tryMarkRead(),
  { flush: 'post' }
)

onMounted(() => {
  tryMarkRead()
  window.addEventListener('keydown', handleKeyDown);
})

onUnmounted(() => {
  emailStore.contentData.showUnread = false;
  readRequesting = false
  window.removeEventListener('keydown', handleKeyDown);
})

function handleKeyDown(event) {
  if (event.key !== 'Escape') return;
  if (showPreview.value) return;
  if (document.querySelector('.el-message-box')) return;
  const writeBox = document.querySelector('.write-box');
  if (writeBox && writeBox.offsetParent !== null) return;
  handleBack();
}

function openReply() {
  uiStore.writerRef.openReply(email.value)
}

function openForward() {
  uiStore.writerRef.openForward(email.value)
}

function toMessage(message) {
  return  message ? JSON.parse(message).message : '';
}

function formatImage(content) {
  content = content || '';
  const domain = settingStore.settings.r2Domain;
  return  content.replace(/{{domain}}/g, toOssDomain(domain) + '/');
}

function showImage(key) {
  if (!isImage(key)) return;
  const url = cvtR2Url(key)
  srcList.length = 0
  srcList.push(url)
  showPreview.value = true
}

function isImage(filename) {
  return ['png', 'jpg', 'jpeg', 'bmp', 'gif','jfif'].includes(getExtName(filename))
}

function formateReceive(recipient) {
  if (!recipient) return ''
  recipient = JSON.parse(recipient)
  return recipient.map(item => item.address).join(', ')
}

function changeStar() {
  if (email.value.isStar) {
    email.value.isStar = 0;
    starCancel(email.value.emailId).then(() => {
      email.value.isStar = 0;
      emailStore.cancelStarEmailId = email.value.emailId
      setTimeout(() => emailStore.cancelStarEmailId = 0)
      emailStore.starScroll?.deleteEmail([email.value.emailId])
    }).catch((e) => {
      console.error(e)
      email.value.isStar = 1;
    })
  } else {
    email.value.isStar = 1;
    starAdd(email.value.emailId).then(() => {
      email.value.isStar = 1;
      emailStore.addStarEmailId = email.value.emailId
      setTimeout(() => emailStore.addStarEmailId = 0)
      emailStore.starScroll?.addItem(email.value)
    }).catch((e) => {
      console.error(e)
      email.value.isStar = 0;
    })
  }
}

const handleBack = () => {
  router.back()
}

const handleDelete = () => {
  ElMessageBox.confirm(t('delEmailConfirm'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(() => {
    if (emailStore.contentData.delType === 'logic') {
      emailDelete(email.value.emailId).then(() => {
        ElMessage({
          message: t('delSuccessMsg'),
          type: 'success',
          plain: true,
        })
        emailStore.deleteIds = [email.value.emailId]
      })
    } else  {

      allEmailDelete(email.value.emailId).then(() => {
        ElMessage({
          message: t('delSuccessMsg'),
          type: 'success',
          plain: true,
        })
        emailStore.deleteIds = [email.value.emailId]
      })
    }

    router.back()
  })
}
</script>
<style scoped lang="scss">
.box {
  height: 100%;
  overflow: hidden;
}

.header-actions {
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--header-actions-border);
  background: var(--el-bg-color);
  font-size: 16px;

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 13.5px;
    font-family: var(--font-mincho);
    letter-spacing: 0.06em;
    color: var(--el-text-color-primary);
    padding: 3px 8px;
    border-radius: 4px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }
  }

  .action-divider {
    width: 1px;
    height: 14px;
    background: var(--el-border-color);
  }

  .star {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 21px;
  }

  .icon {
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      color: var(--el-color-primary);
      transform: scale(1.1);
    }
  }
}

.scrollbar {
  height: calc(100% - 38px);
  width: 100%;
}

.container {
  font-size: 14px;
  max-width: 960px;
  margin: 16px auto 30px;
  padding: 24px 32px 32px;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(43, 35, 56, 0.04);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 1023px) {
    margin: 8px 10px 20px;
    padding: 16px 18px 24px;
    border-radius: 6px;
  }

  .epistle-crest {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 12px;
    opacity: 0.75;

    .crest-line {
      height: 1px;
      flex: 1;
      max-width: 60px;
      background: linear-gradient(90deg, transparent, var(--el-border-color), transparent);
    }

    .crest-symbol {
      font-family: var(--font-serif-italic);
      font-size: 12px;
      letter-spacing: 0.12em;
      color: var(--el-color-primary);
    }
  }

  .email-title {
    font-family: var(--font-mincho);
    font-size: 22px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 0.06em;
    color: var(--el-text-color-primary);
    margin-bottom: 14px;
    word-break: break-word;
  }

  .htm-scrollbar {
  }

  .content {
    display: flex;
    flex-direction: column;

    .att {
      margin-top: 30px;
      margin-bottom: 24px;
      border: 1px solid var(--el-border-color);
      background: rgba(138, 72, 107, 0.02);
      padding: 16px;
      border-radius: 8px;
      width: fit-content;

      .att-box {
        min-width: min(410px,calc(100vw - 60px));
        max-width: 600px;
        display: grid;
        gap: 12px;
        grid-template-rows: 1fr;
      }

      .att-title {
        font-family: var(--font-mincho);
        letter-spacing: 0.06em;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        span:first-child {
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
        span:last-child {
          font-family: var(--font-serif-italic);
          font-style: italic;
          color: var(--el-text-color-secondary);
        }
      }

      .att-item {
        cursor: pointer;
        background: var(--card-bg, #ffffff);
        border: 1px solid var(--el-border-color-lighter);
        box-shadow: 0 1px 4px rgba(43, 35, 56, 0.03);
        padding: 6px 10px;
        border-radius: 6px;
        align-self: start;
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

        &:hover {
          border-color: var(--el-color-primary);
          transform: translateY(-1px);
        }

        div {
          align-self: center;
        }

        .att-icon {
          display: grid;
        }

        .att-size {
          color: var(--secondary-text-color);
        }

        .att-name {
          margin-left: 8px;
          margin-right: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }

        .att-image {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .opt-icon {
          padding-left: 10px;
          color: var(--secondary-text-color);
          align-items: center;
          display: flex;
          gap: 8px;
          cursor: pointer;
          a {
            color: var(--secondary-text-color);
            align-items: center;
            display: flex;
          }
        }
      }
    }

    .epistle-colophon-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px dashed var(--el-border-color-lighter);
      font-family: var(--font-serif-italic);
      font-size: 11px;
      letter-spacing: 0.12em;
      color: var(--el-text-color-secondary);
      opacity: 0.7;

      .footer-fleuron {
        font-size: 10px;
        color: var(--el-color-primary);
      }
    }

    .email-info {
      border: 1px solid var(--el-border-color-lighter);
      background: rgba(138, 72, 107, 0.025);
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 20px;

      @media (max-width: 1024px) {
        padding: 10px 14px;
        margin-bottom: 14px;
      }

      .date {
        font-family: var(--font-serif-italic);
        font-style: italic;
        font-size: 13px;
        color: var(--el-text-color-secondary);
        margin-top: 6px;
      }

      .email-msg {
        max-width: 400px;
        width: fit-content;
        margin-bottom: 15px;
      }

      .send {
        display: flex;
        align-items: baseline;
        margin-bottom: 6px;

        .send-source {
          font-family: var(--font-mincho);
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--el-color-primary);
          font-weight: 600;
          white-space: nowrap;
          padding-right: 12px;
        }

        .send-name {
          color: var(--el-text-color-primary);
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px;

          .send-name-title {
            font-weight: 600;
          }

          .send-email-text {
            font-family: var(--font-serif-italic);
            font-style: italic;
            color: var(--el-text-color-secondary);
            font-size: 13.5px;
          }
        }
      }

      .receive {
        display: flex;
        align-items: baseline;
        margin-bottom: 6px;

        .source {
          font-family: var(--font-mincho);
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--el-text-color-secondary);
          font-weight: 600;
          white-space: nowrap;
          padding-right: 12px;
        }

        .receive-email {
          max-width: 700px;
          word-break: break-word;
          font-family: var(--font-serif-italic);
          font-style: italic;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}

.shadow-html::after  {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--message-block-color); /* 半透明黑色蒙层 */
  pointer-events: none; /* 不影响点击 */
}

.email-text {
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.privacy-shield-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: var(--shield-bg, rgba(179, 136, 72, 0.08));
  border: 1px solid var(--shield-border, rgba(179, 136, 72, 0.28));
  color: var(--shield-text, #8d6220);
  font-size: 12.5px;
  transition: all 0.2s ease;

  &.is-secure {
    opacity: 0.85;
  }

  .shield-main {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    .shield-icon {
      flex-shrink: 0;
    }

    .shield-text {
      line-height: 1.4;

      .shield-highlight {
        font-weight: 600;
      }
    }
  }

  .shield-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    .shield-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid var(--shield-border, rgba(179, 136, 72, 0.3));
      background: var(--el-bg-color, #ffffff);
      color: var(--shield-text, #8d6220);
      cursor: pointer;
      font-size: 11.5px;
      font-weight: 500;
      transition: all 0.15s ease;

      &:hover {
        background: var(--el-color-primary);
        color: #ffffff;
        border-color: var(--el-color-primary);
      }
    }

    .shield-loaded-tip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11.5px;
      opacity: 0.85;
    }

    .persona-btn {
      background: rgba(138, 72, 107, 0.08) !important;
      border-color: rgba(138, 72, 107, 0.3) !important;
      color: var(--el-color-primary, #8a486b) !important;
      gap: 5px !important;

      &.is-custom-bound {
        background: rgba(179, 136, 72, 0.09) !important;
        border-color: rgba(179, 136, 72, 0.36) !important;
        color: #9c6c22 !important;
      }

      .persona-emoji {
        font-size: 13px;
        line-height: 1;
      }

      .persona-label {
        font-weight: 600;
        letter-spacing: 0.02em;
        display: inline-flex;
        align-items: center;

        .custom-mailbox-tag {
          font-family: var(--font-mincho), serif;
          font-size: 10px;
          color: #b38848;
          background: rgba(179, 136, 72, 0.12);
          border: 1px solid rgba(179, 136, 72, 0.3);
          padding: 0 4px;
          border-radius: 3px;
          margin-right: 5px;
          letter-spacing: 0.04em;
          font-weight: 600;
          line-height: 1.4;
        }
      }

      &:hover {
        background: #8a486b !important;
        color: #ffffff !important;
        border-color: #8a486b !important;

        .custom-mailbox-tag {
          color: #fff9ea;
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }
      }
    }

    .log-btn {
      background: rgba(184, 74, 91, 0.08) !important;
      border-color: rgba(184, 74, 91, 0.3) !important;
      color: #b84a5b !important;

      &:hover {
        background: #b84a5b !important;
        color: #ffffff !important;
      }
    }
  }
}

:deep(.persona-dropdown) {
  min-width: 260px;

  .dropdown-header-note {
    font-size: 11px;
    font-family: var(--font-mincho), serif;
    padding: 7px 12px 5px;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--el-border-color-lighter);
    margin-bottom: 4px;

    .note-title-line {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #b38848;
      font-weight: 600;
      margin-bottom: 3px;
    }

    .note-target-line {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10.5px;
      color: var(--el-text-color-secondary);

      .target-email {
        font-family: var(--font-serif-italic), serif;
        font-style: italic;
        color: var(--el-text-color-primary);
        max-width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .target-badge {
        font-size: 9.5px;
        padding: 0 4px;
        border-radius: 2px;
        white-space: nowrap;

        &.badge-custom {
          color: #8a486b;
          background: rgba(138, 72, 107, 0.12);
          border: 1px solid rgba(138, 72, 107, 0.3);
        }

        &.badge-inherit {
          color: #7d7289;
          background: rgba(125, 114, 137, 0.08);
          border: 1px solid rgba(125, 114, 137, 0.2);
        }
      }
    }
  }

  .dropdown-reset-bar {
    border-bottom: 1px dashed var(--el-border-color-lighter);
    padding-bottom: 3px;
    margin-bottom: 3px;

    .reset-item {
      color: #8a486b !important;
      font-size: 11.5px !important;
      font-family: var(--font-mincho), serif;
      gap: 6px;
      padding: 6px 12px;

      &:hover {
        background: rgba(138, 72, 107, 0.08) !important;
      }
    }
  }

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;

    .dropdown-emoji {
      font-size: 15px;
      line-height: 1;
    }

    .dropdown-item-content {
      flex: 1;
      display: flex;
      flex-direction: column;

      .dropdown-name {
        font-size: 12px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .dropdown-badge {
        font-size: 10px;
        color: #9589a3;
      }
    }

    .dropdown-active-seal {
      color: #8a486b;
      font-weight: bold;
    }

    &.is-active-persona {
      background: rgba(138, 72, 107, 0.08);

      .dropdown-name {
        color: #8a486b;
      }
    }
  }
}

:deep(.codex-audit-dialog) {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  box-shadow: 0 16px 40px rgba(43, 35, 56, 0.14);

  .el-dialog__header {
    margin-right: 0;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .audit-modal-content {
    padding: 6px 4px;

    .audit-summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 20px;

      .summary-card {
        padding: 12px;
        border-radius: 8px;
        text-align: center;
        border: 1px solid var(--el-border-color);

        .card-num {
          display: block;
          font-family: var(--font-mincho), serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .card-label {
          font-size: 11.5px;
          color: var(--el-text-color-secondary);
        }

        &.danger {
          background: rgba(184, 74, 91, 0.06);
          border-color: rgba(184, 74, 91, 0.25);
          .card-num { color: #b84a5b; }
        }

        &.warning {
          background: rgba(179, 136, 72, 0.06);
          border-color: rgba(179, 136, 72, 0.25);
          .card-num { color: #b38848; }
        }

        &.clean {
          background: rgba(62, 207, 142, 0.06);
          border-color: rgba(62, 207, 142, 0.25);
          .card-num { color: #2e7c65; }
        }
      }
    }

    .audit-section {
      margin-bottom: 16px;

      .section-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        flex-wrap: wrap;
        gap: 8px;

        .section-title {
          margin-bottom: 0;
        }

        .poison-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid #8a486b;
          background: #8a486b;
          color: #ffffff;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;

          &:hover:not(:disabled) {
            background: #723755;
            box-shadow: 0 2px 8px rgba(138, 72, 107, 0.25);
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

      .section-title {
        font-family: var(--font-mincho), serif;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 10px;
        color: var(--el-text-color-primary);

        .fleuron {
          color: #b38848;
          margin-right: 4px;
        }
      }

      .tracker-item {
        background: rgba(43, 35, 56, 0.025);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 6px;
        padding: 10px 12px;
        margin-bottom: 8px;

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;

          .tracker-type {
            font-size: 12px;
            font-weight: 600;
            color: #b84a5b;
          }

          .tracker-status {
            font-size: 11px;
            padding: 1px 6px;
            border-radius: 3px;
            background: rgba(184, 74, 91, 0.1);
            color: #b84a5b;
          }
        }

        .tracker-url {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;

          code {
            flex: 1;
            font-family: monospace;
            font-size: 11.5px;
            background: #ffffff;
            border: 1px solid rgba(220, 208, 228, 0.6);
            border-radius: 4px;
            padding: 4px 8px;
            word-break: break-all;
            color: #2b2338;
          }

          .copy-url-btn {
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 4px;
            border: 1px solid var(--el-border-color);
            background: #ffffff;
            cursor: pointer;
            color: #6e5a75;
            flex-shrink: 0;

            &:hover {
              color: var(--el-color-primary);
              border-color: var(--el-color-primary);
            }
          }

          .poison-single-btn {
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 4px;
            border: 1px solid rgba(138, 72, 107, 0.35);
            background: rgba(138, 72, 107, 0.08);
            cursor: pointer;
            color: #8a486b;
            font-weight: 600;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            gap: 3px;
            transition: all 0.15s ease;

            &:hover:not(:disabled) {
              background: #8a486b;
              color: #ffffff;
            }

            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          }
        }

        .poison-feedback-tag {
          font-size: 11px;
          background: rgba(62, 207, 142, 0.1);
          border: 1px solid rgba(62, 207, 142, 0.3);
          color: #216e53;
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 4px;

          .fleuron {
            color: #216e53;
          }
        }

        .tracker-reason {
          font-size: 11px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
