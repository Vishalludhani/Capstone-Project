import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useAuth } from '../store/authStore'
import toast from 'react-hot-toast'
import { formCard, formGroup, formTitle, inputClass, labelClass, submitBtn, errorClass, loadingClass } from '../styles/common'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState(null)
  const login = useAuth(state=>state.login)
  const isAuthenticated = useAuth((state)=>state.isAuthenticated)
  const currentUser = useAuth((state)=>state.currentUser)
  const loading = useAuth((state)=>state.loading)
  const error = useAuth((state)=>state.error)


  const navigate = useNavigate()

  const onLogin = async (credentials) => {

    await login(credentials)

    // setLoading(true)
    // setError(null)
    // try {
    //   let res = await fetch("http://localhost:6767/user-api/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(credentials)
    //   })
      // if (res.status === 200) {
      //   const data = await res.json()
      //   // Store token if provided
      //   if (data.token) {
      //     localStorage.setItem("token", data.token)
      //   }
      //   navigate("/dashboard")
      // }
      // else {
      //   throw new Error("Invalid credentials")
      // }
    // } catch (err) {
    //   setError(err.message)
    // } finally {
    //   setLoading(false)
    // }
  }

  useEffect(()=>{
    if(isAuthenticated){
      if(currentUser.role=="USER"){
        toast.success("Logged in Successfully")
        navigate("/userdashboard")
      }
      if(currentUser.role=="AUTHOR"){
        navigate("/authordashboard")
      }
      if(currentUser.role=="ADMIN"){
        navigate("/admindashboard")
      }
    }
  },[isAuthenticated,currentUser])

  if(loading){
    return <div className={loadingClass}>Loading....</div>
  }

  return (
    <div className={`${formCard} mt-15`}>
      {/* {error && <p className="text-center text-red-600 text-lg mb-4">Failed: {error}</p>} */}
      <h2 className={formTitle}>Login</h2>
      <form onSubmit={handleSubmit(onLogin)}>
        
        {/* <div className="flex items-center justify-center gap-8 mb-8">
          <h2 className="font-semibold">Select Role</h2>
          <div className="flex items-center gap-2">
            <input type="radio" id="user-role" value="user" {...register("role")} className='cursor-pointer' />
            <label htmlFor="user-role" className="cursor-pointer">User</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="author-role" value="author" {...register("role")} className='cursor-pointer' />
            <label htmlFor="author-role" className="cursor-pointer">Author</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="admin-role" value="admin" {...register("role")} className='cursor-pointer' />
            <label htmlFor="admin-role" className="cursor-pointer">Admin</label>
          </div>
        </div> */}

        <div className={formGroup}>
          <label className={labelClass}>Email</label>
          <input type="email" {...register("email")} placeholder="Email" className={inputClass} required />
        </div>
          
        <div className={formGroup}>
          <label className={labelClass}>Password</label>
          <input type="password" {...register("password")} placeholder="Password" className={inputClass} required />
        </div>
          {error && <p className={errorClass}>{error}</p>}
        <button type="submit" className={submitBtn}>Login</button>
      </form>
    </div>
  )
}

export default Login