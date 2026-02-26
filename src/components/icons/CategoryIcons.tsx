import React from "react";

interface IconProps {
    className?: string;
}

export const SaffronIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M32 8c-2 8-6 14-6 20s3 8 6 8 6-2 6-8-4-12-6-20z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M32 36v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 52h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M22 14c4 6 8 12 10 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <path d="M42 14c-4 6-8 12-10 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <path d="M30 36c-1 4-3 8-4 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M34 36c1 4 3 8 4 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M32 36v14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="28" cy="49" r="1.2" fill="currentColor" />
        <circle cx="32" cy="51" r="1.2" fill="currentColor" />
        <circle cx="36" cy="49" r="1.2" fill="currentColor" />
    </svg>
);

export const BeautyIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M32 16c-4 0-8 4-8 10 0 4 2 7 4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M32 16c4 0 8 4 8 10 0 4-2 7-4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M28 20c2 2 4 6 4 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M36 20c-2 2-4 6-4 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="32" cy="30" rx="6" ry="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M32 35v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 40c-4 2-8 1-10-1 2-1 6-1 10 1z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M32 45c4 2 8 1 10-1-2-1-6-1-10 1z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
);

export const DryFruitsIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M32 12c-6 4-12 12-12 22s6 18 12 18 12-8 12-18S38 16 32 12z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M32 16c-2 4-6 10-6 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <path d="M32 16c2 4 6 10 6 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <path d="M32 14v36" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
);

export const FoodIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 28c0 12 8 20 20 20s20-8 20-20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="10" y1="28" x2="54" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 22c0-4 2-6 0-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <path d="M32 20c0-4 2-6 0-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <path d="M40 22c0-4 2-6 0-10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <ellipse cx="32" cy="50" rx="6" ry="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </svg>
);

export const TeaIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M14 24h30v4c0 10-6 18-15 18S14 38 14 28v-4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M44 28c4 0 8 2 8 6s-4 6-8 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="29" cy="48" rx="16" ry="3" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <path d="M22 18c1-3 3-4 1-8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
        <path d="M29 16c1-3 3-4 1-8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
        <path d="M36 18c1-3 3-4 1-8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
    </svg>
);

export const HoneyIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="18" y="22" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="22" y="16" width="20" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="20" y="12" width="24" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M28 36c0 2-2 4-2 6s1 3 3 3 3-1 3-3-2-4-2-6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
        <line x1="24" y1="40" x2="40" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M42 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="49" cy="15" rx="3" ry="4" stroke="currentColor" strokeWidth="1.2" fill="none" transform="rotate(45, 49, 15)" />
    </svg>
);

export const OilsIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M24 20h16v4l4 6v22a4 4 0 01-4 4H24a4 4 0 01-4-4V30l4-6v-4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="28" y="10" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="29" y="6" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <path d="M22 38h20" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
        <ellipse cx="32" cy="44" rx="6" ry="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
);

export const SpicesIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 32c0 12 8 20 20 20s20-8 20-20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M10 32h44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M38 28l12-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="51" cy="11" rx="3" ry="2" stroke="currentColor" strokeWidth="1.3" fill="none" transform="rotate(-50, 51, 11)" />
        <circle cx="26" cy="38" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="32" cy="40" r="1.2" fill="currentColor" opacity="0.5" />
        <circle cx="38" cy="37" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="30" cy="44" r="0.8" fill="currentColor" opacity="0.4" />
    </svg>
);

export const FragranceIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="20" y="26" width="24" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="28" y="18" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M30 14h4v4h-4z" stroke="currentColor" strokeWidth="1.3" fill="none" />
        <line x1="32" y1="10" x2="32" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M36 10c2-2 4-4 6-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        <path d="M37 12c2-1 5-2 7 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        <path d="M37 8c1-2 3-4 5-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        <path d="M24 30l8 8-8 8" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
        <path d="M40 30l-8 8 8 8" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
    </svg>
);

export const KashmiriSpecialIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M8 40c4 4 12 8 24 8s20-4 24-8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M14 40v-8h36v8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M20 32c0-6 4-12 12-12s12 6 12 12" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M6 46c4-2 8 0 12-2s8 0 12-2 8 0 12-2 8 0 12-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        <path d="M8 50c4-2 8 0 12-2s8 0 12-2 8 0 12-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        <path d="M30 24l2-4 2 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
);
