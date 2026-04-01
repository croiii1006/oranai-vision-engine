# Billing 前端对接接口文档

作者：zpf

## 1. 文档说明

- 本文档基于 `oran-ai-billing/src/main/java/oran/ai/billing/controller` 包下当前已实现的用户侧接口整理。

## 2. 通用约定

### 2.1 鉴权

- 除特别说明外，本文所有接口都要求用户已登录。
- 请求头统一携带：

```http
Authorization: Bearer {token}
Content-Type: application/json
```

- 例外：
  - `GET /billing/journals`
  - `POST /billing/journals/page`

这两个分页接口虽然是用户侧接口，也需要登录，但参数不是 JSON Body，而是 URL Query 参数或表单参数。

### 2.2 统一响应结构

成功响应统一包裹为：

```json
{
  "code": "0",
  "msg": "ok",
  "success": true,
  "timestamp": 1710000000000,
  "data": {}
}
```

失败响应统一包裹为：

```json
{
  "code": "409",
  "msg": "当前已有有效订阅，请改用升级接口",
  "success": false,
  "timestamp": 1710000000000,
  "data": null,
  "bizCode": "BILLING_ACTIVE_SUBSCRIPTION_EXISTS"
}
```

字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `string` | 成功通常为 `0`；失败时通常为 HTTP 语义码字符串，例如 `400`、`401`、`404`、`409`、`500` |
| `msg` | `string` | 提示文案，适合展示，不建议前端用它做分支判断 |
| `success` | `boolean` | 是否成功 |
| `timestamp` | `number` | 服务端当前毫秒时间戳 |
| `data` | `object \| array \| string \| boolean \| null` | 业务数据 |
| `bizCode` | `string` | 仅失败时出现，前端应优先基于它做稳定分支判断 |

### 2.3 通用错误口径

| 场景 | `code` | `bizCode` | 说明 |
| --- | --- | --- | --- |
| 参数缺失、参数格式错误、校验失败 | `400` | `COMMON_BAD_REQUEST` | 例如 `itemCode` 为空、分页参数越界、请求体格式错误 |
| 未登录或登录过期 | `401` | `COMMON_UNAUTHORIZED` | 需要重新登录 |
| 无权限 | `403` | `COMMON_FORBIDDEN` | 当前 billing 接口暂无显式权限码，但沿用全局口径 |
| 业务语义错误 | `404/409/500` | `BILLING_*` | 例如订单不存在、不可升级、不可取消自动续费 |

### 2.4 ID 与时间字段约定

- 项目启用了大整数友好序列化。`Long` 类型字段如果超出 JS 安全整数范围，会被序列化为字符串。
- 前端请将所有 ID 字段都按“字符串 ID”处理，不要强依赖数值类型。
- `LocalDateTime` 字段统一按字符串返回，格式为：`yyyy-MM-dd HH:mm:ss`。

### 2.5 分页参数约定

分页对象来自 `PageQuery`，通用字段如下：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `page` | `number` | 否 | `1` | 页码，最小值为 `1` |
| `size` | `number` | 否 | `10` | 每页条数，范围 `1-1000` |
| `sort` | `string[]` | 否 | 无 | 框架通用排序参数，格式如 `sort=createTime,desc` |

账务流水接口的额外说明：

- `GET /billing/journals` 和 `POST /billing/journals/page` 当前共用同一个后端实现。
- 这两个接口当前都不接收 JSON Body。
- `sort` 在当前账务流水实现里没有被真正消费，返回结果固定按创建时间倒序，前端不要依赖自定义排序能力。

### 2.6 商品编码说明

- 三个结账接口都只接收一个 `itemCode`。
- 不同接口允许的商品编码范围不同，前端应以对应接口章节里的字段说明为准。
- 通用汇总见下方“当前仓库默认商品编码”。

### 2.7 当前仓库默认商品编码

- 以下清单来自仓库初始化数据，适合作为联调环境默认值参考。
- 它们本质上是商品目录数据，不是枚举。
- 如果测试库、生产库或运营后台后续调整了商品目录，应以后端实际数据为准。

