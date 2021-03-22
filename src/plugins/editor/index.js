import VueMarkdownEditor from '@kangc/v-md-editor'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'

VueMarkdownEditor.use(vuepressTheme)
VMdPreview.use(vuepressTheme)
VueMarkdownEditor.use(createEmojiPlugin())
VueMarkdownEditor.use(createTodoListPlugin())

const vueMarkDown = {
    install(Vue) {
        Vue.component(VueMarkdownEditor.name, VueMarkdownEditor)
        Vue.component(VMdPreview.name, VMdPreview)
    }
}

export default vueMarkDown
