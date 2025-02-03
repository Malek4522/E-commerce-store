import { useState } from 'react';
import classNames from 'classnames';
import styles from '../product-details/product-details.module.scss';

interface MediaItem {
    url: string;
    type: 'video' | 'image';
    altText?: string;
}

interface ProductImagesProps {
    images: MediaItem[];
}

export function ProductImages({ images }: ProductImagesProps) {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(images[0] || null);

    if (!images.length) {
        return null;
    }

    const getYoutubeVideoId = (url: string) => {
        // Extract video ID from various YouTube URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getYoutubeEmbedUrl = (url: string) => {
        const videoId = getYoutubeVideoId(url);
        // Add more parameters to completely clean up the player
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&color=white` : url;
    };

    const getYoutubeThumbnailUrl = (url: string) => {
        const videoId = getYoutubeVideoId(url);
        if (!videoId) return '';
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    };

    const renderMedia = (media: MediaItem) => {
        if (media.type === 'video') {
            const embedUrl = getYoutubeEmbedUrl(media.url);
            return (
                <div className={styles.videoMode} style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <iframe
                        src={embedUrl}
                        title="Product video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            aspectRatio: '16 / 9',
                            width: '100%'
                        }}
                    />
                </div>
            );
        }
        return (
            <img 
                src={media.url} 
                alt={media.altText || 'Product image'} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        );
    }

    const renderThumbnail = (media: MediaItem) => {
        if (media.type === 'video') {
            const thumbnailUrl = getYoutubeThumbnailUrl(media.url);
            return (
                <div className={styles.videoThumbnail}>
                    <img 
                        src={thumbnailUrl} 
                        alt="Video thumbnail"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className={styles.playIcon}>▶</div>
                </div>
            );
        }
        return (
            <img 
                src={media.url} 
                alt={media.altText || 'Product thumbnail'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        );
    };

    return (
        <div>
            <div className={classNames(styles.imageContainer, {
                [styles.imageMode]: selectedMedia?.type === 'image',
                [styles.videoMode]: selectedMedia?.type === 'video'
            })}>
                {selectedMedia && renderMedia(selectedMedia)}
            </div>
            
            <div className={styles.thumbnails}>
                {images.map((media, index) => (
                    <button
                        key={index}
                        className={classNames(styles.thumbnail, {
                            [styles.active]: media.url === selectedMedia?.url,
                            [styles.videoThumbnailWrapper]: media.type === 'video'
                        })}
                        onClick={() => setSelectedMedia(media)}
                        type="button"
                    >
                        {renderThumbnail(media)}
                    </button>
                ))}
            </div>
        </div>
    );
}
