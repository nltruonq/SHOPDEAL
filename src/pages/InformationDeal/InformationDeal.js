import styles from "./InformationDeal.module.scss";
import classNames from "classnames/bind";

import { Container, Row, Col, Table } from "react-bootstrap";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import Popup from "../../components/Popup/Popup";

const cx = classNames.bind(styles);

function InformationDeal({ info }) {
    const [isCopy, setIsCopy] = useState(false);
    const [isCopy2, setIsCopy2] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);

    function selectAndCopy() {
        const elementToSelect = document.querySelector("p");
        const range = document.createRange();
        const selection = window.getSelection();
        selection.removeAllRanges();
        range.selectNode(elementToSelect);
        selection.addRange(range);
        document.execCommand("copy");

        selection.removeAllRanges();
        setIsCopy(true);
        setOpenPopup(true);
    }

    function selectAndCopy2() {
        const elementToSelect = document.querySelector(".spancpy");
        const range = document.createRange();
        const selection = window.getSelection();
        selection.removeAllRanges();
        range.selectNode(elementToSelect);
        selection.addRange(range);
        document.execCommand("copy");

        selection.removeAllRanges();
        setIsCopy2(true);
    }
    return (
        <>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h1 className={cx("title")}>Đăng Deal lên Facebook theo mẫu 👇</h1>
                    </Col>
                    <Col xs={12}>
                        <div className={cx("wrapper")}>
                            <div className={cx("heading")}>
                                <AiOutlineMenu size={20} />
                                Nội dung mẫu
                            </div>
                            <div className={cx("body")}>
                                <p>
                                    🔥{info?.category === "0d" && "Deal0Đ"}
                                    <br />#{info?.location} {info?.category === "0d" && "#deal0dong"}{" "}
                                    {info?.freeshipextra && "#freeshipextra"} <br />
                                    👉Giá bán: {info?.price}đ - Hoàn: {Math.round((info?.refund / info?.price) * 100)}%
                                    <br /> 👉Số lượng deal: chỉ có {info?.slot} <br />
                                    GIỚI THIỆU VỀ SẢN PHẨM
                                    <br /> 'Nhà bán hàng viết về sản phẩm tại đây'
                                    <br />3 BƯỚC MUA DEAL, NHẬN HOÀN TIỀN
                                    <br />
                                    B1: Like bài post deal. Comment đăng ký mua deal và chờ phản hồi link deal từ người
                                    bán
                                    <br />
                                    B2: Mua hàng -&gt; Gửi ảnh đơn hàng vào link deal để giữ slot
                                    <br />
                                    B3: Nhận hàng -&gt; đánh giá sản phẩm trên SHOPEE -&gt; Gửi ảnh đánh giá vào link
                                    deal -&gt; Chờ chủ shop hoàn tiền
                                    <br />
                                    *Hoàn tiền qua: {info?.bank && "Ngân hàng "}{" "}
                                    {info?.bank && info?.momo ? "  &  " : ""} {info?.momo && "Momo"}
                                    <br />
                                    *Mẹo: Bạn có thể xem deal đã đăng ký bằng cách nhấp vào nút "Đã mua" trên link deal
                                </p>
                                <div className={cx("btn")}>
                                    <button className={cx("btn-cpy")} onClick={selectAndCopy}>
                                        {isCopy ? "Đã copy" : "Copy"}
                                    </button>
                                </div>
                                <div className={cx("link")}>
                                    Link deal:{" "}
                                    <span className="spancpy">https://shopdeal.vercel.app//product/{info?.id}</span>
                                    <div className={cx("btn")}>
                                        <button className={cx("btn-cpy")} onClick={selectAndCopy2}>
                                            {isCopy2 ? "Đã copy" : "Copy"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {openPopup && (
                <Popup
                    title="Thông báo"
                    content="Copy nội dung thành công."
                    note="Hệ thống mới đã tự động dẫn người mua đến trang bán hàng, chủ shop KHÔNG ib gửi link riêng cho từng người, không xóa bài viết trên FB. Nếu vi phạm, deal sẽ bị xóa và chủ shop sẽ bị tước quyền đăng deal.

                    Shop chỉ cần theo dõi duyệt ảnh review và lấy thông tin hoàn tiền ngay trên shop.khongsodat.vn, không cần phải xử lý inbox cho từng khách. Khách nào vẫn ib thì báo khách up ảnh và thông tin vào link mua deal để tiện quản lý.
                    
                    Chúc shop buôn may bán đắt."
                    contentBtn="Đóng"
                    setOpen={setOpenPopup}
                />
            )}
        </>
    );
}

export default InformationDeal;
