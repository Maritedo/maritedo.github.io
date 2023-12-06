<template>
    <n-config-provider fullH :theme="appConfig.currentTheme.value">
        <n-layout class="n-container" content-style="display: flex; flex-direction: column;" fullH>
            <n-layout-header class="n-header" bordered @click.prevent>
                <n-page-header class="n-header-bar">
                    <template #title>
                        <div class="n-header-bar-wrapper">
                            <div class="n-action" nonedrag>
                                <n-button @click="appRouter.go(-1)" text>
                                    <n-icon size="large"><arrow-back /></n-icon>
                                </n-button>
                                <n-button @click="appRouter.go(1)" text>
                                    <n-icon size="large"><arrow-forward /></n-icon>
                                </n-button>
                            </div>
                            <n-breadcrumb class="breadcrumb">
                                <n-breadcrumb-item :clickable="false"> 测试应用 </n-breadcrumb-item>
                                <transition name="breadcrumb" v-for="(name, index) in getDisplayNames(section)"
                                    :key="index">
                                    <n-breadcrumb-item nonedrag :key="name.original" @click.prevent="onBreadcurmbClick">
                                        <router-link :to="{ name: name.original }">
                                            {{ name.display }}
                                        </router-link>
                                    </n-breadcrumb-item>
                                </transition>
                            </n-breadcrumb>
                        </div>
                    </template>
                    <template #back></template>
                </n-page-header>
            </n-layout-header>
            <n-layout class="n-main" has-sider>
                <n-notification-provider container-style="margin-top: var(--title-height);" ref="appNotify">
                    <n-layout-sider :native-scrollbar="false" content-style="height: 100%" class="n-sider"
                        collapse-mode="width" :collapsed="collapsed" bordered>
                        <div class="i-wrapper">
                            <n-button @click="collapsed = !collapsed" :style="{
                                backgroundColor: appConfig.themeVars.value.bodyColor,
                                padding: ['6px', 'auto', '6px', '10px'],
                                display: 'block'
                            }" text>
                                <n-icon size="28px"><menu-icon /></n-icon>
                            </n-button>
                            <n-layout :native-scrollbar="false">
                                <n-menu ref="portalRef" class="i-menu" :options="portalOptions || []"
                                    :value="currentPortal" />
                            </n-layout>
                            <div class="i-actions">
                                <n-menu ref="actionRef" class="i-action-menu" :options="actionOptions || []"
                                    :value="currentAction">
                                </n-menu>
                            </div>
                        </div>
                    </n-layout-sider>
                    <n-layout-content class="n-content" content-style="height: 100%;" :native-scrollbar="false">
                        <router-view v-slot="{ Component, route }">
                            <transition name="fade">
                                <keep-alive v-if="appConfig.keepAlive.value">
                                    <component class="i-content" :is="Component" :key="route.path" />
                                </keep-alive>
                                <component v-else class="i-content" :is="Component" :key="route.path" />
                            </transition>
                        </router-view>
                    </n-layout-content>
                </n-notification-provider>
            </n-layout>
        </n-layout>
    </n-config-provider>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch, onMounted } from 'vue'
import { NMenu } from 'naive-ui'
import type { MenuDividerOption, NBreadcrumb } from 'naive-ui'
import { RouterView, useRouter, type RouteLocationNormalized } from 'vue-router'
import { storeToRefs } from 'pinia'
import { portal, action, getDisplayNames } from '@/router/index'
import { useConfigStore as useConfigs } from '@/stores/configs'
import { configureThemeColor, simulateClick, genMenuOptions as genMenu, type ExtendedRecord, type DiversedOption, getOverrided } from '@/scripts/normal'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'
import { ArrowBack, ArrowForward, Menu as MenuIcon } from '@vicons/ionicons5'
const portalRef: Ref<null | typeof NMenu> = ref(null)
const actionRef: Ref<null | typeof NMenu> = ref(null)
const currentPortal: Ref<any> = ref()
const currentAction: Ref<any> = ref()
const section: Ref<string[]> = ref([])
const collapsed: Ref<boolean> = ref(true)

const appConfig = storeToRefs(useConfigs())
const appRouter = useRouter()
const appNotify = ref()
var useNotify: NotificationApiInjection

const divider: MenuDividerOption = {
    type: 'divider'
}
const appendDivider = (function _(items: DiversedOption[], options: { top?: boolean, bottom?: boolean, children?: boolean, indent?: number }) {
    const _options = Object.assign({
        top: false,
        bottom: true,
        children: false,
        indent: NMenu.__defaults?.indent || 32,
        last: true,
        offset: 0,
        root: true
    }, options)
    const _divider = _options.root ? divider : getOverrided(divider, {
        props: {
            style: {
                marginLeft: /** NaiveUI菜单分割线MarginLeft默认值*/18 + _options.offset + 'px'
            }
        }
    })
    const result: DiversedOption[] = []
    if (_options.top) result.push(_divider)
    for (var index = 0; index < items.length; index++) {
        let item = items[index]
        /** 
         * !此处 item.children 类型为 DiversedOption[], 系 VS Code 类型推断漏洞
        */
        if (_options.children && item.children)
            item.children = _(item.children as DiversedOption[], getOverrided(_options, {
                offset: _options.offset + _options.indent,
                bottom: false,
                last: false,
                root: false
            }))
        result.push(item, _divider)
    }
    result.pop()
    if (_options.bottom) result.push(_divider)
    return result;
})

