import { type Result, post, put, get } from "../base";
/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryTotal<T>(data?: any): Promise<Result<T>> {
  return post("/bill/team/total", data);
}
/**
 * 统计
 * @param query .
 * @returns .
 */
export function queryPage<T>(data?: any): Promise<Result<T>> {
  return post("/bill/team/page", data);
}
