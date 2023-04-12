import styles from "./Footer.module.scss";
import classNames from "classnames/bind";
import { Container, Row, Col } from "react-bootstrap";

import { FaFax } from "react-icons/fa";
import { AiFillPhone, AiFillMail } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx("wrapper")}>
            {/* <Container>
                <Row>
                    <Col xs={6}>
                        <div className={"content"}>
                            <h4 style={{ fontSize: 16, color: "#222", fontWeight: 700 }}>
                                CÔNG TY TNHH PHẦN MỀM LAMECO
                            </h4>
                            <div className={cx("wrapper-item")}>
                                <li className={cx("item")}>
                                    <FaFax size={14} />
                                    <span>MST: 0109762951</span>
                                </li>
                                <li className={cx("item")}>
                                    <MdLocationOn size={16} />
                                    <span>
                                        Số 311 Đường Trường Chinh, Phường Khương Mai, Quận Thanh Xuân, Thành Phố Hà Nội,
                                        Việt Nam
                                    </span>
                                </li>
                                <li className={cx("item")}>
                                    <AiFillPhone size={14} />
                                    <span>0877898365</span>
                                </li>
                                <li className={cx("item")}>
                                    <AiFillMail size={14} />
                                    <span>info@khongsodat.vn</span>
                                </li>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container> */}
        </div>
    );
}

export default Footer;
