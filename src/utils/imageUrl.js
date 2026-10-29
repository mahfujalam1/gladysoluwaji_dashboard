import { BASE_URL } from '../RTK/api';
import defaultAvatar from '../assets/default-avatar.svg';

/**
 * Returns a complete URL for images. If path is relative, prepends backend BASE_URL.
 * If empty or invalid, returns local defaultAvatar.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.includes('placehold.net')) {
    return defaultAvatar;
  }
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${cleanPath}`;
};

export { defaultAvatar };
