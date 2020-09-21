<template>
    <div>
        <div class="uploadbox" v-if="add">
            <!-- <i v-if="clear" class="el-icon-error imgClear" @click="closeUpload()"></i> -->
            <div class="upload" @click="uploadfn($event)">
                <div class="upload-icon">
                    <i class="el-icon-plus"></i>
                    <p>{{ text }}</p>
                </div>
                <input :accept="isVideo?'video/*':'image/*'" id="files" type="file" style="display:none">
            </div>
        </div>
        <div class="uploadbox" v-else>
            <i v-if="!clear && imgObj.strLitimg" class="el-icon-error imgClear" @click="imgClearfn()"></i>
            <i v-if="clear" class="el-icon-error closeClear" @click="closeUpload()"></i>
            <div class="upload" @click="uploadfn($event)">
                <div class="upload-icon" v-if="!imgObj.strLitimg">
                    <i class="el-icon-plus"></i>
                    <p>{{ text }}</p>
                </div>
                <img :src="imgObj.strLitimg" v-else>
                <div v-if="video" class="output">
                    <i class="el-icon-video-play iconImg"></i>
                </div>
                <div v-if="!video">
                    <input :accept="isVideo?'video/*':'image/*'" type="file" style="display:none">
                </div>
            </div>
        </div>
        <playvideo :video-src="video"  :showVideo.sync="isShow"></playvideo>
    </div>
</template>

<script>
    import {uploadImg, uploadImgCloud} from "../../../assets/js/common";
    import playvideo from "../../../components/block/video"
    import {Toast} from "mint-ui";

    export default {
        props: ["img", 'add', 'stop', 'text', 'delete', 'video', 'isVideo'],
        data() {
            return {
                imgObj: {},
                progress: 0,
                uploadStop: this.stop, //是否组织图片上传
                clearImage: this.delete, //是否阻止图片删除
                clear: false, // 是都取消上传
                source: null, //取消上传
                isShow: false, // 是否显示视频
            }
        },
        components:{
            playvideo
        },
        watch: {
            imgObj(val) {
                this.$emit("img-upload", val);
            },
            img: {
                immediate: true,
                handler: function (val) {
                    this.imgObj.strLitimg = val;
                }
            },
            stop(val) {
                this.uploadStop = val;
            },
            delete(val) {
                this.clearImage = val;
            }
        },
        mounted() {
        },
        methods: {
            // 删除图片
            imgClearfn() {
                if (this.clearImage && this.clearImage == true) {
                    return false;
                }
                ;
                let that = this;
                MessageBox({
                    title: "",
                    message: '是否确定删除？',
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        that.imgObj = {};
                        Toast('删除成功')
                    }
                });

            },
            // 取消上传
            closeUpload() {
                let that = this;
                if (that.source) {
                    that.source.cancel('取消上传'); //"取消上传"这几个字，会在上面catch（）的error中输出的，可以console看一下。
                }
                ;
                this.clear = false;
                this.zero = false;
            },
            // 上传图片
            uploadfn(event) {
                if (this.video) {
                    this.isShow = true;
                } else {
                    if (this.uploadStop && this.uploadStop == true) {
                        return false;
                    }
                    ;
                    var el = event.currentTarget;
                    let that = this;
                    el.querySelector('input').click();
                    el.querySelector('input').onchange = function () {
                        if (that.isVideo) {
                            that.uploadVideo(this)
                        } else {
                            that.ceartupload(this);
                        }
                    };
                }
            },
            // 上传视频
            uploadVideo(event) {
                let that = this;
                let form = new FormData();
                let scale = 0.8;
                let cancelToken = axios.CancelToken; //Axios使我修改axios原型链了。
                let video = document.getElementById("video");
                // 判断上传图片不能大于10mb
                var filesId = document.getElementById('files');//获取id
                form.append('multipartFiles', event.files[0]);
                that.source = cancelToken.source();
                function getFileURL(file) {
                    var getUrl = null;
                    if (window.createObjectURL != undefined) { // basic
                        getUrl = window.createObjectURL(file);
                    } else if (window.URL != undefined) { // mozilla(firefox)
                        getUrl = window.URL.createObjectURL(file);
                    } else if (window.webkitURL != undefined) { // webkit or chrome
                        getUrl = window.webkitURL.createObjectURL(file);
                    }
                    return getUrl;
                }
                var url = getFileURL(event.files[0]);//把当前的 files[0] 传进去
                if (url) {
                    video.src = url;
                }
                video.addEventListener("loadeddata", function () {
                    var duration = video.duration;
                    if (Math.floor(duration) > 60) {
                        Toast('视频不能大于60秒')
                    } else {
                        uploadImgCloud(form).then(res => {
                            res = res[0];
                            let poster = res + `?vframe/jpg/offset/1/w/${video.videoWidth * scale}/h/${video.videoHeight * scale}`;
                            that.imgObj = {
                                ImgName: "video",
                                ImgUrl: "video",
                                Msg: "图片上传成功",
                                video: res,
                                strLitimg: poster,
                                strProductImgUrl: poster,
                                Type: 0
                            };
                            this.video = res;
                            video.removeEventListener("loadeddata",function () {})
                            that.imgObj.id = Math.random();
                            event.value = ''; // 上传完图片清除input值
                            that.uploadStop = false;
                        }).catch(err => {
                            Toast('视频上传失败了')
                        })
                    }
                });
            },
            // 上传事件函数
            ceartupload(event) {
                let that = this;
                let cancelToken = axios.CancelToken; //Axios使我修改axios原型链了。
                that.source = cancelToken.source();
                // 判断上传图片不能大于10mb
                if (event.files[0].size / (1024 * 1024) > 8) {
                    Toast('上传图片太大，请上传8mb以下的图片。')
                    that.closeUpload();
                    return false;
                };

                this.uploadStop = true;
                if (that.zero == false) that.zero = true;
                this.clear = true;

                let param = new FormData();
                param.append("file", event.files[0]);
                uploadImg(param).then(url=>{
                    that.clear = false;
                    that.imgObj = {
                        ImgName: url,
                        ImgUrl: url,
                        Msg: "图片上传成功",
                        strLitimg: url,
                        strProductImgUrl: url,
                        Type: 1
                    };
                    that.imgObj.id = event.files[0].lastModified;
                    event.value = ''; // 上传完图片清除input值
                    that.uploadStop = false;
                }).catch(err=>{
                    Toast(err.message);
                })

                // axios({
                //     method: 'post',
                //     url: 'https://upload.520shq.com/upload',
                //     data: form,
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     },
                //     cancelToken: that.source.token,
                //     //上传监控事件
                //     //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                //     //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                //     onUploadProgress(a) {
                //         if (a.lengthComputable) {
                //             ;
                //             (function () {
                //                 that.progress = Math.floor((a.loaded / a.total) * 100);
                //                 that.progressText = that.progress + '%';
                //             })();
                //         }
                //     },
                //     //下载监控事件
                //     onDownloadProgress(a) {
                //         if (a.lengthComputable) {
                //             ;
                //             (function () {
                //                 that.progress = Math.floor((a.loaded / a.total) * 100);
                //                 that.progressText = that.progress + '%';
                //             })();
                //         }
                //     }
                // }).then(res => {

                //     this.clear = false;
                //     this.imgObj = res.data.data;
                //     this.imgObj.id = event.files[0].lastModified;
                //     this.progress = 0;
                //     this.progressText = '0%';
                //     event.value = ''; // 上传完图片清除input值
                //     this.zero = false;
                //     this.uploadStop = false;
                // }).catch((err) => {
                //     this.uploadStop = false;
                // })


            },
        }
    }

