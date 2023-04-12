import styles from "./Report.module.scss";
import classNames from "classnames/bind";

import { Container, Row, Col, Table } from "react-bootstrap";
import { AiOutlineTable } from "react-icons/ai";

import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const cx = classNames.bind(styles);

function Report() {
    const [reports, setReports] = useState([]);

    const getReports = async () => {
        const q = query(collection(db, "reports"));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        setReports(data);
    };

    const handleValid = (shop) => {
        updateDoc(doc(db, "reports", shop.id), {
            isValid: 1,
        });
        getReports();
    };

    const handleNotValid = (shop) => {
        updateDoc(doc(db, "reports", shop.id), {
            isValid: -1,
        });
        getReports();
    };

    const handleReValid = (shop) => {
        updateDoc(doc(db, "reports", shop.id), {
            isValid: 1,
        });
        getReports();
    };

    useEffect(() => {
        getReports();
    }, []);

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <h1 className={cx("title")}>KHIẾU NẠI</h1>
                </Col>
                <Col xs={12}>
                    <div className={cx("wrapper")}>
                        <div className={cx("heading")}>
                            <AiOutlineTable size={20} />
                            Số lượng: {reports.length}
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Họ và tên</th>
                                    <th>ID Shop</th>
                                    <th>Nội dung</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Hình ảnh sản phẩm</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports?.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{e?.username}</td>
                                            <td>{e?.shop}</td>
                                            <td>
                                                {e?.text}
                                            </td>
                                            <td>
                                                {e?.name}
                                            </td>
                                            <td>
                                                <img className={cx("shop-img")} src={e?.img} />
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

export default Report;