const actionOptions: DiversedOption[] = appendDivider(genMenu(action), {
    children: false,
    top: false,
    bottom: false
})
const portalOptions: DiversedOption[] = appendDivider(genMenu(portal), {
    children: true,
    top: false,
    bottom: true
})

appRouter.beforeEach((to: RouteLocationNormalized) => {
    let handledName: string | undefined = undefined
    const nav = (v: Ref, t: Ref<any>) => {
        t.value = handledName
        setTimeout(() => {
            section.value = v.value?.activePath || []
            if (v.value && to.name && !(to.name in v.value.activePath))
                v.value.showOption(handledName)
        })
    }
    enum loc {
        NOTFOUND,
        FOUND,
        VIRTUAL
    }
    currentPortal.value = currentAction.value = null;
    switch (([action, portal]).find((v) => {
        return (function _(vals: ExtendedRecord[]): loc {
            for (const val of vals) {
                if (val.name == to.name) {
                    if (val.meta?.virtual)
                        return loc.VIRTUAL
                    handledName = String(val.name)
                    return loc.FOUND
                }
                else if (val.redirect == to.name && (val.children || !val.component)) {
                    handledName = String(to.name = val.name)
                    return loc.FOUND
                }
                else if (val.children) {
                    const i = _(val.children)
                    if (i == loc.VIRTUAL)
                        handledName = String(val.name)
                    if (i != loc.NOTFOUND)
                        return loc.FOUND
                }
            }
            return loc.NOTFOUND
        }).call(null, v) != loc.NOTFOUND
    })) {
        case action: nav(actionRef, currentAction); break;
        case portal: nav(portalRef, currentPortal); break;
    }
    return to.name ? appRouter.hasRoute(to.name) : false
})

const onBreadcurmbClick = (e: PointerEvent) => {
    const element = e.target as HTMLElement
    if (element instanceof HTMLSpanElement) {
        const a = element.children[0]
        a && simulateClick(a)
    }
}

// const dayNightRail = (info: any) => ({
//   backgroundColor: info.checked ? '#bdc6ce' : '#ffd700'
// })

onMounted(() => {
    // console.log(darkTheme.common)
    useNotify = appNotify.value
    const colorSchemeSetter = (isLight: boolean) => {
        appConfig.osTheme.value = isLight ? 'light' : 'dark'
    }
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: light)')
    colorSchemeSetter(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', (e) => colorSchemeSetter(e.matches))
    if (appConfig.firstRun.value) {
        appConfig.firstRun.value = false
        useNotify.info({
            content: '你好！',
            duration: 5120
        })
    }
    watch(appConfig.useDarkTheme, () => configureThemeColor(appConfig.themeVars.value.cardColor), { immediate: true }
    )
})
</script>

<style scoped lang="scss">
.n-container {
    .n-header {
        -webkit-app-region: drag;
        height: var(--title-height);

        .n-header-bar {
            height: 100%;

            .n-header-bar-wrapper {
                height: 100%;
            }

            [nonedrag]:last-child {
                -webkit-app-region: drag;
            }

            .n-header-bar-wrapper {
                display: flex;
                flex-direction: row;
                align-items: center;

                .n-action {
                    display: flex;
                    height: 100%;
                    align-items: center;
                }
            }
        }
    }

    .n-header,
    .n-sider {
        user-select: none;
    }

    .n-main {
        height: calc(100% - var(--title-height));
        position: relative;

        .n-content {
            overflow-y: auto;
        }
    }
}

.i-content {
    width: 100%;
    height: 100%
}


.i-wrapper {
    display: flex;
    height: 100%;
    flex-direction: column;

    .i-menu,
    .i-actions .i-action-menu {
        text-align: left;
    }
}

.fade-enter-to,
.fade-leave-from {
    transform: translateY(0%);
    opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
    transition: all 0.2s ease;
    position: absolute;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(-100%);
}

.fade-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.breadcrumb-enter-to,
.breadcrumb-leave-from {
    transform: translateY(0%);
    opacity: 1;
}

.breadcrumb-enter-from {
    opacity: 0;
    transform: translateY(+100%);
}

.breadcrumb-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.breadcrumb-leave-active,
.breadcrumb-enter-active {
    transition: all 0.2s ease;
}

.breadcrumb-leave-active {
    position: absolute;
}
</style>

<style lang="scss">
// 修正面包屑动画时的分隔符动画bug
.breadcrumb-leave-active:nth-last-child(2)>span:last-child {
    display: none;
}

// 修正菜单收起时使用鼠标操作会出现的错位问题
.n-menu--collapsed .n-menu-item-content__icon {
    margin-right: auto !important;
}

// 面包屑居中
.n-header-bar .n-page-header {
    height: 100%;
}

// 完全隐藏返回按钮
.n-page-header__back {
    margin: 0 !important;
}

// 前进、后退按钮定位修正
.n-action>* {
    margin-right: 8px;

    &:first-child {
        margin-left: 8px;
    }
}
</style>
