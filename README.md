# AIyting 生图/生视频 · DeepSeek Harness

在 DeepSeek Harness 中查询 AIyting 模型与点数报价、设置生图参数、生成图片和找回未完成任务。插件界面显示名为 **AIyting生图/生视频**；本版开放生图，生视频仍在第二阶段计划中。

当前版本为 **v0.3.6**，已在 Windows 的 DSH **0.2.2-rc.3** 运行时验证。通过官网账号授权即可连接。

## 安装

桌面版：在 DSH 的“插件管理”页点击“添加插件”，选择安装第三方插件，填写：

```text
github:liangyu112212/dsh-aiyting-image-video#v0.3.6
```

按页面提示检查并安装。若 DSH 提示需要重启，先保存当前工作，再使用应用正常退出流程。

使用 CLI 管理普通 `web` profile 时，可执行：

```sh
dsh plugin --profile web add "github:liangyu112212/dsh-aiyting-image-video#v0.3.6"
```

`web` 可替换为自己使用的普通 profile。桌面用户可在插件管理页完成安装和升级。

此插件以 DSH bundle 通过 GitHub 标签分发，已收录于社区插件目录。[收录记录](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/11638)

## 连接与退出

1. 在 DSH 侧栏打开 AIyting，点「使用 AIyting 登录」，再点「前往官网确认」。
2. 登录官网，核对网页和插件显示的授权码，然后确认。回到插件即可查看连接结果。授权过期或拒绝后可以重新登录。
3. 账号连接成功后，页面显示可用点数、今日已用、每日上限和实际开放的能力。
4. 点击页面顶部“退出登录”清除本机共享连接，回到登录入口。待确认授权会取消，迟到结果不会重新登录。

密钥由 DSH 在本机管理，页面不会回显。相同 DSH home 中使用这份凭据的 profile 共用连接，退出时会一起失去访问权限。官网浏览器会话和官网授权在官网单独管理；需要彻底撤销密钥时，请在官网“AI 助手连接”中操作。

## 参数与生成

插件页按上下布局展示账号、默认参数和辅助信息，默认参数直接在页面内编辑。可选择模型、线路、比例、分辨率及张数，报价来自服务端。

- 保存参数不会生成图片或扣点。新对话继承默认参数，已有对话保留自己的选择。
- 对话输入框旁的参数入口只应用到当前对话。
- 生成前先查询报价；只读权限预设可能隐藏生成工具，需要由用户切换到允许相应写操作的预设。
- 价格、目录、线路状态和额度以服务端当前返回为准。

| 对话工具 | 作用 | 是否扣点 |
| --- | --- | --- |
| `aiyting_image_catalog` | 查询模型、线路与规格 | 否 |
| `aiyting_image_settings` | 读取、报价、保存参数 | 否 |
| `aiyting_image_generate` | 报价或提交图片生成 | 只有显式提交且服务端受理时 |
| `aiyting_image_task` | 查询、等待任务或找回本机台账 | 否 |

`aiyting_image_generate` 未传 `maxCredits` 时返回报价和 `clientRequestId`。用户确认后，使用相同的请求号与参数，并传入本次同意的点数上限。插件与服务端都会检查上限。如果提交时断线，请保留该请求号，使用相同参数重试。

任务记录按账号保存在本机。连接中断或重新打开对话后，可调用 `aiyting_image_task` 查询；不传任务号时会列出本机记录，并刷新部分未完成任务。同一请求号的重试用于找回原请求；失败退款后的新生成需要重新报价和提交。

## 升级与卸载

桌面版在插件管理页的“已安装插件”中卸载本插件。升级到后续 GitHub tag 时，先卸载，再填写新版本的精确来源重新安装，并按 DSH 提示重启。升级和卸载前应先结束需要保留的活动任务。

普通 `web` profile 的 CLI 卸载示例：

```sh
dsh plugin --profile web remove "@aiyting/dsh-image-video"
```

本版包名为 `@aiyting/dsh-image-video`。此前若装过 `@local/aiyting-ui`，请先卸载旧包，再安装本版，避免出现两个入口。卸载插件和清除官网授权是独立操作；如需撤销服务访问，请同时在官网管理密钥。

## 开发与验证

源码为原生 ES modules，不需要前端编译步骤。测试使用 Node.js 内置测试框架：

```sh
npm run check
npm test
```

集成测试使用真实 DSH 对话栏、原生工具执行器和官方 MCP 客户端，连接本地模拟服务。回归覆盖官网授权、完整模型目录、点数上限、请求号重试和任务退款。运行这些测试无需 AIyting 账号或点数。

没有安装 DSH 的环境会明确跳过相应集成测试，其余测试可独立运行。可通过 `DSH_RUNTIME_DIR` 指向已有 DSH runtime 目录来启用集成检查；本版测试使用 Node.js 22。

## 已知范围

- 本版提供图片生成；视频入口标记为“二期”。
- 点数卡和常用入口中的「充值」打开插件专用充值页。「计费说明」打开定价页。[官网充值](https://aiyting.com/recharge?client=dsh-plugin) · [计费说明](https://aiyting.com/pricing)
- 会话结果以 Markdown 图片、参数与任务提示呈现。
- 目前仅实测一个 DSH 版本，未声明所有版本或所有平台兼容。

## 参考与权利

插件通过 DSH 官方 MCP 客户端使用 AIyting 服务。主要运行时参考包括 MIT 许可的 `@deepseek-ai/dsh-mcp-client`、`@deepseek-ai/cordis`、`@deepseek-ai/dsh-client-connection` 和 `@modelcontextprotocol/client`，相关权利属于各自作者。本仓库不分发这些运行时的源码或安装包。

安装机制参考 [DSH 官方插件管理实现](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/README.md)。AIyting 名称与 Logo 为品牌标识，使用权以权利方许可为准。本仓库代码当前保留版权，具体见 [LICENSE](LICENSE)；公开源码不额外授予开源许可。
