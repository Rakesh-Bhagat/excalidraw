"use client"

import Canvas from "@/components/Canvas";
import SessionButton from "@/components/SessionButton";
import ToolBox from "@/components/ToolBox";

const StandAloneCanvas = () => {
    return (
        <div className="flex relative justify-center">
            <div className="flex absolute z-10 top-3"> 
                <ToolBox/>
            </div>
            <div className="z-12 flex absolute top-3 right-3">
                <SessionButton roomId="standalone" />
            </div>
            <div>
                <Canvas />
            </div>
        </div>
    )
}

export default StandAloneCanvas;