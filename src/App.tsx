/**
 * Main application component with routing and tab navigation
 */

import { useState } from 'react'
import { TopBar } from './components/TopBar'
import { BottomTabs, type Tab } from './components/BottomTabs'
import { Toaster } from './components/Toaster'
import { WatermarkEditor } from './components/WatermarkEditor'
import { BatchWatermark } from './components/BatchWatermark'
import { Discovery } from './pages/Discovery'
import './App.css'

type TabId = 'single' | 'batch' | 'discovery'

const tabs: Tab[] = [
  {
    id: 'single',
    label: '加水印',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path
          d="M21 15l-5-5L5 21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'batch',
    label: '批量加水印',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="8"
          y="8"
          width="13"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 16V4a2 2 0 012-2h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'discovery',
    label: '发现',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16v-4M12 8h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

const tabTitles: Record<TabId, string> = {
  single: '证件图片加水印',
  batch: '批量加水印',
  discovery: '发现',
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('single')

  return (
    <div className="app">
      <TopBar title={tabTitles[activeTab]} />

      <main className="app-content" role="main">
        <div
          id="panel-single"
          role="tabpanel"
          aria-labelledby="tab-single"
          hidden={activeTab !== 'single'}
        >
          {activeTab === 'single' && <WatermarkEditor />}
        </div>
        <div
          id="panel-batch"
          role="tabpanel"
          aria-labelledby="tab-batch"
          hidden={activeTab !== 'batch'}
        >
          {activeTab === 'batch' && <BatchWatermark />}
        </div>
        <div
          id="panel-discovery"
          role="tabpanel"
          aria-labelledby="tab-discovery"
          hidden={activeTab !== 'discovery'}
        >
          {activeTab === 'discovery' && <Discovery />}
        </div>
      </main>

      <BottomTabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

      <Toaster />
    </div>
  )
}

export default App
