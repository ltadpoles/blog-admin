<template>
    <div class="article-publish">
        <div class="publish">
            <a-popover
                v-model:visible="publishVisible"
                trigger="click"
                placement="bottomRight"
                overlayClassName="publish-pop"
            >
                <template #content>
                    <div class="publish-content">
                        <div>
                            <a-upload
                                v-model:file-list="fileList"
                                accept=".png, .jpg, .jpeg"
                                list-type="picture-card"
                                class="avatar-uploader"
                                :show-upload-list="false"
                                action="http://localhost:4000/v1/upImg"
                                :before-upload="beforeUpload"
                                @change="handleChange"
                            >
                                <img
                                    class="title-image"
                                    v-if="article.image"
                                    :src="article.image"
                                    alt="avatar"
                                />
                                <div v-else>
                                    <LoadingOutlined v-if="loading" />
                                    <PlusOutlined v-else />
                                    <div class="ant-upload-text">封面图片</div>
                                </div>
                            </a-upload>
                        </div>
                        <div class="publish-sty">
                            <div class="title-sty">文章类型：</div>
                            <div class="padding-sty">
                                <a-radio-group
                                    name="typeGroup"
                                    v-model:value="article.type"
                                    @change="typeChange"
                                >
                                    <a-radio :value="1">原创</a-radio>
                                    <a-radio :value="2">转载</a-radio>
                                </a-radio-group>
                            </div>
                        </div>
                        <div class="publish-sty" v-if="article.type === 2">
                            <div class="title-sty">原文链接：</div>
                            <div class="padding-sty">
                                <a-input
                                    class="title-input"
                                    v-model:value="article.link"
                                    placeholder="原文链接"
                                    size="small"
                                />
                            </div>
                        </div>
                        <div class="confirm">
                            <a-button type="primary" @click="confirm">确认发布</a-button>
                        </div>
                    </div>
                </template>
                <a-button type="primary">发布文章</a-button>
            </a-popover>
        </div>
        <a-input placeholder="请输入标题" v-model:value="article.title" size="large" />
        <div class="tag">
            <a-tag
                v-for="item in article.tag"
                :key="item.id"
                closable
                @close="tagClose(item.id)"
                color="#87d068"
                >{{ item.name }}</a-tag
            >
            <a-popover
                v-model:visible="visible"
                trigger="click"
                placement="bottomLeft"
                overlayClassName="tag-pop"
                @visibleChange="popoverChange(visible)"
                v-if="article.tag.length < tagLength"
            >
                <template #content>
                    <div class="tag-content">
                        <div class="tag-dec">
                            <span>还可以添加{{ tagLength - article.tag.length }}个标签</span>
                            <span
                                >找不到标签？
                                <a @click="addTag">创建</a>
                            </span>
                        </div>
                        <div class="tag-search">
                            <a-input
                                placeholder="搜索标签"
                                v-model:value="search"
                                @change="searchChange"
                            ></a-input>
                        </div>
                        <div v-if="!isSearch">
                            <div>
                                常用标签：
                            </div>
                            <div class="base-tag">
                                <a-tag
                                    class="base-tag-sty"
                                    v-for="item in baseTagList"
                                    :key="item.id"
                                    @click="choiceTag(item)"
                                    color="#87d068"
                                    >{{ item.name }}</a-tag
                                >
                            </div>
                        </div>
                        <ul class="tag-search-content" v-else>
                            <li
                                class="search-tags"
                                @click="choiceTag(item)"
                                v-for="item in resultTagList"
                                :key="item.id"
                            >
                                {{ item.name }}
                            </li>
                        </ul>
                    </div>
                </template>
                <a-button size="small">添加标签</a-button>
            </a-popover>
        </div>

        <!-- markdown 输入区域 -->
        <v-md-editor
            v-model="article.content"
            left-toolbar="undo redo clear | h emoji bold italic strikethrough quote | tip table hr | link todo-list code | image"
            :include-level="[1, 2, 3, 4]"
            height="500px"
            @change="mdChange"
        ></v-md-editor>

        <!-- 新增标签 -->
        <a-modal
            v-model:visible="tagVisible"
            title="创建标签"
            @ok="tagAdd"
            @cancel="tagCancel"
            class="tag-modal"
            okText="确认"
            cancelText="取消"
        >
            <div class="tag-modal-input">
                <p>标签名：</p>
                <a-input
                    placeholder="标签名(10个字符以内,不支持特殊字符)"
                    v-model:value="newTags.name"
                ></a-input>
            </div>
            <div class="tag-modal-input">
                <p>标签描述：</p>
                <a-input placeholder="标签描述(可选)" v-model:value="newTags.dec"></a-input>
            </div>
        </a-modal>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { addArticle, getArticleInfo, modifyArticle } from '@/api/article'
import { useRoute, useRouter } from 'vue-router'
import { addTag as addTags, getTags } from '@/api/tag'
import { getUserId } from '@/utils'

