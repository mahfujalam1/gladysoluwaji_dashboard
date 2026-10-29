import React, { useState, useEffect } from "react";
import defaultAvatar from "../../assets/default-avatar.svg";
import { getImageUrl } from "../../utils/imageUrl";

const ProfileImage = ({ alt = "Profile", className = "", src, onClick, ...props }) => {
    const [imgSrc, setImgSrc] = useState(() => (src ? getImageUrl(src) : defaultAvatar));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (src) {
            setImgSrc(getImageUrl(src));
            setHasError(false);
        } else {
            setImgSrc(defaultAvatar);
        }
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(defaultAvatar);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`rounded-full object-cover ${className}`}
            onClick={onClick}
            onError={handleError}
            {...props}
        />
    );
};

export default ProfileImage;
