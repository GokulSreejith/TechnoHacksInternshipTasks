import React from 'react'

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-20 h-20 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-spin"></div>
        </div>
    )
}

export default Loader