| `itemCode` | 商品名称 | `itemType` | `planCode` | 积分数 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `subscription-starter-monthly` | Starter 月订阅 | `SUBSCRIPTION` | `starter_monthly` | `300` | Starter 套餐 |
| `subscription-starter-one-time` | Starter 一次性会员 | `SUBSCRIPTION` | `starter_one_time` | `300` | Starter 套餐，一次性购买后权益有效期 1 个月 |
| `subscription-pro-monthly` | Pro 月订阅 | `SUBSCRIPTION` | `pro_monthly` | `1200` | Pro 套餐 |
| `subscription-pro-one-time` | Pro 一次性会员 | `SUBSCRIPTION` | `pro_one_time` | `1200` | Pro 套餐，一次性购买后权益有效期 1 个月 |
| `credit-pack-small` | 加油包 200 | `CREDIT_PACK` | - | `200` | 一次性购买 200 积分 |
| `credit-pack-large` | 加油包 1000 | `CREDIT_PACK` | - | `1000` | 一次性购买 1000 积分 |

- 仓库里还给这些商品配置了默认 Airwallex 绑定，因此在本地默认配置下，它们也是后端优先支持的商品编码。
- Starter / Pro 是否走“订阅”还是“一次性”，不是靠名称判断，而是靠后端商品目录里的 `billingMode` 和 Airwallex 绑定里的 `checkout-mode` 判断：`SUBSCRIPTION -> SUBSCRIPTION`，`ONE_TIME -> PAYMENT`。

## 3. 接口总览

| 接口 | 方法 | 路径 | 需要登录 | 备注 |
| --- | --- | --- | --- | --- |
| 创建订阅结账 | `POST` | `/billing/checkouts/subscription` | 是 | 会员新购（订阅版或一次性版） |
| 创建升级结账 | `POST` | `/billing/checkouts/upgrade` | 是 | 会员升级，仅支持同模式升级 |
| 创建流量包结账 | `POST` | `/billing/checkouts/credit-pack` | 是 | 购买加油包 |
| 取消自动续费 | `POST` | `/billing/subscription/cancel-auto-renew` | 是 | 无请求体 |
| 查询订单详情 | `GET` | `/billing/orders/{orderId}` | 是 | 仅可查询当前用户自己的订单 |
| 获取我的计费摘要 | `GET` | `/billing/me/summary` | 是 | 返回套餐与积分摘要 |
| 查询账务流水 | `GET` | `/billing/journals` | 是 | 分页查询 |
| 分页查询账务流水 | `POST` | `/billing/journals/page` | 是 | 与 GET 语义一致，但仍不是 JSON Body |

## 4. 接口详情

## 4.1 创建订阅结账

- 方法：`POST`
- 路径：`/billing/checkouts/subscription`
- 说明：创建“会员新购”订单和结账单，既支持订阅版 Starter / Pro，也支持一次性版 Starter / Pro。

### 请求参数

请求体：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `itemCode` | `string` | 是 | 会员商品编码。当前仓库默认值可参考 `subscription-starter-monthly`、`subscription-starter-one-time`、`subscription-pro-monthly`、`subscription-pro-one-time`。该接口只接受 `itemType = SUBSCRIPTION` 的会员商品 |

请求示例：

```json
{
  "itemCode": "your-subscription-item-code"
}
```

### 响应 `data`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `orderId` | `string \| number` | 本地订单 ID，建议前端按字符串处理 |
| `orderNo` | `string` | 订单号 |
| `orderType` | `string` | 订阅版新购返回 `SUBSCRIPTION_NEW`；一次性会员新购返回 `MEMBERSHIP_ONE_TIME` |
| `orderStatus` | `string` | 创建成功后通常为 `CHECKOUT_CREATED` |
| `checkoutId` | `string` | 渠道结账单号 |
| `checkoutUrl` | `string \| null` | Airwallex 结账跳转地址；正常创建成功时通常非空 |
| `message` | `string` | 结账结果提示文案 |

响应示例：

