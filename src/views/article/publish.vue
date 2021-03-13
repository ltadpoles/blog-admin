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
                                name="avatar"
                                list-type="picture-card"
                                class="avatar-uploader"
                                :show-upload-list="false"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
                        <div>
                            文章类型：
                        </div>
                        <div class="padding-sty">
                            <a-radio-group name="typeGroup" v-model:value="article.type">
                                <a-radio value="1">原创</a-radio>
                                <a-radio value="2">转载</a-radio>
                            </a-radio-group>
                        </div>
                        <div class="confirm">
                            <a-button type="primary" @click="confirm">确认发布</a-button>
                        </div>
                    </div>
                </template>
                <a-button type="primary">发布文章</a-button>
            </a-popover>
        </div>
        <a-input placeholder="请输入标题" v-model:value="article.title" size="large"></a-input>
        <div class="tag">
            <a-tag
                v-for="item in article.tags"
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
                v-if="article.tags.length < tagLength"
            >
                <template #content>
                    <div class="tag-content">
                        <div class="tag-dec">
                            <span>还可以添加{{ tagLength - article.tags.length }}个标签</span>
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
                            <div>
                                <a-tag
                                    class="base-tag"
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
        <v-md-editor
            v-model="article.content"
            left-toolbar="undo redo clear | h emoji bold italic strikethrough quote | tip table hr | link todo-list code | image"
            :include-level="[1, 2, 3, 4]"
            height="500px"
        ></v-md-editor>

        <!-- 新增标签 -->
        <a-modal
            v-model:visible="tagVisible"
            title="创建标签"
            @ok="tagAdd"
            class="tag-modal"
            okText="确认"
            cancelText="取消"
        >
            <div class="tag-modal-input">
                <p>标签名：</p>
                <a-input
                    placeholder="标签名(10个字符以内,不支持特殊字符)"
                    v-model:value="newTags.tagName"
                ></a-input>
            </div>
            <div class="tag-modal-input">
                <p>标签描述：</p>
                <a-input placeholder="标签描述" v-model:value="newTags.dec"></a-input>
            </div>
        </a-modal>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { addArticle } from '@/api/article'
import { useRouter } from 'vue-router'

function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

export default defineComponent({
    setup() {
        const router = useRouter()

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
            baseTagList: [
                {
                    id: 0,
                    name: 'Vue'
                },
                {
                    id: 1,
                    name: 'JavaScript'
                }
            ]
        })

        const article = reactive({
            title: '',
            tags: [], // 已选中的标签列表
            content: '',
            image: '',
            type: '1'
        })

        const newTags = reactive({
            tagName: '',
            dec: ''
        })
        const handleChange = info => {
            if (info.file.status === 'uploading') {
                state.loading = true
                return
            }

            // if (info.file.status === 'done') {
            // Get this url from response in real world.
            console.log(11223344)
            getBase64(info.file.originFileObj, base64Url => {
                article.image = base64Url
                state.loading = false
            })
            // }

            // if (info.file.status === 'error') {
            //     state.loading = false
            //     message.error('上传失败')
            // }
        }

        const beforeUpload = file => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'

            if (!isJpgOrPng) {
                message.error('You can only upload JPG file!')
            }

            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isLt2M) {
                message.error('Image must smaller than 2MB!')
            }

            return isJpgOrPng && isLt2M
        }

        // 关闭选中标签
        const tagClose = id => {
            article.tags = article.tags.filter(item => item.id !== id)
        }

        // 标签选中
        const choiceTag = item => {
            if (!article.tags.some(res => res.id == item.id)) {
                article.tags.push(item)
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
            if (!newTags.tagName || !newTags.dec) {
                message.warning('请完善标签信息')
                return
            }
            if (pattern.test(newTags.tagName)) {
                message.warning('标签不能包含特殊字符')
                return
            }
            if (newTags.tagName.length > 10) {
                message.warning('标签长度不合法')
                return
            }
            newTags.tagName = ''
            newTags.dec = ''
            state.tagVisible = false
        }

        const searchChange = () => {
            console.log(state.search)
            if (state.search) {
                state.isSearch = true
            } else {
                state.isSearch = false
            }
        }

        const confirm = () => {
            console.log(article)
            let tags = article.tags.map(item => item.id).join(',')
            let image =
                'https://sf6-ttcdn-tos.pstatp.com/img/user-avatar/38ad29cc69d52044086f52bdcf71236c~300x300.image'
            let author = '游荡de蝌蚪'
            addArticle({ ...article, tags, image, author }).then(res => {
                message.success(res.message)
                router.push('/article')
            })
        }

        return {
            ...toRefs(state),
            article,
            newTags,
            handleChange,
            beforeUpload,
            tagClose,
            addTag,
            tagAdd,
            choiceTag,
            searchChange,
            confirm
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
    .padding-sty {
        padding: 10px 0;
    }
    .confirm {
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
        margin-bottom: 5px;
        cursor: pointer;
    }
}

.tag-modal-input {
    margin-bottom: 10px;
    > p {
        margin-bottom: 10px;
    }
}
</style>
