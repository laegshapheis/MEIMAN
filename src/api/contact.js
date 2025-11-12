import {requestApi} from "@/utils/request";

// 获取列表
export const getContactList = (data) => {
  return requestApi({
    url: "/api/contact/getList",
    method: "POST",
    data,
  });
}

export const deleteContact = (data) => {
  return requestApi({
    url: "/api/contact/delete",
    method: "POST",
    data,
  });
}

export const createContact = (data) => {
  return requestApi({
    url: "/api/contact/create",
    method: "POST",
    data,
  });
}
