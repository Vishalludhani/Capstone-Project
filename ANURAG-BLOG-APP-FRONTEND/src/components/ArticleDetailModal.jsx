import React from 'react'
import {
  articleTitle,
  articleBody,
  mutedText,
  subHeadingClass,
  divider,
  secondaryBtn,
  articleMeta,
  modalOverlayScroll,
  modalContainer,
  modalCloseBtn,
  modalFooter,
  commentCard,
  commentAuthor,
  commentBody,
  commentList,
  authorNameHighlight,
  authorEmailMuted,
} from '../styles/common'

function ArticleDetailModal({ article, onClose }) {
  if (!article) return null

  return (
    <div className={modalOverlayScroll}>
      <div className={modalContainer}>

        {/* Close button */}
        <button onClick={onClose} className={modalCloseBtn}>
          ✕ Close
        </button>

        {/* Title */}
        <h1 className={`${articleTitle} text-2xl mb-2`}>{article.title}</h1>

        {/* Author meta */}
        <p className={`${articleMeta} mb-6`}>
          By <span className={authorNameHighlight}>{article.author?.firstName || 'Unknown'}</span>
          {article.author?.email && (
            <span className={authorEmailMuted}>· {article.author.email}</span>
          )}
        </p>

        {/* Divider */}
        <div className={divider} />

        {/* Content */}
        <p className={`${articleBody} whitespace-pre-wrap mt-6`}>{article.content}</p>

        {/* Comments */}
        <div className={`${divider} mt-10`} />
        <h3 className={`${subHeadingClass} mb-4`}>Comments</h3>

        {article.comments && article.comments.length > 0 ? (
          <div className={commentList}>
            {article.comments.map((c, i) => (
              <div key={i} className={commentCard}>
                <p className={commentAuthor}>
                  {c.user?.email || 'Anonymous'}
                </p>
                <p className={commentBody}>{c.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={mutedText}>No comments yet.</p>
        )}

        {/* Footer */}
        <div className={modalFooter}>
          <button onClick={onClose} className={secondaryBtn}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ArticleDetailModal
