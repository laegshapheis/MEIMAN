<!-- eslint-disable -->
<template>
  <view
    v-html="videoHtml"
    id="dom-video"
    class="dom-video"
    :videoCurrentTime="videoCurrentTime"
    :change:videoCurrentTime="domVideo.seekChange"
    :eventDrive="eventDrive"
    :change:eventDrive="domVideo.eventHandle"
    :videoSrc="videoSrc"
    :change:videoSrc="domVideo.srcChange"
    :videoProps="videoProps"
    :change:videoProps="domVideo.propsChange"
    :randomNum="randomNum"
    :change:randomNum="domVideo.randomNumChange"
  />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: false
    },
    objectFit: {
      type: String,
      default: 'contain'
    },
    muted: {
      type: Boolean,
      default: false
    },
    poster: {
      type: String,
      default: ''
    },
    controlsList: {
      type: String,
      default: ''
    }
  },

  // 数据状态
  data() {
    return {
      videoHtml: '',
      videoSrc: '',
      eventDrive: null,
      videoProps: {},
	    videoCurrentTime: 0,
      randomNum: Math.floor(Math.random() * 100000000 + 1)
    }
  },
  watch: {
    // 监听视频资源文件更新
    src: {
      handler(val) {
        if (!val) return
        this.initVideoHtml()
        setTimeout(() => {
          this.videoSrc = val
        }, 0)
      },
      immediate: true
    },
    // 监听首次加载
    autoplay: {
      handler(val) {
        this.videoProps.autoplay = val
      },
      immediate: true
    },
  },
  // 生命周期
  mounted() {
    this.initVideoHtml()
  },

  // 方法
  methods: {
    // 将video的事件传递给父组件
    videoEvent(data) {
      // console.log('向父组件传递事件 =>', data)
      this.$emit(data.e, data)
    },
    // 初始化视频
    initVideoHtml() {
      this.videoHtml = `<video
          src="${this.src}"
          id="dom-html-video_${this.randomNum}"
          class="dom-html-video"
          ${this.autoplay ? 'autoplay' : ''}
          ${this.loop ? 'loop' : ''}
          ${this.controls ? 'controls' : ''}
          ${this.muted ? 'muted' : ''}
          ${this.poster ? 'poster="' + this.poster + '"' : ''}
          preload="auto"
          playsinline
          webkit-playsinline
          width="100%"
          height="100%"
          disablepictureinpicture
          controlslist="nodownload noremoteplayback noplaybackrate"
          style="object-fit: ${this.objectFit};padding:0;"
        >
          <source src="${this.src}" type="video/mp4">
          <source src="${this.src}" type="video/ogg">
          <source src="${this.src}" type="video/webm">
        </video>
      `
      // console.log('视频html =>', this.videoHtml)
    },
    resetEventDrive() {
      this.eventDrive = null
    },
    // 将service层的事件/数据 => 传递给renderjs层
    play() {
      this.eventDrive = 'play'
    },
    pause() {
      this.eventDrive = 'pause'
    },
    stop() {
      this.eventDrive = 'stop'
    },
    seek(value) {
      this.videoCurrentTime = value
    }
  }
}
</script>

<script module="domVideo" lang="renderjs">
export default {
  data() {
    return {
      video: null,
      num: '',
      options: {}
    }
  },
  mounted() {
    this.initVideoEvent()
  },
  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer)
  },
  methods: {
    initVideoEvent() {
      if(this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let video = document.getElementById(`dom-html-video_${this.num}`)
        this.video = video
        // 监听视频事件
        video.addEventListener('play', () => {
          this.$ownerInstance && this.$ownerInstance.callMethod('videoEvent', {e: 'play', video})
        })
        video.addEventListener('pause', () => {
          this.$ownerInstance && this.$ownerInstance.callMethod('videoEvent', {e: 'pause', video})
        })
        video.addEventListener('ended', () => {
          this.$ownerInstance && this.$ownerInstance.callMethod('videoEvent', {e: 'ended', video})
          this.$ownerInstance && this.$ownerInstance.callMethod('resetEventDrive')
        })
        video.addEventListener('timeupdate', () => {
          this.$ownerInstance && this.$ownerInstance.callMethod('videoEvent', {e: 'timeupdate',  currentTime: video.currentTime})
        })
        video.addEventListener('error', () => {
          this.$ownerInstance && this.$ownerInstance.callMethod('videoEvent', {e: 'error',  data: 'error'})
        })
        
      }, 100)
    },
    eventHandle(eventType
	) {
      if (eventType) {
        this.video = document.getElementById(`dom-html-video_${this.num}`)
        if (eventType === 'play') {
          this.video.play()
        } else if (eventType === 'pause') {
          this.video.pause()
        } else if (eventType === 'stop') {
          this.video.stop()
        } 
      }
    },
    seekChange(val) {
      setTimeout(() => {
        let video = document.getElementById(`dom-html-video_${this.num}`)
        if (video) {
          video.currentTime = val
        }
      }, 0);
	  },
    srcChange(val) {
      // 实现视频的第一帧作为封面，避免视频展示黑屏
      this.initVideoEvent()
      if(this.sd) clearTimeout(this.sd)
      this.sd = setTimeout(() => {
        let video = document.getElementById(`dom-html-video_${this.num}`)
        video.addEventListener('loadedmetadata', () => {
          this.$ownerInstance && this.$ownerInstance.callMethod('videoEvent', {e: 'loadedmetadata', duration: video.duration})
        })
        video.addEventListener('canplaythrough', () => {
          this.$ownerInstance && this.$ownerInstance.callMethod('videoEvent', {e: 'canplaythrough', duration: video.duration})
        })
        video.addEventListener('waiting', () => {
          this.$ownerInstance && this.$ownerInstance.callMethod('videoEvent', {e: 'waiting'})
        })
      }, 0)
    },
    propsChange(obj) {
      this.options = obj
    },
    randomNumChange(val) {
      this.num = val
    },
  }
}
</script>


<style lang="scss" scoped>
.dom-video {
  overflow: hidden;
  height: 100%;
  padding: 0;
  &-height {
    height: 100%;
  }
}
</style>
