import useNetwork from "@/hooks/useNetwork";
import config from "@/config";

export default ({onFailure, onSuccess}) => {
  const { checkNetwork } = useNetwork({
    apiUrlList: config.apiUrlList,
    jsonUrlList: config.jsonUrlList,
    onFailure: () => {
      onFailure && onFailure();
    },
    onSuccess: () => {
      onSuccess && onSuccess();
    },
  });
  checkNetwork();
};
