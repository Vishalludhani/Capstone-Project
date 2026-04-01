import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
    subHeadingClass,
    mutedText,
    loadingClass,
    errorClass,
    emptyStateClass,
    primaryBtn,
    secondaryBtn,
    commentAuthor,
} from '../styles/common'

function UsersList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const res = await axios.get('http://localhost:6767/admin-api/users', {
                    withCredentials: true,
                })
                setUsers(res.data.payload)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load users')
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleBlock = async (uid) => {
        try {
            await axios.get(`http://localhost:6767/admin-api/block-user/${uid}`, {
                withCredentials: true,
            })
            setUsers((prev) =>
                prev.map((u) => (u._id === uid ? { ...u, isActive: false } : u))
            )
            toast.success('User blocked')
        } catch (err) {
            toast.error('Failed to block user')
        }
    }

    const handleUnblock = async (uid) => {
        try {
            await axios.get(`http://localhost:6767/admin-api/unblock-user/${uid}`, {
                withCredentials: true,
            })
            setUsers((prev) =>
                prev.map((u) => (u._id === uid ? { ...u, isActive: true } : u))
            )
            toast.success('User unblocked')
        } catch (err) {
            toast.error('Failed to unblock user')
        }
    }

    if (loading) return <div className={loadingClass}>Loading users…</div>
    if (error) return <div className={errorClass}>{error}</div>
    if (users.length === 0) return <div className={emptyStateClass}>No users found.</div>

    return (
        <div className="space-y-3">
            {users.map((user) => (
                <div
                    key={user._id}
                    className="bg-white border border-[#e7e3d9] rounded-lg px-5 py-4 flex items-center justify-between"
                >
                    <div>
                        <p className={`${subHeadingClass} text-base`}>
                            {user.firstName} {user.lastName || ''}
                        </p>
                        <p className={mutedText}>{user.email}</p>
                        <span
                            className={`text-xs font-semibold mt-1 inline-block ${
                                user.isActive ? 'text-green-600' : 'text-red-500'
                            }`}
                        >
                            {user.isActive ? '● Active' : '● Blocked'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {user.isActive ? (
                            <button
                                className={`${secondaryBtn} cursor-pointer text-red-500 border-red-200 hover:bg-red-50`}
                                onClick={() => handleBlock(user._id)}
                            >
                                Block
                            </button>
                        ) : (
                            <button
                                className={`${primaryBtn} cursor-pointer`}
                                onClick={() => handleUnblock(user._id)}
                            >
                                Unblock
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UsersList
