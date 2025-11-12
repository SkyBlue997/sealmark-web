/**
 * Bottom tab navigation component
 */

import './BottomTabs.css'

export interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

export interface BottomTabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function BottomTabs({ tabs, activeTab, onChange }: BottomTabsProps) {
  return (
    <nav className="bottom-tabs" role="tablist" aria-label="主导航">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            className={`bottom-tab ${isActive ? 'bottom-tab-active' : ''}`}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            <span className="bottom-tab-icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span className="bottom-tab-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
