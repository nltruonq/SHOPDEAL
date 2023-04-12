import styles from "./ShopReviewAndReFund.module.scss";
import classNames from "classnames/bind";

import { Container, Row, Col, Table } from "react-bootstrap";
import { AiOutlineTable } from "react-icons/ai";

import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const cx = classNames.bind(styles);

const url = "https://shopdeal.vercel.app//product/";

function ShopReviewAndReFund() {
    const [orders, setOrders] = useState([]);

    const handleDetailImage = (order) => {
        if (order.status > 2) {
            window.open(order.imgUpdate, "_blank", "noreferrer");
            window.open(order.imgReview, "_blank", "noreferrer");
            return;
        }
        window.open(order.imgUpdate, "_blank", "noreferrer");
    };

    const handleSuccess = (order) => {
        updateDoc(doc(db, "orders", order.orderId), {
            status: 4,
        });
        getOrders();
    };

    const handleError = (order) => {
        updateDoc(doc(db, "orders", order.orderId), {
            status: -1,
        });
        getOrders();
    };

    const getOrders = async () => {
        const q = query(collection(db, "orders"), where("shop", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), orderId: doc.id });
        });
        setOrders(data);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getOrders();
            }
        });
    }, []);
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h1 className={cx("title")}>Duyệt ảnh review & hoàn tiền</h1>
                </Col>
                <Col xs={12}>
                    <div className={cx("wrapper")}>
                        <div className={cx("heading")}>
                            <AiOutlineTable size={20} />
                            Tìm được {orders.length} order
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Mã deal</th>
                                    <th>Tên deal</th>
                                    <th>Tên người mua</th>
                                    <th>Phương thức thanh toán</th>
                                    <th>Thông tin thanh toán</th>
                                    <th>Giá bán</th>
                                    <th>Hoàn tiền</th>
                                    <th>Trạng thái</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{e?.id}</td>
                                            <td style={{ maxWidth: 300 }}>{e?.name}</td>
                                            <td>{e?.username}</td>
                                            <td>{e?.methodRefund === "bank" ? "Ngân hàng" : "Momo"}</td>
                                            <td>
                                                {e?.methodRefund === "bank" ? (
                                                    <ul>
                                                        <li>Chủ tài khoản: {e?.bankOwner}</li>
                                                        <li>Tên ngân hàng: {e?.bank}</li>
                                                        <li>Số tài khoản: {e?.bankNumber}</li>
                                                    </ul>
                                                ) : (
                                                    "SĐT momo: " + e?.momoNumber
                                                )}
                                            </td>
                                            <td>{e?.price}đ</td>
                                            <td>{e?.refund}đ</td>
                                            <td>
                                                {e?.status === 1
                                                    ? "Đăng ký"
                                                    : e?.status === 2
                                                    ? "Đã đặt hàng"
                                                    : e?.status === 3
                                                    ? "Đã review"
                                                    : e?.status === 4
                                                    ? "Đã hoàn tiền"
                                                    : e?.status === -1
                                                    ? "Đã từ chối"
                                                    : ""}
                                            </td>
                                            <td>
                                                <div className={cx("wrapper-btn")}>
                                                    {e?.status === 2 || e?.status === 3 ? (
                                                        <button
                                                            onClick={() => handleDetailImage(e)}
                                                            className={cx("action-btn", "yellow")}
                                                        >
                                                            Chi tiết hình ảnh
                                                        </button>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {e?.status === 3 && (
                                                        <button
                                                            onClick={() => handleSuccess(e)}
                                                            className={cx("action-btn", "green")}
                                                        >
                                                            Xác nhận đã hoàn tiền
                                                        </button>
                                                    )}
                                                    {e?.status === 2 || e?.status === 3 ? (
                                                        <button
                                                            onClick={() => handleError(e)}
                                                            className={cx("action-btn", "red")}
                                                        >
                                                            Hình ảnh không chính xác
                                                        </button>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ShopReviewAndReFund;
