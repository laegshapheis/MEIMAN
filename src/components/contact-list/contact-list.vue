<template>
    <fui-bottom-popup border-radius="0rpx" :show="show" @close="closePopup" :background="$colors.modalBg">
        <view class="fui-scroll__wrap">
            <view class="fui-title">{{ title }}</view>
            <fui-list-cell>
                <view class="flex flex-row justify-between w-[100%]">
                    <text class="text-base" v-if="label">{{ label }}</text>
                    <text class="text-base" v-if="value">{{ value }}</text>
                </view>
            </fui-list-cell>
            <scroll-view scroll-y class="fui-scroll__view">
                <fui-swipe-action v-for="(item, index) in itemList" :key="index" @click="handleDelete(item)">
                    <fui-list-cell @click="onSelect(item)" v-if="label || value">
                        <view class="flex flex-row justify-between w-[100%]">
                            <text class="text-base" v-if="label">{{ item.name }}</text>
                            <text class="text-base" v-if="value">{{ item.account }}</text>
                        </view>
                    </fui-list-cell>
                </fui-swipe-action>
            </scroll-view>
            <view class="fui-icon__close" @tap="closePopup">
                <text>取消</text>
            </view>
        </view>
    </fui-bottom-popup>
    <wk-loading v-if="loading" />
</template>

<script>

import { getContactList as getContactListApi, deleteContact as deleteContactApi } from '@/api/contact'

export default {
    props: {
        label: {
            type: String,
            default: '姓名',
        },
        value: {
            type: String,
            default: '收款账号',
        },
        type: {
            type: [String, Number],
            default: 0,
        },
        title: {
            type: String,
            default: '历史收款人',
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            page: {
                page: 1,
                pageSize: 20,
            },
            itemList: [],
            loading: false,
        };
    },
    watch: {
        show(newValue, oldValue) {
            if (newValue) {
                this.getContractList();
            }
        },
    },
    mounted() {
        this.getContractList();
    },
    methods: {
        async getContractList() {
            const data = {
                ...this.page,
                type: this.type,
            }
            try {
                const result = await getContactListApi(data);
                console.log(result);
                if (result.status === 0) {
                    this.itemList = result.list || [];
                }
            } catch (e) {
                console.error(e);
            }
        },

        async handleDelete(item) {
            this.loading = true;
            try {
                const result = await deleteContactApi({ id: item.id });

                if (result.status === 0) {
                    uni.$showToast({
                        title: "删除成功",
                        icon: "none",
                        duration: 3000
                    });

                    this.getContractList();
                }
                this.loading = false;
            } catch (e) {
                this.loading = false;
                console.error("删除失败", error);
            }


        },
        closePopup(type) {
            this.$emit("update:show", false)
        },
        onSelect(item) {
            this.$emit("onSelect", item)
            this.closePopup()
        },
        onClick() {
            console.log("点击了");
        }
    }
};
</script>

<style scoped lang="scss">
.fui-list__cell-background {
    background: theme('colors.neutral.modalBg');
    border-radius: 0rpx !important;
}

.fui-scroll__wrap {
    padding-top: 30rpx;
    border-radius: 0rpx !important;
    position: relative;
    color: theme('colors.neutral.modalTextColor');
}

.fui-title {
    font-size: 34rpx;
    font-weight: bold;
    text-align: center;
    padding-bottom: 24rpx;
    font-weight: 500;
    border-bottom: 1rpx solid theme('colors.neutral.divider');
}
::v-deep .fui-cell__border-color {
    background-color: theme('colors.neutral.divider') !important;
}
.fui-icon__close {
    position: absolute;
    top: 32rpx;
    left: 36rpx;
    font-size: 28rpx;
    color: theme('colors.neutral.regular');
}
.fui-scroll__view {
    width: 100%;
    height: 50vh;
}
</style>