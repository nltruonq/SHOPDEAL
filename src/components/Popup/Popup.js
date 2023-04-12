import styles from "./Popup.module.scss";
import classNames from "classnames/bind";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";

const cx = classNames.bind(styles);

function Popup({ title, content, note, contentBtn, setOpen, href, error = false }) {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("main")}>
                <div className={cx("icon")}>
                    {error ? <BiErrorCircle size={60} /> : <AiOutlineCheckCircle size={60} />}
                </div>
                <div className={cx("title")}>{title}</div>
                <div className={cx("content")}>{content}</div>
                <div className={cx("note")}>
                    {note && <span className={cx("note-check")}>Lưu ý:</span>} {note}
                </div>
                <div className={cx("content-btn")}>
                    <a
                        href={href}
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        {contentBtn}
                    </a>
                    {error && (
                        <button
                            style={{ border: "none", marginLeft: 20, padding: "4px 16px", borderRadius: 4 }}
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Popup;
