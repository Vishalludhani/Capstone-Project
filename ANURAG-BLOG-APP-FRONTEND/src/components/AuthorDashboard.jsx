import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { useAuth } from '../store/authStore'
import ArticleDetailModal from './ArticleDetailModal'
import ArticleEditForm from './ArticleEditForm'
import ArticleCreateModal from './ArticleCreateModal'
import {
  pageWrapper,
  pageTitleClass,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  primaryBtn,
  secondaryBtn,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  tagClass,
  pageHeaderRow,
  cardActionRow,
} from '../styles/common'

function AuthorDashboard() {
  const logout = useAuth((state) => state.logout)
  const navigate = useNavigate()

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Modal state
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  // Fetch author's articles — extracted so it can be called on re-fetch after create
  const fetchArticles = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('http://localhost:6767/author-api/articles', {
        withCredentials: true,
      })
      setArticles(res.data.payload)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // ── Handlers ────────────────────────────────────────────

  const handleOpen = (article) => {
    setSelectedArticle(article)
    setShowDetail(true)
  }

  const handleEdit = (article) => {
    setSelectedArticle(article)
    setShowEdit(true)
  }

  const handleSave = (updatedArticle) => {
    setArticles((prev) =>
      prev.map((a) => (a._id === updatedArticle._id ? updatedArticle : a))
    )
  }

  const handleDelete = async (article) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${article.title}"?`
    )
    if (!confirmed) return

    try {
      await axios.patch(
        'http://localhost:6767/author-api/article-delete',
        { articleid: article._id },
        { withCredentials: true }
      )
      setArticles((prev) => prev.filter((a) => a._id !== article._id))
      toast.success('Article deleted successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleCreate = () => setShowCreate(true)
  const handleCreateClose = () => setShowCreate(false)
  const handleCreateSave = () => {
    // Re-fetch so the new card has the author name populated
    fetchArticles()
  }

  const handleLogout = async () => {
    toast.success('Logged out successfully')
    await logout()
    navigate('/login')
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <div className={pageWrapper}>
      {/* Header */}
      <div className={pageHeaderRow}>
        <h1 className={pageTitleClass}>Author Dashboard</h1>
        <div className="flex gap-3">
          <button onClick={handleCreate} className={`${primaryBtn} cursor-pointer`}>
            + New Article
          </button>
          <button onClick={handleLogout} className={`${secondaryBtn} cursor-pointer`}>
            Logout
          </button>
        </div>
      </div>

      {/* Feedback states */}
      {loading && <div className={loadingClass}>Loading your articles…</div>}
      {error && <div className={errorClass}>{error}</div>}
      {!loading && !error && articles.length === 0 && (
        <div className={emptyStateClass}>
          You haven't published any articles yet.
        </div>
      )}

      {/* Article card grid */}
      <div className={articleGrid}>
        {articles.map((article) => (
          <div key={article._id} className={`${articleCardClass} flex flex-col justify-between`}>
            {/* Category tag */}
            {article.category && (
              <span className={tagClass}>{article.category}</span>
            )}

            {/* Title */}
            <p className={`${articleTitle} mt-1`}>{article.title}</p>

            {/* Author */}
            <p className={articleMeta}>
              By {article.author?.firstName || 'Unknown'}
            </p>

            {/* Excerpt */}
            <p className={articleExcerpt}>
              {article.content?.slice(0, 100)}…
            </p>

            {/* Actions */}
            <div className={cardActionRow}>
              <button
                className={`${primaryBtn} cursor-pointer`}
                onClick={() => handleOpen(article)}
              >
                Open
              </button>
              <button
                className={`${secondaryBtn} cursor-pointer`}
                onClick={() => handleEdit(article)}
              >
                Edit
              </button>
              <button
                className={`${ghostBtn} cursor-pointer`}
                onClick={() => handleDelete(article)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {showDetail && selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setShowDetail(false)}
        />
      )}

      {/* Edit form modal */}
      {showEdit && selectedArticle && (
        <ArticleEditForm
          article={selectedArticle}
          onSave={handleSave}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Create article modal */}
      {showCreate && (
        <ArticleCreateModal
          onSave={handleCreateSave}
          onClose={handleCreateClose}
        />
      )}
    </div>
  )
}

export default AuthorDashboard