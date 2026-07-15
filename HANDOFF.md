# ZlabScholar 项目交接文档

> 最后更新：2026-07-15（Asia/Shanghai）  
> 工作目录：`C:\Users\13557\Desktop\zlabscholar`  
> 本文面向完全不了解历史的后续开发者或 AI，请先完整阅读，再修改代码。

## 1. 我们在做什么

ZlabScholar 是一个为 Zlab 课题组开发的轻量级成员与学术成果展示平台。目前目标不是完整的科研管理系统，而是先完成：

1. 课题组成员首页，按教师、博士生、研究生分组。
2. 每位成员的独立个人主页。
3. 按作者自动归集论文，展示论文、引用数、年份、DOI 和详情。
4. 支持成员头像在浏览器本地上传、裁剪、压缩和保存。
5. 后续再扩展真正的成员管理、论文上传、持久化、登录权限和引用数据同步。

当前产品仍是前端演示原型。论文和成员信息主要硬编码在 `src/App.jsx` 中，没有数据库或后端管理接口。

## 2. 技术栈与真实入口

- React `19.2.6`
- React DOM `19.2.6`
- Vite `8.1.4`
- Node.js `24.18.0`
- npm `11.16.0`
- Windows / PowerShell

项目已移除站点平台专用部署配置和未使用的 Next.js 遗留入口，当前实际运行方式是 **Vite，不是 Next.js**：

- HTML 入口：`index.html`
- React 入口：`src/main.jsx`
- 主应用：`src/App.jsx`
- 全局样式：`app/globals.css`

不要因为看到 `app/` 目录就按 Next.js 项目改造或启动。

## 3. 启动、构建与停止

### 开发模式

```powershell
cd C:\Users\13557\Desktop\zlabscholar
npm install
npm run dev
```

默认访问：

```text
http://localhost:5173/
```

### 构建

```powershell
npm run build
```

构建脚本不是默认的 `vite build`，而是 `scripts/build-sites.js`。它会：

1. 将 Vite 前端产物构建到 `dist/public`。
2. 将本地论文复制到 `dist/public/papers`。
3. 生成 `dist/server/index.js`，由 Node 直接读取 `dist/public` 中的静态文件，适合通用云服务器部署。

### 生产模式

```powershell
npm start
```

默认访问：

```text
http://localhost:3000/
```

### 当前运行状态

交接时开发服务器仍在运行：

- PID：`28992`
- 地址：`http://localhost:5173/`

停止它：

```powershell
Stop-Process -Id 28992
```

如果 PID 已变化，使用：

```powershell
Get-Process -Name node
```

## 4. 当前页面与路由

目前没有安装 React Router，使用 URL hash 和组件状态手工切换页面。

| 页面 | 地址 |
|---|---|
| 成员首页 | `http://localhost:5173/#members` |
| 申童童 | `http://localhost:5173/#tongtong-shen` |
| 王新尧 | `http://localhost:5173/#xinyao-wang` |
| 郑文 | `http://localhost:5173/#wen-zheng` |
| 李卓杭 | `http://localhost:5173/#zhuohang-li` |
| 袁易 | `http://localhost:5173/#yi-yuan` |

导航行为：

- 点击左上角 ZlabScholar 返回成员首页。
- 顶部“课题组成员”按钮返回成员首页。
- 点击成员卡片头像或姓名进入个人主页。
- 论文作者列表中，已经建档的中英文作者姓名可以点击进入个人主页。
- `openProfile()` 与 `openMembers()` 使用 `history.replaceState()` 修改 hash。
- 所有成员主页的研究方向统一由 `ResearchLinks` 组件渲染，方向右侧带低对比度阴影样式的“修改方向”入口；当前点击仅显示待接入提示，尚未持久化编辑。

已知限制：没有监听 `hashchange` / `popstate`，浏览器前进后退行为不完整。后续应改为正式路由。

## 5. 已完成的成员首页

成员首页按以下三组硬编码在 `src/App.jsx` 的页面 JSX 中；分组不是根据 `role` 自动计算的：

### 教师

- 王新尧 / Xinyao Wang
- 郑文 / Wen Zheng

### 博士生

- 申童童 / Tongtong Shen
- 李卓杭 / Zhuohang Li
- 袁易 / Yi Yuan

### 研究生

- 当前为空，显示“成员信息待添加”。

成员卡片已经按用户要求改成紧凑横向布局：

- 左侧小头像。
- 右侧只显示中英文姓名和研究领域。
- 不在成员首页卡片中显示单位和邮箱。
- 点击头像或姓名进入个人主页。