export default defineComponent({
    setup() {
        const router = useRouter()
        const route = useRoute()

        const userId = getUserId()

        const state = reactive({
            search: '',
            isSearch: false,
            loading: false,
            tagLength: 3, // 可创建的标签数量
            fileList: [], // 封面图片列表
            visible: false,
            publishVisible: false,
            resultTagList: [], // 搜索而来的标签列表
            tagVisible: false,
            baseTagList: [], // 常用标签列表
            article: {
                title: '',
                html: '',
                tag: [], // 已选中的标签列表
                content: '',
                image: '',
                type: 1,
                link: ''
            }
        })

        const newTags = reactive({
            name: '',
            dec: ''
        })

        const handleChange = async info => {
            if (info.file.status === 'uploading') {
                state.loading = true
                return
            }

            if (info.file.status === 'done') {
                message.success('上传成功')
                state.article.image = info.file.response.url
            }

            if (info.file.status === 'warning') {
                state.loading = false
                message.warning('上传失败')
            }
        }

        const beforeUpload = file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(file) //base64编码
                reader.onload = function(e) {
                    const img = new Image()
                    img.src = e.target.result //获取编码后的值,也可以用this.result获取
                    img.onload = function() {
                        console.log('height:' + this.height + '----width:' + this.width)
                        const scale =
                            this.height / this.width < 0.7 && this.height / this.width > 0.4
                        if (!scale) {
                            message.warning('图片比例不支持')
                            reject('图片比例不支持')
                        }
                        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                        if (!isJpgOrPng) {
                            message.warning('所选文件格式不支持')
                            reject('所选文件格式不支持')
                        }
                        const isLt1M = file.size / 1024 / 1024 < 1
                        if (!isLt1M) {
                            message.warning(`最大支持1MB文件`)
                            reject(`最大支持1MB文件`)
                        }
                        resolve(scale && isJpgOrPng && isLt1M)
                    }
                }
            })
        }

        // 关闭选中标签
        const tagClose = id => {
            state.article.tag = state.article.tag.filter(item => item.id !== id)
        }

        // 类型更改
        const typeChange = () => {
            state.article.link = ''
        }

        // 标签选中
        const choiceTag = item => {
            if (!state.article.tag.some(res => res.id == item.id)) {
                state.article.tag.push(item)
                state.search = ''
                state.resultTagList = []
                state.isSearch = false
            }
        }

        // 创建标签
        const addTag = () => {
            state.visible = false // 关闭添加标签弹窗
            state.tagVisible = true
        }
        const tagAdd = () => {
            const pattern = new RegExp(
                "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
            )
            if (!newTags.name || !newTags.dec) {
                message.warning('请完善标签信息')
                return
            }
            if (pattern.test(newTags.name)) {
                message.warning('标签不能包含特殊字符')
                return
            }
            if (newTags.name.length > 10) {
                message.warning('标签长度不合法')
                return
            }
            addTags({ ...newTags, userId }).then(res => {
                message.success(res.message)
                tagCancel()
            })
        }

        const tagCancel = () => {
            newTags.name = ''
            newTags.dec = ''
            state.tagVisible = false
        }

        const mdChange = (text, html) => {
            state.article.content = text
            state.article.html = html
        }

        const searchChange = async () => {
            if (state.search) {
                state.isSearch = true
                const query = {
                    params: { name: state.search }
                }
                const result = await getTags(query)
                state.resultTagList = result.data.rows
            } else {
                state.isSearch = false
                state.resultTagList = []
            }
        }

        const popoverChange = async visible => {
            // 点击添加标签即更新标签
            if (visible) {
                // 按使用次数排序
                const initTags = await getTags({ params: { order: 1 } })
                state.baseTagList = initTags.data.rows
            }
        }

        const confirm = () => {
            const { title, tag, type, link, content, image } = state.article

            if (!title || tag.length < 1 || !type || !content || !image) {
                message.warning('请完善文章信息')
                return
            }
            if (type && type === 2 && !link) {
                message.warning('请完善原文链接')
                return
            }

            const tagsIds = tag.map(item => item.id).join(',')

            if (route.query.id) {
                modifyArticle({
                    ...state.article,
                    tags: tagsIds,
                    image,
                    userId,
                    id: route.query.id
                }).then(res => {
                    message.success(res.message)
                    router.replace({ path: '/article-info', query: { id: route.query.id } })
                })
            } else {
                addArticle({ ...state.article, tags: tagsIds, image, userId }).then(res => {
                    message.success(res.message)
                    router.push('/article')
                })
            }
        }

        onMounted(() => {
            if (route.query.id) {
                getArticleInfo(route.query.id).then(res => {
                    state.article = res.data
                })
            }
        })

        return {
            ...toRefs(state),
            newTags,
            handleChange,
            beforeUpload,
            tagClose,
            addTag,
            tagAdd,
            tagCancel,
            choiceTag,
            popoverChange,
            searchChange,
            confirm,
            mdChange,
            typeChange
        }
    },
    components: {
        PlusOutlined,
        LoadingOutlined
    }
})
</script>

<style lang="less">
.article-publish {
    position: relative;
    .publish {
        position: absolute;
        right: 0;
        top: -60px;
        text-align: center;
    }
    .tag {
        margin: 10px 0;
    }
}

.publish-content {
    .publish-sty {
        display: flex;
        align-items: center;
        .title-sty {
            width: 70px;
            min-width: 70px;
        }
        .padding-sty {
            padding: 10px 0;
        }
    }

    .confirm {
        margin-top: 20px;
        text-align: center;
    }
    .ant-upload.ant-upload-select-picture-card {
        width: 100%;
        height: 130px;
    }
    .title-image {
        width: 100%;
        height: 130px;
    }
}

.tag-content {
    .tag-dec {
        display: flex;
        justify-content: space-between;
    }
    .tag-search-content {
        margin: 0;
        .search-tags {
            padding-bottom: 5px;
            cursor: pointer;
            &:hover {
                background-color: #eee;
            }
        }
    }
    .tag-search {
        margin: 10px 0;
    }
    .base-tag {
        margin-top: 5px;
        .base-tag-sty {
            cursor: pointer;
            margin: 5px 5px 5px 0;
        }
    }
}

.tag-modal-input {
    margin-bottom: 10px;
    > p {
        margin-bottom: 10px;
    }
}
</style>
