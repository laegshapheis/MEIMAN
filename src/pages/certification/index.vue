<template>
  <layout ref="layoutRef" :refresher="true" @onRefresh="handleRefresh" navTitle="实名认证" bgType="bg-main2"
    :isLottie="false">
    <view class="px-[32rpx] pb-[180rpx]" v-if="loadingFlag">
      <!-- 审核中 -->
      <view class="flex-col flex items-center justify-center" v-if="certificate_stae == 4">
        <image class="w-[184rpx] h-[184rpx]" src="/static/images/user/audit.png" mode="widthFix" />
        <view class="text-center flex flex-col mt-[20rpx] mb-[60rpx]">
          <text class="text-neutral text-xl">实名资料审核中</text>
          <text class="text-neutral/80 text-lg mt-[10rpx]">请稍后再来查看审核结果</text>
        </view>
      </view>
      <!-- 完成认证，审核通过 -->
      <view class="w-full flex flex-col justify-center items-center mt-[50rpx]"
        v-if="certificate_stae === 2 || certificate_stae === 3">
        <image class="w-[184rpx] h-[184rpx]" src="/static/images/user/audit_success.png" mode="widthFix" />
        <view class="mt-[20rpx] mb-[60rpx] text-center">
          <text class="text-neutral text-xl">{{ more_text }}</text>
        </view>
      </view>
      <template v-if="
        certificate_stae == 1 ||
        certificate_stae == 3 ||
        certificate_stae == 4 ||
        certificate_stae == 5
      ">
        <view v-if="
          certificate_stae !== 4 && certificate_stae !== 3 && rz_sjnum > 0
        " class="mb-[60rpx] flex flex-col items-center justify-center mt-[20rpx]">
          <image class="w-[184rpx] h-[184rpx]" src="/static/images/user/audit_fail.png" mode="widthFix" />
          <view class="mt-[32rpx] text-neutral text-xl">实名资料审核失败！</view>
          <view class="mt-[20rpx] text-neutral-regular text-lg">失败原因：{{ sb_mark }}</view>
          <view v-if="sancishibai" class="mt-[20rpx] text-neutral-error text-base">{{ sancishibai }}</view>
        </view>
        <view class="mb-[44rpx] py-[32rpx] rounded-[48rpx]" style="border: 1rpx solid #00000020;">
          <!-- <view class="text-white/80 text-base mb-[24rpx]">实名信息</view> -->
          <view class="flex flex-col justify-between">
            <view class="text-neutral-regular/80 text-sm mb-[10rpx]">真实姓名</view>
            <view class="input-bg3 h-[96rpx] flex items-center px-[24rpx]" v-if="certificate_stae == 5 || certificate_stae == 3">
              <text class="text-neutral-regular text-lg font-bold">{{ user_name }}</text>
            </view>
          </view>
          <!-- <view class="h-[1rpx] bg-neutral-divider w-full my-[16rpx]"></view> -->
          <view class="flex flex-col justify-between mt-[24rpx]">
            <view class="text-neutral-regular/80 text-sm mb-[10rpx]">身份证号码</view>
            <view class="input-bg3 h-[96rpx] flex items-center px-[24rpx]" v-if="certificate_stae == 5 || certificate_stae == 3">
              <text class="text-neutral-regular text-lg font-bold">{{ certificate_no }}</text>
            </view>
          </view>
        </view>
        <view class="flex flex-col mt-[24rpx] bg-white" v-if="certificate_stae == 1 && isShowInfo">
          <idCardItem v-if="is_card_image == 1" text="身份证正面" :src="simg_1" :defaultSrc="defaultSrc1"
            @click="(src) => handleSelImage(src, 'simg_1')" />
          <idCardItem v-if="is_card_image == 1" text="身份证反面" :src="simg_2" :defaultSrc="defaultSrc2"
            @click="(src) => handleSelImage(src, 'simg_2')" />
          <idCardItem v-if="ishandheld == 1" text="手持身份证" :src="simg_3" :defaultSrc="defaultSrc3"
            @click="(src) => handleSelImage(src, 'simg_3')" />
        </view>
      </template>
      <!-- 未提交认证 -->

      <template v-if="certificate_stae == 0">
        <view class="mt-[24rpx]">
          <view class="flex flex-col mb-[24rpx]">
            <view class="text-neutral-regular/80 text-sm mb-[10rpx]">真实姓名</view>
            <view class="flex flex-row items-center justify-between rounded-[32rpx]">
            <wk-input class="text-regular text-base font-medium" fontSize="32rpx"  bgSize="100%" maxlength="50" borderWidth="0rpx"
                v-model="user_name" placeholder="请输入真实姓名" @input="vinInput" />
            </view>
          </view>
          <view class="flex flex-col">
            <view class="text-neutral-regular/80 text-sm mb-[10rpx]">身份证号码</view>
            <view class="flex flex-row items-center justify-between rounded-[32rpx] ">

              <wk-input class="text-neutral/80 text-base font-medium" fontSize="32rpx" bgSize="100%" maxlength="18" borderWidth="0rpx"
                v-model="certificate_no" placeholder="请输入身份证号码" @input="sfzInput" />
            </view>
          </view>
        </view>

        <view class="flex flex-col mt-[32rpx] bg-white p-[32rpx] rounded-[24rpx]" v-if="isShowInfo"
          style="border: 1rpx solid #00000020;">
          <view class="mb-[32rpx] text-neutral-regular text-lg font-bold">上传证照信息</view>
          <idCardItem v-if="is_card_image == 1" text="身份证正面" :src="simg_1" :defaultSrc="defaultSrc1"
            @click="(src) => handleSelImage(src, 'simg_1')" />
          <idCardItem v-if="is_card_image == 1" text="身份证反面" :src="simg_2" :defaultSrc="defaultSrc2"
            @click="(src) => handleSelImage(src, 'simg_2')" />
          <idCardItem v-if="ishandheld == 1" text="手持身份证" :src="simg_3" :defaultSrc="defaultSrc3"
            @click="(src) => handleSelImage(src, 'simg_3')" />
        </view>
      </template>

      <wk-common-tip
        class="mt-[24rpx] bg-[#0C052F] text-white/80 p-[32rpx] rounded-[48rpx] border-[length:1rpx] border-solid border-neutral-divider"
        :content="noteMsg" color="rgba(255,255,255,0.8)"></wk-common-tip>
    </view>
    <view v-if="certificate_stae == 0 || certificate_stae == 1"
      class="bg-neutral-bottomBtnBg fixed bottom-0 left-0 right-0 px-[32rpx] py-[24rpx]">
      <wk-button v-if="certificate_stae == 0" height="80rpx" @submit="handleSubmit">
        立即认证
      </wk-button>
      <wk-button v-if="certificate_stae == 1" height="80rpx" @submit="handleSubmit">
        重新认证
      </wk-button>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import idCardItem from "./components/id-card-item.vue";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import {
  certification,
  editCertification,
  savepicCertificationV2,
} from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const certificate_stae = ref(9);
const user_name = ref("");
const certificate_no = ref("");
const defaultSrc1 = "/static/images/user/card1.png";
const defaultSrc2 = "/static/images/user/card2.png";
const defaultSrc3 = "/static/images/user/card3.png";
const simg_1 = ref(defaultSrc1);
const simg_2 = ref(defaultSrc2);
const simg_3 = ref(defaultSrc3);
const more_text = ref("");
const rz_sjnum = ref(0); // 审核次数
const sb_mark = ref(""); // 审核失败原因
const ishandheld = ref(0);
const noteMsg = ref("");
const is_card_image = ref(0);
const layoutRef = ref(null);
const sancishibai = ref("");
const isShowInfo = computed(() => {
  return (
    certificate_stae.value !== 4 &&
    certificate_stae.value !== 3 &&
    (ishandheld.value == 1 || is_card_image.value == 1)
  );
});
const loadingFlag = ref(false);
const loading = ref(false);
const loadingText = ref("");
const vinInput = (value) => {
  let val = value;
  let chineseRegex = /[^\u4e00-\u9fa5\u00B7]/g;
  let str = val.replace(chineseRegex, "");
  if (str.length > 50) {
    str = str.substring(0, 50);
  }
  setTimeout(() => {
    user_name.value = str;
  }, 10);
};