## 6. 当前成员资料

成员数据定义在 `src/App.jsx` 的 `profiles` 常量中。

### 申童童 / Tongtong Shen

- 中文名：申童童
- 身份：数据科学方向博士研究生
- 单位：College of Artificial Intelligence, Taiyuan University of Technology
- 邮箱：`2024319017@link.tyut.edu.cn`
- ORCID：`https://orcid.org/0009-0004-5900-4556`
- 研究领域：Complex Systems、Amorphous Materials、AI for Science
- 当前自动归集论文：6 篇

### 王新尧 / Xinyao Wang

- 中文名：王新尧
- 身份：教师
- 单位：Key Laboratory for Satellite Digitalization Technology, Innovation Academy for Microsatellites of Chinese Academy of Sciences
- 单位官网：`https://www.microsate.ac.cn/`
- 邮箱：`wangxinyao@microsate.ac.cn`
- ORCID：`https://orcid.org/0009-0001-3326-7030`
- 研究领域：Systems Engineering、Manned/Unmanned Collaboration、Computer Vision
- 当前自动归集论文：11 篇（包含 `papers/wangxinyao` 中录入的 6 篇，以及郑文目录中与王新尧共同署名的 2 篇新论文）

### 郑文 / Wen Zheng

- 身份：研究员、副主任
- 单位：Key Laboratory for Satellite Digitalization Technology, Innovation Academy for Microsatellites of Chinese Academy of Sciences
- 单位官网：`https://www.microsate.ac.cn/`
- 邮箱：`zhengwen@microsate.ac.cn`
- 个人主页：`https://microsate.cas.cn/sourcedb/zw/gbzjrc/jcqn/202404/t20240403_7075517.html`
- ORCID：`https://orcid.org/0000-0002-6570-6245`
- 研究领域根据现有论文暂设为 Machine Learning、AI for Science、Computer Vision。
- 当前自动归集论文：23 篇。

### 李卓杭 / Zhuohang Li

- 身份：博士研究生
- 当前单位、邮箱尚未提供，页面使用“待补充”。
- ORCID：`https://orcid.org/0009-0007-9834-1370`
- 研究领域根据现有论文暂设为 Computer Vision、Remote Sensing、AI for Science。
- 当前自动归集论文：2 篇。

### 袁易 / Yi Yuan

- 英文名 `Yi Yuan` 是按中文名暂定，尚未由用户确认。
- 身份：博士研究生
- 单位、邮箱、研究方向均待补充。
- 未找到能够排除同名并可靠对应本人的 ORCID，页面不显示 ORCID 链接。
- 当前没有论文记录，主页显示 0 篇。

## 7. 论文数据与展示规则

论文数据定义在 `src/App.jsx` 的 `initialPapers` 数组中，目前共 29 条。

### 自动归集逻辑

`profilePapers` 会把论文作者按英文逗号或中文逗号拆分，再匹配当前成员的英文名或中文名。

`authorList()` 负责把已经存在于 `profiles` 中的作者渲染为可点击按钮。

### 当前展示格式

- 列表为“选择框 / 标题与作者期刊 / 引用次数 / 年份”的表格化布局。
- 作者必须显示全名，不允许缩写为首字母。
- 关键词用于搜索，但不在论文卡片下方显示。
- 期刊名使用类似旧关键词标签的浅灰色块样式。
- 期刊名只显示期刊名称，不附带卷号、期号和页码。
- DOI 和摘要在详情弹窗中显示。
- 已建档作者姓名可以点击进入成员主页。

### 摘要数据

- 29 篇内置论文均已补成完整的多句摘要，不再使用一句话占位简介。
- 页面实际使用 `src/App.jsx` 中的 `fullPaperAbstracts`，初始化论文状态时按 `id` 覆盖 `initialPapers` 里原来的短摘要。
- 有本地 PDF 的论文优先依据原文摘要整理；中文论文保留中文，英文论文保留英文。
- 没有本地 PDF 的论文依据 DOI/出版社公开页面整理，避免凭标题扩写。
- 详情弹窗已有 `max-height: 90vh` 和内部滚动，长摘要在桌面及移动端不会撑出视口。

### 中文论文规则

以下 3 篇是中文期刊的中文论文，平台必须保持中文，不得改成 PDF 中附带的英文翻译：

1. 《有人机/无人机编队协同作战决策系统架构设计》
2. 《基于DoDAF的有人/无人机协同作战体系结构建模》
3. 《面向复杂系统需求分析的DSL构建》

