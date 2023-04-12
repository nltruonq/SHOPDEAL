import styles from "./ItemProduct.module.scss";
import classNames from "classnames/bind";
import { useState, useEffect } from "react";

const cx = classNames.bind(styles);

function ItemProduct({ data }) {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("img")}>
                <img src={data.img} alt="" />
            </div>
            <div className={cx("description")}>
                <div className={cx("title")}>{data.name}</div>
                <div className={cx("price")}>{data.price}đ</div>
                <div className={cx("deal")}>Hoàn tiền {Math.round(data.refund / data.price * 100)}%</div>
            </div>
        </div>
    );
}

export default ItemProduct;
