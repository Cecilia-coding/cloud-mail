<template>
  <el-scrollbar class="scroll">
    <div>
      <div class="aside-brand">
        <div class="brand-crest">❖</div>
        <div class="brand-title">{{settingStore.settings.title || '雲端密匣'}}</div>
        <div class="brand-sub">The Codex Archive</div>
      </div>
      <el-menu :collapse="false" text-color="var(--aside-text-color, var(--el-text-color-primary))" active-text-color="var(--el-color-primary)" style="margin-top: 10px">
        <el-menu-item @click="router.push({name: 'email'})" index="email"
                      :class="route.meta.name === 'email' ? 'choose-item' : ''">
          <Icon icon="hugeicons:mailbox-01" width="20" height="20" />
          <span class="menu-name" style="margin-left: 16px">{{$t('inbox')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'send'})" index="send" v-perm="'email:send'"
                      :class="route.meta.name === 'send' ? 'choose-item' : ''">
          <Icon icon="cil:send" width="20" height="20" />
          <span class="menu-name" style="margin-left: 16px">{{$t('sent')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'draft'})" index="draft" v-perm="'email:send'"
                      :class="route.meta.name === 'draft' ? 'choose-item' : ''">
          <Icon icon="ep:document" width="19" height="19" />
          <span class="menu-name" style="margin-left: 17px">{{$t('drafts')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'star'})" index="star"
                      :class="route.meta.name === 'star' ? 'choose-item' : ''">
          <Icon icon="solar:star-line-duotone" width="20" height="20" />
          <span class="menu-name" style="margin-left: 16px">{{$t('starred')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'setting'})" index="setting"
                      :class="route.meta.name === 'setting' ? 'choose-item' : ''">
          <Icon icon="fluent:settings-48-regular" width="20" height="20" />
          <span class="menu-name" style="margin-left: 16px">{{$t('settings')}}</span>
        </el-menu-item>
        <div class="manage-title" v-perm="['all-email:query','user:query','role:query','setting:query','analysis:query','reg-key:query']">
          <div>✦ {{$t('manage')}} ✦</div>
        </div>
        <el-menu-item @click="router.push({name: 'analysis'})" index="analysis" v-perm="'analysis:query'"
                      :class="route.meta.name === 'analysis' ? 'choose-item' : ''">
          <Icon icon="fluent:data-pie-20-regular" width="24" height="24" />
          <span class="menu-name" style="margin-left: 13px">{{$t('analytics')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'user'})" index="setting" v-perm="'user:query'"
                      :class="route.meta.name === 'user' ? 'choose-item' : ''">
          <Icon icon="si:user-alt-2-line" width="20" height="20" />
          <span class="menu-name" style="margin-left: 16px">{{$t('allUsers')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'all-email'})" index="all-email" v-perm="'all-email:query'"
                      :class="route.meta.name === 'all-email' ? 'choose-item' : ''">
          <Icon icon="fluent:mail-list-28-regular" width="22" height="22" />
          <span class="menu-name" style="margin-left: 15px">{{$t('allMail')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'role'})" index="setting" v-perm="'role:query'"
                      :class="route.meta.name === 'role' ? 'choose-item' : ''">
          <Icon icon="fluent:lock-closed-16-regular" width="22" height="22" />
          <span class="menu-name" style="margin-left: 15px">{{$t('permissions')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'reg-key'})" index="reg-key" v-perm="'reg-key:query'"
                      :class="route.meta.name === 'reg-key' ? 'choose-item' : ''">
          <Icon icon="fluent:fingerprint-20-filled" width="22" height="22" />
          <span class="menu-name" style="margin-left: 15px">{{$t('inviteCode')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'sys-setting'})" index="sys-setting" v-perm="'setting:query'"
                      :class="route.meta.name === 'sys-setting' ? 'choose-item' : ''">
          <Icon icon="eos-icons:system-ok-outlined" width="18" height="18" style="margin-left: 2px" />
          <span class="menu-name" style="margin-left: 17px">{{$t('SystemSettings')}}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-scrollbar>
</template>

<script setup>
import router from "@/router/index.js";
import { useRoute } from "vue-router";
import {Icon} from "@iconify/vue";
import {useSettingStore} from "@/store/setting.js";

const settingStore = useSettingStore();
const route = useRoute();

</script>

<style lang="scss" scoped>

.aside-brand {
  margin: 16px 14px 12px;
  padding: 14px 12px 12px;
  border-radius: 8px;
  text-align: center;
  background: var(--aside-brand-bg, rgba(138, 72, 107, 0.05));
  border: 1px solid var(--el-border-color);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6), 0 2px 6px rgba(43, 35, 56, 0.02);
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &::before, &::after {
    content: "✦";
    position: absolute;
    top: 6px;
    font-size: 8px;
    color: var(--el-color-primary);
    opacity: 0.45;
  }
  &::before { left: 8px; }
  &::after { right: 8px; }

  &:hover {
    border-color: rgba(179, 136, 72, 0.45);
    box-shadow: 0 4px 12px rgba(138, 72, 107, 0.08);
  }

  .brand-crest {
    font-size: 13px;
    color: var(--el-color-primary);
    margin-bottom: 2px;
  }

  .brand-title {
    font-family: var(--font-mincho);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .brand-sub {
    font-family: var(--font-serif-italic);
    font-style: italic;
    font-size: 11px;
    color: var(--el-text-color-secondary);
    letter-spacing: 0.06em;
    margin-top: 2px;
  }
}

.manage-title {
  margin-top: 14px;
  margin-bottom: 4px;
  padding-left: 20px;
  font-family: var(--font-mincho);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--el-text-color-secondary);
}

.el-menu-item {
  margin: 3px 10px !important;
  border-radius: 6px;
  height: 36px;
  padding: 10px !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: var(--font-mincho);
  letter-spacing: 0.04em;
}

.choose-item {
  font-weight: 600;
  background: var(--aside-menu-active-background) !important;
  color: var(--el-color-primary) !important;
  border-left: 3px solid var(--el-color-primary) !important;
  box-shadow: inset 0 0 12px rgba(138, 72, 107, 0.04);
}

@media (hover: hover) {
  .el-menu-item:hover {
    background: var(--aside-menu-active-background) !important;
    color: var(--el-color-primary) !important;
  }
}

.menu-name {
  user-select: none;
}

:deep(.el-scrollbar__wrap--hidden-default ) {
  background: var(--aside-backgound) !important;
}

:deep(.el-menu-item) {
  background: var(--aside-backgound);
  color: var(--aside-text-color, var(--el-text-color-primary));
}

:deep(.el-menu) {
  background: var(--aside-backgound);
}

.el-menu {
  border-right: 0;
  width: 260px;
}

:deep(.el-divider__text) {
  background: var(--aside-backgound);
  color: var(--el-text-color-primary);
}

.scroll {

}
</style>
