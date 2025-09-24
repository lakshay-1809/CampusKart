import { ToastContainer, toast } from 'react-toastify';
import { Slide } from "react-toastify"


export default function Toast({ message }) {
    const notify = () => {
        toast.success(message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
        });
    }
    return (
        <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            progress={undefined}
            theme="colored"
            transition={Slide}
        />
    )
}