</script>

<style scoped>
    .uploadbox {
        max-width: 3.3333rem
        /* 150/45 */;
        width: 100%;
        position: relative;
        background: white;
        display: inline-block;
        margin-bottom: .5556rem
        /* 25/45 */;
    }

    .progress {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.25);
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 1;
    }

    .progress >>> .mt-progress {
        width: 90%;
        margin: 0 auto;
        height: auto;
        line-height: auto;
        padding-bottom: .2222rem
        /* 10/45 */;
    }

    .progress-text {
        font-size: 0.7rem;
        color: white;
        padding-left: .1778rem
        /* 8/45 */;
        padding-bottom: .1111rem
        /* 5/45 */;
        text-align: center;
        font-weight: bold;
    }

    .progress >>> .mt-progress-progress {
        background-color: #ff8f28;
        border-radius: 10px;
    }

    .progress >>> .mt-progress-content {
        display: inline-flex;
        width: 100%;
    }

    .upload {
        color: #999999;
        width: 3.3333rem
        /* 150/45 */;
        height: 3.3333rem
        /* 150/45 */;
        overflow: hidden;
        position: relative;
    }

    .imgClear,
    .closeClear {
        position: absolute;
        right: -.0667rem
        /* 3/45 */;
        top: -.0889rem
        /* 4/45 */;
        font-size: .4444rem
        /* 20/45 */;
        border-radius: 50%;
        background: white;
        color: #ec0746;
        width: .4rem
        /* 18/45 */;
        height: .4rem
        /* 18/45 */;
        z-index: 9;
    }

    .upload-icon {
        height: 100%;
        text-align: center;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #f3f3f3;
    }

    .upload-icon i {
        font-size: .6667rem
        /* 30/45 */;
        color: #ccc;
    }

    .upload-icon p {
        font-size: .3111rem
        /* 14/45 */;
        color: #999;
    }

    .uploadbox img {
        height: auto;
        max-height: 100%;
        position: relative;
    }

    .videoBox {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 10000;
    }

    .videoBox video {
        width: 100%;
        height: 100%;
    }

    .videoBox i {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        font-size: 1.4rem;
        color: #fff;
    }

    .iconImg {
        position: absolute;
        z-index: 10;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
    }

    .output i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

</style>
