import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import axios from 'axios'
import {
  pageWrapper,
  pageTitleClass,
  subHeadingClass,
  mutedText,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  primaryBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  tagClass
} from '../styles/common'

function UserDashboard() {
  const currentUser = useAuth((state) => state.currentUser)
  const [savedArticles, setSavedArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSavedArticles = async () => {
      setLoading(true)
      try {
        const res = await axios.get("http://localhost:6767/user-api/saved-articles", { withCredentials: true })
        setSavedArticles(res.data.payload)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to get saved articles")
      } finally {
        setLoading(false)
      }
    }
    fetchSavedArticles()
  }, [])

  const handleUnsave = async (articleId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:6767/user-api/unsave-article/${articleId}`, { withCredentials: true });
      setSavedArticles((prev) => prev.filter((a) => a._id !== articleId));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={pageWrapper}>
      <h1 className={pageTitleClass}>User Dashboard</h1>

      {/* Profile Summary */}
      <div className="bg-white border border-[#e7e3d9] rounded-xl p-8 mb-12 flex items-center gap-6 mt-8 shadow-sm">
        <div className="w-20 h-20 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center text-3xl font-serif">
          {currentUser?.firstName?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-serif text-[#1a1a1a]">
            {currentUser?.firstName} {currentUser?.lastName}
          </h2>
          <p className="text-[#8a8a8a] mt-1">{currentUser?.email}</p>
          <div className="mt-3 inline-block bg-[#f0eee8] text-[#555] px-3 py-1 rounded-full text-xs font-medium">
            Reader Account
          </div>
        </div>
      </div>

      <h2 className={`${subHeadingClass} mb-6`}>Saved Articles</h2>

      {loading && <div className={loadingClass}>Loading saved articles...</div>}
      {error && <div className={errorClass}>{error}</div>}
      {!loading && !error && savedArticles.length === 0 && (
        <div className={emptyStateClass}>
          You haven't saved any articles yet. Explore the Articles page to find something interesting!
        </div>
      )}

      <div className={articleGrid}>
        {savedArticles.map((article) => (
          <div key={article._id} className={`${articleCardClass} flex flex-col justify-between hover:shadow-md transition-shadow relative`}>
            <div>
              {article.category && <span className={tagClass}>{article.category}</span>}
              <p className={`${articleTitle} mt-3`}>{article.title}</p>
              <p className={articleMeta}>By {article.author?.firstName || 'Unknown'}</p>
              <p className={articleExcerpt}>{article.content?.slice(0, 100)}...</p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#e7e3d9] flex gap-3">
              <button
                className={`${primaryBtn} flex-1 cursor-pointer`}
                onClick={() => navigate(`/article/${article._id}`, { state: article })}
              >
                Read
              </button>
              <button
                className="border border-[#e7e3d9] text-[#b91c1c] hover:bg-red-50 hover:border-red-200 transition px-4 py-2 rounded-full text-sm font-medium cursor-pointer"
                onClick={(e) => handleUnsave(article._id, e)}
              >
                Unsave
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserDashboard