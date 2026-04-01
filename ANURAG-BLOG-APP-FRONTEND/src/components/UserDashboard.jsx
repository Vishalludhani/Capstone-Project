import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import { articleCardClass, articleExcerpt, articleGrid, articleTitle, pageWrapper, pageTitleClass, primaryBtn, secondaryBtn, section, loadingClass, errorClass } from '../styles/common'


function UserDashboard() {
  const logout = useAuth(state => state.logout)
  let [article, setArticle] = useState([])
  let [error, setError] = useState(null)
  let [loading, setLoading] = useState(false)
  const setArticles = useAuth((state) => state.setArticles)
  const navigate = useNavigate()
  const onLogout = async () => {
    toast.success("Logged Out Successfully")
    await logout()
    navigate("/login")
  }

  // useEffect(() => {
  //   setLoading(true)
  //   try {
  //     let resObj
  //   } catch (err) {
  //     setError(err.response?.data?.error || "Failed to get Articles")
  //   } finally {
  //     setLoading(false)
  //   }
  // })

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true)
      try {
        let resObj = await axios.get("http://localhost:6767/user-api/read-articles", { withCredentials: true })
        setArticle(resObj.data.payload)
        setArticles(resObj.data.payload)
      } catch (err) {
        setError(err.response?.data?.error || "Failed to get Articles")
      } finally {
        setLoading(false)
      }
    }
    getArticles()
  }, [])

  return (
    <div className={pageWrapper}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={pageTitleClass}>User Dashboard</h1>
        <button onClick={onLogout} className={`${secondaryBtn} cursor-pointer`}>Logout</button>
      </div>

      {loading && <div className={loadingClass}>Loading articles...</div>}
      {error && <div className={errorClass}>{error}</div>}

      <div className={articleGrid}>
        {
          article.map(articleObj => (
            <div
              key={articleObj._id}
              className={articleCardClass}
            >
              <p className={articleTitle}>{articleObj.title}</p>
              <p className={articleExcerpt}>{articleObj.content.slice(0, 100)}...</p>

              <button className={`${primaryBtn} cursor-pointer`} onClick={() => navigate(`/article/${articleObj._id}`, {
                state: articleObj,
              })}>Read More</button>
            </div>
          ))
        }
      </div>
    </div >
  )
}

export default UserDashboard