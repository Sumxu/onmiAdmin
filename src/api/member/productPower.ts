import { type Result, post, put, get } from "../base";

/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(data?: any): Promise<Result<T>> {
  return post("/product/list", data);
}
 /**
 * 列表修改
 * @param query .
 * @returns .
 */
export function update<T>(data?: any): Promise<Result<T>> {
  return post("/product/update", data);
}
