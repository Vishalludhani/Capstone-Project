import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
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

function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      try {
        const res = await axios.get('http://localhost:6767/common-api/public-articles')
        setArticles(res.data.payload)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  return (
    <div className={pageWrapper}>
      <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">All Articles</h1>
      <p className="text-[#8a8a8a] mb-8">Discover the latest stories from our community.</p>
      
      {loading && <div className={loadingClass}>Loading articles…</div>}
      {error && <div className={errorClass}>{error}</div>}
      {!loading && !error && articles.length === 0 && (
        <div className={emptyStateClass}>
          No articles found.
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
                onClick={() => navigate(`/article/${article._id}`, { state: article })}
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

export default Articles