它们的标题、作者、期刊、摘要和关键词均已使用中文。

## 8. `papers/wangxinyao` 文献目录

目录中有 6 个原始 PDF，已统一为：

```text
作者_年份_期刊_标题.pdf
```

当前文件：

1. `王新尧_2020_无人系统技术_有人机无人机编队协同作战决策系统架构设计.pdf`
2. `王新尧_2020_系统工程与电子技术_基于DoDAF的有人无人机协同作战体系结构建模.pdf`
3. `王新尧_2022_系统工程与电子技术_面向复杂系统需求分析的DSL构建.pdf`
4. `王新尧_2024_Aerospace_An Optimization Method for Manned-Unmanned Aerial Vehicle Collaborative Operation System Architecture Based on PGQNSGA-II.pdf`
5. `王新尧_2025_IEEE Aerospace and Electronic Systems Magazine_Evaluation of Crewed-Uncrewed Aerial Vehicle Collaborative Operation System Effectiveness Based on AMC-HFADC.pdf`
6. `王新尧_2026_Arabian Journal for Science and Engineering_CT-Mono Leveraging CNNs and Transformers for Self-Supervised Depth Estimation in Single-View Scenarios.pdf`

这些 PDF 保存在 `papers/` 中。开发服务器通过受限的 `/papers/` 路由读取本地文件；生产构建会把它们复制到 `dist/public/papers`，由 Node 静态资源服务器读取，因此网页可以直接下载已登记的本地 PDF。

为读取 PDF，开发环境用户级 Python 中安装过 `pypdf 6.14.2`；它不是项目运行依赖，也没有写进 `package.json`。

### `papers/zhengwen` 文献目录

目录中有 18 个 PDF。两份 `Plug-and-Play PPO` 文件的 SHA-256 完全相同，因此平台只录入一次；其余文件共形成 17 条唯一论文记录。文件名前缀日期不一定是正式出版时间，平台以论文首页和 DOI 登记元数据为准，例如 YOLO-SEA 与 MCAUnet 均按正式出版年份 2025 展示。

新增论文的引用量统一按 Crossref `is-referenced-by-count` 口径于 2026-07-15 核对，并记录 `citationSource` 与 `citationUpdatedAt`。Crossref 未稳定收录的 3 篇中文论文使用 `null`，页面显示 `—`，没有误写为 0。

## 9. 引用数据现状

引用数据仍然是硬编码的，不会自动更新。

当前规则：

- 数字表示已经通过公开网站核对过的值。
- `null` 表示当前引用库没有稳定收录，页面显示 `—`。
- 不得把“未查询/未收录”写成 `0`。
- 郑文目录新增论文采用 Crossref 统一口径，最近核对日期为 2026-07-15；页面统计区和论文详情会显示核对日期。

王新尧目录文献当前值：

| 论文 | 引用数 |
|---|---:|
| 3 篇中文论文 | `null`，页面显示 `—` |
| PGQNSGA-II（Aerospace 2024） | 3 |
| AMC-HFADC（IEEE 2025） | 2 |
| CT-Mono | 0 |

页面说明文字必须保持为：

```text
引用数据来自公开网站，未收录显示“—”
```

统计卡片只对有限数字进行计算，标签已经改为“已收录引用”“h-index（已收录）”“i10（已收录）”，避免把不完整数据冒充完整统计。

后续正确方向是增加引用来源、更新时间和定期同步，而不是继续手工猜数字。

## 10. 头像上传功能

个人主页头像支持上传：

- 支持 JPG、PNG、WebP。
- 原始文件最大 10 MB。
- 上传后居中裁剪为正方形。
- 最大输出 640×640。
- 使用高质量图像平滑。
- 输出 WebP，质量 0.9。
- 小图不会被强制放大。
- 头像保存在浏览器 `localStorage`，没有上传到服务器。

相机按钮交互要求：

- 默认完全隐藏。
- 只有鼠标进入头像圆形区域时，底部深灰遮罩和白色“加号相机”才出现。
- 鼠标离开头像后立即消失。
- 页面其他位置不能触发相机遮罩。

本地存储键：

```text
zlab-theme
zlab-avatar-${profileKey}
zlab-avatar                 # 申童童旧头像兼容键
```

风险：`localStorage` 容量有限。保存失败时当前页面仍显示头像，但刷新后可能丢失。生产版本应改为服务器对象存储。

## 11. 其他已完成功能

