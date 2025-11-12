# 图片加水印

一个给图片加水印的 Web 工具。图片处理全在浏览器本地完成，不会上传到服务器。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3366

## 功能

- 单张图片加水印
- 批量处理多张图片
- 支持拖拽、粘贴、点击选择图片
- 自动处理图片方向

## 参数说明

| 参数 | 范围 | 默认值 | 说明 |
|------|------|--------|------|
| 文字 | - | 仅供办理XX业务使用,他用无效 | 水印文字，支持多行 |
| 铺满 | 开/关 | 开 | 是否平铺水印 |
| 间距 | 8-80 | 30 | 平铺时的间距(px) |
| 行高 | 16-120 | 50 | 多行文字的行距(px) |
| 大小 | 10-64 | 20 | 字体大小(px) |
| 透明度 | 0-100 | 100 | 0为全透明 |
| 角度 | 0-60 | 30 | 旋转角度(度) |
| 颜色 | - | 黑色 | 8种预设+自定义 |

### 日期占位符

在文字中可以使用这些占位符，会自动替换为当前日期时间：

- `{YYYY}` - 年份
- `{MM}` - 月份
- `{DD}` - 日期
- `{HH}` - 小时
- `{mm}` - 分钟
- `{YYYY-MM-DD}` - 完整日期
- `{HH:mm}` - 时间

例如：`仅供办理XX业务使用 {YYYY-MM-DD}` 会显示为 `仅供办理XX业务使用 2025-01-12`

## 技术栈

- React 18
- TypeScript
- Vite
- Zustand (状态管理)
- HTML5 Canvas
- ExifReader (EXIF方向处理)
- JSZip (批量导出)

## 项目结构

```
├── src/
│   ├── components/      # UI组件
│   ├── pages/           # 页面
│   ├── lib/             # 工具库
│   │   ├── canvas/      # Canvas处理
│   │   └── zip.ts       # ZIP导出
│   ├── hooks/           # 自定义Hooks
│   ├── styles/          # 样式
│   ├── App.tsx
│   └── main.tsx
├── public/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 构建

```bash
# 开发
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## Docker

```bash
docker build -t apple-watermark-web .
docker run -d -p 3366:3366 apple-watermark-web
```

或使用 docker-compose:

```bash
docker compose up -d
```

## Cloudflare Pages 部署

这个项目是纯静态应用，适合部署到 Cloudflare Pages。

1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard 连接仓库
3. 构建设置：
   - 构建命令: `npm run build`
   - 输出目录: `dist`


## 使用建议

- 证件照建议开启铺满模式
- 字体大小推荐 16-24px
- 角度推荐 30-45度
- 透明度建议 40-70%
- 浅色背景用深色水印，深色背景用浅色水印

## 浏览器支持

需要支持 Canvas 2D API、File API 的现代浏览器：

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 隐私说明

所有图片处理在浏览器本地完成，使用 HTML5 Canvas API。不会上传图片到任何服务器，不收集任何数据。

## License

MIT
