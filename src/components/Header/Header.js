import classNames from "classnames/bind";
import styles from "./Header.module.scss";

import { Col, Container, Row } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { AiOutlineStar, AiFillBell } from "react-icons/ai";
import { GiShoppingBag } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const cx = classNames.bind(styles);

const btn = [
    {
        title: "Deal Bán Chạy",
        icon: <AiOutlineStar size={14} />,
        to: "/",
    },
    {
        title: "Đã Mua",
        icon: <GiShoppingBag size={14} />,
        to: "/deal-da-tham-gia",
    },
    {
        title: "Thông Báo",
        icon: <AiFillBell size={14} />,
        to: "/thong-bao",
    },
    {
        title: "User",
        icon: <FaUser size={14} />,
    },
];

function Header() {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const handleHome = () => {
        navigate("/");
    };

    const handleLogout = () => {
        auth.signOut();
        setUser(null);
        navigate("/login");
    };

    const handleSign = () => {
        navigate("/login");
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            }
        });
    }, []);
    return (
        <>
            <div className={cx("wrapper")}>
                <Container>
                    <Row className={cx("top-header")} style={{ height: "60px" }}>
                        <Col className="d-flex align-items-center d-none d-lg-flex" lg={4} md={4}>
                            <span className={cx("title")}>Chào mừng bạn đến với shop</span>
                        </Col>
                        <Col
                            className="d-flex align-items-center justify-content-end gap-4 d-none d-md-flex"
                            lg={8}
                            md={12}
                        >
                            {user &&
                                btn.map((e, i) => {
                                    if (e.title === "User")
                                        return (
                                            <li onClick={handleLogout} className={cx("item", "user")} key={i}>
                                                {e.icon}
                                                <span>{user?.displayName || e.title}</span>
                                            </li>
                                        );
                                    else
                                        return (
                                            <Link key={i} to={e.to}>
                                                <li className={cx("item")} key={i}>
                                                    {e.icon}
                                                    <span>{e.title}</span>
                                                </li>
                                            </Link>
                                        );
                                })}
                            {!user && (
                                <li className={cx("item")}>
                                    <FaUser />
                                    <span onClick={handleSign}>Đăng nhập/Đăng ký</span>
                                </li>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container>
                <Row>
                    <Col
                        className={cx("wrapper-logo")}
                        style={{ height: "100px", padding: "35px 0px", position: "relative" }}
                        xs={12}
                    >
                        <img
                            onClick={handleHome}
                            className={cx("logo")}
                            src="https://firebasestorage.googleapis.com/v0/b/shopdeal-77174.appspot.com/o/logo%2Flogo.png?alt=media&token=71ce4570-94ba-4f8c-ad5a-69eef440a515"
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Header;
