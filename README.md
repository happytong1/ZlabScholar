# ZlabScholar

面向课题组的成员主页与学术成果展示平台。ZlabScholar 将成员档案、论文检索、引用信息与日常内容管理集中到一个简洁的站点中。

![ZlabScholar 主页面](docs/images/homepage.png)

## 主要功能

- 按教师、博士生和研究生分组展示课题组成员
- 独立成员主页，集中展示研究方向、联系方式与学术成果
- 按论文、作者、关键词和年份检索与筛选成果
- 展示引用次数、期刊分区等论文信息，并支持本地 PDF 下载
- 支持浅色与深色主题
- 内置管理员登录及成员信息的新增、编辑和移除功能
- 使用 SQLite 持久化成员资料与管理员会话

## 技术栈

- React 19
- Vite 8
- Node.js
- SQLite（Node.js 内置 `node:sqlite`）

## 本地开发

请先安装支持 `node:sqlite` 的较新版本 Node.js，然后安装依赖：

```bash
npm install
```

分别启动后端服务和前端开发服务器：

```bash
npm run dev:server
npm run dev
```

前端默认运行在 [http://localhost:5173](http://localhost:5173)，API 默认运行在 `http://127.0.0.1:3000`。

首次创建数据库时，可以通过环境变量设置管理员账号：

```powershell
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="请替换为安全密码"
npm run dev:server
```

> 管理员账号只会在数据库中尚无管理员时创建。运行数据默认保存在 `data/zlabscholar.sqlite`，该目录不会提交到 Git。

## 构建与运行

```bash
npm run build
npm start
```

生产服务默认运行在 [http://localhost:3000](http://localhost:3000)。构建过程会同时打包前端、后端和 `papers/` 中的论文文件。

## 测试

```bash
npm test
```

## 项目结构

```text
zlabscholar/
├─ src/                  # React 页面、组件与样式
├─ server/               # API、认证与成员数据服务
├─ public/               # 静态资源与成员头像
├─ papers/               # 论文 PDF 文件
├─ data/                 # 本地 SQLite 数据（不提交）
├─ scripts/              # 构建脚本
└─ docs/images/          # README 展示图片
```

## 数据说明

论文元数据会结合站内整理信息和 Crossref 数据进行展示。引用次数及期刊信息可能随外部数据源更新，请以出版社或索引平台的最新记录为准。
