import { ref } from 'vue'
import { certification } from "@/api/user"
import { routes } from "@/config/routes"
import { cacheManager } from "@/utils/cacheManager"

export const useAuth = () => {
  const authStatus = ref(0)
  const name = uni.getStorageSync('last_login_username')
  const cache = cacheManager.getCache('authStatus' + name)
  // if (cache) {
  //   authStatus.value = cache.stats
  // }
  
  const checkAuth = async (isShowModal = true, isGoProfile = true) => {
    const res = await certification({})
    authStatus.value = res.stats
    cacheManager.setCache('authStatus' + name, res)
    if (res.stats !== 1 && isShowModal) {
      uni.$showModal({
        title: "提示",
        content: "请先进行实名认证", 
        showCancel: true,
        success: function(res) {
          if (res.cancel) {
            if (isGoProfile) {
              uni.switchTab({
                url: routes.profile
              })
            }
          }
          if (res.confirm) {
            uni.navigateTo({
              url: routes.certification
            })
          }
        }
      })
    }
    
    return res.stats
  }

  return {
    authStatus,
    checkAuth
  }
} 