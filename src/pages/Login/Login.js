import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase/config.js";
import { setDoc, doc, collection, query, where, getDocs, getDoc } from "firebase/firestore";

import { Container, Row, Col } from "react-bootstrap";
import { AiFillFacebook } from "react-icons/ai";

const cx = classNames.bind(styles);

const provider = new FacebookAuthProvider();

function Login() {
    const navigate = useNavigate();

    const loginFacebook = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // The signed-in user info.
                const user = result.user;

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

                const ref = doc(db, "users", user.uid);
                const docSnap = await getDoc(ref);
        
                if (!docSnap.exists()) {
                    await setDoc(doc(db, "users", user.uid), {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        img: user.photoURL,
                        isValid: 1,
                    });
                }

                console.log(user);
                navigate("/");
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

    return (
        <div className={cx("wrapper")}>
            <Container>
                <Row>
                    <Col xs={12} className="d-flex flex-column align-items-center justify-content-center">
                        <h3 className={cx("title")}>ĐĂNG NHẬP</h3>
                        <div className={cx("fb")}>
                            <AiFillFacebook size={20} />
                            <button onClick={loginFacebook}>Đăng nhập với Facebook</button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