```json
{
  "code": "0",
  "msg": "ok",
  "success": true,
  "timestamp": 1710000000000,
  "data": {
    "orderId": "8014753905961037835",
    "orderNo": "BO202603201530301A2B3C",
    "orderType": "SUBSCRIPTION_NEW",
    "orderStatus": "CHECKOUT_CREATED",
    "checkoutId": "ch_123456",
    "checkoutUrl": "https://payments.example.com/checkout/xxx",
    "message": "Checkout created successfully"
  }
}
```

### 前端对接说明

- 如果 `checkoutUrl` 非空，前端可直接跳转到该地址完成支付。
- 下单成功后建议前端保存 `orderId`，用于回查订单详情或支付结果页轮询。
- 订阅版会员最终生效依赖后续 `subscription.active` webhook；一次性会员最终生效依赖 `billing.checkout.completed` webhook。

### 主要错误码

| `bizCode` | `code` | 说明 |
| --- | --- | --- |
| `COMMON_UNAUTHORIZED` | `401` | 用户未登录 |
| `COMMON_BAD_REQUEST` | `400` | 请求体缺失、JSON 格式错误、`itemCode` 为空 |
| `BILLING_ACTIVE_SUBSCRIPTION_EXISTS` | `409` | 当前已有有效订阅，应改用升级接口 |
| `BILLING_SKU_NOT_FOUND` | `404` | 商品不存在 |
| `BILLING_SKU_TYPE_MISMATCH` | `409` | 商品不是订阅类商品 |
| `BILLING_CHECKOUT_CREATE_FAILED` | `500` | 调用支付网关创建结账单失败 |

## 4.2 创建升级结账

- 方法：`POST`
- 路径：`/billing/checkouts/upgrade`
- 说明：创建“会员升级”订单和结账单，当前仅支持订阅版到订阅版、一次性版到一次性版的同模式升级。

### 请求参数

请求体与订阅新购接口一致：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `itemCode` | `string` | 是 | 目标会员商品编码。当前仓库默认值可参考 `subscription-starter-monthly`、`subscription-starter-one-time`、`subscription-pro-monthly`、`subscription-pro-one-time`。该接口只接受 `itemType = SUBSCRIPTION` 的会员商品，且目标套餐必须高于当前套餐 |

### 响应 `data`

响应结构与“创建订阅结账”一致，区别在于：

| 字段 | 说明 |
| --- | --- |
| `orderType` | 订阅版升级返回 `SUBSCRIPTION_UPGRADE`；一次性会员升级返回 `MEMBERSHIP_ONE_TIME_UPGRADE` |

### 前端对接说明

- 当前用户必须存在有效会员，否则会直接失败。
- 目标套餐不能与当前套餐相同。
- 当前实现只允许从低套餐升级到高套餐。
- 当前实现不支持 `ONE_TIME -> SUBSCRIPTION` 或 `SUBSCRIPTION -> ONE_TIME` 的跨模式升级。
- 若当前是订阅版升级，接口仍会依赖现有渠道订阅 ID；如果后端订阅绑定数据缺失，会返回服务端错误。
- 若当前是一次性会员升级，旧会员不会走远程取消；剩余积分会在升级成功后结转到新的 1 个月有效期内。

### 主要错误码

| `bizCode` | `code` | 说明 |
| --- | --- | --- |
| `COMMON_UNAUTHORIZED` | `401` | 用户未登录 |
| `COMMON_BAD_REQUEST` | `400` | 请求体缺失、JSON 格式错误、`itemCode` 为空 |
| `BILLING_SUBSCRIPTION_UPGRADE_NOT_ALLOWED` | `409` | 没有可升级会员、跨模式升级、升级到同套餐、或目标套餐级别不高于当前套餐 |
| `BILLING_SKU_NOT_FOUND` | `404` | 商品不存在 |
| `BILLING_SKU_TYPE_MISMATCH` | `409` | 商品不是订阅类商品 |
| `BILLING_SUBSCRIPTION_PROVIDER_ID_MISSING_FOR_UPGRADE` | `500` | 当前有效订阅缺少渠道订阅 ID，后端无法升级订阅版会员 |
| `BILLING_CHECKOUT_CREATE_FAILED` | `500` | 调用支付网关失败 |

