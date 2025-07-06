import { cn } from "./Card";


interface SketchyBoxProps {
  className?: string;
  children?: React.ReactNode;
}

export const SketchyBox = ({ className, children }: SketchyBoxProps) => {
  return (
    <div className={cn("relative", className)}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2,2 L98,3 L97,97 L3,96 Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          className="opacity-90"
          style={{
            strokeDasharray: '2,1',
            filter: 'url(#roughPaper)',
          }}
        />
        <defs>
          <filter id="roughPaper">
            <feTurbulence
              baseFrequency="0.04"
              numOctaves="3"
              result="roughness"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="roughness"
              scale="1"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
};
