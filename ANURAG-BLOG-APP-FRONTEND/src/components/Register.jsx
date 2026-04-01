import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { errorClass, formCard, formGroup, formTitle, inputClass, labelClass, subHeadingClass, submitBtn, loadingClass } from '../styles/common'

function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [preview, setPreview] = useState()
    // const [] = useState()

    const navigate = useNavigate()

    const onUserCreate = async (newUser) => {
        setLoading(true)
        setError(null)
        // Create form data object
        const formData = new FormData();

        //get user object
        let { role, profileImageUrl, ...userObj } = newUser;
        //add all fields except profilePic to FormData object
        Object.keys(userObj).forEach((key) => {
            formData.append(key, userObj[key]);
        });
        // add profilePic to Formdata object
        formData.append("profileImageUrl", profileImageUrl[0]);
        // try {
        //     let res = await fetch("http://localhost:6767/user-api/users", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(newUser)
        //     })
        // } catch (err) {
        //     setError(err.message)
        // } finally {
        //     setLoading(false)
        // }

        try {
            let { role, ...userObj } = newUser
            if (role == 'user') {
                //make request to user API
                let resObj = await axios.post("http://localhost:6767/user-api/users", formData)
                let res = resObj.data
                if (resObj.status == 201) {
                    navigate("/login")
                }
            }
            if (role == 'author') {
                //make request to author API
                let resObj = await axios.post("http://localhost:6767/author-api/users", formData)
                let res = resObj.data
                if (resObj.status == 201) {
                    navigate("/login")
                }
            }

        } catch (err) {
            setError(err.response?.data?.error || "Registeration failure")
        } finally {
            setLoading(false)
        }

    }

    //cleanup (remove preview from browser memory)
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    if (loading) {
        return <div className={loadingClass}>Loading...</div>
    }

    return (
        <div className={`${formCard} mt-8`}>
            {error && <p className={errorClass}>Failed: {error}</p>}
            <h2 className={formTitle}>Register</h2>
            <form onSubmit={handleSubmit(onUserCreate)} className={formGroup}>
                <div className="flex items-center justify-center gap-8 mb-8">
                    <h2 className={subHeadingClass}>Select Role:</h2>
                    <div className="flex items-center gap-2">
                        <input type="radio" id="user-role" value="user" {...register("role")} className="cursor-pointer accent-[#b91c1c]" required />
                        <label htmlFor="user-role " className="cursor-pointer text-sm"> User</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="radio" id="author-role" value="author" {...register("role")} className="cursor-pointer accent-[#b91c1c]" required />
                        <label htmlFor="author-role" className="cursor-pointer text-sm">Author</label>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <div>
                        <label className={labelClass}>First Name:</label>
                        <input type="text" {...register("firstName")} placeholder="First name" className={`${inputClass} flex-1`} />
                    </div>
                    <div>
                        <label className={labelClass}>Last Name:</label>
                        <input type="text" {...register("lastName")} placeholder="Last name" className={`${inputClass} flex-1`} />
                    </div>
                </div>

                <div className={formGroup}>
                    <label className={labelClass}>Email:</label>
                    <input type="email" {...register("email")} placeholder="example@gmail.com" className={`${inputClass} text-center`} />
                </div>

                <div className={formGroup}>
                    <label className={labelClass}>Password:</label>
                    <input type="password" {...register("password")} placeholder="•••••••••••" className={`${inputClass} text-center`} />
                </div>

                <div className="mb-6">
                    <label className={labelClass}>Upload Profile Picture:</label>
                    <input type="file" className={`${inputClass} text-center`}


                        accept="image/png, image/jpeg"
                        {...register("profileImageUrl")}
                        onChange={(e) => {
                            
                            //get image file
                            const file = e.target.files[0];
                            // validation for image format
                            if (file) {
                                if (!["image/jpeg", "image/png"].includes(file.type)) {
                                    setError("Only JPG or PNG allowed");
                                    return;
                                }
                                //validation for file size
                                if (file.size > 2 * 1024 * 1024) {
                                    setError("File size must be less than 2MB");
                                    return;
                                }
                                //Converts file → temporary browser URL(create preview URL)
                                const previewUrl = URL.createObjectURL(file);
                                setPreview(previewUrl);
                                setError(null);
                            }

                        }} />
                </div>

                {preview && (
                    <div className="mt-3 flex justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-full border"
                        />
                    </div>
                )}
                <button type="submit" className={submitBtn}>Register</button>
            </form>
        </div>
    )
}

export default Register