## 4.3 创建流量包结账

- 方法：`POST`
- 路径：`/billing/checkouts/credit-pack`
- 说明：创建“加油包购买”订单和结账单。

### 请求参数

请求体：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `itemCode` | `string` | 是 | 加油包商品编码。当前仓库默认值可参考 `credit-pack-small`、`credit-pack-large`。该接口只接受 `CREDIT_PACK` 类型商品 |

### 响应 `data`

响应结构与订阅结账一致，区别在于：

| 字段 | 说明 |
| --- | --- |
| `orderType` | 固定为 `CREDIT_PACK` |

### 前端对接说明

- 该接口不要求用户先有订阅。
- 支付成功后的积分发放由后端支付回调驱动，不在本接口内直接完成。

### 主要错误码

| `bizCode` | `code` | 说明 |
| --- | --- | --- |
| `COMMON_UNAUTHORIZED` | `401` | 用户未登录 |
| `COMMON_BAD_REQUEST` | `400` | 请求体缺失、JSON 格式错误、`itemCode` 为空 |
| `BILLING_SKU_NOT_FOUND` | `404` | 商品不存在 |
| `BILLING_SKU_TYPE_MISMATCH` | `409` | 商品不是加油包商品 |
| `BILLING_CHECKOUT_CREATE_FAILED` | `500` | 调用支付网关失败 |

## 4.4 取消自动续费

- 方法：`POST`
- 路径：`/billing/subscription/cancel-auto-renew`
- 说明：关闭当前有效订阅的自动续费标记，不会立刻终止当前订阅周期。

### 请求参数

- 无请求体。

### 响应 `data`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `boolean` | 通常为 `true`；表示接口已受理或当前本身就是非自动续费状态 |

响应示例：

```json
{
  "code": "0",
  "msg": "ok",
  "success": true,
  "timestamp": 1710000000000,
  "data": true
}
```

### 前端对接说明

- 这是“关闭下个周期自动续费”，不是“立即退订”。
- 如果当前订阅本身已经是 `autoRenew = false`，接口仍会返回成功，具备幂等性。

### 主要错误码

| `bizCode` | `code` | 说明 |
| --- | --- | --- |
| `COMMON_UNAUTHORIZED` | `401` | 用户未登录 |
| `BILLING_SUBSCRIPTION_CANCEL_NOT_ALLOWED` | `409` | 当前没有可取消自动续费的有效订阅 |
| `BILLING_SUBSCRIPTION_PROVIDER_ID_MISSING_FOR_CANCEL` | `500` | 当前订阅缺少渠道订阅 ID，后端无法调用取消续费 |

## 4.5 查询订单详情

- 方法：`GET`
- 路径：`/billing/orders/{orderId}`
- 说明：查询当前登录用户自己的订单详情。

### 路径参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `orderId` | `string \| number` | 是 | 订单 ID，建议前端按字符串传递 |

### 响应 `data`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string \| number` | 订单 ID |
| `orderNo` | `string` | 订单号 |
| `orderType` | `string` | 订单类型，见“值域速查” |
| `status` | `string` | 订单状态，见“值域速查” |
| `itemCode` | `string` | 商品编码 |
| `itemName` | `string \| null` | 商品名称 |
| `planCode` | `string \| null` | 套餐编码 |
| `checkoutId` | `string \| null` | 渠道结账单号 |
| `paymentProvider` | `string \| null` | 支付渠道，当前主要为 `AIRWALLEX` |
| `paymentStatus` | `string \| null` | 支付状态 |
| `snapshotJson` | `object \| null` | 订单快照，动态结构，不建议前端做强 schema 绑定 |
| `paymentRawJson` | `object \| null` | 支付渠道原始快照，动态结构 |
| `paidTime` | `string \| null` | 支付时间，格式 `yyyy-MM-dd HH:mm:ss` |
| `createTime` | `string \| null` | 创建时间，格式 `yyyy-MM-dd HH:mm:ss` |

