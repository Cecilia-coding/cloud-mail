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
          当邮件中潜伏着营销追踪器（如 Anthropic/Claude、Customer.io、SendGrid）或 1x1 隐形透明像素时，隐私护盾除了就地切断本地探测外，还支持调用 Cloudflare 边缘计算集群，伪装成奇异设备身份（如三星智能冰箱、诺基亚塞班机皇、成人情趣脉冲器、主流 iPhone/MacBook）向对方投掷虚假遥测数据，或者选择「真实本机直出 (无替身)」，彻底掌控你暴露给外部互联网的设备指纹。
        </span>
      </div>

      <div class="egress-dock">
        <div class="egress-copy">
          <span class="fleuron">❖</span>
          <div>
            <div class="egress-title">回馈出口挂载</div>
            <div class="egress-subtitle">拦截、设备人格与网络出口彼此独立；拔掉外接出口不会影响邮箱阅读。</div>
          </div>
        </div>
        <div class="egress-options">
          <button
            v-for="mode in egressOptions"
            :key="mode.key"
            class="egress-option"
            :class="{ active: activeEgressMode === mode.key, unavailable: !mode.available }"
            :disabled="!mode.available"
            @click="selectEgressMode(mode.key)"
          >
            <span class="egress-option-name">{{ mode.name }}</span>
            <span class="egress-option-detail">{{ mode.detail }}</span>
            <span v-if="activeEgressMode === mode.key" class="egress-option-state">已接通</span>
            <span v-else-if="!mode.available" class="egress-option-state">未挂载</span>
          </button>
        </div>
      </div>

      <div class="decoy-tuning-panel">
        <div class="tuning-copy">
          <span class="fleuron">❖</span>
          <div>
            <div class="tuning-title">伪装浓度调音台</div>
            <div class="tuning-subtitle">刻度只参与「自适应伪装」选角；真实型号优先，荒谬感藏在设备状态里。</div>
          </div>
        </div>
        <div class="tuning-axis">
          <span class="axis-label">可信度</span>
          <el-slider v-model="decoyTuning.plausibility" :min="0" :max="100" :show-tooltip="true" />
          <strong>{{ decoyTuning.plausibility }}</strong>
        </div>
        <div class="tuning-axis">
          <span class="axis-label">荒谬度</span>
          <el-slider v-model="decoyTuning.absurdity" :min="0" :max="100" :show-tooltip="true" />
          <strong>{{ decoyTuning.absurdity }}</strong>
        </div>
        <div class="tuning-footer">
          <span>当前近邻：</span>
          <span v-for="p in tuningPreview" :key="p.key" class="tuning-chip">{{ p.emoji }} {{ p.shortName }}</span>
          <button class="adaptive-enable-btn" :class="{ active: selectedPersonaKey === 'adaptive_mix' }" @click="selectPersona('adaptive_mix')">
            {{ selectedPersonaKey === 'adaptive_mix' ? '✦ 自适应选角已启用' : '启用自适应选角' }}
          </button>
        </div>
      </div>

      <!-- ✦ 分邮箱独立花活配属矩阵 ✦ -->
      <div class="account-persona-matrix-box">
        <div class="matrix-top-bar">
          <div class="matrix-title-group">
            <span class="fleuron">❖</span>
            <span class="matrix-title">分邮箱独立花活配属 · 多重人格矩阵</span>
            <span class="matrix-subtitle">为每个邮箱单独指定不同花活（如工作邮箱配 ThinkPad，私人邮箱配 LELO 或绝对静默）</span>
          </div>
          <div class="custom-rule-adder">
            <el-input
              v-model="customRuleInput"
              placeholder="输入邮箱地址定制花活 (如 work@company.com)"
              class="custom-rule-input"
              size="small"
              clearable
              @keyup.enter="handleAddCustomRule"
            >
              <template #append>
                <el-button @click="handleAddCustomRule" size="small">➕ 定制</el-button>
              </template>
            </el-input>
          </div>
        </div>

        <div class="account-rules-grid">
          <div
            v-for="acc in displayedAccountRules"
            :key="acc.email"
            class="account-rule-tile"
            :class="{ 'is-custom-bound': acc.isCustom }"
          >
            <div class="acc-header">
              <div class="acc-email-wrap">
                <span class="acc-email-symbol">✉</span>
                <span class="acc-email-address">{{ acc.email }}</span>
                <span class="acc-name-chip" v-if="acc.name">({{ acc.name }})</span>
              </div>
              <span class="acc-state-badge" :class="acc.isCustom ? 'badge-custom' : 'badge-inherit'">
                {{ acc.isCustom ? '✦ 专属配属' : '跟随全局默认' }}
              </span>
            </div>

            <div class="acc-body">
              <div class="acc-current-persona">
                <span class="acc-emoji">{{ acc.persona.emoji }}</span>
                <div class="acc-ptexts">
                  <span class="acc-pname">{{ acc.persona.name }}</span>
                  <span class="acc-pbadge">{{ acc.persona.badge }}</span>
                </div>
              </div>

              <div class="acc-selector-row">
                <el-select
                  :model-value="acc.isCustom ? acc.personaKey : 'inherit_global'"
                  class="acc-select"
                  size="small"
                  placeholder="选择花活"
                  @change="(val) => handleAccountPersonaChange(acc.email, val)"
                >
                  <el-option label="✦ 跟随全局默认花活" value="inherit_global" />
                  <el-option-group
                    v-for="cat in DECOY_CATEGORIES.filter(c => c.key !== 'all')"
                    :key="cat.key"
                    :label="cat.name"
                  >
                    <el-option
                      v-for="p in DECOY_PERSONAS.filter(item => item.category === cat.key)"
                      :key="p.key"
                      :label="`${p.emoji} ${p.name}`"
                      :value="p.key"
                    />
                  </el-option-group>
                </el-select>

                <button
                  v-if="acc.isCustom"
                  class="acc-clear-btn"
                  title="恢复为跟随全局默认"
                  @click="handleRemoveCustomRule(acc.email)"
                >
                  重置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="global-persona-header">
        <span class="fleuron">✦</span>
        <span>全局默认备用花活 (Global Fallback Persona · 未单独配属的邮箱统一生效)</span>
      </div>

      <!-- Category Filter Tabs -->
      <div class="category-tabs-bar">
        <button
          v-for="cat in DECOY_CATEGORIES"
          :key="cat.key"
          class="cat-tab-btn"
          :class="{ 'is-active': activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          <Icon :icon="cat.icon" width="13" height="13" />
          <span>{{ cat.name }}</span>
          <span class="cat-count">{{ getCategoryCount(cat.key) }}</span>
        </button>
      </div>

      <!-- Personas Grid -->
      <div class="personas-grid">
        <div
          v-for="p in filteredPersonas"
          :key="p.key"
          class="persona-tile"
          :class="{ 'is-selected': selectedPersonaKey === p.key, 'is-native-tile': p.key === 'native_real', 'is-silent-tile': p.key === 'silent_block' }"
          @click="selectPersona(p.key)"
        >
          <div class="tile-top">
            <div class="tile-title-group">
              <span class="tile-emoji">{{ p.emoji }}</span>
              <span class="tile-name">{{ p.name }}</span>
            </div>
            <div class="tile-seal">
              <span v-if="selectedPersonaKey === p.key" class="seal-active" :class="{ 'seal-silent': p.key === 'silent_block' }">
                {{ p.key === 'silent_block' ? '✦ 绝对静默' : (p.key === 'native_real' ? '✦ 原生直出' : '✦ 已启用') }}
              </span>
              <span v-else class="seal-inactive">{{ p.key === 'silent_block' ? '开启静默' : (p.key === 'native_real' ? '不使用替身' : '选择') }}</span>
            </div>
          </div>

          <div class="tile-badge-row">
            <span class="tile-badge" :class="{ 'native-badge': p.key === 'native_real', 'silent-badge': p.key === 'silent_block' }">{{ p.badge }}</span>
            <span class="tile-res">{{ p.resolution }}</span>
          </div>

          <div class="tile-specs">
            <Icon icon="solar:screencast-linear" width="13" height="13" />
            <span>{{ p.specs }}</span>
          </div>

          <div class="tile-specs chip-specs" v-if="p.chip">
            <Icon icon="solar:cpu-linear" width="13" height="13" />
            <span>{{ p.chip }}</span>
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
            <span>{{ fireLoading ? '出口调度处理中...' : (activeEgressMode === 'off' ? '仅拦截 · 不产生回访流量' : (activePersona.key === 'silent_block' ? '以 [绝对静默模式] 拦截出站请求' : (activePersona.key === 'native_real' ? '以 [本机真实原生] 身份发射探针' : `以 [${activePersona.shortName}] 身份发射诱饵`))) }}</span>
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
            <span class="terminal-title">✦ 诱饵发送响应回报 · {{ lastProbeResult.egressLabel || 'Cloudflare Edge' }}</span>
            <span class="terminal-status">HTTP {{ lastProbeResult.statusCode }} {{ lastProbeResult.statusText }}</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-row">
              <span class="term-lbl">目标端点:</span>
              <span class="term-val">{{ lastProbeResult.targetUrl }}</span>
            </div>
            <div class="terminal-row">
              <span class="term-lbl">{{ lastProbeResult.personaKey === 'native_real' ? '设备特征:' : '伪装身份:' }}</span>
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
              <span class="term-lbl">安全说明:</span>
              <span class="term-val" :class="lastProbeResult.isSilent ? 'purple' : (lastProbeResult.personaKey === 'native_real' ? 'blue' : 'green')">
                {{ lastProbeResult.isSilent
                  ? (lastProbeResult.message || '出口已关闭：未向目标发出任何探测流量。')
                  : (lastProbeResult.personaKey === 'native_real'
                    ? '真实原生透传模式：未启用任何虚拟替身，目标端点已捕获你当前真实使用的浏览器 User-Agent！'
                    : '真实客户端 IP 0 泄露，发件人后台已记录所选奇异设备开信指纹！') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="decoy-archive-box">
        <div class="archive-header">
          <div>
            <span class="fleuron">❖</span>
            <span class="archive-title">替身档案室 · 最近战绩</span>
            <span class="archive-subtitle">发射后抹除完整追踪 URL，只留下目标域名、短指纹与结果；保留 90 天。</span>
          </div>
          <button class="archive-refresh-btn" :disabled="archiveLoading" @click="loadProbeArchive">{{ archiveLoading ? '读取中…' : '刷新档案' }}</button>
        </div>
        <div v-if="probeArchive.length" class="archive-list">
          <div v-for="entry in probeArchive" :key="entry.probeId" class="archive-row">
            <span class="archive-status" :class="`status-${entry.status}`">{{ archiveStatusLabel(entry.status) }}</span>
            <span class="archive-host">{{ entry.targetHost }}</span>
            <code>#{{ entry.fingerprint }}</code>
            <span class="archive-persona">{{ entry.personaName || personaNameFor(entry.requestedPersonaKey) }}</span>
            <span class="archive-egress">{{ entry.egressLabel || egressNameFor(entry.egressMode) }}</span>
            <span class="archive-time">{{ formatArchiveTime(entry.firedAt || entry.scheduledFor) }}</span>
            <button v-if="entry.status === 'scheduled'" class="archive-cancel-btn" @click="cancelScheduledProbe(entry)">取消</button>
          </div>
        </div>
        <div v-else class="archive-empty">尚无替身出勤记录。</div>
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
import {reactive, ref, computed, onMounted, defineOptions, watch} from 'vue'
import {resetPassword, userDelete} from "@/request/my.js";
import {useUserStore} from "@/store/user.js";
import router from "@/router/index.js";
import {accountSetName, accountList} from "@/request/account.js";
import {useAccountStore} from "@/store/account.js";
import {useI18n} from "vue-i18n";
import {useSettingStore} from "@/store/setting.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {Icon} from "@iconify/vue";
import {
  DECOY_PERSONAS,
  DECOY_CATEGORIES,
  getActivePersonaKey,
  setActivePersonaKey,
  getActivePersona,
  getAccountPersonaMap,
  setAccountPersona,
  removeAccountPersona,
  getDecoyTuning,
  setDecoyTuning
} from "@/utils/decoy-personas.js";
import {fireDecoyProbe, getDecoyArchive, cancelDecoyProbe, getEgressStatus} from "@/request/privacy.js";
import {
  EGRESS_MODES,
  getActiveEgressMode,
  setActiveEgressMode
} from "@/utils/egress-mode.js";

const { t } = useI18n()
const accountStore = useAccountStore()
const settingStore = useSettingStore()
const userStore = useUserStore();
const setPwdLoading = ref(false)
const setNameShow = ref(false)
const accountName = ref(null)
const langSelect = ref(settingStore.lang)

const activeEgressMode = ref(getActiveEgressMode())
const remoteEgressModes = ref([])
const egressOptions = computed(() => EGRESS_MODES.map(mode => {
  const remote = remoteEgressModes.value.find(item => item.key === mode.key)
  return {
    ...mode,
    available: remote?.available ?? mode.key !== 'webshare',
    detail: remote?.detail || mode.subtitle
  }
}))

async function loadEgressStatus() {
  try {
    const response = await getEgressStatus()
    remoteEgressModes.value = response?.modes || response?.data?.modes || []
    const active = egressOptions.value.find(mode => mode.key === activeEgressMode.value)
    if (active && !active.available) {
      activeEgressMode.value = 'cloudflare'
      setActiveEgressMode('cloudflare')
    }
  } catch (error) {
    remoteEgressModes.value = []
  }
}

function selectEgressMode(mode) {
  const option = egressOptions.value.find(item => item.key === mode)
  if (!option?.available) return
  activeEgressMode.value = mode
  setActiveEgressMode(mode)
  ElMessage.success({
    message: mode === 'off'
      ? '✦ 回馈出口已拔除：继续拦截，停止制造任何外发流量。'
      : `✦ 回馈出口已切换为「${option.name}」。`,
    plain: true
  })
}

// 🎭 Decoy Personas Matrix State
const selectedPersonaKey = ref(getActivePersonaKey())
const decoyTuning = reactive(getDecoyTuning())
const probeArchive = ref([])
const archiveLoading = ref(false)
const activePersona = computed(() => {
  return DECOY_PERSONAS.find(p => p.key === selectedPersonaKey.value) || DECOY_PERSONAS[0];
})

watch(decoyTuning, value => setDecoyTuning(value), { deep: true })

const tuningPreview = computed(() => {
  const excluded = new Set(['silent_block', 'native_real', 'adaptive_mix', 'quantum_random'])
  return DECOY_PERSONAS
    .filter(persona => !excluded.has(persona.key))
    .map(persona => ({
      ...persona,
      distance: Math.abs(persona.plausibility - decoyTuning.plausibility)
        + Math.abs(persona.absurdity - decoyTuning.absurdity)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
})

// 📬 Per-Account Persona Matrix State
const userAccounts = ref([]);
const accountPersonaMap = ref(getAccountPersonaMap());
const customRuleInput = ref('');

async function loadUserAccounts() {
  try {
    const res = await accountList(0, 100);
    const list = Array.isArray(res) ? res : (res?.data || []);
    if (list && list.length) {
      userAccounts.value = list;
    } else if (accountStore.currentAccount?.email) {
      userAccounts.value = [accountStore.currentAccount];
    }
  } catch (e) {
    if (accountStore.currentAccount?.email) {
      userAccounts.value = [accountStore.currentAccount];
    }
  }
}

const displayedAccountRules = computed(() => {
  const map = accountPersonaMap.value;
  const list = [];
  const seenEmails = new Set();

  // 1. All real accounts from userAccounts
  userAccounts.value.forEach(acc => {
    if (acc?.email) {
      const email = acc.email.toLowerCase().trim();
      seenEmails.add(email);
      const isCustom = !!map[email];
      const personaKey = map[email] || selectedPersonaKey.value;
      const persona = DECOY_PERSONAS.find(p => p.key === personaKey) || DECOY_PERSONAS[0];
      list.push({
        email: acc.email,
        name: acc.name || '',
        isCustom,
        personaKey,
        persona
      });
    }
  });

  // 2. Custom rules added by user for aliases or extra mailboxes
  Object.keys(map).forEach(email => {
    if (!seenEmails.has(email)) {
      seenEmails.add(email);
      const personaKey = map[email];
      const persona = DECOY_PERSONAS.find(p => p.key === personaKey) || DECOY_PERSONAS[0];
      list.push({
        email,
        name: '自定义规则',
        isCustom: true,
        personaKey,
        persona
      });
    }
  });

  return list;
});

function handleAccountPersonaChange(email, newPersonaKey) {
  if (!email) return;
  setAccountPersona(email, newPersonaKey);
  accountPersonaMap.value = { ...getAccountPersonaMap() };
  const p = DECOY_PERSONAS.find(item => item.key === newPersonaKey);
  if (newPersonaKey === 'inherit_global' || !newPersonaKey) {
    ElMessage.success({
      message: `✦ 邮箱 [${email}] 已恢复为「跟随全局默认花活」`,
      plain: true
    });
  } else {
    ElMessage.success({
      message: `✦ 邮箱 [${email}] 已绑定专属花活「${p ? p.name : newPersonaKey}」！`,
      plain: true
    });
  }
}

function handleAddCustomRule() {
  const email = customRuleInput.value.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    ElMessage.warning({ message: '请输入有效的邮箱地址 (例如: alias@domain.com)', plain: true });
    return;
  }
  handleAccountPersonaChange(email, 'smart_fridge');
  customRuleInput.value = '';
}

function handleRemoveCustomRule(email) {
  removeAccountPersona(email);
  accountPersonaMap.value = { ...getAccountPersonaMap() };
  ElMessage.success({ message: `✦ 已移除邮箱 [${email}] 的独立花活规则，已恢复跟随全局`, plain: true });
}

onMounted(() => {
  loadUserAccounts();
  loadProbeArchive();
  loadEgressStatus();
});

async function loadProbeArchive() {
  archiveLoading.value = true
  try {
    const response = await getDecoyArchive(40)
    probeArchive.value = Array.isArray(response) ? response : (response?.data || [])
  } catch (error) {
    probeArchive.value = []
  } finally {
    archiveLoading.value = false
  }
}

async function cancelScheduledProbe(entry) {
  try {
    await cancelDecoyProbe(entry.probeId)
    await loadProbeArchive()
    ElMessage.success({ message: '✦ 这只潜伏中的替身已撤回。', plain: true })
  } catch (error) {
    ElMessage.error({ message: error?.message || '撤回失败', plain: true })
  }
}

function personaNameFor(key) {
  return DECOY_PERSONAS.find(persona => persona.key === key)?.shortName || key
}

function egressNameFor(key) {
  return EGRESS_MODES.find(mode => mode.key === key)?.name || key || 'Cloudflare 边缘'
}

function archiveStatusLabel(status) {
  return ({ scheduled: '潜伏中', sending: '发射中', sent: '已命中', blocked: '静默', failed: '失手', cancelled: '已撤回' })[status] || status
}

function formatArchiveTime(timestamp) {
  if (!timestamp) return '—'
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }).format(new Date(timestamp))
}

const activeCategory = ref('all')
const filteredPersonas = computed(() => {
  if (activeCategory.value === 'all') return DECOY_PERSONAS;
  return DECOY_PERSONAS.filter(p => p.category === activeCategory.value);
})

function getCategoryCount(catKey) {
  if (catKey === 'all') return DECOY_PERSONAS.length;
  return DECOY_PERSONAS.filter(p => p.category === catKey).length;
}

const defaultWebhookUrl = 'https://webhook.site/fb5e79e2-651d-4e6f-aa3d-2fc5ffe4378d'
const defaultWebhookDashboard = 'https://webhook.site/#!/view/fb5e79e2-651d-4e6f-aa3d-2fc5ffe4378d'
const testTargetUrl = ref(defaultWebhookUrl)
const fireLoading = ref(false)
const lastProbeResult = ref(null)

function selectPersona(key) {
  selectedPersonaKey.value = key
  setActivePersonaKey(key)
  const p = DECOY_PERSONAS.find(item => item.key === key)
  let msg = `✦ 已切换全局伪装身份为「${p.name}」`
  if (key === 'silent_block') {
    msg = '✦ 已切换为「🛡️ 绝对静默模式」：彻底封禁出站探针，0 IP 暴露，绝对安全'
  } else if (key === 'native_real') {
    msg = '✦ 已切换为「⚡ 真实本机直出」：原汁原味透传本机真实浏览器指纹'
  }
  ElMessage.success({
    message: msg,
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
    const probeResult = await fireDecoyProbe(testTargetUrl.value.trim(), selectedPersonaKey.value, {
      tuning: decoyTuning,
      egressMode: activeEgressMode.value
    })
    if (probeResult) {
      lastProbeResult.value = probeResult
      if (probeResult.isSilent) {
        ElMessage.info({
          message: `✦ ${probeResult.message || '绝对静默拦截生效：外发请求已被阻断。'}`,
          plain: true
        })
      } else {
        ElMessage.success({
          message: `✦ 探针已由 ${probeResult.egressLabel || 'Cloudflare Edge'} 发射！目标服务器已捕获「${probeResult.personaName}」身份`,
          plain: true
        })
      }
      await loadProbeArchive()
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

    /* 分邮箱花活配属矩阵 */
    .account-persona-matrix-box {
      background: #faf8fc;
      border: 1px solid var(--el-border-color, #dcd0e4);
      border-radius: 10px;
      padding: 16px 18px;
      margin-bottom: 24px;
      box-shadow: 0 2px 10px rgba(43, 35, 56, 0.02);

      .matrix-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 14px;
        padding-bottom: 12px;
        border-bottom: 1px dashed var(--el-border-color-lighter, #ece4f2);

        .matrix-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;

          .fleuron {
            color: #b38848;
          }

          .matrix-title {
            font-family: var(--font-mincho), serif;
            font-weight: 700;
            font-size: 14px;
            color: var(--el-text-color-primary, #2b2338);
            letter-spacing: 0.05em;
          }

          .matrix-subtitle {
            font-size: 11.5px;
            color: #9589a3;
          }
        }

        .custom-rule-adder {
          .custom-rule-input {
            width: 320px;
          }
        }
      }

      .account-rules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 12px;

        .account-rule-tile {
          background: #ffffff;
          border: 1px solid var(--el-border-color-lighter, #ece4f2);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

          &.is-custom-bound {
            border-color: #8a486b;
            background: linear-gradient(180deg, rgba(138, 72, 107, 0.03) 0%, #ffffff 100%);
            box-shadow: 0 2px 10px rgba(138, 72, 107, 0.08);
          }

          .acc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;

            .acc-email-wrap {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              overflow: hidden;

              .acc-email-symbol {
                color: #8a486b;
                font-size: 13px;
              }

              .acc-email-address {
                font-family: monospace;
                font-weight: 600;
                color: var(--el-text-color-primary, #2b2338);
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }

              .acc-name-chip {
                font-size: 11px;
                color: #9589a3;
              }
            }

            .acc-state-badge {
              font-size: 10.5px;
              padding: 1px 7px;
              border-radius: 10px;
              flex-shrink: 0;

              &.badge-custom {
                background: rgba(138, 72, 107, 0.12);
                color: #8a486b;
                font-weight: 600;
              }

              &.badge-inherit {
                background: rgba(43, 35, 56, 0.06);
                color: #9589a3;
              }
            }
          }

          .acc-body {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .acc-current-persona {
              display: flex;
              align-items: center;
              gap: 8px;
              background: #faf8fc;
              padding: 6px 10px;
              border-radius: 6px;
              border: 1px solid var(--el-border-color-lighter, #ece4f2);

              .acc-emoji {
                font-size: 16px;
              }

              .acc-ptexts {
                display: flex;
                flex-direction: column;
                overflow: hidden;

                .acc-pname {
                  font-size: 12px;
                  font-weight: 600;
                  color: #2b2338;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .acc-pbadge {
                  font-size: 10.5px;
                  color: #946927;
                  font-family: monospace;
                }
              }
            }

            .acc-selector-row {
              display: flex;
              gap: 6px;
              align-items: center;

              .acc-select {
                flex: 1;
              }

              .acc-clear-btn {
                background: none;
                border: 1px solid #dcd0e4;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 11px;
                color: #8a486b;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.2s;

                &:hover {
                  background: rgba(138, 72, 107, 0.08);
                  border-color: #8a486b;
                }
              }
            }
          }
        }
      }
    }

    .global-persona-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-mincho), serif;
      font-size: 13.5px;
      font-weight: 700;
      color: var(--el-text-color-primary, #2b2338);
      margin-bottom: 12px;
      letter-spacing: 0.04em;

      .fleuron {
        color: #b38848;
      }
    }

    /* Category Filter Tabs Bar */
    .category-tabs-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      overflow-x: auto;
      padding-bottom: 4px;
      flex-wrap: wrap;

      .cat-tab-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid var(--el-border-color, #dcd0e4);
        background: #ffffff;
        color: var(--el-text-color-regular, #635773);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: var(--font-mincho), serif;

        .cat-count {
          font-size: 10.5px;
          background: rgba(43, 35, 56, 0.06);
          color: #9589a3;
          padding: 1px 6px;
          border-radius: 10px;
          font-family: monospace;
        }

        &:hover {
          border-color: #8a486b;
          color: #8a486b;
        }

        &.is-active {
          background: #8a486b;
          color: #ffffff;
          border-color: #8a486b;
          box-shadow: 0 2px 8px rgba(138, 72, 107, 0.25);

          .cat-count {
            background: rgba(255, 255, 255, 0.25);
            color: #ffffff;
          }
        }
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

        &.is-native-tile {
          border-style: dashed;
          border-color: #baa4c9;
          background: #faf8fc;

          &.is-selected {
            border-style: solid;
            border-color: #2e7559;
            background: linear-gradient(180deg, rgba(46, 117, 89, 0.05) 0%, #ffffff 100%);
            box-shadow: 0 4px 16px rgba(46, 117, 89, 0.14), inset 0 0 0 1px #2e7559;

            .tile-seal .seal-active {
              background: #2e7559;
              border-color: #2e7559;
            }
          }
        }

        &.is-silent-tile {
          border-color: #baa4c9;
          background: #fbf9fd;

          &.is-selected {
            border-style: solid;
            border-color: #53396e;
            background: linear-gradient(180deg, rgba(83, 57, 110, 0.08) 0%, #ffffff 100%);
            box-shadow: 0 4px 16px rgba(83, 57, 110, 0.18), inset 0 0 0 1px #53396e;

            .tile-seal .seal-active {
              background: #53396e;
              border-color: #53396e;
            }
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

            &.native-badge {
              background: rgba(46, 117, 89, 0.12);
              color: #2e7559;
              font-weight: 600;
            }

            &.silent-badge {
              background: rgba(83, 57, 110, 0.12);
              color: #53396e;
              font-weight: 600;
            }
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

          &.chip-specs {
            color: #946927;
            font-size: 11px;
            font-family: monospace;
          }
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

              &.blue {
                color: #79c0ff;
              }

              &.purple {
                color: #d2a8ff;
                font-weight: 600;
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

  .egress-dock,
  .decoy-tuning-panel,
  .decoy-archive-box {
    margin: 14px 0;
    padding: 14px 16px;
    border: 1px solid rgba(138, 72, 107, 0.22);
    border-radius: 9px;
    background: linear-gradient(135deg, rgba(138, 72, 107, 0.055), rgba(179, 136, 72, 0.045));
  }

  .egress-dock {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    .egress-copy {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      min-width: 230px;
    }

    .fleuron {
      color: #b38848;
    }

    .egress-title {
      font-family: var(--font-mincho), serif;
      font-weight: 700;
      color: var(--el-text-color-primary);
    }

    .egress-subtitle {
      margin-top: 3px;
      max-width: 420px;
      color: var(--regular-text-color);
      font-size: 11px;
      line-height: 1.5;
    }

    .egress-options {
      display: grid;
      grid-template-columns: repeat(3, minmax(128px, 1fr));
      gap: 8px;
      flex: 1;
      max-width: 610px;
    }

    .egress-option {
      position: relative;
      min-height: 62px;
      padding: 9px 11px;
      border: 1px solid rgba(138, 72, 107, 0.22);
      border-radius: 7px;
      color: #53475e;
      background: rgba(255, 255, 255, 0.52);
      text-align: left;
      cursor: pointer;
      transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        border-color: rgba(138, 72, 107, 0.55);
      }

      &.active {
        border-color: #8a486b;
        box-shadow: inset 0 0 0 1px rgba(138, 72, 107, 0.18), 0 4px 12px rgba(138, 72, 107, 0.1);
        background: linear-gradient(135deg, rgba(138, 72, 107, 0.1), rgba(179, 136, 72, 0.07));
      }

      &.unavailable {
        opacity: 0.52;
        cursor: not-allowed;
      }
    }

    .egress-option-name,
    .egress-option-detail {
      display: block;
    }

    .egress-option-name {
      font-size: 12px;
      font-weight: 700;
    }

    .egress-option-detail {
      margin-top: 4px;
      padding-right: 38px;
      color: var(--regular-text-color);
      font-size: 10px;
      line-height: 1.35;
    }

    .egress-option-state {
      position: absolute;
      top: 8px;
      right: 8px;
      color: #8a486b;
      font-size: 9px;
      letter-spacing: 0.05em;
    }

    @media (max-width: 980px) {
      flex-direction: column;
      align-items: stretch;

      .egress-options {
        max-width: none;
      }
    }

    @media (max-width: 620px) {
      .egress-options {
        grid-template-columns: 1fr;
      }
    }
  }

  .decoy-tuning-panel {
    .tuning-copy {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }

    .tuning-title,
    .archive-title {
      font-family: var(--font-mincho), serif;
      font-weight: 700;
      color: var(--el-text-color-primary);
    }

    .tuning-subtitle,
    .archive-subtitle {
      margin-top: 3px;
      font-size: 11px;
      color: var(--regular-text-color);
    }

    .tuning-axis {
      display: grid;
      grid-template-columns: 62px minmax(160px, 1fr) 32px;
      align-items: center;
      gap: 10px;
      font-size: 12px;

      .axis-label {
        font-weight: 600;
      }

      strong {
        color: #8a486b;
        text-align: right;
      }
    }

    .tuning-footer {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
      font-size: 11px;
    }

    .tuning-chip {
      padding: 3px 7px;
      border: 1px solid rgba(179, 136, 72, 0.3);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.42);
    }

    .adaptive-enable-btn {
      margin-left: auto;
      border: 1px solid #8a486b;
      border-radius: 5px;
      padding: 5px 10px;
      color: #8a486b;
      background: transparent;
      cursor: pointer;

      &.active {
        color: white;
        background: #8a486b;
      }
    }
  }

  .decoy-archive-box {
    .archive-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
    }

    .archive-title {
      margin-left: 5px;
      font-family: var(--font-mincho), serif;
      font-weight: 700;
    }

    .archive-subtitle {
      display: block;
      margin: 4px 0 0 20px;
      font-size: 11px;
      color: var(--regular-text-color);
    }

    .archive-refresh-btn,
    .archive-cancel-btn {
      border: 1px solid rgba(138, 72, 107, 0.38);
      border-radius: 5px;
      padding: 4px 9px;
      color: #8a486b;
      background: transparent;
      cursor: pointer;
    }

    .archive-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .archive-row {
      display: grid;
      grid-template-columns: 58px minmax(110px, 1fr) 100px minmax(150px, 1.4fr) minmax(110px, 0.9fr) 95px auto;
      align-items: center;
      gap: 8px;
      padding: 7px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.36);
      font-size: 11px;

      code {
        color: #7b6b87;
      }
    }

    .archive-status {
      text-align: center;
      padding: 2px 5px;
      border-radius: 999px;
      background: rgba(122, 122, 122, 0.12);

      &.status-scheduled { color: #9a6b20; background: rgba(179, 136, 72, 0.14); }
      &.status-sent { color: #24775e; background: rgba(62, 207, 142, 0.13); }
      &.status-failed { color: #a63c4c; background: rgba(184, 74, 91, 0.13); }
    }

    .archive-host,
    .archive-persona,
    .archive-egress {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .archive-empty {
      padding: 12px;
      text-align: center;
      color: var(--regular-text-color);
      font-size: 12px;
    }

    @media (max-width: 900px) {
      .archive-row {
        grid-template-columns: 58px 1fr 90px;

        code,
        .archive-persona,
        .archive-egress {
          display: none;
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