- 亮色/暗色主题，并保存到 `localStorage`。
- 暗色主题使用低对比度灰黑背景和低饱和紫色，减少高亮与发光感；主题切换按钮使用独立的柔和圆角底色。
- 顶部导航不显示“登录”入口，保留课题组成员与成果管理入口。
- 全局论文搜索。
- 按年份筛选。
- 论文列表分页，每页最多显示 10 篇；搜索、年份筛选、排序或切换成员时自动回到第 1 页。
- 论文表头支持按年份和引用次数排序：默认年份降序 `↓`，再次点击切换升序 `↑`；切换排序字段时箭头只显示在当前字段，未收录引用始终排在数值记录之后。
- 每篇论文右侧显示下载按钮；存在 `pdfAsset` 的论文直接下载 `papers/` 中的本地 PDF，没有本地文件时按钮保持可见但禁用。
- 论文详情弹窗。
- DOI 外链。
- 开放获取标识和比例。
- 引用柱状图。
- 合作者卡片和部分成员主页跳转。
- 主要合作者根据当前成员论文作者自动统计；郑文显示合作篇数最高的前 8 位，其他成员显示前 3 位，已建档成员可点击进入主页。
- 添加论文演示表单。
- 响应式桌面、平板、手机布局。
- 单位链接下划线设置为连续显示：`text-decoration-skip-ink: none`。

## 12. 现在卡在哪里

### 12.1 没有后端和持久化

- 成员和论文都硬编码在 `src/App.jsx`。
- “添加论文”只修改 React 内存，刷新即丢失。
- 头像只存在当前浏览器。
- 没有真正的 PDF 上传、文件管理或数据库。

### 12.2 个人资料不完整

- 李卓杭、袁易缺少准确单位、邮箱等信息；郑文的研究领域仍为根据现有论文暂设。
- 袁易英文名尚未确认。
- 不要自行搜索到同名人员后直接填入，必须由用户确认身份。

### 12.3 引用数据不完整

- 没有自动同步。
- 中文文献在国际引用库中可能无法稳定匹配。
- 不同来源的引用量口径不同。
- 当前统计只是“已收录范围”，不是完整 Google Scholar 指标。

### 12.4 作者身份模型过于简单

当前仅按姓名字符串匹配论文。相同英文名的不同作者可能被错误合并，尤其是 `Xinyao Wang` 这类可能存在同名的姓名。

生产数据模型必须为成员和论文作者建立稳定 ID，不要继续只依赖名字。

### 12.5 路由不完整

- 当前是手工 hash 路由。
- 前进/后退、刷新、404、分享链接行为未系统测试。
- 应迁移到 React Router 或正式框架路由。

### 12.6 工程结构需要重构

- `src/App.jsx` 已经很长，成员、论文、业务函数和全部 JSX 混在一个文件。
- `app/globals.css` 只有约 17 个物理行，大量 CSS 压缩在超长单行中，后续修改容易出现级联覆盖问题。
- 样式文件尾部存在多轮需求产生的覆盖规则；不要只看前面定义就判断最终效果。
- 没有 ESLint、Prettier、单元测试或端到端测试。

### 12.7 版本控制

当前目录已初始化为 Git 仓库，默认分支为 `main`，仅使用本地版本控制，没有配置远程仓库。Git 本地身份为 `tongtong <1355718091@qq.com>`。本次可用版本计划以 `[0715] 21:06项目功能完善` 提交，包含成员页、郑文文献、完整摘要、排序分页、本地 PDF 下载、主题 UI、复用研究方向入口以及通用云服务器构建支持。后续修改应保持提交边界清晰，避免把无关改动混入同一提交。

## 13. 推荐的下一步顺序

### 优先级 1：确认数据

向用户确认：

1. 郑文的研究领域。
2. 李卓杭的单位、邮箱、研究领域。
3. 袁易的英文名、单位、邮箱、研究领域。
4. 原有 3 篇包含 `Xinyao Wang` 的论文是否确属王新尧，避免同名作者混淆。
5. 引用数据最终采用哪个来源和口径。

### 优先级 2：拆分数据与组件

建议至少拆成：

```text
src/data/profiles.js
src/data/papers.js
src/components/MemberHome.jsx
src/components/ProfileHeader.jsx
src/components/PaperList.jsx
src/components/StatsPanel.jsx
src/components/AvatarUploader.jsx
src/components/PaperModal.jsx
```

同时把 CSS 格式化并按组件拆分。Git 基线已经建立，重构时应按阶段提交。

### 优先级 3：建立正式数据模型

建议核心字段：