### 前端对接说明

- 当前接口只返回当前用户自己的订单；如果订单不存在，或者订单属于别人，后端都统一返回 `BILLING_ORDER_NOT_FOUND`。
- `snapshotJson`、`paymentRawJson` 是透传对象，字段集合可能随支付网关或商品配置变化，不建议前端据此做强校验。
- 如果前端只关心支付结果，优先看 `status` 与 `paymentStatus`。

### 主要错误码

| `bizCode` | `code` | 说明 |
| --- | --- | --- |
| `COMMON_UNAUTHORIZED` | `401` | 用户未登录 |
| `BILLING_ORDER_NOT_FOUND` | `404` | 订单不存在或不属于当前用户 |

## 4.6 获取我的计费摘要

- 方法：`GET`
- 路径：`/billing/me/summary`
- 说明：返回当前登录用户的积分摘要和订阅摘要。

### 响应 `data`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `subscriptionCredits` | `number` | 订阅积分余额 |
| `giftCredits` | `number` | 赠送积分余额 |
| `packCredits` | `number` | 加油包积分余额 |
| `totalCredits` | `number` | 总可用积分 |
| `membershipPlan` | `string` | 当前会员计划；无订阅时通常为 `free` |
| `subscriptionStatus` | `string` | 订阅状态，见“值域速查” |
| `autoRenew` | `boolean` | 是否自动续费 |
| `subscriptionEndTime` | `string \| null` | 当前订阅到期时间，格式 `yyyy-MM-dd HH:mm:ss` |

响应示例：

```json
{
  "code": "0",
  "msg": "ok",
  "success": true,
  "timestamp": 1710000000000,
  "data": {
    "subscriptionCredits": 120,
    "giftCredits": 100,
    "packCredits": 50,
    "totalCredits": 270,
    "membershipPlan": "free",
    "subscriptionStatus": "FREE",
    "autoRenew": false,
    "subscriptionEndTime": null
  }
}
```

### 前端对接说明

- 当前接口不会返回内部 DTO 中的 `frozenCredits`，前端不要依赖该字段。
- 用户没有有效订阅时，后端会返回：
  - `membershipPlan = free`
  - `subscriptionStatus = FREE`
  - `autoRenew = false`
  - `subscriptionEndTime = null`

### 主要错误码

| `bizCode` | `code` | 说明 |
| --- | --- | --- |
| `COMMON_UNAUTHORIZED` | `401` | 用户未登录 |

## 4.7 查询账务流水（GET）

- 方法：`GET`
- 路径：`/billing/journals`
- 说明：分页查询当前用户账务流水。

### 请求参数

通过 Query 参数传递：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `accountType` | `string` | 否 | 账户类型：`SUBSCRIPTION`、`GIFT`、`PACK` |
| `direction` | `string` | 否 | 流水方向：`INCREASE`、`DECREASE` |
| `page` | `number` | 否 | 页码，默认 `1` |
| `size` | `number` | 否 | 每页条数，默认 `10`，范围 `1-1000` |
| `sort` | `string[]` | 否 | 当前实现不生效，前端不要依赖 |

请求示例：

```text
GET /billing/journals?accountType=PACK&direction=INCREASE&page=1&size=10
```

### 响应 `data`

`data` 为分页对象：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `list` | `BillingJournalResp[]` | 当前页记录 |
| `total` | `number` | 总记录数 |

