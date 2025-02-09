import React from 'react'
import mainImg from '../images/LoginImg.png'
import { FcGoogle } from "react-icons/fc";
import mystyle from './css/Loginmain.module.css'
const Loginmain = () => {
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
                            <input type="email" placeholder="Email Address" />
                        </div>
                        <div class={mystyle.input_box}>
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Password" />
                        </div>
                    </form>
                    <a href="" className={mystyle.fp}>Forgot password ?</a>
                    <button className={mystyle.lgn_btn}>Login</button>
                </div>
                <div className={mystyle.or}>
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

                </div>
            </div>
        </div>
    )
}

export default Loginmain
