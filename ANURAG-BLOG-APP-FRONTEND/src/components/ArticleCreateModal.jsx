import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  secondaryBtn,
  errorClass,
  modalOverlayScroll,
  modalCloseBtn,
  formActionRow,
} from '../styles/common'

const CATEGORIES = [
  'technology',
  'lifestyle',
  'business',
  'health',
  'education',
  'entertainment',
  'sports',
  'travel',
]

function ArticleCreateModal({ onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await axios.post(
        'http://localhost:6767/author-api/articles',
        { title, category, content },
        { withCredentials: true }
      )
      toast.success('Article published!')
      onSave()   // signal dashboard to re-fetch
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={modalOverlayScroll} onClick={onClose}>
      <div
        className={`${formCard} w-full max-w-lg relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button type="button" onClick={onClose} className={modalCloseBtn}>
          ✕ Close
        </button>

        <h2 className={formTitle}>New Article</h2>

        {error && <div className={`${errorClass} mb-4`}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className={formGroup}>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title…"
              required
            />
          </div>

          {/* Category */}
          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className={formGroup}>
            <label className={labelClass}>Content</label>
            <textarea
              className={`${inputClass} resize-y min-h-[200px]`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here…"
              required
            />
          </div>

          {/* Actions */}
          <div className={formActionRow}>
            <button
              type="submit"
              disabled={loading}
              className={`${submitBtn} flex-1 ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? 'Publishing…' : 'Publish Article'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`${secondaryBtn} cursor-pointer`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArticleCreateModal
