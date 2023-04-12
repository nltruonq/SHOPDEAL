import styles from "./LoginAdmin.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

function LoginAdmin() {
    const [usernameText, setUsernameText] = useState("");
    const [passwordText, setPasswordText] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (usernameText !== "" && passwordText !== "") {
            const querySnapshot = await getDocs(collection(db, "admin"));
            querySnapshot.forEach((doc) => {
                const admin = doc.data();
                if (admin.username === usernameText && admin.password === passwordText) {
                    localStorage.setItem("admin_nghiendeal", JSON.stringify(admin));
                    navigate("/admin");
                } else {
                    toast.error("Đăng nhập thất bại!");
                }
            });
        }
    };

    return (
        <section className={cx("gradient-custom")}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw-bold mb-2 text-uppercase">ADMIN</h2>
                                    <p className="text-white-50 mb-5">Vui lòng điền tài khoản và mật khẩu!</p>

                                    <div className="form-outline form-white mb-4">
                                        <label className="form-label" htmlFor="typeEmailX">
                                            Tài khoản
                                        </label>
                                        <input
                                            value={usernameText}
                                            onChange={(e) => setUsernameText(e.target.value)}
                                            type="text"
                                            id="typeEmailX"
                                            className="form-control form-control-lg"
                                        />
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <label className="form-label" htmlFor="typePasswordX">
                                            Mật khẩu
                                        </label>
                                        <input
                                            value={passwordText}
                                            onChange={(e) => setPasswordText(e.target.value)}
                                            type="password"
                                            id="typePasswordX"
                                            className="form-control form-control-lg"
                                        />
                                    </div>

                                    <button onClick={handleSubmit} className="btn btn-outline-light btn-lg px-5">
                                        Đăng Nhập
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LoginAdmin;
