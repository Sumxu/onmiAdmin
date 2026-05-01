<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $Api from "@/api/member/user";
import message from "@/utils/message";
import {
  formatAddress,
  formatDate,
  fromWei,
  callContractMethod,
  toWei
} from "@/utils/wallet";
import {
  levelOptions,
  userLevelOptions,
  userTypeMap,
  userTypeOptions,
  amountOptions,
  userSetLevelOptions
} from "@/constants/constants";
import {
  userlevelConvert,
  levelConvert,
  userTypeConvert
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
const pageData: any = reactive({
  searchState: true,
  searchForm: {},
  statusLoading: false,
  amountType: "", //派送类型
  amountNumber: "", //派送数量
  searchField: [
    {
      type: "input",
      label: "钱包地址",
      prop: "address",
      placeholder: "请输入钱包地址"
    },
    {
      type: "input",
      label: "上级地址",
      prop: "parentAddress",
      placeholder: "请输入上级地址"
    },
    {
      type: "date",
      dateType: "datetimerange",
      label: "日期范围",
      prop: "dates",
      placeholder: "请输入日期范围",
      startPlaceholder: "请输入开始日期范围",
      endPlaceholder: "请输入结束日期范围"
    },
    {
      type: "select",
      label: "用户等级",
      prop: "level",
      placeholder: "请选择用户等级",
      dataSourceKey: "userLevelOptions",
      options: {
        filterable: true,
        keys: {
          prop: "value",
          value: "value",
          label: "label"
        }
      }
    }
  ],
  dataSource: {
    levelOptions: levelOptions,
    userLevelOptions: userLevelOptions,
    userTypeOptions: userTypeOptions
  },
  permission: {
    query: ["defi:user:page"]
  },
  btnOpts: {
    size: "small",
    leftBtns: [
      {
        key: "promotion",
        label: "导出报表",
        icon: "ep:promotion",
        state: true
      }
    ],
    rightBtns: [
      { key: "search", label: "查询", icon: "ep:search", state: true },
      { key: "refresh", label: "刷新", icon: "ep:refresh", state: true }
    ]
  },
  tableParams: {
    columns: [
      {
        label: "钱包地址",
        prop: "address",
        width: "370px"
      },
      {
        label: "上级地址",
        prop: "parentAddress",
        width: "370px"
      },
      { label: "当前等级", prop: "level", width: "100px",slot:"levelScope" },
      { label: "状态", prop: "status", width: "210px", slot: "statusScope" },
      {
        label: "用户投入",
        prop: "myPerf",
        slot: "myPerfScope",
        width: "140px"
      },
      { label: "直推人数", prop: "directCount", width: "100px" },
      { label: "社区人数", prop: "teamCount", width: "100px" },
      {
        label: "团队业绩",
        prop: "teamPerf",
        slot: "teamPerfScope",
        width: "140px"
      },
      {
        label: "小区业绩",
        prop: "communityPerf",
        slot: "teamPerfScope",
        width: "140px"
      },
      {
        label: "邀请奖励",
        prop: "inviteReward",
        slot: "teamPerfScope",
        width: "100px"
      },
      {
        label: "治理奖励",
        prop: "teamReward",
        slot: "teamPerfScope",
        width: "140px"
      },
      {
        label: "产出收益",
        prop: "yieldReward",
        slot: "teamPerfScope",
        width: "140px"
      },
      {
        label: "有效直推人数",
        prop: "directValidCount",
        width: "160px"
      },
      {
        label: "是否参与",
        prop: "isJoin",
        width: "100px"
      },
      {
        label: "是否特殊",
        prop: "special",
        width: "100px"
      },
      { label: "注册时间", prop: "createTime", width: "180px" },
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
const handleUpdateLevel = (row: any) => {
  const status = ref<string | number>(row.level);
  const userStatus = ref<string | number>(row.level);
  const address = row.address;
  ElMessageBox({
    title: "修改用户等级",
    message: () =>
      h(
        "div",
        {
          style:
            "width: 300px; display: flex; flex-direction: column; gap: 16px;" // 增加了垂直方向的间距
        },
        [
          // 用户等级选择框
          h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
            // 左侧标题
            h(
              "span",
              { style: "white-space: nowrap; font-weight: 500;" },
              "用户等级"
            ),
            // 下拉选择框
            h(
              ElSelect,
              {
                modelValue: userStatus.value,
                placeholder: "请选择用户等级",
                "onUpdate:modelValue": (val: any) => {
                  userStatus.value = val;
                },
                style: "flex: 1;",
                clearable: true
              },
              () =>
                userLevelOptions.map(item =>
                  h(ElOption, {
                    key: item.value,
                    label: item.label,
                    value: item.value
                  })
                )
            )
          ])
        ]
      ),
    showCancelButton: true,
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true;
          $Api
            .upLevel({
              address,
              level: userStatus.value
            })
            .then((res: any) => {
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
          // 确保 loading 状态被关闭
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
//导出报表
const deriveXlsx = async () => {
  const query = getQueryParams();
  pageData.btnOpts.leftBtns[0].loading = true;
  const result = await downloadExcel(
    () => $Api.exportXlsx(query),
    "静态记录.xlsx"
  );
  if (result.success) {
    ElMessage.success("导出成功");
    pageData.btnOpts.leftBtns[0].loading = false;
  } else {
    pageData.btnOpts.leftBtns[0].loading = false;
  }
};
// 获取表格数据
const _loadData = (page?: number) => {
  pageData.tableParams.list = [];
  pageData.tableParams.loading = true;
  const query = getQueryParams();
  if (page) query.current = page;
  $Api
    .queryPage(query)
    .then((res: any) => {
      if (res.code === 200) {
        pageData.tableParams.list = res.data.records;
        pageData.tableParams.pagination.total = Number(res.data.total);
      } else {
        message.warning(res.msg);
        pageData.tableParams.list = [];
        pageData.tableParams.pagination.total = 0;
      }
    })
    .finally(() => (pageData.tableParams.loading = false));
};

/**
 *
 * @param row row 更新上架 下架
 * @param newValue
 */
const switchChange = async (row, newValue) => {
  const actionText = newValue ? "正常" : "拉黑";

  try {
    await ElMessageBox.confirm(`确认要将用户${actionText}吗？`);

    pageData.statusLoading = true;
    const res = await $Api.upStatus({
      id: row.id,
      status: newValue
    });

    if (res.success) {
      row.status = newValue;
    } else {
      ElMessage.error("失败");
    }
  } catch {
    // 用户取消 → 什么都不做
    row.status = !newValue;
  } finally {
    pageData.statusLoading = false;
  }
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
    case "promotion":
      deriveXlsx();
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
       <template #levelScope="scope">
        <span>{{ levelConvert(scope.row[scope.column.property]) }}</span>
      </template>
      <template #teamPerfScope="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>
      <template #statusScope="{ row }">
        <el-switch
          v-model="row.status"
          size="large"
          :loading="pageData.statusLoading"
          @change="val => switchChange(row, val)"
          active-text="正常"
          inactive-text="拉黑"
        />
      </template>
      <template #operation="{ row }">
        <el-link
          type="warning"
          style="margin-left: 14px"
          @click="handleUpdateLevel(row)"
        >
          修改等级
        </el-link>
      </template>
    </pure-table>
  </el-card>
</template>
