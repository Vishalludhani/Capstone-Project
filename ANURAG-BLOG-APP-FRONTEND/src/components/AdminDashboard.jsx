import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../store/authStore'
import toast from 'react-hot-toast'
import UsersList from './UsersList'
import AuthorsList from './AuthorsList'
import ArticlesList from './ArticlesList'
import AdminOverview from './AdminOverview'
import {
  pageWrapper,
  pageTitleClass,
  secondaryBtn,
  pageHeaderRow,
} from '../styles/common'

const TABS = ['Overview', 'Users', 'Authors', 'Articles']

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div className={pageWrapper}>
      {/* Header */}
      <div className={pageHeaderRow}>
        <h1 className={pageTitleClass}>Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#e7e3d9] mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition cursor-pointer ${
              activeTab === tab
                ? 'border-b-2 border-[#b91c1c] text-[#b91c1c]'
                : 'text-[#8a8a8a] hover:text-[#1a1a1a]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && <AdminOverview />}
      {activeTab === 'Users' && <UsersList />}
      {activeTab === 'Authors' && <AuthorsList />}
      {activeTab === 'Articles' && <ArticlesList />}
    </div>
  )
}

export default AdminDashboard