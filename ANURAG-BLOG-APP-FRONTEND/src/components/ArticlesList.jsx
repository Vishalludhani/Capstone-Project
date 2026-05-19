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

function ArticlesList() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            try {
                const res = await axios.get('http://localhost:6767/admin-api/articles', {
                    withCredentials: true,
                })
                setArticles(res.data.payload)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load articles')
            } finally {
                setLoading(false)
            }
        }
        fetchArticles()
    }, [])

    const handleDisable = async (articleId) => {
        const confirmed = window.confirm("Are you sure you want to disable this article? It will no longer be visible to users.");
        if (!confirmed) return;

        try {
            await axios.patch(`http://localhost:6767/admin-api/article-disable/${articleId}`, {}, {
                withCredentials: true,
            })
            setArticles((prev) =>
                prev.map((a) => (a._id === articleId ? { ...a, isArticleActive: false } : a))
            )
            toast.success('Article disabled successfully')
        } catch (err) {
            toast.error('Failed to disable article')
        }
    }

    if (loading) return <div className={loadingClass}>Loading articles…</div>
    if (error) return <div className={errorClass}>{error}</div>
    if (articles.length === 0) return <div className={emptyStateClass}>No articles found.</div>

    return (
        <div className="space-y-3">
            {articles.map((article) => (
                <div
                    key={article._id}
                    className="bg-white border border-[#e7e3d9] rounded-lg px-5 py-4 flex items-center justify-between"
                >
                    <div className="max-w-[70%]">
                        <p className={`${subHeadingClass} text-base truncate`}>
                            {article.title}
                        </p>
                        <p className={mutedText}>
                            By: {article.author?.firstName || 'Unknown'} {article.author?.email ? `(${article.author.email})` : ''}
                        </p>
                        <p className={`${mutedText} text-xs mt-1`}>
                            Category: {article.category || 'Uncategorized'} | Comments: {article.comments?.length || 0}
                        </p>
                        <span
                            className={`text-xs font-semibold mt-2 inline-block ${
                                article.isArticleActive ? 'text-green-600' : 'text-red-500'
                            }`}
                        >
                            {article.isArticleActive ? '● Active' : '● Disabled'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {article.isArticleActive ? (
                            <button
                                className={`${secondaryBtn} cursor-pointer text-red-500 border-red-200 hover:bg-red-50`}
                                onClick={() => handleDisable(article._id)}
                            >
                                Disable
                            </button>
                        ) : (
                            <button
                                className={`${secondaryBtn} opacity-50 cursor-not-allowed`}
                                disabled
                            >
                                Disabled
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ArticlesList
