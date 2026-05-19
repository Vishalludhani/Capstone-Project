import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../store/authStore'
import {
  pageWrapper,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  primaryBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  tagClass,
} from '../styles/common'

function Home() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const user = useAuth((state) => state.currentUser)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const getProfilePath = () => {
      if (!user) return '/'
      switch (user.role) {
          case "AUTHOR": return "/authordashboard";
          case "ADMIN": return "/admindashboard";
          default: return "/userdashboard";
      }
  }

  useEffect(() => {
    const fetchPublicArticles = async () => {
      setLoading(true)
      try {
        const res = await axios.get('http://localhost:6767/common-api/public-articles')
        setArticles(res.data.payload)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recent articles')
      } finally {
        setLoading(false)
      }
    }
    fetchPublicArticles()
  }, [])

  return (
    <div className={pageWrapper}>
      {/* Hero Section */}
      <div className="bg-[#1a1a1a] text-[#f7f5f0] rounded-xl p-12 mb-12 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Welcome to Anurag's Blog
        </h1>
        <p className="text-[#a0a0a0] text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Read the latest thoughts, ideas, and stories from our community of writers.
          Join us to start sharing your own.
        </p>
        <div className="flex gap-4 justify-center">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-[#1a1a1a] font-medium hover:bg-[#e0e0e0] transition rounded-full cursor-pointer px-6 py-2.5 text-base shadow-sm"
              >
                Start Writing
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-transparent border border-white text-white font-medium hover:bg-white hover:text-[#1a1a1a] transition rounded-full cursor-pointer px-6 py-2.5 text-base"
              >
                Login
              </button>
            </>
          ) : (
            <button
                onClick={() => navigate(getProfilePath())}
                className="bg-white text-[#1a1a1a] font-medium hover:bg-[#e0e0e0] transition rounded-full cursor-pointer px-6 py-2.5 text-base shadow-sm"
              >
                Go to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Articles Section */}
      <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Recent Articles</h2>
      
      {loading && <div className={loadingClass}>Loading latest articles…</div>}
      {error && <div className={errorClass}>{error}</div>}
      {!loading && !error && articles.length === 0 && (
        <div className={emptyStateClass}>
          No articles published yet. Check back soon!
        </div>
      )}

      <div className={articleGrid}>
        {articles.map((article) => (
          <div key={article._id} className={`${articleCardClass} flex flex-col justify-between hover:shadow-md transition-shadow`}>
            <div>
              {/* Category tag */}
              {article.category && (
                <span className={tagClass}>{article.category}</span>
              )}

              {/* Title */}
              <p className={`${articleTitle} mt-3`}>{article.title}</p>

              {/* Author */}
              <p className={articleMeta}>
                By {article.author?.firstName || 'Unknown'}
              </p>

              {/* Excerpt */}
              <p className={articleExcerpt}>
                {article.content?.slice(0, 120)}...
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-4 border-t border-[#e7e3d9]">
              <button
                className={`${primaryBtn} w-full cursor-pointer`}
                onClick={() => navigate('/login')}
              >
                Read Full Article
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home