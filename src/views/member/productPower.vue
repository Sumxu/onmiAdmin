<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $Api from "@/api/member/productPower";
import message from "@/utils/message";
import omniABI from "@/abi/omniABI";
import {
  formatAddress,
  formatDate,
  fromWei,
  callContractMethod,
  toWei
} from "@/utils/wallet";
import { useNFTMulticall } from "@/utils/useNFTMulticall";
import {
  levelOptions,
  userLevelOptions,
  userTypeMap,
  userTypeOptions,
  amountOptions,
  userSetLevelOptions,
  pidOptions
} from "@/constants/constants";
import {
  userlevelConvert,
  levelConvert,
  userTypeConvert,
  pidScopeConvert
} from "@/constants/convert";
import {
  ElMessageBox,
  ElSelect,
  ElOption,
  ElInput,
  ElMessage
} from "element-plus";
import erc20Abi from "@/abi/erc20-abi";
import { contractAddress } from "@/config/contract";
import { downloadExcel } from "@/utils/downloadExcel";
const { fetch } = useNFTMulticall();
const pageData: any = reactive({
  searchState: true,
  searchForm: {},
  statusLoading: false,
  amountType: "", //派送类型
  amountNumber: "", //派送数量
  dataSource: {},
  permission: {
    query: ["defi:user:page"]
  },
  btnOpts: {
    size: "small",
    leftBtns: [],
    rightBtns: [
      { key: "search", label: "查询", icon: "ep:search", state: true },
      { key: "refresh", label: "刷新", icon: "ep:refresh", state: true }
    ]
  },
  tableParams: {
    columns: [
      {
        label: "收益类型",
        prop: "id",
        slot: "pidScope"
      },
      {
        label: "参与人数",
        prop: "joinUser",
        slot: "joinUserScope"
      },
      {
        label: "最小入金",
        prop: "minPrice",
        slot: "priceScope"
      },
      {
        label: "最大入金",
        prop: "maxPrice",
        slot: "priceScope"
      },
      {
        label: "日化收益",
        prop: "rate"
      },
      { label: "操作", fixed: "right", slot: "operation", width: "220px" }
    ],
    list: [],
    loading: false,
    pagination: {
      pageSize: 50,
      defaultPageSize: 50,
      currentPage: 1,
      total: 0,
      background: true,
      pageSizes: [50, 100, 200, 300, 500]
    }
  }
});
const handleUpdateRate = (row: any) => {
  const rate = ref<string | number>(row.rate);
  const id = row.id;
  ElMessageBox({
    title: "修改收益率",
    message: () =>
      h(
        "div",
        {
          style:
            "width: 300px; display: flex; flex-direction: column; gap: 16px;"
        },
        [
          // 用户等级输入框
          h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
            h(
              "span",
              {
                style: "white-space: nowrap; font-weight: 500; min-width: 70px;"
              },
              "用户等级"
            ),
            h(ElInput, {
              modelValue: rate.value,
              "onUpdate:modelValue": val => {
                rate.value = val;
              },
              placeholder: "请输入收益率",
              style: "flex: 1;",
              clearable: true,
              // 可以根据需要添加类型，例如 type: 'number'
              type: "number"
            })
          ])
        ]
      ),
    showCancelButton: true,
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true;

          $Api.update({ id, rate: rate.value }).then((res: any) => {
            if (res.code === 200) {
              message.success(res.msg);
              _loadData();
              done();
            } else {
              message.warning(res.msg);
            }
          });
        } catch (err: any) {
          console.error("updateLevel error:", err);
          message.error(err?.message || "请求出错");
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    }
  });
};
// 搜索表单变化
const _updateSearchFormData = (data: any) => (pageData.searchForm = data);
// 查询
const _searchForm = (data: any) => {
  pageData.searchForm = data;
  _loadData();
};
const handleUpdateAmount = (row: any) => {
  const id = row.id;

  const minAmount = ref(fromWei(row.minPrice));
  const maxAmount = ref(fromWei(row.maxPrice));
  const joinUser = ref(row.joinUser.toString());
  // id 对应区间
  const rangeMap: Record<number, [number, number]> = {
    0: [100, 1000],
    1: [1001, 3000],
    2: [3001, 10000]
  };

  const currentRange = rangeMap[id];
  if (!currentRange) {
    message.warning("未知的档位ID");
    return;
  }

  const [start, end] = currentRange;

  ElMessageBox({
    title: "修改收益率",
    message: () =>
      h(
        "div",
        {
          style:
            "width: 320px; display: flex; flex-direction: column; gap: 16px;"
        },
        [
          // 日化收益（只读）
          h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
            h(
              "span",
              { style: "min-width: 80px; font-weight: 500;" },
              "日化收益"
            ),
            h(ElInput, {
              modelValue: pidScopeConvert(id),
              disabled: true,
              style: "flex: 1;"
            })
          ]),
          h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
            h(
              "span",
              { style: "min-width: 80px; font-weight: 500;" },
              "参与人数"
            ),
            h(ElInput, {
              modelValue: joinUser.value,
              "onUpdate:modelValue": val => (joinUser.value = val),
              placeholder: `请输入`,
              type: "string",
              style: "flex: 1;",
              clearable: true
            })
          ]),
          // 最小入金
          h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
            h(
              "span",
              { style: "min-width: 80px; font-weight: 500;" },
              "最小入金"
            ),
            h(ElInput, {
              modelValue: minAmount.value,
              "onUpdate:modelValue": val => (minAmount.value = val),
              placeholder: `建议 ${start}`,
              type: "string",
              style: "flex: 1;",
              clearable: true
            })
          ]),

          // 最大入金
          h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
            h(
              "span",
              { style: "min-width: 80px; font-weight: 500;" },
              "最大入金"
            ),
            h(ElInput, {
              modelValue: maxAmount.value,
              "onUpdate:modelValue": val => (maxAmount.value = val),
              placeholder: `建议 ${end}`,
              type: "string",
              style: "flex: 1;",
              clearable: true
            })
          ]),

          // 提示
          h(
            "div",
            { style: "font-size: 12px; color: #999;" },
            `当前档位金额范围只能设置为：${start} ~ ${end}`
          )
        ]
      ),

    showCancelButton: true,

    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true;

          const min = Number(Number(minAmount.value).toFixed(0));
          const max = Number(Number(maxAmount.value).toFixed(0));
          const joinUserNum = joinUser.value;

          if (isNaN(min) || isNaN(max) || isNaN(joinUserNum)) {
            message.warning("请输入有效的数字");
            return;
          }

          if (min >= max) {
            message.warning("最小入金必须小于最大入金");
            return;
          }
          if (start > min) {
            message.warning(`当前档位金额范围只能设置为：${start} ~ ${end}`);
            return;
          }
          if (end > max) {
            message.warning(`当前档位金额范围只能设置为：${start} ~ ${end}`);
            return;
          }
          // ====================================================
          await callContractMethod(
            contractAddress.omniContract,
            omniABI.abi,
            "updateDeposit",
            [id, [toWei(min), joinUserNum, toWei(max)]],
            true
          );

          message.success("修改成功");
          _loadData();
          done();
        } catch (err: any) {
          console.error("update error:", err);
          message.error(err?.message || "请求出错");
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    }
  });
};
// 重置
const _resetSearchForm = (data?) => (pageData.searchForm = data);
// 获取分页参数
const getQueryParams = () => ({
  ...pageData.searchForm,
  current: pageData.tableParams.pagination.currentPage,
  size: pageData.tableParams.pagination.pageSize
});

