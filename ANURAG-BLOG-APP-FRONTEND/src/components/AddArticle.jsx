import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { formCard, formTitle, inputClass, submitBtn, loadingClass, errorClass, pageWrapper, formGroup } from '../styles/common'

function AddArticle() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const onPublishArticle = async (articleData) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      // Perform post request using Axios so it passes through the global interceptor.
      await axios.post("http://localhost:6767/author-api/articles", articleData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className={loadingClass}>Loading...</div>
  }

  return (
    <div className={`${pageWrapper} flex flex-col items-center justify-center`}>
      {error && <div className={errorClass}>Failed: {error}</div>}
      <form onSubmit={handleSubmit(onPublishArticle)} className={`${formCard} w-full mt-8`}>
        <h2 className={formTitle}>Publish Article</h2>
        <div className={formGroup}>
          <input 
            type="text" 
            {...register("title")} 
            placeholder="Title" 
            className={inputClass}
            required 
          />
        </div>

        <div className={formGroup}>
          <select 
            {...register("category")} 
            className={inputClass}
            required
          >
            <option value="">Select Category</option>
            <option value="technology">Technology</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="sports">Sports</option>
            <option value="travel">Travel</option>
          </select>
        </div>

        <div className={formGroup}>
          <textarea 
            {...register("content")} 
            placeholder="Content"
            rows="6"
            className={`${inputClass} resize-y`}
            required
          />
        </div>

        <button 
          type="submit" 
          className={submitBtn}
        >
          Publish Article
        </button>
      </form>
    </div>
  )
}

export default AddArticle