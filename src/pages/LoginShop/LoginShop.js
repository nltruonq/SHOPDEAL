import styles from "./LoginShop.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FacebookAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/config.js";

import { Container, Row, Col } from "react-bootstrap";
import { AiFillFacebook } from "react-icons/ai";

const cx = classNames.bind(styles);

const provider = new FacebookAuthProvider();

function LoginShop() {
    const navigate = useNavigate();

    const loginFacebook = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

                console.log(user);
                navigate("/shop");
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);

                // ...
            });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/shop");
            }
        });
    }, []);

    return (
        <div className={cx("wrapper")}>
            <Container>
                <Row>
                    <Col xs={12} className="d-flex flex-column align-items-center justify-content-center">
                        <h3 className={cx("title")}>ĐĂNG NHẬP SHOP</h3>
                        <div className={cx("fb")}>
                            <AiFillFacebook size={20} />
                            <button onClick={loginFacebook}>Đăng nhập với Facebook</button>
                        </div>
                        <Link to="/">
                            <div className={cx("home")}>← Về trang chủ</div>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LoginShop;