// 获取表格数据
const _loadData = async (page?: number) => {
  let depositArr = [
    {
      id: 0,
      rate: 0,
      minPrice: 0n,
      joinUser: 0n,
      maxPrice: 0n
    },
    {
      id: 1,
      rate: 0,
      minPrice: 0n,
      joinUser: 0n,
      maxPrice: 0n
    },
    {
      id: 2,
      rate: 0,
      joinUser: 0n,
      minPrice: 0n,
      maxPrice: 0n
    }
  ];
  const calls = [
    {
      address: contractAddress.omniContract,
      abi: omniABI.abi,
      params: [0] // 自动插入下标
    },
    {
      address: contractAddress.omniContract,
      abi: omniABI.abi,
      params: [1] // 自动插入下标
    },
    {
      address: contractAddress.omniContract,
      abi: omniABI.abi,
      params: [2] // 自动插入下标
    }
  ];
  const depositInfoResult = await fetch("depositInfo", calls);
  const depositInfoData = depositInfoResult.data;
  console.log("depositInfoData==", depositInfoData);
  depositArr.map((item, index) => {
    item.minPrice = depositInfoData[index][0];
    item.joinUser = depositInfoData[index][1];
    item.maxPrice = depositInfoData[index][2];
  });
  pageData.tableParams.list = [];
  pageData.tableParams.loading = true;
  const query = getQueryParams();
  if (page) query.current = page;
  $Api
    .queryPage(query)
    .then((res: any) => {
      if (res.code === 200) {
        depositArr.forEach(item => {
          const match = res.data.find(resItem => resItem.id === item.id);
          if (match) {
            item.rate = match.rate;
          }
        });
        pageData.tableParams.list = depositArr;
        pageData.tableParams.pagination.total = 3;
      } else {
        message.warning(res.msg);
        pageData.tableParams.list = [];
        pageData.tableParams.pagination.total = 0;
      }
    })
    .finally(() => (pageData.tableParams.loading = false));
};
// 分页切换
const handleChangePageSize = (val: any) => {
  pageData.tableParams.pagination.pageSize = val;
  _loadData();
};

