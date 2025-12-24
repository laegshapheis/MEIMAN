<template>
    <view class="relative z-20 rounded-[24rpx]  vip-card overflow-hidden">
        <!-- VIP 等级标签 -->
        <view class="absolute top-0 right-0 flex flex-row items-center justify-center px-[16rpx] py-[8rpx]"
            style="background: rgba(18, 30, 62, 0.40);border-radius: 0 12px 0 12px;backdrop-filter: blur(8px)"
            @click="$emit('onTips', 9)">
            <image src="/static/images/profile/vip_icon.svg" mode="widthFix" class="w-[32rpx] h-[32rpx]"></image>
            <text class="text-white text-sm font-medium mx-[8rpx]">{{ userInfo.level }}</text>
            <uv-icon size="24rpx" color="#fff" name="question-circle"></uv-icon>
        </view>

        <!-- 主要内容区域 -->
        <view class="relative flex flex-col">
            <!-- 成长值和直推人数 -->
            <view class="flex flex-row items-center w-full">
                <!-- 会员成长值 -->
                <view class="flex flex-col justify-center items-center flex-1">
                    <view class="flex flex-row items-center w-full">
                        <text class="text-white text-sm leading-[18px] font-normal">会员成长值</text>
                        <view class="w-[12rpx] h-[12rpx] flex justify-center items-center ml-[4rpx]"
                            @click="$emit('onTips', 9)">
                            <uv-icon size="20rpx" color="#fff" name="question-circle"></uv-icon>
                        </view>
                    </view>
                    <view class="flex flex-row items-center w-full mt-[8rpx]">
                        <text class="text-white text-sm leading-[14px] font-medium">
                            <text class="font-normal">{{ userInfo.buymoney || 0 }}</text>
                            <text class="font-normal">/{{ userInfo.serlfmoney || 0 }}</text>
                        </text>
                    </view>
                    <view class="w-full mt-[8rpx]">
                        <uv-line-progress height="12rpx" :showText="false" :percentage="growthProgress"
                            inactiveColor="rgba(0,0,0,0.60)" activeColor="#fff"></uv-line-progress>
                    </view>
                </view>

                <!-- 直推人数 -->
                <view class="flex flex-col justify-center items-center ml-[32rpx] w-[186rpx]">
                    <view class="flex flex-row items-center w-full">
                        <text class="text-white text-sm leading-[18px] font-normal">直推人数</text>
                        <view class="w-[12rpx] h-[12rpx] flex justify-center items-center ml-[4rpx]"
                            @click="$emit('onTips', 10)">
                            <uv-icon size="20rpx" color="#fff" name="question-circle"></uv-icon>
                        </view>
                    </view>
                    <view class="flex flex-row items-center w-full mt-[8rpx]">
                        <text class="text-white text-sm leading-[14px] font-medium">
                            <text class="font-normal">{{ userInfo.number || 0 }}</text>
                            <text class="font-normal">/{{ userInfo.selfnumber || 0 }}</text>
                        </text>
                    </view>
                    <view class="w-full mt-[8rpx]">
                        <uv-line-progress height="12rpx" :showText="false" :percentage="qualifiedProgress"
                            inactiveColor="rgba(0,0,0,0.60)" activeColor="#fff"></uv-line-progress>
                    </view>

                </view>
            </view>

            <!-- 底部按钮 -->
            <view class="flex flex-row items-center w-full mt-[48rpx]">
                <view
                    class="flex-1 h-[64rpx] rounded-[720rpx] btn flex flex-col px-[48rpx] justify-center items-center"
                    @click="handleNavToMembershipLevel">
                    <view class="flex flex-row items-center justify-between w-full">
                        <text class="text-white text-sm">VIP等级</text>
                        <image src="/static/images/profile/vip/arrow_right.svg" mode="widthFix" class="w-[32rpx] h-[32rpx]"></image>
                    </view>
                </view>
                <view
                    class="flex-1 h-[64rpx] rounded-[720rpx] btn flex flex-col px-[48rpx] justify-center items-center ml-[16rpx]"
                    @click="handleNavToTeamLevel">
                    <view class="flex flex-row items-center justify-between w-full">
                        <text class="text-white text-sm">团队等级</text>
                        <image src="/static/images/profile/vip/arrow_right.svg" mode="widthFix" class="w-[32rpx] h-[32rpx]"></image>

                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed } from "vue";
import { routes } from "@/config/routes";
import { vipIcons, teamIcons } from "@/pages/vip/data";

const props = defineProps({
    userInfo: {
        type: Object,
        default: () => ({}),
    },
});

defineEmits(["onTips"]);

// 导航到会员等级页面
const handleNavToMembershipLevel = () => {
    uni.navigateTo({
        url: routes.membershipLevel
    });
};

// 导航到团队等级页面
const handleNavToTeamLevel = () => {
    uni.navigateTo({
        url: routes.teamLevel
    });
};

const menus = computed(() => [
    {
        title: "VIP等级",
        redirect: routes.membershipLevel,
        type: 1,
        desc: props.userInfo.level,
        icon: vipIcons.find((item) => item.id === props.userInfo.levelid)?.icon,
        tip: 9,
    },
    // {
    //   title: "团队等级",
    //   icon: teamIcons.find((item) => item.id === props.userInfo.teams_levelid)
    //     ?.icon,
    //   switch: "team_level_entry_switch",
    //   redirect: routes.teamLevel,
    //   type: 1,
    //   desc: props.userInfo.teams,
    // },
]);

const growthProgress = computed(() => {
    const { buymoney, serlfmoney } = props.userInfo;
    if (!serlfmoney) return 0;
    return Math.min((buymoney / serlfmoney) * 100, 100);
});

const qualifiedProgress = computed(() => {
    const { number, selfnumber } = props.userInfo;
    if (!selfnumber) return 0;
    return Math.min((number / selfnumber) * 100, 100);
});
</script>

<style lang="scss" scoped>
.vip-level-bg {
    background: linear-gradient(90deg, #ebd0b1 0%, #d0a36e 100%);
}

.vip-card {
    height: 298rpx;
    width: 100%;
    background-image: url('/static/images/profile/vip/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    box-sizing: border-box;
    padding: 64rpx 32rpx 32rpx 32rpx;
}

.vip-card-inner {
    width: 100%;
    height: 100%;
}

.btn{
    background: rgba(255, 255, 255, 0.20);
    box-shadow: 0 0 15.6px 0 #FFF inset;
}
</style>