const handleRefresh = () => {
  getCertification();
};
const handleSelImage = (src, type) => {
  if (type == "simg_1") {
    simg_1.value = src;
  }
  if (type == "simg_2") {
    simg_2.value = src;
  }
  if (type == "simg_3") {
    simg_3.value = src;
  }
};
const sfzInput = (value) => {
  let val = value;
  let chineseRegex = /[^0-9a-zA-Z]+/g;
  let str = val.replace(chineseRegex, "");
  if (str.length > 18) {
    str = str.substring(0, 18);
  }
  setTimeout(() => {
    certificate_no.value = str;
  }, 10);
};

const checkIdCardSrc = () => {
  if (is_card_image.value == 1 && simg_1.value == defaultSrc1) {
    uni.$showToast({
      title: "请上传身份证正面",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (is_card_image.value == 1 && simg_2.value == defaultSrc2) {
    uni.$showToast({
      title: "请上传身份证反面",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (ishandheld.value == 1 && simg_3.value == defaultSrc3) {
    uni.$showToast({
      title: "请上传手持身份证正面",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  return true;
};

const checkIdcard = (b) => {
  b = b.toUpperCase();
  if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(b)) return false;
  var a;
  a = b.length;
  if (15 == a) {
    a = RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
    a = b.match(a);
    var c = new Date("19" + a[2] + "/" + a[3] + "/" + a[4]);
    if (
      (a =
        c.getYear() == Number(a[2]) &&
        c.getMonth() + 1 == Number(a[3]) &&
        c.getDate() == Number(a[4]))
    ) {
      a = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      var c = "10X98765432".split(""),
        e = 0,
        d;
      b = b.substr(0, 6) + "19" + b.substr(6, b.length - 6);
      for (d = 0; 17 > d; d++) e += b.substr(d, 1) * a[d];
      return true;
    }
    return false;
  }
  if (18 == a)
    if (
      ((a = RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)),
        (a = b.match(a)),
        (c = new Date(a[2] + "/" + a[3] + "/" + a[4])),
        (a =
          c.getFullYear() == Number(a[2]) &&
          c.getMonth() + 1 == Number(a[3]) &&
          c.getDate() == Number(a[4])))
    ) {
      a = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      c = "10X98765432".split("");
      for (d = e = 0; 17 > d; d++) e += b.substr(d, 1) * a[d];
      if (c[e % 11] != b.substr(17, 1)) return false;
    } else return false;
  return true;
};

const Age = (b) => {
  if (!b) return false;
  var a = b.substring(6, 14);
  var now = new Date();
  a = new Date(a.substring(0, 4), a.substring(4, 6) - 1, a.substring(6, 8));
  return 18 <= Math.round((now - a) / 31536e6);
};

const handleSubmit = async () => {
  var reg_name = /^[\u4E00-\u9FA5\u00B7]{2,15}$/;
  if (user_name.value == "" || !reg_name.test(user_name.value)) {
    uni.$showToast({
      title: "姓名不为空或格式不对",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (!checkIdcard(certificate_no.value)) {
    uni.$showToast({
      title: "身份证号码不对",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (!Age(certificate_no.value)) {
    uni.$showToast({
      title: "实名认证年龄必须年满18周岁",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (!checkIdCardSrc()) {
    return;
  }
  loading.value = true;
  loadingText.value = "加载中...";
  try {
    const params = {
      realname: user_name.value,
      card: certificate_no.value,
      sfz_zm: simg_1.value,
      sfz_fm: simg_2.value,
      sfz_sc: simg_3.value,
    };
    if (certificate_stae.value == 0) {
      await handleCertification(params);
    } else {
      await handleCertificationV2(params);
    }
  } finally {
    loading.value = false;
  }
};
const handleCertificationV2 = async (params) => {
  const res = await savepicCertificationV2(params);
  if (res.status != 0) {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
  }
  if (res.status == 0) {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
    getCertification();
  }
};
const handleCertification = async (params) => {
  const res = await editCertification(params);
  if (res.status != 0) {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
  }
  if (res.status == 0) {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
    getCertification();
  }
};

const handleCache = (res) => {
  ishandheld.value = res.ishandheld;
  is_card_image.value = res.is_card_image;
  noteMsg.value = res.msg;
  if (res.stats == -1) {
    // 未认证
    more_text.value = res.msg;
    certificate_stae.value = 0;
  }
  if (res.stats == 0) {
    user_name.value = res.realname;
    certificate_no.value = res.card;
    certificate_stae.value = 4; // 审核中
  }
  if (res.stats == 1) {
    certificate_stae.value = 3; // 审核通过
    user_name.value = res.realname;
    certificate_no.value = res.card;
    more_text.value = "实名资料已审核通过！";

    simg_1.value = res.pic1;
    simg_2.value = res.pic2;
    simg_3.value = res.pic3;
  }
  if (res.stats == 2) {
    certificate_stae.value = 1; // 重新认证
    user_name.value = "";
    certificate_no.value = "";
    more_text.value = res.msg;
    rz_sjnum.value = res.sjnum;
    sb_mark.value = res.mark;
    simg_1.value = defaultSrc1;
    simg_2.value = defaultSrc2;
    simg_3.value = defaultSrc3;
  }
  if (res.stats == 2 && res.sjnum >= 3) {
    sb_mark.value = res.mark;
    sancishibai.value = res.sancishibai;
    certificate_stae.value = 5; // 审核失败
    user_name.value = res.realname;
    certificate_no.value = res.card;
    more_text.value = res.sancishibai;
  }
  loadingFlag.value = true;
};
const getCertification = async () => {
  loading.value = true;
  loadingText.value = "加载中...";
  try {
    const res = await certification();
    console.log(res);
    if (res.ispay == 0) {
      uni.$showModal({
        title: "提示",
        content: "请先设置支付密码再进行实名认证！",
        showCancel: false,
        success: function (resx) {
          if (resx.confirm) {
            uni.navigateTo({
              url: routes.payPassNew + "?code=" + res.ispay,
            });
          }
        },
      });
    }
    cacheManager.setCache("certification", res);
    handleCache(res);
    layoutRef.value.complete();
  } finally {
    loadingFlag.value = true;
    loading.value = false;
  }
};

const cache = cacheManager.getCache("certification");
onLoad(() => {
  if (cache) {
    handleCache(cache);
  }
  getCertification();
});
</script>
