import { fileURLToPath, URL } from 'node:url'
import { parsedIcons, Url } from './icons'

import { UserConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'


export default ({ mode }: { mode: string }): UserConfig => {
  let baseUrl, prefixUrl, prefixShortcuts;
  const devMode = mode === 'development'
  switch (mode) {
    case 'production':
      baseUrl = './'
      prefixUrl = ''
      prefixShortcuts = '.'
      break
    case 'gitpages':
      baseUrl = '/Vue-PWA/'
      prefixUrl = '.'
      prefixShortcuts = ''
      break
    default:
      baseUrl = '/'
      prefixUrl = ''
      prefixShortcuts = '/#/'
      break
  }
  return {
    base: baseUrl,
    plugins: [
      vue(),
      devMode ? null : legacy({
        targets: ['defaults', 'not IE 11']
      }),
      VitePWA({
        manifest: {
          // 描述信息
          short_name: "测试应用",
          name: '测试应用',
          id: "/",
          description: "基于Vue+ Vite+ NaiveUI+ VueRouter构建的PWA应用",
          start_url: "./index.html",
          lang: "zh-CN",
          // 主题信息
          theme_color: "#fff",
          background_color: "#fff",
          edge_side_panel: {
            preferred_width: 480
          },
          // 清单信息
          icons: parsedIcons(prefixUrl),
          display_override: [
            "window-controls-overlay",
            "fullscreen",
            "minimal-ui"
          ],
          // 快捷方式
          shortcuts: [
            {
              name: "主页",
              description: "主页",
              url: prefixShortcuts + "",
              icons: [
                {
                  src: Url(prefixUrl, "android/android-launchericon-96-96.png"),
                  sizes: "96x96"
                }
              ]
            },
            {
              name: "测试集",
              description: "正在测试的一些玩意",
              url: prefixShortcuts + "test/1",
              icons: [
                {
                  src: Url(prefixUrl, "android/android-launchericon-96-96.png"),
                  sizes: "96x96"
                }
              ]
            },
            {
              name: "工具集",
              description: "Test",
              url: prefixShortcuts + "tool/1",
              icons: [
                {
                  src: Url(prefixUrl, "android/android-launchericon-96-96.png"),
                  sizes: "96x96"
                }
              ]
            },
          ],
          // 屏幕截图
          screenshots: [
            //label,platform,type
            {
              src: Url(prefixUrl, "screenshots/screenshot-wide.jpeg"),
              sizes: "1442x1151",
              form_factor: "wide",
            }, {
              src: Url(prefixUrl, "screenshots/screenshot-narrow.jpeg"),
              sizes: "555x1103",
              form_factor: "narrow",
            }
          ],
          // URI
          protocol_handlers: [
            {
              protocol: "web+test",
              url: prefixUrl + "/test/%s"
            },
            {
              protocol: "web+tool",
              url: prefixUrl + "/tool/%s"
            }
          ]
        },
        devOptions: {
          enabled: true,// 如果想在`vite dev`命令下调试PWA, 必须启用它
          type: "module"// Vite在dev模式下会使用浏览器原生的ESModule，将type设置为`"module"`与原先的保持一致
        }
      }),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8080
    }
  }
}