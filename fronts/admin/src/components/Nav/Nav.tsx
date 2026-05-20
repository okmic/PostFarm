import { useState } from "react";
import { Link } from "react-router-dom";

const linkItems = [
    { to: "/settings", title: "Settings", Icon: <></> },
    { to: "/stats", title: "stats", Icon: <></> },
    { to: "/services", title: "services", Icon: <></> },
]

export default function Nav() {

    const [isActivNav, setIsActivNav] = useState(false)

    return <>
        {
            isActivNav
                ? <ActiveNav onCloseNav={() => setIsActivNav(false)} />
                : <ClosedNav onActivNav={() => setIsActivNav(true)} />
        }
    </>


}

const ActiveNav = ({ onCloseNav }: { onCloseNav: () => void }) => {
    return <div className="fixed bottom-[5%] w-screen flex justify-center items-center">
        <div className="bg-[#000] rounded-[30px] flex gap-1  justify-between p-[5px]">
            {linkItems.map(li => <Link
                className="flex flex-col justify-center items-center bg-[#fff] rounded-[30px] h-[75px] w-[100px]"
                to={li.to}>
                {li.Icon}
                <span>{li.title}</span>
            </Link>)}
        </div>
        <div onClick={onCloseNav} className="cursor-pointer ml-[15px] flex items-center justify-center h-[75px] w-[100px] bg-[#fff] rounded-[50px] ">
            {"<"}
        </div>
    </div>
}

const ClosedNav = ({ onActivNav }: { onActivNav: () => void }) => {
    return <div className="cursor-pointer fixed bottom-[5%] w-screen flex justify-start items-start" onClick={onActivNav}>
        <div className="ml-[15px] flex items-center justify-center h-[75px] w-[100px] bg-[#fff] rounded-[50px] ">
            {">"}
        </div>
    </div>
}