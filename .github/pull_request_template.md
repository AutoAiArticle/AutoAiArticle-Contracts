### 变更类型

- [ ] 新增事件 schema
- [ ] 修改现有 schema（判定：minor / major）
- [ ] 纯函数/工具
- [ ] fixtures
- [ ] CI/工程化

### 三问（schema 变更必答）

1. 影响面：哪些服务消费此事件？
2. 兼容性判定：minor 还是 major？依据？
3. 迁移路径：major 时旧版如何保留、消费方分几批升级？

### 纪律自查

- [ ] 本包只含类型与纯函数，无业务逻辑、无副作用
- [ ] 每个新增/变更的事件有 valid + invalid fixtures
