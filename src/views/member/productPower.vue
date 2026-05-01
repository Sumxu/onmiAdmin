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
        label: "最小入金",
        prop: "price",
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

// 搜索表单变化
const _updateSearchFormData = (data: any) => (pageData.searchForm = data);
// 查询
const _searchForm = (data: any) => {
  pageData.searchForm = data;
  _loadData();
};
/**
 * 修改等级
 * @param row  当前行数据
 */
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
      price: 0n
    },
    {
      id: 1,
      rate: 0,
      price: 0n
    },
    {
      id: 2,
      rate: 0,
      price: 0n
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
  depositArr.map((item, index) => {
    item.price = depositInfoData[index][0];
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
      </template>
    </pure-table>
  </el-card>
</template>
