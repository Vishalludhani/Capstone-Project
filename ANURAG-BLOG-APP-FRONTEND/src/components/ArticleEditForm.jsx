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
  modalOverlay,
  modalCloseBtn,
  formActionRow,
} from '../styles/common'

function ArticleEditForm({ article, onSave, onClose }) {
  const [title, setTitle] = useState(article?.title || '')
  const [content, setContent] = useState(article?.content || '')
  const [category, setCategory] = useState(article?.category || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await axios.put(
        'http://localhost:6767/author-api/articles',
        {
          author: article.author?._id || article.author,
          articleid: article._id,
          title,
          content,
          category,
        },
        { withCredentials: true }
      )
      toast.success('Article updated successfully!')
      onSave({ ...article, title, content, category })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={modalOverlay}>
      <div className={`${formCard} w-full max-w-lg relative`}>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className={modalCloseBtn}
        >
          ✕ Close
        </button>

        <h2 className={formTitle}>Edit Article</h2>

        {error && <div className={`${errorClass} mb-4`}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className={formGroup}>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <input
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className={formGroup}>
            <label className={labelClass}>Content</label>
            <textarea
              className={`${inputClass} resize-y min-h-[160px]`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Actions */}
          <div className={formActionRow}>
            <button
              type="submit"
              disabled={loading}
              className={`${submitBtn} flex-1 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={secondaryBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArticleEditForm
