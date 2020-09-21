<template>
    <div class="rich-text-test">
        <vue-html5-editor :content="content" :height="200" @change="updateData" :url="updateImg"></vue-html5-editor>
    </div>
</template>

<script>
export default {
    props: ['type', 'con'],
    data() {
        return {
            content: '',
            updateImg:this.PRODUCT+"/Product/UploadProductPictures"
        };
    },
    methods: {
        updateData(e = "") {
            let c1 = e.replace(/<img width="100%"/g, "<img");
            let c2 = c1.replace(/<img/g, '<img width="100%"');
            this.content = c2;
            this.$emit('getContent', this.content, this.type)
        }
    },
    watch: {
        con(val) {
            this.content = val;
        }
    }
};
</script>

<style scoped>
	.vue-html5-editor {
		border-radius: 0;
		border: 0;
	}
    .vue-html5-editor >>> img {
        max-width: 50%;
    }
</style>
