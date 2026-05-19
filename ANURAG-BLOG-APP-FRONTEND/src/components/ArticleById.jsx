import { useLocation } from 'react-router'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
    articleTitle,
    pageWrapper,
    articleBody,
    divider,
    subHeadingClass,
    mutedText,
    errorClass,
    inputClass,
    primaryBtn,
    labelClass,
    articleAuthorLine,
    commentCard,
    commentAuthor,
    commentBody,
    commentList,
    commentForm,
} from '../styles/common'
import { useAuth } from '../store/authStore'

function ArticleById() {
    const location = useLocation()
    const currentUser = useAuth((state) => state.currentUser)

    const articleObj = location.state

    // Seed comments from the article object passed via navigation state
    const [comments, setComments] = useState(articleObj?.comments || [])
    const [commentText, setCommentText] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [saving, setSaving] = useState(false)

    if (!articleObj) {
        return <div className={errorClass}>No article found (refresh issue)</div>
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return

        setSubmitting(true)
        try {
            const res = await axios.put(
                'http://localhost:6767/user-api/comments',
                {
                    articleId: articleObj._id,
                    comment: commentText.trim(),
                },
                { withCredentials: true }
            )
            const updatedComments = res.data.payload.comments
            setComments(updatedComments)
            setCommentText('')
            toast.success('Comment added!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add comment')
        } finally {
            setSubmitting(false)
        }
    }

    const handleSaveArticle = async () => {
        setSaving(true)
        try {
            await axios.post(
                'http://localhost:6767/user-api/save-article',
                { articleId: articleObj._id },
                { withCredentials: true }
            )
            setIsSaved(true)
            toast.success('Article saved to your dashboard!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save article')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className={pageWrapper}>
            {/* Article Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className={articleTitle}>{articleObj?.title}</h1>
                    <p className={articleAuthorLine}>
                        By {articleObj?.author?.firstName || 'Unknown'}
                    </p>
                </div>
                {currentUser?.role === 'USER' && (
                    <button
                        onClick={handleSaveArticle}
                        disabled={saving || isSaved}
                        className={`border border-[#e7e3d9] px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                            isSaved ? 'bg-green-50 text-green-700 border-green-200 cursor-default' : 'text-[#1a1a1a] hover:bg-[#f0eee8]'
                        }`}
                    >
                        {isSaved ? 'Saved' : (saving ? 'Saving...' : 'Bookmark')}
                    </button>
                )}
            </div>

            <p className={articleBody}>{articleObj?.content}</p>

            <div className={divider} />

            {/* ── Comments Section ─────────────────────────────── */}
            <h3 className={`${subHeadingClass} mb-4`}>
                Comments ({comments.length})
            </h3>

            {/* Add comment — only for USERs */}
            {currentUser?.role === 'USER' && (
                <form onSubmit={handleAddComment} className={commentForm}>
                    <label className={`${labelClass} mb-1`}>Leave a comment</label>
                    <textarea
                        className={`${inputClass} resize-y min-h-[80px] mb-3`}
                        placeholder="Write your thoughts…"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`${primaryBtn} cursor-pointer ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Posting…' : 'Post Comment'}
                    </button>
                </form>
            )}

            {/* Comment list */}
            {comments.length > 0 ? (
                <div className={commentList}>
                    {comments.map((c, i) => (
                        <div key={c._id || i} className={commentCard}>
                            <p className={commentAuthor}>
                                {c.user?.email || 'Anonymous'}
                            </p>
                            <p className={commentBody}>{c.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={mutedText}>No comments yet. Be the first!</p>
            )}
        </div>
    )
}

export default ArticleById