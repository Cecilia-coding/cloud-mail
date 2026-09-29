import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => ({
        asideShow: window.innerWidth > 1024,
        accountShow: false,
        backgroundLoading: true,
        changeNotice: 0,
        writerRef: null,
        changePreview: 0,
        previewData: {},
        key: 0,
        dark: false,
        currentTheme: 'codex',
        asideCount: {
            email: 0,
            send: 0,
            sysEmail: 0
        }
    }),
    actions: {
        showNotice() {
            this.changeNotice ++
        },
        previewNotice(data) {
            this.previewData = data
            this.changePreview ++
        },
        setTheme(themeName) {
            this.currentTheme = themeName
            const root = document.documentElement
            root.setAttribute('data-theme', themeName)
            const isDark = themeName === 'obsidian'
            this.dark = isDark
            root.setAttribute('class', isDark ? 'dark' : '')
            
            const metaTag = document.getElementById('theme-color-meta')
            if (metaTag) {
                if (themeName === 'obsidian') {
                    metaTag.setAttribute('content', '#121316')
                } else if (themeName === 'celadon') {
                    metaTag.setAttribute('content', '#f3f6f4')
                } else {
                    metaTag.setAttribute('content', '#faf7f2')
                }
            }
        }
    },
    persist: {
        pick: ['accountShow','dark', 'currentTheme'],
    },
})