`list` 中每条记录字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string \| number` | 流水 ID |
| `direction` | `string` | `INCREASE` 或 `DECREASE` |
| `title` | `string` | 业务事项文案，例如“加油包充值”“赠送积分发放” |
| `credits` | `number` | 变动积分数量，后端已取绝对值，前端不需要再取正负 |
| `occurredTime` | `string` | 发生时间，格式 `yyyy-MM-dd HH:mm:ss` |

### 前端对接说明

- 返回结果固定按创建时间倒序。
- `credits` 字段始终是正数，增减方向由 `direction` 表达。
- `title` 是后端根据业务动作映射出的展示文案，前端通常可直接展示。

### 主要错误码

| `bizCode` | `code` | 说明 |
| --- | --- | --- |
| `COMMON_UNAUTHORIZED` | `401` | 用户未登录 |
| `COMMON_BAD_REQUEST` | `400` | `page/size` 非法，或 `direction` 不是支持值 |

## 5. 值域速查

### 5.1 订单类型 `orderType`

| 值 | 说明 |
| --- | --- |
| `SUBSCRIPTION_NEW` | 新购订阅订单 |
| `MEMBERSHIP_ONE_TIME` | 新购一次性会员订单 |
| `SUBSCRIPTION_UPGRADE` | 升级订阅订单 |
| `MEMBERSHIP_ONE_TIME_UPGRADE` | 升级一次性会员订单 |
| `CREDIT_PACK` | 加油包订单 |
| `RENEWAL` | 订阅续费订单 |

### 5.2 订单状态 `orderStatus` / `status`

| 值 | 说明 |
| --- | --- |
| `CREATED` | 已创建 |
| `CHECKOUT_CREATED` | 已生成结账单 |
| `PAID` | 已支付 |
| `CANCELED` | 已取消 |
| `FAILED` | 已失败 |

### 5.3 支付状态 `paymentStatus`

| 值 | 说明 |
| --- | --- |
| `PENDING` | 待支付 |
| `SUCCEEDED` | 支付成功 |
| `FAILED` | 支付失败 |

### 5.4 订阅状态 `subscriptionStatus`

| 值 | 说明 |
| --- | --- |
| `FREE` | 免费版 |
| `ACTIVE` | 生效中 |
| `CANCELED` | 已取消 |
| `PAST_DUE` | 已逾期 |

### 5.5 账户类型 `accountType`

| 值 | 说明 |
| --- | --- |
| `SUBSCRIPTION` | 订阅周期积分 |
| `GIFT` | 免费赠送积分 |
| `PACK` | 加油包购买积分 |

### 5.6 流水方向 `direction`

| 值 | 说明 |
| --- | --- |
| `INCREASE` | 新增 |
| `DECREASE` | 减少 |

### 5.7 支付渠道 `paymentProvider`

| 值 | 说明 |
| --- | --- |
| `AIRWALLEX` | Airwallex 支付 |

## 6. 业务错误码速查

| `bizCode` | `code` | 说明 |
| --- | --- | --- |
| `BILLING_ACTIVE_SUBSCRIPTION_EXISTS` | `409` | 当前已有有效订阅，请改用升级接口 |
| `BILLING_SUBSCRIPTION_UPGRADE_NOT_ALLOWED` | `409` | 当前会员不支持升级，或目标套餐不满足同模式升档要求 |
| `BILLING_SUBSCRIPTION_CANCEL_NOT_ALLOWED` | `409` | 当前没有可取消自动续费的订阅 |
| `BILLING_SUBSCRIPTION_PROVIDER_ID_MISSING_FOR_UPGRADE` | `500` | 当前有效订阅缺少渠道订阅 ID，无法升级订阅版会员 |
| `BILLING_SUBSCRIPTION_PROVIDER_ID_MISSING_FOR_CANCEL` | `500` | 当前有效订阅缺少渠道订阅 ID，无法取消自动续费 |
| `BILLING_ORDER_NOT_FOUND` | `404` | 订单不存在，或不属于当前用户 |
| `BILLING_SKU_NOT_FOUND` | `404` | 商品不存在 |
| `BILLING_SKU_TYPE_MISMATCH` | `409` | 商品类型不匹配 |
| `BILLING_CHECKOUT_CREATE_FAILED` | `500` | 创建结账单失败 |

## 7. 非前端接口说明

- `POST /billing/webhooks/airwallex` 位于同一个 controller 包下，但该接口是支付渠道回调入口。
- 该接口使用原始请求体和签名头完成验签、事件落库与状态同步，不属于前端对接范围。