- `member.id`
- `member.slug`
- `paper.id`
- `paper.authors[].memberId`
- `paper.authors[].displayName`
- `paper.titleOriginal`
- `paper.language`
- `paper.citationCount`
- `paper.citationSource`
- `paper.citationUpdatedAt`
- `paper.pdfAsset`

中文论文必须区分原始题名和可选英文题名，页面默认展示原始语言。

### 优先级 4：后端与管理能力

- 登录和角色权限。
- 成员 CRUD。
- 论文 CRUD。
- PDF 上传与对象存储。
- 头像上传与服务端裁剪。
- 数据库持久化。
- DOI 元数据导入。
- 引用数据定时同步。

### 优先级 5：路由、测试与部署

- 正式路由。
- 数据校验。
- 组件测试。
- 关键路径端到端测试。
- 构建和部署文档。
- 可访问性检查。

## 14. 绝对不能踩的坑

1. **不要把项目当成 Next.js。** 当前是 Vite。
2. **不要直接编辑 `dist/`。** 它是构建产物且已在 `.gitignore` 中，修改源文件后重新构建。
3. **不要把中文论文翻译后替换原文展示。** 3 篇中文论文必须显示中文标题、作者、期刊和摘要。
4. **不要把未知引用量写成 0。** 未收录必须使用 `null`，页面显示 `—`。
5. **不要把页面引用说明改回具体平台名称。** 用户指定文案是“引用数据来自公开网站，未收录显示‘—’”。
6. **不要在论文下方恢复关键词标签。** 用户明确要求不显示关键词。
7. **不要缩写作者姓名。** 作者必须显示完整姓名。
8. **不要给期刊名补卷号、期号和页码。** 列表只显示期刊名称，并维持浅灰标签样式。
9. **不要让头像相机遮罩常驻。** 它只能在鼠标悬停头像时出现。
10. **不要取消头像压缩。** 当前 640×640 WebP 处理是用户认可方向。
11. **不要仅凭同名搜索结果补个人信息。** 成员身份与同名作者必须由用户确认。
12. **不要继续只用姓名作为长期作者主键。** 同名会造成论文误归集。
13. **不要假设“添加论文”已经持久化。** 当前刷新会丢失。
14. **不要绕过现有 PDF 静态资源方案。** 开发环境由 `vite.config.js` 限定 `/papers/` 路由，生产构建由 `scripts/build-sites.js` 复制到 `dist/public/papers`；新增文件必须同步登记 `pdfAsset` 并验证下载。
15. **读取中文源文件时显式使用 UTF-8。** PowerShell 某些默认编码输出曾造成看似乱码，但源文件本身是 UTF-8。
16. **大规模机械重写前先确认工作区干净并建立提交点。** 避免覆盖尚未提交的用户改动。
17. **修改 CSS 时检查文件末尾覆盖规则。** 当前最终样式经常由尾部规则决定。

## 15. 修改后的最低验证清单

每次修改后至少执行：

```powershell
npm run build
```

并人工检查：

1. `/#members` 三个成员分组是否正确。
2. 五个成员主页 hash 是否能直接打开。
3. 点击成员卡片是否跳转。
4. 点击中英文论文作者是否跳转。
5. 王新尧的 3 篇中文论文是否仍显示中文。
6. 未收录引用是否显示 `—` 而不是 0 或空白。
7. 头像相机是否只在头像 hover 时显示。
8. 头像上传、裁剪、刷新后保留是否正常。
9. 桌面与手机布局是否没有横向溢出。
10. 暗色主题下文本、标签和卡片是否可读。
11. 论文超过 10 篇时是否正确分页，筛选和切换成员后是否回到第 1 页。
12. 有本地 PDF 的下载按钮是否返回正确文件，无本地 PDF 的按钮是否保持禁用。

## 16. 交接时最终状态

- 最新 `npm run build`：通过。
- 开发服务器：HTTP 200，运行于 `http://localhost:5173/`。
- Node 进程：PID `28992`（可能在后续会话中变化）。
- 原始 PDF：`papers/wangxinyao` 中 6 个，`papers/zhengwen` 中 18 个（其中 2 个内容重复）。
- 29 篇内置论文均已配置完整的多句摘要，中文论文保持中文摘要。
- 所有成员主页共用 `ResearchLinks`，并显示低对比度阴影样式的“修改方向”入口；当前仅为待接入提示。
- Git 仓库默认分支为 `main`，本次定版提交信息为 `[0715] 21:06项目功能完善`，未配置远程仓库。
- 当前无已知编译错误。
- 核心阻塞不是构建问题，而是数据确认、持久化、作者身份建模和工程重构。
