import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    loadingClass,
    errorClass,
} from '../styles/common'

function AdminOverview() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                const res = await axios.get('http://localhost:6767/admin-api/stats', {
                    withCredentials: true,
                })
                setStats(res.data.payload)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load stats')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <div className={loadingClass}>Loading overview…</div>
    if (error) return <div className={errorClass}>{error}</div>
    if (!stats) return null

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-serif text-[#1a1a1a] mb-4">Platform Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Cards */}
                <div className="bg-white border border-[#e7e3d9] rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-[#8a8a8a] text-sm uppercase tracking-wider font-semibold mb-2">Total Users</p>
                    <p className="text-4xl font-serif text-[#1a1a1a]">{stats.totalUsers}</p>
                </div>

                <div className="bg-white border border-[#e7e3d9] rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-[#8a8a8a] text-sm uppercase tracking-wider font-semibold mb-2">Total Authors</p>
                    <p className="text-4xl font-serif text-[#1a1a1a]">{stats.totalAuthors}</p>
                </div>

                <div className="bg-white border border-[#e7e3d9] rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-[#8a8a8a] text-sm uppercase tracking-wider font-semibold mb-2">Active Articles</p>
                    <p className="text-4xl font-serif text-green-700">{stats.activeArticles}</p>
                </div>

                <div className="bg-white border border-[#e7e3d9] rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-[#8a8a8a] text-sm uppercase tracking-wider font-semibold mb-2">Total Articles</p>
                    <p className="text-4xl font-serif text-[#1a1a1a]">{stats.totalArticles}</p>
                </div>
            </div>
            
            <div className="mt-8 bg-[#faf9f4] border border-[#e7e3d9] rounded-xl p-6">
                <h3 className="text-lg font-serif text-[#1a1a1a] mb-2">Quick Actions</h3>
                <p className="text-[#555] text-sm mb-4">Use the tabs above to manage users, authors, and platform content.</p>
                <ul className="list-disc pl-5 text-sm text-[#555] space-y-2">
                    <li><strong>Users Tab:</strong> Block or unblock standard reader accounts.</li>
                    <li><strong>Authors Tab:</strong> Manage content creators and their access.</li>
                    <li><strong>Articles Tab:</strong> Review all published articles and disable inappropriate content.</li>
                </ul>
            </div>
        </div>
    )
}

export default AdminOverview
