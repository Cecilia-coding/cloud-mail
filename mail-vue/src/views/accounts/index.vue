<template>
  <div class="accounts-hub-page">
    <el-scrollbar class="hub-scrollbar" ref="scrollbarRef">
      <div class="hub-container">

        
        <header class="hub-header">
          <div class="hub-title-group">
            <div class="hub-main-title">
              <span class="fleuron">✦</span>
              <span class="title-text">密匣印籍</span>
              <span class="hub-badge" v-if="accounts.length">{{ accounts.length }} 匣</span>
            </div>
            <div class="hub-subtitle">
              <span>Accounts Hub · 掌中信匣矩阵与全域检视</span>
            </div>
          </div>

          <div class="hub-actions">
            <el-tooltip :content="$t('addAccount') || '添设新邮箱'" placement="top" :show-after="300">
              <button
                v-perm="'account:add'"
                class="hub-btn add-btn"
                @click="openAddDialog"
                aria-label="Add mailbox"
              >
                <Icon icon="solar:user-plus-rounded-linear" width="16" height="16" />
                <span class="btn-label">添设信匣</span>
              </button>
            </el-tooltip>
            <el-tooltip content="刷新印籍" placement="top" :show-after="300">
              <button
                class="hub-btn icon-only-btn"
                :class="{ 'is-spinning': loading }"
                @click="refresh"
                aria-label="Refresh"
              >
                <Icon icon="solar:restart-linear" width="16" height="16" />
              </button>
            </el-tooltip>
          </div>
        </header>

        
        <section class="hub-filter-bar">
          <div class="search-input-wrap">
            <Icon icon="solar:magnifer-linear" width="15" height="15" class="search-icon" />
            <input
              type="text"
              v-model="searchQuery"
              class="search-input"
              placeholder="检视地址、别名或域名..."
              autocomplete="off"
            />
            <button
              v-if="searchQuery"
              class="clear-btn"
              @click="searchQuery = ''"
              aria-label="Clear query"
            >
              <Icon icon="solar:close-circle-linear" width="14" height="14" />
            </button>
          </div>
          <div class="filter-stat-pill">
            <span class="stat-dot">❖</span>
            <span class="stat-text">全域收信 {{ catchAllCount }} 匣</span>
          </div>
        </section>

        
        <section class="pinned-section" v-if="!searchQuery">
          <div class="all-inboxes-card" @click="enterAllInboxes">
            <div class="card-glow"></div>
            <div class="card-left">
              <div class="all-seal">
                <span class="seal-star">✦</span>
              </div>
              <div class="all-info">
                <div class="all-title">
                  <span>全域联合信匣</span>
                  <span class="all-tag">All Inboxes</span>
                </div>
                <div class="all-desc">汇聚名下所有密匣联合流水 · 即刻巡查</div>
              </div>
            </div>
            <div class="card-right">
              <span class="enter-text">阅览信函</span>
              <Icon icon="solar:alt-arrow-right-linear" width="16" height="16" />
            </div>
          </div>
        </section>

        
        <section class="skeleton-grid" v-if="loading && accounts.length === 0">
          <div class="account-card skeleton-card" v-for="i in 6" :key="i">
            <el-skeleton animated>
              <template #template>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <el-skeleton-item variant="circle" style="width: 36px; height: 36px; flex-shrink: 0;" />
                  <div style="flex: 1;">
                    <el-skeleton-item variant="text" style="width: 80%; height: 16px; margin-bottom: 6px;" />
                    <el-skeleton-item variant="text" style="width: 40%; height: 12px;" />
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px;">
                  <el-skeleton-item variant="button" style="width: 80px; height: 24px; border-radius: 12px;" />
                  <el-skeleton-item variant="text" style="width: 60px; height: 18px;" />
                </div>
              </template>
            </el-skeleton>
          </div>
        </section>

        
        <section class="cards-section" v-else>
          <div class="section-lead" v-if="regularAccounts.length > 0">
            <span class="lead-symbol">❖</span>
            <span class="lead-title">常备信匣</span>
            <span class="lead-count">{{ regularAccounts.length }}</span>
          </div>

          <div class="cards-grid" v-if="regularAccounts.length > 0">
            <div
              v-for="item in regularAccounts"
              :key="item.accountId"
              class="account-card"
              :class="{ 'is-active': accountStore.currentAccountId === item.accountId }"
              @click="selectAccountAndEnter(item)"
            >
              
              <div class="card-top">
                <div class="seal-badge">
                  <span class="seal-char">{{ (item.email || 'A')[0].toUpperCase() }}</span>
                </div>
                <div class="meta-wrap">
                  <div class="email-row" :title="item.email">
                    <span class="email-text">{{ item.email }}</span>
                  </div>
                  <div class="alias-row">
                    <span class="alias-text" v-if="item.name">{{ item.name }}</span>
                    <span class="alias-placeholder" v-else>未署别名</span>
                  </div>
                </div>
                <div class="active-pill" v-if="accountStore.currentAccountId === item.accountId">
                  <span class="dot">✦</span>
                  <span class="text">启阅中</span>
                </div>
              </div>

              
              <div class="card-bottom" @click.stop>
                <div class="mode-capsule-wrap">
                  <el-tooltip
                    :content="item.allReceive ? '已启用全域收信：该域名所有前缀邮件均归此匣' : '专属单信模式：仅接收此邮箱地址之信件（点击切换全收）'"
                    placement="top"
                    :show-after="300"
                  >
                    <button
                      class="mode-badge-btn"
                      :class="item.allReceive ? 'is-catchall' : 'is-single'"
                      @click.stop="toggleAllReceive(item)"
                    >
                      <Icon :icon="item.allReceive ? 'solar:archive-linear' : 'solar:letter-linear'" width="13" height="13"/>
                      <span>{{ item.allReceive ? '全域收信' : '专属信箱' }}</span>
                    </button>
                  </el-tooltip>
                </div>

                <div class="actions-wrap">
                  <el-tooltip content="复制邮箱地址" placement="top" :show-after="300">
                    <button class="card-btn" @click.stop="copyEmail(item.email)" aria-label="Copy address">
                      <Icon icon="solar:copy-linear" width="14" height="14" />
                    </button>
                  </el-tooltip>

                  <el-dropdown trigger="click" @click.stop>
                    <button class="card-btn more-btn" aria-label="More operations">
                      <Icon icon="solar:menu-dots-bold" width="14" height="14" />
                    </button>
                    <template #dropdown>
                      <el-dropdown-menu class="codex-dropdown-menu">
                        <el-dropdown-item v-if="hasPerm('email:send')" @click="openRename(item)">
                          <Icon icon="solar:pen-linear" width="14" height="14" style="margin-right: 6px"/>
                          <span>{{ $t('rename') || '改名' }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item @click="setTop(item)">
                          <Icon icon="solar:pin-linear" width="14" height="14" style="margin-right: 6px"/>
                          <span>{{ $t('pin') || '设为置顶' }}</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="hasPerm('account:delete')"
                          divided
                          class="danger-menu-item"
                          @click="deleteAccount(item)"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" width="14" height="14" style="margin-right: 6px; color: #b84a5b"/>
                          <span style="color: #b84a5b">{{ $t('delete') || '删除' }}</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>

          
          <div class="query-empty" v-if="filteredAccounts.length === 0 && !loading">
            <span class="empty-star">❖</span>
            <span class="empty-text">未检索到与“{{ searchQuery }}”匹配的密匣印籍</span>
          </div>

          
          <div class="admin-section" v-if="adminAccount && (!searchQuery || adminMatchesQuery)">
            <div class="section-lead admin-lead">
              <span class="lead-symbol">✦</span>
              <span class="lead-title">系统底匣 · 主管理号</span>
              <span class="admin-pill">System Master</span>
            </div>

            <div
              class="account-card admin-card"
              :class="{ 'is-active': accountStore.currentAccountId === adminAccount.accountId }"
              @click="selectAccountAndEnter(adminAccount)"
            >
              <div class="card-top">
                <div class="seal-badge admin-seal">
                  <span class="seal-char">M</span>
                </div>
                <div class="meta-wrap">
                  <div class="email-row" :title="adminAccount.email">
                    <span class="email-text">{{ adminAccount.email }}</span>
                    <span class="master-tag">系统管理</span>
                  </div>
                  <div class="alias-row">
                    <span class="alias-text">{{ adminAccount.name || '管理母印' }}</span>
                  </div>
                </div>
                <div class="active-pill" v-if="accountStore.currentAccountId === adminAccount.accountId">
                  <span class="dot">✦</span>
                  <span class="text">启阅中</span>
                </div>
              </div>

              <div class="card-bottom" @click.stop>
                <div class="mode-capsule-wrap">
                  <span class="admin-mode-text">
                    <Icon icon="solar:shield-check-linear" width="13" height="13" />
                    <span>系统级常驻 · 仅作底座</span>
                  </span>
                </div>
                <div class="actions-wrap">
                  <el-tooltip content="复制邮箱地址" placement="top" :show-after="300">
                    <button class="card-btn" @click.stop="copyEmail(adminAccount.email)" aria-label="Copy admin address">
                      <Icon icon="solar:copy-linear" width="14" height="14" />
                    </button>
                  </el-tooltip>
                  <el-tooltip content="改名" placement="top" :show-after="300">
                    <button class="card-btn" v-if="hasPerm('email:send')" @click.stop="openRename(adminAccount)" aria-label="Rename admin">
                      <Icon icon="solar:pen-linear" width="14" height="14" />
                    </button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>

          
          <footer class="hub-colophon" v-if="accounts.length > 0">
            <span class="colophon-star">❖</span>
            <span class="colophon-text">全册印籍收录完全 · 随指点阅</span>
            <span class="colophon-star">❖</span>
          </footer>
        </section>

      </div>
    </el-scrollbar>

    
    <el-dialog
      v-model="showAdd"
      :title="$t('addAccount') || '添设新信匣'"
      class="codex-hub-dialog"
      width="90%"
      style="max-width: 440px"
    >
      <div class="dialog-form">
        <el-input
          v-model="addForm.email"
          ref="addRef"
          type="text"
          :placeholder="$t('emailAccount') || '输入前缀'"
          autocomplete="off"
          @keyup.enter="submitAdd"
        >
          <template #append>
            <div @click.stop="openDomainSelect" class="domain-selector-trigger">
              <el-select
                ref="domainSelectRef"
                v-model="addForm.suffix"
                :placeholder="$t('select')"
                class="domain-select"
              >
                <el-option
                  v-for="item in domainList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div class="domain-label">
                <span>{{ addForm.suffix }}</span>
                <Icon class="setting-icon" icon="mingcute:down-small-fill" width="18" height="18" />
              </div>
            </div>
          </template>
        </el-input>
        <el-button
          class="dialog-btn"
          type="primary"
          @click="submitAdd"
          :loading="addLoading"
        >
          {{ $t('add') || '添设' }}
        </el-button>
      </div>
      <div
        class="hub-turnstile-box add-email-turnstile"
        :class="verifyShow ? 'turnstile-show' : 'turnstile-hide'"
        :data-sitekey="settingStore.settings.siteKey"
        data-callback="onHubTurnstileSuccess"
        data-error-callback="onHubTurnstileError"
      >
        <span style="font-size: 12px; color: #F56C6C" v-if="botJsError">{{ $t('verifyModuleFailed') }}</span>
      </div>
    </el-dialog>

    
    <el-dialog
      v-model="showRename"
      :title="$t('changeUserName') || '修改别名署名'"
      class="codex-hub-dialog"
      width="90%"
      style="max-width: 400px"
    >
      <div class="dialog-form">
        <el-input
          v-model="renameValue"
          type="text"
          :placeholder="$t('username') || '输入信匣别名'"
          autocomplete="off"
          @keyup.enter="submitRename"
        />
        <el-button
          class="dialog-btn"
          type="primary"
          @click="submitRename"
          :loading="renameLoading"
        >
          {{ $t('save') || '保存' }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  accountList,
  accountAdd,
  accountDelete,
  accountSetName,
  accountSetAllReceive,
  accountSetAsTop
} from '@/request/account.js'
import { isEmail } from '@/utils/verify-utils.js'
import { useSettingStore } from '@/store/setting.js'
import { useAccountStore } from '@/store/account.js'
import { useEmailStore } from '@/store/email.js'
import { useUserStore } from '@/store/user.js'
import { hasPerm } from '@/perm/perm.js'
import { AccountAllReceiveEnum } from '@/enums/account-enum.js'

defineOptions({
  name: 'accounts'
})

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const accountStore = useAccountStore()
const settingStore = useSettingStore()
const emailStore = useEmailStore()

const scrollbarRef = ref(null)
const domainSelectRef = ref(null)
const addRef = ref(null)

const accounts = ref([])
const loading = ref(false)
const searchQuery = ref('')

const showAdd = ref(false)
const addLoading = ref(false)
const verifyShow = ref(false)
const botJsError = ref(false)
let turnstileId = null
let verifyToken = ''
let verifyErrorCount = 0

const showRename = ref(false)
const renameLoading = ref(false)
const renameValue = ref('')
let targetAccountForRename = null

const addForm = reactive({
  email: '',
  suffix: settingStore.domainList?.[0] || ''
})

const domainList = computed(() => settingStore.domainList || [])

const catchAllCount = computed(() => {
  return accounts.value.filter(item => item.allReceive === AccountAllReceiveEnum.ENABLED).length
})

const adminAccountId = computed(() => {
  return userStore.user?.account?.accountId || 0
})

const adminAccount = computed(() => {
  return accounts.value.find(item => item.accountId === adminAccountId.value)
})

const adminMatchesQuery = computed(() => {
  if (!searchQuery.value || !adminAccount.value) return true
  const q = searchQuery.value.toLowerCase().trim()
  const emailMatch = (adminAccount.value.email || '').toLowerCase().includes(q)
  const nameMatch = (adminAccount.value.name || '').toLowerCase().includes(q)
  return emailMatch || nameMatch
})

const filteredAccounts = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return accounts.value
  return accounts.value.filter(item => {
    const emailMatch = (item.email || '').toLowerCase().includes(q)
    const nameMatch = (item.name || '').toLowerCase().includes(q)
    return emailMatch || nameMatch
  })
})

