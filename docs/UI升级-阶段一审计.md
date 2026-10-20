# UI 升级阶段一审计

## 页面与导航

- 主包业务页共 9 个：`home`、`profile`、`settings`、`shopping`、`pantry`、`detail`、`prep`、`cook`、`complete`。
- 自定义 TabBar 仅包含“主页”和“我的”。
- 主流程：主页/食材匹配 → 菜谱详情 → 备菜 → 分步烹饪 → 完成页。
- 设置、标签和过敏原共用 `settings` 页面；日报、周报、收藏、历史和营养趋势均为 `profile` 内部区块。
- `active-cooks` 在各页面提供进行中菜品的跨页面入口。

## 公共组件

- `active-cooks`：多菜任务浮层。
- `ingredient-image`：食材图及失败占位。
- `nutrition-card`：营养估算。
- `tutorial`：九类业务页面的首次使用引导。

## 关键状态

- 首页：搜索展开、无结果、收藏、过敏原警示、进行中任务。
- 食材匹配：搜索建议、无匹配、空选择、可做/接近可做、缺料、过敏原警示。
- 烹饪：图片加载/失败、计时待开始/运行/暂停/完成、跳步确认、三种退出选择、重定向失败。
- 教程：首次显示、逐页完成、全部跳过、设置页重新开启。

## 数据兼容边界

保留存储键：`zaobian_favorites_v1`、`zaobian_settings_v1`、`zaobian_sessions_v1`、`zaobian_history_v1`、`zaobian_shopping_list_v1`、`zaobian_tutorial_v1`。

## 资源与风险

- 菜品图分为 4 个资源分包，步骤图分为 12 个资源分包。
- 项目启用 `lazyCodeLoading: requiredComponents`。
- `assets/branding` 被打包配置排除，因此正式角色资源放在 `assets/characters`。
- 旧样式存在大量直接色值和字符图标；阶段二先建立语义令牌，并处理三个示范页面及 TabBar。

## 阶段二范围

修改首页、按食材找菜、分步烹饪，以及它们直接依赖的主题样式、教程、自定义 TabBar和角色示范素材。不改变页面路径、事件绑定、业务算法和存储结构。
