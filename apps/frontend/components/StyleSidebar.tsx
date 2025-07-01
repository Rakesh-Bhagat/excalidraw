"use client";
import { useShapeStore } from "@/store/useShapeStore";
import {  useStyleStore } from "@/store/useStyleStore";
import { useToolStore } from "@/store/useToolStore";
import { Square } from "lucide-react";
import { useParams } from "next/navigation";

const strokeColors = ["#d3d3d3", "#ff8383", "#56a2e8", "#3a994c", "#b76100"];
const fillColors = [null, "#5b2c2c", "#043b0c", "#154163", "#362500"];

export default function StyleSidebar() {
  const params = useParams();
  const roomId = params.roomId as string;
  const {currentTool} = useToolStore()
  const {selectedShapeId, roomShapes} = useShapeStore()
  const {setCanvasBg, canvasBg, style, setStyle } = useStyleStore();
  const selectedShape = roomShapes[roomId].find((shape) => shape.id === selectedShapeId)

  return (
    <div className="bg-[#232329] text-white p-5 w-auto rounded-md space-y-3">
      <div>
        <p className="mb-2 text-xs">Stroke</p>
        <div className="flex gap-2">
          {strokeColors.map((color) => (
            <div className="" key={color}>
              <button
                key={color}
                className={`w-6 h-6 rounded-sm  border-2 ${style.stroke === color ? "border-white" : "border-transparent"}`}
                style={{ backgroundColor: color }}
                onClick={() => setStyle({ stroke: color })}
              ></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs">Background</p>
        <div className="flex gap-2">
          {fillColors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-sm border-2 ${style.fill === color ? "border-2" : "border-transparent"}`}
              style={{ backgroundColor: color || "transparent" }}
              onClick={() => setStyle({ fill: color || undefined })}
            >
              {color === null && (
                // checkerboard icon for transparent
                <svg viewBox="0 0 20 20" width={20} height={20}>
                  <pattern
                    id="checker"
                    width="4"
                    height="4"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="2" height="2" fill="#ccc" />
                    <rect x="2" y="2" width="2" height="2" fill="#ccc" />
                  </pattern>
                  <rect width="20" height="20" fill="url(#checker)" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
      {style.fill && (
        <div>
          <p className="mb-2 text-xs">Fill</p>
            <button
              className={`w-6 h-6 rounded-sm border-2 ${style.fillStyle === "hachure" ? "border-2" : "border-transparent"}`}
              onClick={() => setStyle({ fillStyle: "hachure" })}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                ></path>
                <mask
                  id="FillHachureIcon"
                  maskUnits="userSpaceOnUse"
                  x="2"
                  y="2"
                  width="16"
                  height="16"
                >
                  <path
                    d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  ></path>
                </mask>
                <g mask="url(#FillHachureIcon)">
                  <path
                    d="M2.258 15.156 15.156 2.258M7.324 20.222 20.222 7.325m-20.444 5.35L12.675-.222m-8.157 18.34L17.416 5.22"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </button>
            <button
              className={`w-6 h-6 rounded-sm border-2 ${style.fillStyle === "cross-hatch" ? "border-2" : "border-transparent"}`}
              onClick={() => setStyle({ fillStyle: "cross-hatch" })}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
              >
                <g clipPath="url(#a)">
                  <path
                    d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  ></path>
                  <mask
                    id="FillCrossHatchIcon"
                    maskUnits="userSpaceOnUse"
                    x="-1"
                    y="-1"
                    width="22"
                    height="22"
                  >
                    <path
                      d="M2.426 15.044 15.044 2.426M7.383 20 20 7.383M0 12.617 12.617 0m-7.98 17.941L17.256 5.324m-2.211 12.25L2.426 4.956M20 12.617 7.383 0m5.234 20L0 7.383m17.941 7.98L5.324 2.745"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </mask>
                  <g mask="url(#FillCrossHatchIcon)">
                    <path
                      d="M14.121 2H5.88A3.879 3.879 0 0 0 2 5.879v8.242A3.879 3.879 0 0 0 5.879 18h8.242A3.879 3.879 0 0 0 18 14.121V5.88A3.879 3.879 0 0 0 14.121 2Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </g>
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" d="M0 0h20v20H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button
              className={`w-6 h-6 rounded-sm border-1 ${style.fillStyle === "solid" ? "border-2" : "border-transparent"}`}
              onClick={() => setStyle({ fillStyle: "solid" })}
            >
              <Square className="w-5 h-5 fill-current text-[hsl(var(--tool-fill))]" />
            </button>
        </div>
      )}
      <div>
        <p className="text-xs mb-2">Stroke Width</p>
        <div className="flex gap-2">
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.strokeWidth === 1 ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ strokeWidth: 1 })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M4.167 10h11.666"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.strokeWidth === 2 ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ strokeWidth: 2 })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M5 10h10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.strokeWidth === 4 ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ strokeWidth: 4 })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M5 10h10"
                stroke="currentColor"
                strokeWidth="3.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs mb-2">Stroke Style</p>
        <div className="flex gap-2">
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.strokeStyle === "solid" ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ strokeStyle: "solid" })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M4.167 10h11.666"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.strokeStyle === "dashed" ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ strokeStyle: "dashed" })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g strokeWidth="2">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12h2"></path>
                <path d="M17 12h2"></path>
                <path d="M11 12h2"></path>
              </g>
            </svg>
          </button>
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.strokeStyle === "dotted" ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ strokeStyle: "dotted" })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g strokeWidth="2">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M4 12v.01"></path>
                <path d="M8 12v.01"></path>
                <path d="M12 12v.01"></path>
                <path d="M16 12v.01"></path>
                <path d="M20 12v.01"></path>
              </g>
            </svg>
          </button>
        </div>
      </div>
      {currentTool !== 'draw' && selectedShape?.type !== 'draw' &&(<div>
        <p className="text-xs mb-2">Sloppiness</p>
        <div className="flex gap-2">
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.roughness === 1 ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ roughness: 1 })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M2.5 12.038c1.655-.885 5.9-3.292 8.568-4.354 2.668-1.063.101 2.821 1.32 3.104 1.218.283 5.112-1.814 5.112-1.814"
                strokeWidth="1.25"
              ></path>
            </svg>
          </button>
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.roughness === 2 ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ roughness: 2 })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M2.5 12.563c1.655-.886 5.9-3.293 8.568-4.355 2.668-1.062.101 2.822 1.32 3.105 1.218.283 5.112-1.814 5.112-1.814m-13.469 2.23c2.963-1.586 6.13-5.62 7.468-4.998 1.338.623-1.153 4.11-.132 5.595 1.02 1.487 6.133-1.43 6.133-1.43"
                strokeWidth="1.25"
              ></path>
            </svg>
          </button>
          <button
            className={`w-6 h-6 rounded-sm border-1 ${style.roughness === 4 ? "border-2" : "border-transparent"}`}
            onClick={() => setStyle({ roughness: 4 })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M2.5 11.936c1.737-.879 8.627-5.346 10.42-5.268 1.795.078-.418 5.138.345 5.736.763.598 3.53-1.789 4.235-2.147M2.929 9.788c1.164-.519 5.47-3.28 6.987-3.114 1.519.165 1 3.827 2.121 4.109 1.122.281 3.839-2.016 4.606-2.42"
                strokeWidth="1.25"
              ></path>
            </svg>
          </button>
        </div>
      </div>)}

      <div>
        <p className="mb-2 text-xs">Canvas Background</p>
        <div className="flex gap-2">
          
            <button
              className={`w-6 h-6 rounded-sm  border-2 ${canvasBg === "#121212" ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor : '#121212' }}
              onClick={() => setCanvasBg('#121212')}
            ></button>
            <button
              className={`w-6 h-6 rounded-sm  border-2 ${canvasBg === "#161718" ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor : '#161718' }}
              onClick={() => setCanvasBg('#161718')}
            ></button>
            <button
              className={`w-6 h-6 rounded-sm  border-2 ${canvasBg === "#13171c" ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor : '#13171c' }}
              onClick={() => setCanvasBg('#13171c')}
            ></button>
            <button
              className={`w-6 h-6 rounded-sm  border-2 ${canvasBg === "#181605" ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor : '#181605' }}
              onClick={() => setCanvasBg('#181605')}
            ></button>
            <button
              className={`w-6 h-6 rounded-sm  border-2 ${canvasBg === "#1b1615" ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor : '#1b1615' }}
              onClick={() => setCanvasBg('#1b1615')}
            ></button>
          
        </div>
      </div>
    </div>
  );
}