const regularAccounts = computed(() => {
  return filteredAccounts.value.filter(item => item.accountId !== adminAccountId.value)
})

onMounted(() => {
  fetchAccounts()
  setupTurnstileCallbacks()
})

function setupTurnstileCallbacks() {
  window.onHubTurnstileSuccess = (token) => {
    verifyToken = token
  }
  window.onHubTurnstileError = (e) => {
    if (verifyErrorCount >= 4) return
    verifyErrorCount++
    setTimeout(() => {
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile?.render('.add-email-turnstile')
          } catch (err) {
            botJsError.value = true
          }
        } else {
          window.turnstile?.reset(turnstileId)
        }
      })
    }, 1500)
  }
}

async function fetchAccounts() {
  if (loading.value) return
  loading.value = true
  const allList = []
  let currentId = 0
  let lastSort = null
  let hasMore = true

  try {
    while (hasMore) {
      const batch = await accountList(currentId, 30, lastSort)
      if (!batch || batch.length === 0) {
        hasMore = false
        break
      }
      allList.push(...batch)
      if (batch.length < 30) {
        hasMore = false
      } else {
        const lastItem = batch[batch.length - 1]
        currentId = lastItem.accountId
        lastSort = lastItem.sort
      }
    }
    accounts.value = allList
    if (accounts.value.length > 0) {
      const savedId = localStorage.getItem('cloud_mail_last_account_id')
      let target = accounts.value.find(item => String(item.accountId) === String(savedId))
      if (!target) {
        target = regularAccounts.value[0] || accounts.value[0]
      }
      if (!accountStore.currentAccountId && target) {
        accountStore.currentAccountId = target.accountId
        accountStore.currentAccount = target
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function refresh() {
  fetchAccounts()
  emailStore.emailScroll?.refreshList?.()
}

function selectAccountAndEnter(accountItem) {
  accountStore.currentAccountId = accountItem.accountId
  accountStore.currentAccount = accountItem
  if (accountItem?.accountId) {
    localStorage.setItem('cloud_mail_last_account_id', String(accountItem.accountId))
  }
  router.push('/inbox')
}

function enterAllInboxes() {
  if (hasPerm('all-email:query')) {
    router.push('/all-mail')
  } else {
    router.push('/inbox')
  }
}

function toggleAllReceive(item) {
  const previousState = item.allReceive
  const newState = previousState === AccountAllReceiveEnum.DISABLED
    ? AccountAllReceiveEnum.ENABLED
    : AccountAllReceiveEnum.DISABLED

  const previousCatchAll = accounts.value.find(acc => acc.allReceive === AccountAllReceiveEnum.ENABLED && acc.accountId !== item.accountId)
  if (previousCatchAll && newState === AccountAllReceiveEnum.ENABLED) {
    previousCatchAll.allReceive = AccountAllReceiveEnum.DISABLED
  }

  item.allReceive = newState
  accountSetAllReceive(item.accountId).then(() => {
    if (item.allReceive === AccountAllReceiveEnum.ENABLED) {
      ElMessage({
        message: t('setSuccess') || '已设为全域收信',
        type: 'success',
        plain: true
      })
    }
    emailStore.emailScroll?.refreshList?.()
  }).catch(() => {
    item.allReceive = previousState
    if (previousCatchAll) previousCatchAll.allReceive = AccountAllReceiveEnum.ENABLED
  })
}

async function copyEmail(email) {
  try {
    await navigator.clipboard.writeText(email)
    ElMessage({
      message: t('copySuccessMsg') || '地址已复制到剪贴板',
      type: 'success',
      plain: true
    })
  } catch (e) {
    ElMessage({
      message: t('copyFailMsg') || '复制失败',
      type: 'error',
      plain: true
    })
  }
}

function setTop(accountItem) {
  accountSetAsTop(accountItem.accountId).then(() => {
    ElMessage({
      message: t('setSuccess') || '已置顶',
      type: 'success',
      plain: true
    })
    fetchAccounts()
  })
}

function openRename(accountItem) {
  targetAccountForRename = accountItem
  renameValue.value = accountItem.name || ''
  showRename.value = true
}

function submitRename() {
  if (renameLoading.value || !targetAccountForRename) return
  const val = renameValue.value.trim()
  if (!val) {
    ElMessage({
      message: t('emptyUserNameMsg') || '别名不能为空',
      type: 'error',
      plain: true
    })
    return
  }

  renameLoading.value = true
  accountSetName(targetAccountForRename.accountId, val).then(() => {
    targetAccountForRename.name = val
    if (targetAccountForRename.accountId === userStore.user?.account?.accountId) {
      userStore.user.name = val
    }
    showRename.value = false
    ElMessage({
      message: t('saveSuccessMsg') || '保存成功',
      type: 'success',
      plain: true
    })
  }).finally(() => {
    renameLoading.value = false
  })
}

function deleteAccount(accountItem) {
  ElMessageBox.confirm(
    t('delConfirm', { msg: accountItem.email }) || `确认永久移除密匣 ${accountItem.email} 吗`,
    {
      confirmButtonText: t('confirm') || '确认移除',
      cancelButtonText: t('cancel') || '取消',
      type: 'warning'
    }
  ).then(() => {
    accountDelete(accountItem.accountId).then(() => {
      ElMessage({
        message: t('delSuccessMsg') || '已移除',
        type: 'success',
        plain: true
      })
      fetchAccounts()
    })
  })
}

function openAddDialog() {
  addForm.suffix = addForm.suffix || domainList.value[0] || ''
  showAdd.value = true
  nextTick(() => {
    setTimeout(() => {
      addRef.value?.focus?.()
    }, 120)
  })
}

function openDomainSelect() {
  domainSelectRef.value?.toggleMenu?.()
}

function submitAdd() {
  if (addLoading.value) return
  if (!addForm.email) {
    ElMessage({
      message: t('emptyEmailMsg') || '请输入邮箱前缀',
      type: 'error',
      plain: true
    })
    return
  }

  const minPrefix = settingStore.settings?.minEmailPrefix || 1
  if (addForm.email.length < minPrefix) {
    ElMessage({
      message: t('minEmailPrefix', { msg: minPrefix }) || `前缀长度不可少于 ${minPrefix}`,
      type: 'error',
      plain: true
    })
    return
  }

  const fullEmail = addForm.email + addForm.suffix
  if (!isEmail(fullEmail)) {
    ElMessage({
      message: t('notEmailMsg') || '邮箱格式不合规',
      type: 'error',
      plain: true
    })
    return
  }

  const needVerify = (settingStore.settings.addEmailVerify === 0 ||
    (settingStore.settings.addEmailVerify === 2 && settingStore.settings.addVerifyOpen))

  if (!verifyToken && needVerify) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile?.render('.add-email-turnstile')
          } catch (e) {
            botJsError.value = true
          }
        } else {
          window.turnstile?.reset(turnstileId)
        }
      })
    } else if (!botJsError.value) {
      ElMessage({
        message: t('botVerifyMsg') || '请先完成人机校验',
        type: 'error',
        plain: true
      })
    }
    return
  }

  addLoading.value = true
  accountAdd(fullEmail, verifyToken).then(newAcc => {
    addLoading.value = false
    addForm.email = ''
    verifyToken = ''
    verifyShow.value = false
    showAdd.value = false
    settingStore.settings.addVerifyOpen = newAcc.addVerifyOpen
    ElMessage({
      message: t('addSuccessMsg') || '添设成功',
      type: 'success',
      plain: true
    })
    userStore.refreshUserInfo?.()
    fetchAccounts()
  }).catch(res => {
    addLoading.value = false
    if (res?.code === 400) {
      verifyToken = ''
      verifyShow.value = true
      nextTick(() => {
        if (turnstileId) {
          window.turnstile?.reset(turnstileId)
        } else {
          turnstileId = window.turnstile?.render('.add-email-turnstile')
        }
      })
    }
  })
}
</script>

