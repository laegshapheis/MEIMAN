// store/symbolStore.js
import { defineStore } from "pinia";

export const useSymbolStore = defineStore("symbol", {
  state: () => ({
    code: "",
	  name: "",
	  symbol: "",
	  unit: "",
    value: "",
    exchangeUsdtLabel: "USD", // 默认显示美元
    exchangeCNYValue: "CNY" // 默认显示人民币
  }),
  
  actions: {
    setSymbol(symbolData) {
      this.code = symbolData.code
      this.name = symbolData.name
      this.symbol = symbolData.symbol
      this.unit = symbolData.unit
      this.value = symbolData.value
      this.exchangeUsdtLabel = symbolData.value == "CNY" ?  "USDT": symbolData.code
    }
  }
});
