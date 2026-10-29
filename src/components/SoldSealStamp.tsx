import React from 'react';

interface SoldSealStampProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SoldSealStamp: React.FC<SoldSealStampProps> = ({ size = 'md', className = '' }) => {
  const glyphSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl sm:text-3xl';
  const labelSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-base' : 'text-xs sm:text-sm';
  const subSize = size === 'sm' ? 'text-[8px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';
  const padding = size === 'sm' ? 'px-3 py-1.5' : size === 'lg' ? 'px-6 py-4' : 'px-4 py-2.5';
  const borderWidth = size === 'sm' ? 'border-2 ring-2' : 'border-4 ring-4';

  return (
    <div className={`transform -rotate-12 select-none pointer-events-none transition-transform duration-300 ${className}`}>
      <div className={`relative ${borderWidth} border-red-600/95 bg-gradient-to-br from-red-950/95 via-rose-950/90 to-red-950/95 text-red-100 rounded-2xl ${padding} shadow-[0_10px_30px_rgba(220,38,38,0.4)] ring-red-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-center overflow-hidden`}>
        {/* Subtle royal vintage hatched background lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f87171_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
        
        {/* The Exact Cuneiform Royal Glyphs: 𒀱  𒅒  𒈓  𒀰 */}
        <div className={`${glyphSize} font-serif text-amber-300 font-extrabold tracking-widest drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)] leading-none my-1`}>
          𒀱  𒅒  𒈓  𒀰
        </div>

        {/* SOLD Notice */}
        <div className={`${labelSize} font-black text-white tracking-widest border-t-2 border-red-500/70 pt-1 mt-1 uppercase flex items-center gap-1.5 leading-tight`}>
          <span>تم البيع</span>
          <span className="text-amber-400">·</span>
          <span>SOLD</span>
        </div>

        {/* Subtitle Stamp */}
        <div className={`${subSize} text-amber-200/90 font-mono font-bold mt-0.5 tracking-wider leading-none`}>
          ختم التوثيق الملكي الرسمي
        </div>
      </div>
    </div>
  );
};