<style scoped lang="scss">
.accounts-hub-page {
  width: 100%;
  height: 100%;
  background: var(--el-bg-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .hub-scrollbar {
    width: 100%;
    height: 100%;
  }

  .hub-container {
    max-width: 920px;
    margin: 0 auto;
    padding: 18px 16px 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Header Section */
  .hub-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color);

    .hub-title-group {
      display: flex;
      flex-direction: column;
      gap: 3px;

      .hub-main-title {
        display: flex;
        align-items: center;
        gap: 8px;

        .fleuron {
          color: #b38848;
          font-size: 14px;
        }

        .title-text {
          font-family: var(--font-mincho), "Songti SC", serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--aside-text-color, #2b2338);
          letter-spacing: 0.1em;
        }

        .hub-badge {
          font-family: var(--font-serif-italic), "Cormorant Garamond", Georgia, serif;
          font-size: 11px;
          padding: 2px 7px;
          border-radius: 10px;
          border: 1px solid rgba(179, 136, 72, 0.4);
          background: rgba(179, 136, 72, 0.1);
          color: #b38848;
        }
      }

      .hub-subtitle {
        font-family: var(--font-serif-italic), "Cormorant Garamond", Georgia, serif;
        font-size: 12px;
        color: #8a486b;
        opacity: 0.85;
      }
    }

    .hub-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .hub-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 32px;
        padding: 0 12px;
        border-radius: 8px;
        border: 1px solid var(--el-border-color);
        background: rgba(255, 255, 255, 0.6);
        color: var(--aside-text-color, #2b2338);
        font-family: var(--font-mincho), "Songti SC", serif;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

        &:hover {
          border-color: #b38848;
          background: rgba(179, 136, 72, 0.08);
          color: #b38848;
          transform: translateY(-1px);
        }

        &.add-btn {
          border-color: rgba(179, 136, 72, 0.45);
          background: rgba(179, 136, 72, 0.12);
          color: #b38848;
          font-weight: 600;

          &:hover {
            background: rgba(179, 136, 72, 0.2);
          }
        }

        &.icon-only-btn {
          padding: 0;
          width: 32px;
          justify-content: center;
        }

        &.is-spinning :deep(svg) {
          animation: hub-spin 0.8s linear infinite;
        }
      }
    }
  }

  /* Filter Bar */
  .hub-filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    .search-input-wrap {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;

      .search-icon {
        position: absolute;
        left: 10px;
        color: #8a486b;
        opacity: 0.7;
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        height: 34px;
        padding: 0 30px 0 32px;
        border-radius: 8px;
        border: 1px solid var(--el-border-color);
        background: rgba(255, 255, 255, 0.45);
        color: var(--aside-text-color, #2b2338);
        font-size: 12px;
        font-family: inherit;
        outline: none;
        transition: all 0.2s ease;

        &:focus {
          border-color: #b38848;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 2px rgba(179, 136, 72, 0.12);
        }

        &::placeholder {
          color: #9c8e9b;
        }
      }

      .clear-btn {
        position: absolute;
        right: 8px;
        background: transparent;
        border: none;
        color: #9c8e9b;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 2px;

        &:hover {
          color: #8a486b;
        }
      }
    }

    .filter-stat-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 0 10px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid var(--el-border-color);
      background: rgba(255, 255, 255, 0.35);
      font-size: 11px;
      color: #8a486b;
      white-space: nowrap;

      .stat-dot {
        color: #b38848;
        font-size: 9px;
      }
    }
  }

  /* Pinned All-Inboxes Card */
  .pinned-section {
    .all-inboxes-card {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1px solid rgba(179, 136, 72, 0.4);
      background: linear-gradient(135deg, rgba(179, 136, 72, 0.08) 0%, rgba(138, 72, 107, 0.06) 100%);
      cursor: pointer;
      overflow: hidden;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-1.5px);
        border-color: #b38848;
        box-shadow: 0 4px 14px rgba(179, 136, 72, 0.12);
      }

      .card-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .all-seal {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(179, 136, 72, 0.15);
          border: 1px solid rgba(179, 136, 72, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;

          .seal-star {
            color: #b38848;
            font-size: 16px;
          }
        }

        .all-info {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .all-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: var(--font-mincho), "Songti SC", serif;
            font-size: 14px;
            font-weight: 700;
            color: var(--aside-text-color, #2b2338);

            .all-tag {
              font-family: var(--font-serif-italic), "Cormorant Garamond", Georgia, serif;
              font-size: 11px;
              color: #8a486b;
              letter-spacing: 0.04em;
            }
          }

          .all-desc {
            font-size: 11px;
            color: #7d6e7f;
          }
        }
      }

      .card-right {
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: var(--font-mincho), "Songti SC", serif;
        font-size: 12px;
        color: #b38848;
        font-weight: 600;
      }
    }
  }

  /* Section Lead */
  .section-lead {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 2px;

    .lead-symbol {
      color: #b38848;
      font-size: 10px;
    }

    .lead-title {
      font-family: var(--font-mincho), "Songti SC", serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--aside-text-color, #2b2338);
      letter-spacing: 0.06em;
    }

    .lead-count {
      font-size: 11px;
      color: #8a486b;
      opacity: 0.8;
    }

    &.admin-lead {
      margin-top: 14px;
      border-top: 1px dashed var(--el-border-color);
      padding-top: 14px;

      .lead-symbol {
        color: #8a486b;
      }

      .admin-pill {
        font-family: var(--font-serif-italic), "Cormorant Garamond", Georgia, serif;
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 8px;
        background: rgba(138, 72, 107, 0.1);
        color: #8a486b;
      }
    }
  }

  /* Cards Grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  /* Account Card Anatomy */
  .account-card {
    position: relative;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid var(--el-border-color);
    background: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      border-color: rgba(179, 136, 72, 0.5);
      background: rgba(255, 255, 255, 0.85);
      transform: translateY(-1.5px);
      box-shadow: 0 4px 12px rgba(43, 35, 56, 0.05);
    }

    &.is-active {
      border-color: #b38848;
      background: rgba(179, 136, 72, 0.08);
      box-shadow: inset 0 0 0 1px rgba(179, 136, 72, 0.35);

      .seal-badge {
        border-color: #b38848;
        background: rgba(179, 136, 72, 0.2);
        color: #b38848;
      }
    }

    .card-top {
      display: flex;
      align-items: center;
      gap: 10px;

      .seal-badge {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid rgba(220, 208, 228, 0.8);
        background: rgba(247, 244, 250, 0.85);
        color: var(--aside-text-color, #2b2338);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mincho), "Songti SC", serif;
        font-weight: 700;
        font-size: 14px;
        flex-shrink: 0;
      }

      .meta-wrap {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .email-row {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;

          .email-text {
            font-size: 13px;
            font-weight: 600;
            color: var(--aside-text-color, #2b2338);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .alias-row {
          .alias-text {
            font-size: 11px;
            color: #8a486b;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .alias-placeholder {
            font-size: 10px;
            color: #a497a5;
            font-style: italic;
          }
        }
      }

      .active-pill {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 7px;
        border-radius: 10px;
        background: rgba(179, 136, 72, 0.16);
        border: 1px solid rgba(179, 136, 72, 0.4);
        color: #b38848;
        font-size: 10px;
        font-weight: 600;
        flex-shrink: 0;
      }
    }

    .card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-top: 6px;
      border-top: 1px solid rgba(220, 208, 228, 0.4);

      .mode-capsule-wrap {
        .mode-badge-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 22px;
          padding: 0 8px;
          border-radius: 11px;
          font-size: 11px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;

          &.is-catchall {
            background: rgba(179, 136, 72, 0.15);
            border-color: rgba(179, 136, 72, 0.35);
            color: #996e30;
          }

          &.is-single {
            background: rgba(138, 72, 107, 0.09);
            border-color: rgba(138, 72, 107, 0.25);
            color: #8a486b;
          }

          &:hover {
            filter: brightness(0.95);
            transform: scale(1.02);
          }
        }
      }

      .actions-wrap {
        display: flex;
        align-items: center;
        gap: 5px;

        .card-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1px solid rgba(220, 208, 228, 0.7);
          background: transparent;
          color: #7d6e7f;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;

          &:hover {
            border-color: #b38848;
            color: #b38848;
            background: rgba(179, 136, 72, 0.1);
          }
        }
      }
    }

    &.admin-card {
      border-style: dashed;
      border-color: rgba(138, 72, 107, 0.35);
      background: rgba(247, 244, 250, 0.4);

      .admin-seal {
        background: rgba(138, 72, 107, 0.12);
        color: #8a486b;
        border-color: rgba(138, 72, 107, 0.3);
      }

      .master-tag {
        font-size: 10px;
        padding: 1px 5px;
        border-radius: 6px;
        background: rgba(138, 72, 107, 0.12);
        color: #8a486b;
      }

      .admin-mode-text {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: #8a486b;
        opacity: 0.85;
      }
    }
  }

  .query-empty {
    padding: 30px 12px;
    text-align: center;
    color: #9c8e9b;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    .empty-star {
      color: #b38848;
      font-size: 14px;
    }
  }

  .hub-colophon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px 0 10px;
    color: #b3a4b6;
    font-size: 11px;

    .colophon-star {
      color: #b38848;
      opacity: 0.6;
    }
  }
}

/* Dialog Stylings */
.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .dialog-btn {
    width: 100%;
    height: 38px;
    border-radius: 8px;
    background: #b38848;
    border-color: #b38848;
    color: #ffffff;
    font-family: var(--font-mincho), "Songti SC", serif;
    font-size: 13px;
    font-weight: 600;

    &:hover {
      background: #a3793c;
      border-color: #a3793c;
    }
  }
}

.domain-selector-trigger {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;

  .domain-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
  }

  .domain-label {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    color: var(--aside-text-color, #2b2338);
  }
}

.hub-turnstile-box {
  margin-top: 10px;

  &.turnstile-hide {
    display: none;
  }
  &.turnstile-show {
    display: block;
  }
}

@keyframes hub-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
