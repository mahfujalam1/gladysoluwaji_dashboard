import React, { useState, useEffect } from "react";
import Avatar from "../../assets/avater.png";

const FALLBACK_IMAGE =
    "https://placehold.net/avatar.svg?text=TF&bg=212121";

const ProfileImage = ({ alt = "image", className = "", src, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src || Avatar);

    useEffect(() => {
        if (src) {
            setImgSrc(src);
        }
    }, [src]);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {

                // API

                const data = {
                    avatar: "",
                };

                if (data?.avatar && !src) {
                    setImgSrc(data.avatar);
                }
            } catch (error) {
                console.error("Image API failed", error);
            }
        };

        fetchProfileImage();
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`rounded-full object-cover ${className}`}
            {...props}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
    );
};

export default ProfileImage;
