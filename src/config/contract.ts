interface ContractMap {
  multiCallToken: string;
  omniContract: string;
}

// 开发环境合约（测试网）
const devContract: ContractMap = {
  multiCallToken: "0xcA11bde05977b3631167028862bE2a173976CA11",
  omniContract: "0x65d7bE6721c797F1D3C4558E94229B71aFD8b812"
};
// 生产环境合约（主网）
const prodContract: ContractMap = {
  multiCallToken: "0xcA11bde05977b3631167028862bE2a173976CA11",
  omniContract: "0x65d7bE6721c797F1D3C4558E94229B71aFD8b812"
};

// 根据环境选择配置
export const contractAddress: ContractMap =
  import.meta.env.MODE === "development" ? devContract : prodContract;
