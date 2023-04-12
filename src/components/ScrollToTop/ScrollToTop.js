import styles from "./ScrollToTop.module.scss";
import classNames from "classnames/bind";

import { AiOutlineArrowUp } from "react-icons/ai";
import { useEffect, useRef } from "react";

const cx = classNames.bind(styles);

function ScrollToTop() {
    const scrollRef = useRef(null);

    const handleScrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY >= 300) {
                scrollRef.current.style.display = 'flex';
            } else {
                scrollRef.current.style.display = 'none';
            }
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    })

    return (
        <div ref={scrollRef} onClick={handleScrollToTop} className={cx("wrapper")}>
            <AiOutlineArrowUp size={25} />
        </div>
    );
}

export default ScrollToTop;
