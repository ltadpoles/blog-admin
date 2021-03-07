<template>
    <a-upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :action="action"
        :accept="accept"
        :multiple="multiple"
        :before-upload="beforeUpload"
        :remove="remove"
        @change="handleChange"
    >
        <img class="title-image" v-if="imgSrc" :src="imgSrc" alt="avatar" />
        <div v-else>
            <LoadingOutlined v-if="loading" />
            <PlusOutlined v-else />
            <div class="ant-upload-text">{{ imgText }}</div>
        </div>
    </a-upload>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        fileList: {
            type: Array,
            default: []
        },
        imgSrc: String,
        isShowList: {
            type: Boolean,
            default: false
        },
        action: String,
        accept: String,
        method: {
            type: String,
            default: 'post'
        },
        multiple: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        imgText: String,
        beforeUpload: Function,
        remove: Function,
        handleChange: Function
    },
    setup() {
        return {}
    }
})
</script>
