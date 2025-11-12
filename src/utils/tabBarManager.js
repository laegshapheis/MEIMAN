import { useUserCardInfoStore } from '@/stores/userCardInfoStore';
import { cacheManager } from '@/utils/cacheManager';

const handleTabBar = (data) => {
  const cards = data.cards;
  if (cards > 0) {
    uni.setTabBarItem({
      index: 1,
      visible: true,
    })
    uni.setTabBarItem({
      index: 2,
      visible: false,
    })
    uni.setTabBarItem({
      index: 3,
      visible: true,
    })
  } else {
    uni.setTabBarItem({
      index: 1,
      visible: false,
    })
    uni.setTabBarItem({
      index: 2,
      visible: true,
    })
    uni.setTabBarItem({
      index: 3,
      visible: false,
    })
  }
  console.log(data, "card info");
  return data;
}
export const updateTabBar = async () => {
  const cecheData = cacheManager.getCache('userCardInfo');
  if (cecheData) {
    handleTabBar(cecheData);
  }
  await useUserCardInfoStore().getUserCardInfo();
  const data = useUserCardInfoStore().userCardInfo;
  handleTabBar(data);
}; 