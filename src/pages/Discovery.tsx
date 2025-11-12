/**
 * Discovery page with usage instructions and tips
 */

import './Discovery.css'

export function Discovery() {
  return (
    <div className="discovery">
      <div className="discovery-content">
        {/* Header */}
        <div className="discovery-header">
          <h2 className="discovery-title">发现</h2>
          <p className="discovery-subtitle">了解如何使用证件图片加水印工具</p>
        </div>

        {/* Quick Start */}
        <section className="discovery-section">
          <h3 className="discovery-section-title">快速使用</h3>
          <ol className="discovery-list">
            <li>进入"加水印"或"批量加水印",点击相机或"+"选图</li>
            <li>在"文字"中输入水印内容</li>
            <li>是否铺满:证件图建议开启,普通照片按需</li>
            <li>调整大小/透明/角度/间距/行高,选择颜色</li>
            <li>单张:点【保存】;批量:点【批量预览 → 批量保存】</li>
          </ol>
        </section>

        {/* Parameters Guide */}
        <section className="discovery-section">
          <h3 className="discovery-section-title">参数建议</h3>
          <div className="discovery-grid">
            <div className="discovery-card">
              <h4 className="discovery-card-title">字体大小</h4>
              <p className="discovery-card-content">
                推荐 16-24 像素。太小不清晰,太大影响证件内容。
              </p>
            </div>
            <div className="discovery-card">
              <h4 className="discovery-card-title">旋转角度</h4>
              <p className="discovery-card-content">
                推荐 30-45 度。适度倾斜既美观又不遮挡关键区域。
              </p>
            </div>
            <div className="discovery-card">
              <h4 className="discovery-card-title">间距</h4>
              <p className="discovery-card-content">
                推荐 30-40 像素。合理间距让水印分布均匀自然。
              </p>
            </div>
            <div className="discovery-card">
              <h4 className="discovery-card-title">透明度</h4>
              <p className="discovery-card-content">
                推荐中等透明度(40-70%)。既清晰可见又不过度遮挡。
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="discovery-section">
          <h3 className="discovery-section-title">使用技巧</h3>
          <div className="discovery-tips">
            <div className="discovery-tip">
              <div className="discovery-tip-icon">💡</div>
              <div className="discovery-tip-content">
                <h4 className="discovery-tip-title">避免遮挡关键区域</h4>
                <p>姓名、证件号、人像、有效期等核心区域应尽量保持清晰可见</p>
              </div>
            </div>
            <div className="discovery-tip">
              <div className="discovery-tip-icon">🎨</div>
              <div className="discovery-tip-content">
                <h4 className="discovery-tip-title">选择合适的颜色</h4>
                <p>浅底用深色,深底用浅色,保持对比度达标(WCAG AA标准)</p>
              </div>
            </div>
            <div className="discovery-tip">
              <div className="discovery-tip-icon">📅</div>
              <div className="discovery-tip-content">
                <h4 className="discovery-tip-title">使用日期占位符</h4>
                <p>支持 {'{YYYY-MM-DD}'} 和 {'{HH:mm}'} 等格式,自动替换为当前日期时间</p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="discovery-section">
          <h3 className="discovery-section-title">隐私与安全</h3>
          <div className="discovery-privacy">
            <div className="discovery-privacy-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>本地处理</span>
            </div>
            <p className="discovery-privacy-text">
              所有图像处理完全在您的浏览器本地完成,不会上传至任何服务器。
              本程序不收集、不存储任何图像或个人信息,确保您的隐私安全。
            </p>
          </div>
        </section>

        {/* Technical Info */}
        <section className="discovery-section">
          <h3 className="discovery-section-title">技术说明</h3>
          <div className="discovery-tech">
            <div className="discovery-tech-item">
              <h4>Canvas 2D API</h4>
              <p>使用 HTML5 Canvas 技术在本地浏览器中进行图像处理和水印绘制</p>
            </div>
            <div className="discovery-tech-item">
              <h4>EXIF 方向校正</h4>
              <p>自动读取并校正图片的 EXIF 方向信息,确保图片显示正确</p>
            </div>
            <div className="discovery-tech-item">
              <h4>高 DPI 支持</h4>
              <p>支持 Retina 等高分辨率屏幕,确保预览和导出的图片清晰细腻</p>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="discovery-section">
          <h3 className="discovery-section-title">无障碍支持</h3>
          <ul className="discovery-list">
            <li>完整的键盘导航支持</li>
            <li>屏幕阅读器友好的 ARIA 标签</li>
            <li>符合 WCAG AA 标准的颜色对比度</li>
            <li>触控目标不小于 44×44 pt (Apple HIG 标准)</li>
            <li>支持系统"减少动态效果"设置</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="discovery-footer">
          <p>
            使用 React + TypeScript + Vite 构建
          </p>
          <p className="discovery-footer-version">v1.0.0</p>
        </footer>
      </div>
    </div>
  )
}
