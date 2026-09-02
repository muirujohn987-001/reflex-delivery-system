import { useEffect, useState } from "react";

const TAGLINE_WORDS = ["Visible.", "Trackable.", "Trustworthy."];

export default function Logo({ size = 48, showTagline = false, taglineClassName = "text-white/70", className = "" }) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!showTagline) return undefined;

        const HOLD_MS = 1400;
        const FADE_MS = 350;

        const cycle = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((i) => (i + 1) % TAGLINE_WORDS.length);
                setVisible(true);
            }, FADE_MS);
        }, HOLD_MS + FADE_MS);

        return () => clearInterval(cycle);
    }, [showTagline]);

    return (
        <div className={`flex flex-col ${className}`}>
            <img
                src="/logo.png"
                alt="REFLEX — Smart Delivery Coordination"
                style={{ height: size }}
                className="w-auto shrink-0 object-contain"
            />

            {showTagline && (
                <p
                    className={`mt-2 text-[10px] font-semibold uppercase tracking-widest transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"
                        } ${taglineClassName}`}
                >
                    {TAGLINE_WORDS[index]}
                </p>
            )}
        </div>
    );
}