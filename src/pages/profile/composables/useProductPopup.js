import { ref, watch } from "vue";
import { navigateTo } from "@/utils/navigation";
import { routes } from "@/config/routes";

/**
 * 产品弹窗相关的组合式API
 * 处理产品弹窗的显示、关闭和交互逻辑
 * @param {Ref} userInfo - 用户信息响应式引用
 */
export const useProductPopup = (userInfo) => {
  // 状态定义
  const showProductModal = ref(false);
  const product = ref({});
  const productList = ref([]);
  const currentProductIndex = ref(0); // 当前展示的产品索引
  const productPopHistory = ref({}); // 记录每个产品的弹窗历史 {productId: popCount}

  // 监听用户信息变化，更新产品列表
  watch(() => userInfo.value, (newVal) => {
    if (newVal && newVal.product_pop_list) {
      productList.value = newVal.product_pop_list;
    }
  }, { deep: true });

  /**
   * 显示下一个产品弹窗
   */
  const showNextProduct = () => {
    if (!productList.value.length) return;

    // 找到下一个需要显示的产品
    for (let i = currentProductIndex.value; i < productList.value.length; i++) {
      const currentProduct = productList.value[i];
      const popCount = productPopHistory.value[currentProduct.id] || 0;
      
      // 如果弹窗次数小于产品设定的次数，则显示该产品
      if (popCount < currentProduct.profile_pop_count) {
        product.value = currentProduct;
        currentProductIndex.value = i;
        showProductModal.value = true;
        
        // 更新弹窗历史
        productPopHistory.value[currentProduct.id] = popCount + 1;
        productPopHistory.value["userId"] = userInfo.value.invicode;
        uni.setStorageSync("productPopHistory", productPopHistory.value);
        break;
      }
    }
  };

  /**
   * 初始化产品弹窗
   */
  const handleProductOpen = () => {
    // 如果用户有未签名的合同，则不显示产品弹窗
    if (userInfo.value.buy_no_sign_count > 0) return;
    
    // 从本地存储获取弹窗历史
    const history = uni.getStorageSync("productPopHistory") || {};
    
    // 检查存储的用户ID是否与当前用户ID匹配
    if (history.userId !== userInfo.value.invicode) {
      // 用户已切换,清除历史记录
      productPopHistory.value = {
        userId: userInfo.value.invicode,
      };
      uni.setStorageSync("productPopHistory", productPopHistory.value);
    } else {
      productPopHistory.value = history;
    }

    currentProductIndex.value = 0;
    showNextProduct();
  };

  /**
   * 关闭产品弹窗
   */
  const handleProductClose = () => {
    showProductModal.value = false;
    setTimeout(() => {
      // 当前产品弹窗关闭后，尝试显示下一个产品
      currentProductIndex.value++;
      showNextProduct();
    }, 300);
  };

  /**
   * 处理产品提交
   * @param {String} type - 提交类型，用于拼团
   */
  const handleProductSubmit = (type) => {
    showProductModal.value = false;
    
    // 检查实名认证
    if (userInfo.value.isreal != 1) {
      uni.$showModal({
        title: "提示",
        content: "请先进行实名认证",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({
              url: routes.certification,
            });
          }
        },
      });
      return;
    }
    
    // 根据类型跳转到不同页面
    if (!type) {
      navigateTo(routes.productDetail + "?id=" + product.value.id);
    } else {
      navigateTo(
        routes.pinTuanDetail + "?id=" + product.value.id + "&type=" + type
      );
    }
  };

  return {
    showProductModal,
    product,
    productList,
    handleProductOpen,
    handleProductClose,
    handleProductSubmit,
    showNextProduct
  };
}; 