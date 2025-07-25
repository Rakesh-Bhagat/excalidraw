/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Github, Trash2, Download, Upload } from "lucide-react";
import { useShapeStore } from "@/store/useShapeStore";
import { useStyleStore } from "@/store/useStyleStore";
import { useParams, usePathname } from "next/navigation";

const MenuDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const params = useParams();
  const pathname = usePathname();
  const isStandalone = pathname === "/canvas";
  const roomId = isStandalone ? "standalone" : (params.roomId as string);

  const { clearShapes, getShapes } = useShapeStore();
  const { canvasBg, setCanvasBg } = useStyleStore();

  // Canvas background options
  const backgroundOptions = [
    { color: "#121212", name: "Dark Gray" },
    { color: "#161718", name: "Charcoal" },
    { color: "#13171c", name: "Dark Blue" },
    { color: "#181605", name: "Dark Olive" },
    { color: "#1b1615", name: "Dark Brown" },
    { color: "#000000", name: "Black" },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the entire canvas? This action cannot be undone.")) {
      clearShapes(roomId);
      setIsOpen(false);
    }
  };

  const handleExportCanvas = () => {
    const shapes = getShapes(roomId);
    const dataStr = JSON.stringify(shapes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `canvas-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setIsOpen(false);
  };

  const handleImportCanvas = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const shapes = JSON.parse(e.target?.result as string);
            if (Array.isArray(shapes)) {
              if (window.confirm("This will replace all current shapes. Continue?")) {
                useShapeStore.getState().setShapes(roomId, shapes);
              }
            } else {
              alert("Invalid file format");
            }
          } catch (error) {
            alert("Error reading file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setIsOpen(false);
  };

  const handleGitHub = () => {
    window.open("https://github.com/Rakesh-Bhagat/excalidraw", "_blank");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 bg-[hsl(var(--toolbox))] text-white rounded-lg hover:bg-[hsl(var(--icon-hover))] transition-colors ${
          isOpen ? "bg-[hsl(var(--icon-selected))]" : ""
        }`}
        title="Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-[hsl(var(--toolbox))] rounded-lg shadow-lg border border-gray-600 py-2 min-w-[250px] z-50">
          {/* Canvas Background Section */}
          <div className="px-4 py-2 border-b border-gray-600">
            <h3 className="text-xs font-semibold text-gray-300 mb-2">Canvas Background</h3>
            <div className="flex gap-2">
              {backgroundOptions.map((option) => (
                <button
                  key={option.color}
                  onClick={() => {
                    setCanvasBg(option.color);
                  }}
                  className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                    canvasBg === option.color ? "border-white" : "border-gray-500"
                  }`}
                  style={{ backgroundColor: option.color }}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          {/* Canvas Actions */}
          <div className="border-b border-gray-600">
            <button
              onClick={handleClearCanvas}
              className="w-full px-4 py-3 text-left text-white hover:bg-[hsl(var(--icon-hover))] transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Clear Canvas
            </button>
            
            <button
              onClick={handleExportCanvas}
              className="w-full px-4 py-3 text-left text-white hover:bg-[hsl(var(--icon-hover))] transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-3" />
              Export Canvas
            </button>
            
            <button
              onClick={handleImportCanvas}
              className="w-full px-4 py-3 text-left text-white hover:bg-[hsl(var(--icon-hover))] transition-colors flex items-center"
            >
              <Upload className="w-4 h-4 mr-3" />
              Import Canvas
            </button>
          </div>

          {/* Links */}
          <div>
            <button
              onClick={handleGitHub}
              className="w-full px-4 py-3 text-left text-white hover:bg-[hsl(var(--icon-hover))] transition-colors flex items-center"
            >
              <Github className="w-4 h-4 mr-3" />
              GitHub Repository
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;