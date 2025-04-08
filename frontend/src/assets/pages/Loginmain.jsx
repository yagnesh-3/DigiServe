import React, { useState } from 'react'
import mainImg from '../images/LoginImg.png'
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import mystyle from './css/Loginmain.module.css'
import { useTables } from "../context/TableContext.jsx";
import { useNavigate } from 'react-router-dom';
const Loginmain = () => {
    const navigate = useNavigate();
    const { backendUrl } = useTables();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    async function handleSubmit(event) {
        event.preventDefault();
        if (!email || !password) {
            toast.warning('Please fill in all fields');
            return;
        }

        try {
            const start = performance.now();
            const res = await fetch(`${backendUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const end = performance.now(); // End timer
            const responseTime = end - start;
            console.log(`Backend response time: ${responseTime.toFixed(2)} ms`);
            const data = await res.json();
            console.log(data)
            if (!data.status) {
                toast.error(data.message);
                return;
            }
            console.log(data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success("Login Success!");
            navigate('/'); // Redirect to products page after login
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('Something went wrong. Try again.');
        }
    }
    return (
        <div className={mystyle.mainDiv}>
            <div className={mystyle.imgDiv}>
                <img src={mainImg} alt="" />
            </div>
            <div className={mystyle.inputDiv}>
                <h1>Welcome Back!</h1>

                <div className={mystyle.inpContainer}>
                    <form >

                        <div className={mystyle.input_box}>
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div class={mystyle.input_box}>
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </form>
                    <a href="" className={mystyle.fp}>Forgot password ?</a>
                    <button className={mystyle.lgn_btn} onClick={handleSubmit} >Login</button>

                </div>
                {/* <div className={mystyle.or}>
                    <hr className={mystyle.line} />
                    <p>Or</p>
                    <hr className={mystyle.line} />
                </div>

                <div className={mystyle.loginbtns}>
                    <div className={mystyle.btn}>
                        <FcGoogle className={mystyle.google} />
                        <span>Google</span>
                    </div>
                    <div className={mystyle.btn}>
                        <i class="fa-brands fa-facebook"></i>
                        <span>Facebook</span>
                    </div>
                </div>
                <div className={mystyle.sup}>
                    <p>Dont't have an account? <span className={mystyle.signup}>Sign Up</span></p>

                </div> */}
            </div>
        </div>
    )
}

export default Loginmain
