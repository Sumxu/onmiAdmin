import { type Result, post, put, get } from "../base";
/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(data?: any): Promise<Result<T>> {
  return post("/member/user/page", data);
}
/**
 * 修改状态
 * @param query .
 * @returns .
 */
export function upStatus<T>(data?: any): Promise<Result<T>> {
  return get("/member/user/updateStatus", data);
}
/**
 * 修改等级
 * @param query .
 * @returns
 */
export function upLevel<T>(data?: any): Promise<Result<T>> {
  return get("/member/user/updateLevel", data);
}
//导出
export function exportXlsx<T>(data?: any): Promise<Result<T>> {
  return post("/member/user/export", data, {
    responseType: "blob",
    timeout: 300000 // 5分钟
  });
}