import styles from "./ShopMyDeal.module.scss";
import classNames from "classnames/bind";

import { Container, Row, Col, Table } from "react-bootstrap";
import { AiOutlineTable } from "react-icons/ai";

import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const cx = classNames.bind(styles);

const url = "https://nghiendeal.vn/product/";

function ShopMyDeal() {
    const [deals, setDeals] = useState([]);
    useEffect(() => {
        const getDeals = async () => {
            const q = query(collection(db, "deals"), where("shop", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            setDeals(data);
        };
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getDeals();
            }
        });
    }, []);
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h1 className={cx("title")}>Deal của tôi</h1>
                </Col>
                <Col xs={12}>
                    <div className={cx("wrapper")}>
                        <div className={cx("heading")}>
                            <AiOutlineTable size={20} />
                            Tìm được {deals.length} deal
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Mã deal</th>
                                    <th>Tên deal</th>
                                    <th>Số lượt mua</th>
                                    <th>Khu vực</th>
                                    <th>Giá bán</th>
                                    <th>Hoàn tiền</th>
                                    <th>Thanh toán</th>
                                    <th>Link sản phẩm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deals.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{e?.id}</td>
                                            <td style={{maxWidth: 300}}>{e?.name}</td>
                                            <td>
                                                {e?.bought}/{e?.slot}
                                            </td>
                                            <td>{e?.location}</td>
                                            <td>{e?.price}đ</td>
                                            <td>{e?.refund}đ</td>
                                            <td>
                                                {e?.bank && "Ngân hàng"} {e?.bank && e?.momo && " & "}{" "}
                                                {e?.momo && "Momo"}
                                            </td>
                                            <td><a href={url + e?.id}>{url + e?.id}</a></td>
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

export default ShopMyDeal;