const handleChangeCurrentPage = (val: any) => {
  pageData.tableParams.pagination.currentPage = val;
  _loadData();
};

// 按钮操作
const btnClickHandle = (key: string) => {
  switch (key) {
    case "search":
      pageData.searchState = !pageData.searchState;
      break;
    case "refresh":
      _loadData();
      break;
  }
};

onMounted(() => _loadData());
</script>

<template>
  <el-card :shadow="'never'">
    <form-search
      :show="pageData.searchState"
      :form-field="pageData.searchField"
      :data-source="pageData.dataSource"
      @search-form="_updateSearchFormData"
      @search="_searchForm"
      @reset="_resetSearchForm"
    />
    <table-buttons
      :size="pageData.btnOpts.size"
      :left-btns="pageData.btnOpts.leftBtns"
      :right-btns="pageData.btnOpts.rightBtns"
      @click="btnClickHandle"
    />
    <pure-table
      :data="pageData.tableParams.list"
      :columns="pageData.tableParams.columns"
      row-key="address"
      border
      stripe
      :loading="pageData.tableParams.loading"
      :pagination="pageData.tableParams.pagination"
      @page-current-change="handleChangeCurrentPage"
      @page-size-change="handleChangePageSize"
    >
      <template #joinUserScope="scope">
        <span>{{ scope.row[scope.column.property].toString() }}</span>
      </template>
      <template #pidScope="scope">
        <span>{{ pidScopeConvert(scope.row[scope.column.property]) }}</span>
      </template>
      <template #priceScope="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>

      <template #operation="{ row }">
        <el-link
          type="warning"
          style="margin-left: 14px"
          @click="handleUpdateRate(row)"
        >
          修改收益率
        </el-link>
        <el-link
          type="warning"
          style="margin-left: 14px"
          @click="handleUpdateAmount(row)"
        >
          修改信息
        </el-link>
      </template>
    </pure-table>
  </el-card>
</template>
