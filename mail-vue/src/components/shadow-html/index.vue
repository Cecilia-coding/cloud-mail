<template>
  <div class="content-box" ref="contentBox">
    <div ref="container" class="content-html"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUiStore } from '@/store/ui.js'

const props = defineProps({
  html: {
    type: String,
    required: true
  }
})

const uiStore = useUiStore()
const container = ref(null)
const contentBox = ref(null)
let shadowRoot = null

function updateContent() {
  if (!shadowRoot) return;

  // 1. 提取 <body> 的 style 属性（如果存在）
  const bodyStyleRegex = /<body[^>]*style="([^"]*)"[^>]*>/i;
  const bodyStyleMatch = props.html.match(bodyStyleRegex);
  const bodyStyle = bodyStyleMatch ? bodyStyleMatch[1] : '';

  // 2. 移除 <body> 标签（保留内容）
  const cleanedHtml = props.html.replace(/<\/?body[^>]*>/gi, '');

  const isDark = uiStore.dark;
  const defaultBg = uiStore.currentTheme === 'obsidian' ? '#16181f' : (uiStore.currentTheme === 'celadon' ? '#f3f6f4' : '#ffffff');
  const defaultColor = uiStore.currentTheme === 'obsidian' ? '#e4e7ed' : (uiStore.currentTheme === 'celadon' ? '#182721' : '#2b2338');
  const primaryColor = uiStore.currentTheme === 'obsidian' ? '#3ecf8e' : (uiStore.currentTheme === 'celadon' ? '#2e7c65' : '#8a486b');

  // 3. 将 body 的 style 应用到 .shadow-content 并注入主题适配样式
  shadowRoot.innerHTML = `
    <style>
      :host {
        all: initial;
        width: 100%;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC",
                    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        font-size: 14.5px;
        line-height: 1.65;
        color: ${defaultColor};
        word-break: break-word;
      }

      h1, h2, h3, h4 {
        font-size: 18px;
        font-weight: 700;
        margin-top: 1em;
        margin-bottom: 0.5em;
        color: ${defaultColor};
      }

      p {
        margin: 0.5em 0;
      }

      a {
        text-decoration: underline;
        color: ${primaryColor};
        transition: opacity 0.2s ease;
      }

      a:hover {
        opacity: 0.8;
      }

      .shadow-content {
        background: ${bodyStyle ? '' : defaultBg};
        color: ${defaultColor};
        width: fit-content;
        height: fit-content;
        min-width: 100%;
        border-radius: 6px;
        ${bodyStyle ? bodyStyle : ''}
      }

      img:not(table img) {
        max-width: 100%;
        height: auto !important;
        border-radius: 4px;
      }

      blockquote {
        border-left: 3px solid ${primaryColor};
        margin: 0.5em 0;
        padding-left: 12px;
        opacity: 0.85;
      }

      pre, code {
        font-family: "JetBrains Mono", Consolas, Monaco, monospace;
        font-size: 13px;
        border-radius: 4px;
        background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
        padding: 2px 4px;
      }

    </style>
    <div class="shadow-content">
      ${cleanedHtml}
    </div>
  `;
}

function autoScale() {
  if (!shadowRoot || !contentBox.value) return

  const parent = contentBox.value
  const shadowContent = shadowRoot.querySelector('.shadow-content')

  if (!shadowContent) return

  const parentWidth = parent.offsetWidth
  const childWidth = shadowContent.scrollWidth

  if (childWidth === 0) return

  const scale = parentWidth / childWidth

  const hostElement = shadowRoot.host
  hostElement.style.zoom = scale
}

onMounted(() => {
  shadowRoot = container.value.attachShadow({ mode: 'open' })
  updateContent()
  autoScale()
})

watch(() => props.html, () => {
  updateContent()
  autoScale()
})

watch(() => uiStore.currentTheme, () => {
  updateContent()
})
</script>

<style scoped>
.content-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Inter, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.content-html {
  width: 100%;
  height: 100%;
}
</style>
