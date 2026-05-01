<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $Api from "@/api/member/user";
import message from "@/utils/message";
import { useNFTMulticall } from "@/utils/useNFTMulticall";
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
  userSetLevelOptions,
  pledgeTypeOptions,
  pidSetOptions
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
  ElMessage,
  ElRadioGroup,
  ElRadio,
  ElSwitch
} from "element-plus";
import omniABI from "@/abi/omniABI.ts";
import { contractAddress } from "@/config/contract";
import { downloadExcel } from "@/utils/downloadExcel";
const { fetch } = useNFTMulticall();
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
    },
    {
      type: "radio",
      label: "类型",
      prop: "queryType",
      default: 1,
      dataSourceKey: "pledgeTypeOptions",
      options: {
        filterable: true,
        keys: {
          prop: "prop",
          value: "value",
          label: "label"
        }
      }
    }
  ],
  dataSource: {
    levelOptions: levelOptions,
    userLevelOptions: userLevelOptions,
    userTypeOptions: userTypeOptions,
    pledgeTypeOptions: pledgeTypeOptions
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
      { label: "当前等级", prop: "level", width: "100px", slot: "levelScope" },
      { label: "状态", prop: "status", width: "210px", slot: "statusScope" },
      {
        label: "用户投入",
        prop: "selfPerf",
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
        label: "是否参与",
        prop: "isJoin",
        width: "100px",
        slot: "isJoinScope"
      },
      { label: "注册时间", prop: "createTime", width: "180px" },
      { label: "操作", fixed: "right", slot: "operation", width: "320px" }
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
const handleUpdateLeader = (row: any) => {
  const currentAddress = ref<string>(row.address || "");
  const newParentAddress = ref<string>(""); // 新上级地址

  ElMessageBox({
    title: "修改上级",
    customClass: "my-message-box",
    message: () =>
      h(
        "div",
        {
          style: {
            width: "530px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }
        },
        [
          // 当前用户地址（禁用）
          h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
            h(
              "span",
              {
                style: "white-space: nowrap; font-weight: 500; min-width: 80px;"
              },
              "当前地址"
            ),
            h(ElInput, {
              modelValue: currentAddress.value,
              disabled: true,
              style: { width: "390px" },
              placeholder: "当前用户地址"
            })
          ]),

          // 新上级地址（可编辑）
          h("div", { style: "display: flex; align-items: center; gap: 8px;" }, [
            h(
              "span",
              {
                style: "white-space: nowrap; font-weight: 500; min-width: 80px;"
              },
              "新上级地址"
            ),
            h(ElInput, {
              style: { width: "390px" },
              modelValue: newParentAddress.value,
              "onUpdate:modelValue": (val: string) => {
                newParentAddress.value = val;
              },
              placeholder: "请输入新的上级地址",
              clearable: true
            })
          ])
        ]
      ),

    showCancelButton: true,

    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        // 简单校验
        if (!newParentAddress.value || newParentAddress.value.trim() === "") {
          message.warning("请输入新上级地址");
          return;
        }

        try {
          instance.confirmButtonLoading = true;

          const res = await $Api.upLeader({
            address: currentAddress.value, // 当前用户地址
            newParentAddress: newParentAddress.value.trim() // 新上级地址
          });

          if (res.code === 200) {
            message.success(res.msg || "修改上级成功");
            _loadData(); // 刷新列表
            done();
          } else {
            message.warning(res.msg || "修改失败");
          }
        } catch (err: any) {
          console.error("upLeader error:", err);
          message.error(err?.message || "请求失败");
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    }
  });
};
const handleUpdateStatus = (row: any) => {
  const isBlack = ref<boolean>(row.status); // 是否拉黑
  const updateChildren = ref<boolean>(false); // 是否同时修改伞下用户
  const address = row.address;
  ElMessageBox({
    title: "修改用户状态",
    message: () =>
      h(
        "div",
        {
          style:
            "width: 320px; display: flex; flex-direction: column; gap: 20px;"
        },
        [
          // 1. 是否拉黑 - 使用 ElSwitch
          h(
            "div",
            {
              style:
                "display: flex; align-items: center; justify-content: space-between;"
            },
            [
              h("span", { style: "font-weight: 500;" }, "是否拉黑"),
              h(ElSwitch, {
                modelValue: isBlack.value,
                "onUpdate:modelValue": (val: boolean) => {
                  isBlack.value = val;
                },
                activeText: "正常",
                inactiveText: "拉黑"
              })
            ]
          ),
          // 2. 是否修改伞下用户 - 使用 ElRadioGroup
          h(
            "div",
            { style: "display: flex; align-items: center; gap: 12px;" },
            [
              h(
                "span",
                { style: "font-weight: 500; white-space: nowrap;" },
                "是否修改伞下用户"
              ),

              h(
                ElRadioGroup,
                {
                  modelValue: updateChildren.value,
                  "onUpdate:modelValue": (val: boolean) => {
                    updateChildren.value = val;
                  }
                },
                () => [
                  h(ElRadio, { label: true }, () => "是"),
                  h(ElRadio, { label: false }, () => "否")
                ]
              )
            ]
          )
        ]
      ),
    showCancelButton: true,
    beforeClose: async (action, instance, done) => {
      console.log("isBlack==", isBlack.value);
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true;
          await $Api.upStatus({
            address,
            status: isBlack.value,
            isTeam: updateChildren.value // 是否同步修改伞下用户
          });
          message.success("修改成功");
          _loadData();
          done();
        } catch (err: any) {
          console.error("updateLevel error:", err);
          message.error(err?.message || "修改失败");
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    }
  });
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const labelStyle = {
  width: "80px",
  fontWeight: 500,
  whiteSpace: "nowrap"
};
const handleAdminDeposit = async (row: any) => {
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
  console.log("row.address==", row.address);
  const selectValue = ref("");
  const amount = ref("");
  ElMessageBox({
    title: "添加质押",
    customClass: "my-message-box",
    message: () =>
      h(
        "div",
        {
          style: {
            width: "520px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }
        },
        [
          // 当前地址
          h("div", rowStyle, [
            h("span", labelStyle, "当前地址"),
            h(ElInput, {
              modelValue: row.address,
              disabled: true,
              style: { flex: 1 }
            })
          ]),

          // 下拉选择
          h("div", rowStyle, [
            h("span", labelStyle, "类型"),
            h(
              ElSelect,
              {
                modelValue: selectValue.value,
                "onUpdate:modelValue": (val: string) => {
                  selectValue.value = val;
                },
                placeholder: "请选择类型",
                style: { flex: 1 }
              },
              {
                default: () =>
                  pidSetOptions.map((item, index) =>
                    h(ElOption, {
                      label:
                        item.label +
                        "-" +
                        "最少入金:" +
                        fromWei(depositInfoData[index][0]),
                      value: item.value,
                      key: item.value
                    })
                  )
              }
            )
          ]),

          // 金额输入
          h("div", rowStyle, [
            h("span", labelStyle, "金额"),
            h(ElInput, {
              modelValue: amount.value,
              "onUpdate:modelValue": (val: string) => {
                amount.value = val;
              },
              placeholder: "请输入金额",
              clearable: true,
              style: { flex: 1 }
            })
          ])
        ]
      ),

    showCancelButton: true,

    beforeClose: async (action, instance, done) => {
      if (action !== "confirm") return done();

      const type = selectValue.value;
      const amt = amount.value?.trim();
      // 校验
      if (type === "" || type === null || type === undefined) {
        message.warning("请选择类型");
        return;
      }

      if (!amt) {
        message.warning("请输入金额");
        return;
      }

      if (isNaN(Number(amt)) || Number(amt) <= 0) {
        message.warning("请输入正确的金额");
        return;
      }
      const amountIn = fromWei(depositInfoData[type][0]);
      console.log("amountIn---", amountIn);
      if (Number(amt) < Number(amountIn)) {
        message.warning(`金额不能少于${amountIn}`);
        return;
      }
      try {
        instance.confirmButtonLoading = true;
        const res = await callContractMethod(
          contractAddress.omniContract,
          omniABI.abi,
          "adminDeposit",
          [row.address, type, toWei(amt)],
          true
        );
        message.success(res.msg || "添加质押成功");
        _loadData();
        done();
      } catch (err: any) {
        message.error(err?.message || "请求失败");
        done();
        _loadData();
      } finally {
        instance.confirmButtonLoading = false;
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
        <span>{{ userlevelConvert(scope.row[scope.column.property]) }}</span>
      </template>
      <template #isJoinScope="scope">
        <span>{{ scope.row[scope.column.property] ? "是" : "否" }}</span>
      </template>
      <template #specialScope="scope">
        <span>{{ scope.column.property ? "是" : "否" }}</span>
      </template>
      <template #teamPerfScope="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>
      <template #statusScope="{ row }">
        <el-switch
          v-model="row.status"
          size="large"
          disabled
          :loading="pageData.statusLoading"
          @change="val => switchChange(row, val)"
          active-text="正常"
          inactive-text="拉黑"
        />
      </template>
      <template #operation="{ row }">
        <el-link type="primary" @click="handleUpdateLevel(row)">
          修改等级
        </el-link>
        <el-link
          type="warning"
          style="margin-left: 14px"
          @click="handleUpdateStatus(row)"
        >
          是否拉黑
        </el-link>
        <el-link
          type="info"
          style="margin-left: 14px"
          @click="handleUpdateLeader(row)"
        >
          修改上级
        </el-link>

        <el-link
        v-if="row.isJoin==false"
          type="danger"
          style="margin-left: 14px"
          @click="handleAdminDeposit(row)"
        >
          添加质押
        </el-link>
      </template>
    </pure-table>
  </el-card>
</template>
<style lang="scss">
.my-message-box {
  --el-messagebox-width: 550px !important;
}
</style>
