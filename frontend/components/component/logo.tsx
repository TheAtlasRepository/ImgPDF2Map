import React, { useState, useEffect } from 'react';

function Logo() {
    const [text, setText] = useState('IMG  ');
    const [opacity, setOpacity] = useState('opacity-100');

    useEffect(() => {
        const interval = setInterval(() => {
            setOpacity('opacity-0');
            setTimeout(() => {
                setText(prevText => prevText === 'IMG  ' ? 'PDF  ' : 'IMG  ');
                setOpacity('opacity-100');
            }, 1000);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`text-8xl text-black flex justify-center`}>
            <div className={`transition-all duration-500 ease-in-out ${opacity}`}>
                <span className="font-bold">{text}</span>
            </div>
            <div>
                <span> 2 MAP</span>
            </div>
        </div>
    );
}

export default Logo;