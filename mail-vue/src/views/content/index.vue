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
            <div class="shield-actions" v-if="privacyAudit.blockedImagesCount > 0 && !allowImagesForCurrent">
              <button class="shield-btn" @click="toggleLoadImages">
                <Icon icon="solar:gallery-wide-linear" width="14" height="14" />
                显示图片
              </button>
              <button class="shield-btn" @click="trustSender" v-if="email.sendEmail && !isSenderTrusted(email.sendEmail)">
                <Icon icon="solar:user-check-rounded-linear" width="14" height="14" />
                信任此发件人
              </button>
            </div>
            <div class="shield-actions" v-else-if="allowImagesForCurrent && privacyAudit.blockedImagesCount > 0">
              <span class="shield-loaded-tip">
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
        </div>
      </div>
    </el-scrollbar>
    <el-image-viewer
        v-if="showPreview"
        :url-list="srcList"
        show-progress
        @close="showPreview = false"
    />
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
      margin-bottom: 30px;
      border: 1px solid var(--light-border-color);
      padding: 14px;
      border-radius: 6px;
      width: fit-content;
      .att-box {
        min-width: min(410px,calc(100vw - 60px));
        max-width: 600px;
        display: grid;
        gap: 12px;
        grid-template-rows: 1fr;
      }

      .att-title {
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        span:first-child {
          font-weight: bold;
        }
      }

      .att-item {
        cursor: pointer;
        div {
          align-self: center;
        }
        background: var(--light-ill);
        padding: 5px 7px;
        border-radius: 4px;
        align-self: start;
        display: grid;
        grid-template-columns: auto 1fr auto auto;
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
  }
}
</style>
