# @autoai/contracts

AutoAiArticle 跨服务契约包：8 个拆分服务的唯一共享"语言定义"。

服务之间只通过 HTTPS + HMAC 签名通信。本包是它们共享的事件 schema、HMAC 签名/验签纯函数、错误码分类与幂等键规则。

> 本包只被"安装"，不被"运行"：不部署 Worker、无数据库、无业务逻辑（评分、准入、决策）。

## 安装

```bash
# git tag 依赖方式（起步阶段）
npm install git+https://github.com/<org>/AutoAiArticle-Contracts.git#v0.1.0

# 本地联调
npm link
```

> **依赖说明**：`zod` 以 `dependencies`（`^3.24`）声明，随本包一起安装，消费方**无需**自行安装 zod（与 Scanner 工程一致）。

## 内容

- **事件 schema（zod v3）**：7 个事件，字段逐字段取自 Scanner / 主工程真实代码
  - `hotspot-candidate`（Scanner → Materials）
  - `qualified-event`（Materials → 内部事件入站，保留主工程 pydantic 语义）
  - `writing-request`（Materials → Writer）
  - `quality-verdict`（QualityGate → Writer）
  - `image-request` / `image-response`（Writer → ImageGen）
  - `publish-request`（Writer → Publisher）
  - `candidate-feedback`（Writer/Publisher → Scanner）
- **HMAC**：`buildCanonicalString` / `computeSignature` / `sha256Hex` / `signRequest` / `verifyRequest`，与主工程 `app/core/security.py` 逐字节对齐（含常量时间比较）
- **错误码与重试**：`ERROR_CODES` / `classifyHttpStatus` / `retryDelaySeconds`，照搬 Scanner `state-machine.ts`
- **幂等键**：`candidateIdempotencyKey` / `writingIdempotencyKey` / `validateIdempotencyKeyFormat`
- **版本常量**：`SUPPORTED_SCHEMA_VERSIONS`
- **golden fixtures**：每个事件 ≥1 valid + ≥1 invalid 样本，双向校验测试强制

## 消费方接入示例

```ts
import { hotspotCandidateSchema, verifyRequest } from '@autoai/contracts';

// keys 来自服务自身的 Secret/配置（对应主工程 settings.inbound_event_hmac_keys）
const keys = JSON.parse(env.INBOUND_EVENT_HMAC_KEYS); // { "cf-hotspot-v1": "<secret>" }

app.post('/api/v1/hotspot-candidates', async (c) => {
  const body = new Uint8Array(await c.req.arrayBuffer());
  const v = await verifyRequest({
    keys,
    method: 'POST',
    path: '/api/v1/hotspot-candidates',
    body,
    headers: c.req.header(),
    toleranceSeconds: 300,
    maxBodyBytes: 262144
  });
  if (!v.ok) return c.json({ error: { code: v.code, retryable: false } }, statusOf(v.code));
  const event = hotspotCandidateSchema.parse(c.req.json());
  // ... 业务
});
```

## 开发

```bash
npm install
npm run verify   # format + lint + typecheck + test + build 全绿
```

## 发版流程

改 schema → 测试 → `git tag v0.x.0` → 消费方升级，全程不超过 10 分钟人工操作。

### 三问纪律（schema 变更必答）

1. 影响面：哪些服务消费此事件？
2. 兼容性判定：minor 还是 major？依据？
3. 迁移路径：major 时旧版如何保留、消费方分几批升级？

## 关键语义决策

- `schema_version` 类型按事件独立：hotspot-candidate 等新契约用 number literal `1`，qualified-event 用 string `"1.0"`（各自沿用来源系统语义）。
- `observed.hot_value` 为三态（键缺失 / number / null），zod 定义为 `.nullable().optional()`。
- 所有 datetime 字段强制带时区偏移（`offset: true`）。
- HMAC 验签顺序不可调换（见 `src/auth/hmac.ts`）。
- 本包不做运行时 SSRF 防护（NFR-1 禁副作用）；仅做 URL 语法级拒绝。
- `retryDelaySeconds` 的 `rate_limited` + `retryAfter=0` 会返回 `0`（公式 `ceil(0 * …)` 无下限），语义为"立即重试"，**不是**"不重试"——这与 `retryAfter≥0` 时走 Retry-After 分支的设计一致。
