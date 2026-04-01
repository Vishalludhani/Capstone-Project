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
} from '../styles/common'

function AuthorsList() {
    const [authors, setAuthors] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAuthors = async () => {
            setLoading(true)
            try {
                const res = await axios.get('http://localhost:6767/admin-api/authors', {
                    withCredentials: true,
                })
                setAuthors(res.data.payload)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load authors')
            } finally {
                setLoading(false)
            }
        }
        fetchAuthors()
    }, [])

    const handleBlock = async (uid) => {
        try {
            await axios.get(`http://localhost:6767/admin-api/block-user/${uid}`, {
                withCredentials: true,
            })
            setAuthors((prev) =>
                prev.map((a) => (a._id === uid ? { ...a, isActive: false } : a))
            )
            toast.success('Author blocked')
        } catch (err) {
            toast.error('Failed to block author')
        }
    }

    const handleUnblock = async (uid) => {
        try {
            await axios.get(`http://localhost:6767/admin-api/unblock-user/${uid}`, {
                withCredentials: true,
            })
            setAuthors((prev) =>
                prev.map((a) => (a._id === uid ? { ...a, isActive: true } : a))
            )
            toast.success('Author unblocked')
        } catch (err) {
            toast.error('Failed to unblock author')
        }
    }

    if (loading) return <div className={loadingClass}>Loading authors…</div>
    if (error) return <div className={errorClass}>{error}</div>
    if (authors.length === 0) return <div className={emptyStateClass}>No authors found.</div>

    return (
        <div className="space-y-3">
            {authors.map((author) => (
                <div
                    key={author._id}
                    className="bg-white border border-[#e7e3d9] rounded-lg px-5 py-4 flex items-center justify-between"
                >
                    <div>
                        <p className={`${subHeadingClass} text-base`}>
                            {author.firstName} {author.lastName || ''}
                        </p>
                        <p className={mutedText}>{author.email}</p>
                        <span
                            className={`text-xs font-semibold mt-1 inline-block ${
                                author.isActive ? 'text-green-600' : 'text-red-500'
                            }`}
                        >
                            {author.isActive ? '● Active' : '● Blocked'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {author.isActive ? (
                            <button
                                className={`${secondaryBtn} cursor-pointer text-red-500 border-red-200 hover:bg-red-50`}
                                onClick={() => handleBlock(author._id)}
                            >
                                Block
                            </button>
                        ) : (
                            <button
                                className={`${primaryBtn} cursor-pointer`}
                                onClick={() => handleUnblock(author._id)}
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

export default AuthorsList
