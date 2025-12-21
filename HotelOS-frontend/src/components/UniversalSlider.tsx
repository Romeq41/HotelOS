import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

interface SliderImage {
    url: string;
    alt: string;
    isPrimary?: boolean;
}

interface UniversalSliderProps {
    images: SliderImage[];
    height?: number | string;
    autoplay?: boolean;
    autoplaySpeed?: number;
    arrows?: boolean;
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    pauseOnHover?: boolean;
    className?: string;
    imageClassName?: string;
    onImageError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    renderOverlay?: (image: SliderImage, index: number) => React.ReactNode;
    clickable?: boolean;
    onImageClick?: (image: SliderImage, index: number) => void;
}

export const UniversalSlider: React.FC<UniversalSliderProps> = ({
    images,
    height = 200,
    autoplay = true,
    autoplaySpeed = 3000,
    arrows = true,
    dots = true,
    infinite = true,
    speed = 500,
    pauseOnHover = true,
    className = '',
    imageClassName = '',
    onImageError,
    renderOverlay,
    clickable = false,
    onImageClick
}) => {
    // Sort images so primary image comes first
    const sortedImages = [...images].sort((a, b) => {
        if (a.isPrimary === true) return -1;
        if (b.isPrimary === true) return 1;
        return 0;
    });

    const settings = {
        infinite: infinite && sortedImages.length > 1,
        speed,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: autoplay && sortedImages.length > 1,
        autoplaySpeed,
        arrows: arrows && sortedImages.length > 1,
        dots: dots && sortedImages.length > 1,
        pauseOnHover,
        adaptiveHeight: false,
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
        if (onImageError) {
            onImageError(e);
        }
    };

    const handleImageClick = (image: SliderImage, index: number) => {
        if (clickable && onImageClick) {
            onImageClick(image, index);
        }
    };

    // If only one image, render without slider
    if (sortedImages.length <= 1) {
        const image = sortedImages[0] || { url: "https://via.placeholder.com/300x200?text=No+Image", alt: "No image available" };
        return (
            <div
                className={`relative overflow-hidden ${className}`}
                style={{ height: typeof height === 'number' ? `${height}px` : height }}
            >
                <img
                    src={image.url}
                    alt={image.alt}
                    className={`w-full h-full object-cover ${imageClassName} ${clickable ? 'cursor-pointer' : ''}`}
                    style={{ height: '100%' }}
                    onError={handleImageError}
                    onClick={() => handleImageClick(image, 0)}
                />
                {renderOverlay && renderOverlay(image, 0)}
            </div>
        );
    }

    return (
        <div
            className={`slider-container ${className}`}
            style={{
                height: typeof height === 'number' ? `${height}px` : height,
                '--slider-height': typeof height === 'number' ? `${height}px` : height
            } as React.CSSProperties}
        >
            <style >{`
                .slider-container .slick-slide > div {
                    height: var(--slider-height);
                }
                .slider-container .slick-list,
                .slider-container .slick-track {
                    height: var(--slider-height);
                }
                .slider-container .slick-dots {
                    bottom: 10px;
                }
                .slider-container .slick-dots li button:before {
                    color: white;
                    font-size: 12px;
                    opacity: 0.7;
                }
                .slider-container .slick-dots li.slick-active button:before {
                    opacity: 1;
                }
                .slider-container .slick-prev,
                .slider-container .slick-next {
                    z-index: 2;
                }
                .slider-container .slick-prev:before,
                .slider-container .slick-next:before {
                    font-size: 20px;
                    color: white;
                    text-shadow: 0 0 3px rgba(0,0,0,0.5);
                }
                .slider-container .slick-prev {
                    left: 10px;
                }
                .slider-container .slick-next {
                    right: 10px;
                }
            `}</style>
            <Slider {...settings}>
                {sortedImages.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image.url}
                            alt={image.alt}
                            className={`w-full h-full object-cover ${imageClassName} ${clickable ? 'cursor-pointer' : ''}`}
                            style={{ height: typeof height === 'number' ? `${height}px` : height }}
                            onError={handleImageError}
                            onClick={() => handleImageClick(image, index)}
                        />
                        {renderOverlay && renderOverlay(image, index)}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default UniversalSlider;
