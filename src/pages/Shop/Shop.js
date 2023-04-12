import styles from "./Shop.module.scss";
import classNames from "classnames/bind";
import { Col, Container, Row, Navbar, Nav } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import ShopProfile from "../../components/ShopProfile/ShopProfile";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import ShopRegisterDeal from "../../components/ShopRegisterDeal/ShopRegisterDeal";
import ShopMyDeal from "../../components/ShopMyDeal/ShopMyDeal";
import ShopReviewAndReFund from "../../components/ShopReviewAndReFund/ShopReviewAndReFund";

import axios from "axios";
import InformationDeal from "../InformationDeal/InformationDeal";
import Admin from "../../components/Admin/Admin";
import Report from "../../components/Report/Report";

const cx = classNames.bind(styles);

function Shop() {
    const [nav, setNav] = useState("profile");
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleNav = (text) => {
        setNav(text);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate("/shop/login");
    };

    useEffect(() => {
        const checkIsAdmin = async () => {
            const q = query(collection(db, "shops"), where("id", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            if (data[0].admin) {
                setIsAdmin(true);
            }
        };
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                checkIsAdmin();
            } else {
                navigate("/shop/login");
            }
        });
    }, []);

    return (
        <>
            <Navbar className={cx("nav-bar")} expand="lg">
                <Navbar.Brand style={{ color: "#fff" }} href="#">
                    SELLER
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className={cx("collapse")} id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => handleNav("register")} className={cx("nav-link")}>
                            Đăng ký Deal
                        </Nav.Link>
                        <Nav.Link onClick={() => handleNav("review")} className={cx("nav-link")}>
                            Duyệt ảnh review & Hoàn tiền
                        </Nav.Link>
                        <Nav.Link onClick={() => handleNav("deal")} className={cx("nav-link")}>
                            Deal của tôi
                        </Nav.Link>
                        <Nav.Link onClick={() => handleNav("profile")} className={cx("nav-link")}>
                            Tài khoản
                        </Nav.Link>
                        {isAdmin && (
                            <>
                                <Nav.Link onClick={() => handleNav("admin")} className={cx("nav-link")}>
                                    Admin
                                </Nav.Link>
                                <Nav.Link onClick={() => handleNav("report")} className={cx("nav-link")}>
                                    Xem khiếu nại
                                </Nav.Link>
                            </>
                        )}
                        <Nav.Link onClick={handleLogout} className={cx("nav-link")}>
                            Đăng xuất
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {nav === "profile" ? (
                <ShopProfile />
            ) : nav === "register" ? (
                <ShopRegisterDeal />
            ) : nav === "deal" ? (
                <ShopMyDeal />
            ) : nav === "review" ? (
                <ShopReviewAndReFund />
            ) : nav === "admin" ? (
                <Admin />
            ) : nav === "report" ? (
                <Report />
            ) : (
                <InformationDeal />
            )}
        </>
    );
}

export default Shop;
