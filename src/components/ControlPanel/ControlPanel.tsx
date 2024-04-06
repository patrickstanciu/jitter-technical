import React from 'react';
import {Rectangle} from "../Canvas/CanvasTypes";

interface ControlPanelProps {
    addRandomRectangle: () => void;
    clearRectangles: () => void;
    animate: () => void;
    changeColors: () => void;
    downloadSceneData: () => void;
    setAnimationDuration: (duration: number) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rectangles: Rectangle[];
    animationDuration: number;
    isAnimating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
        addRandomRectangle,
        clearRectangles,
        animate,
        changeColors,
        downloadSceneData,
        setAnimationDuration,
        handleFileUpload,
        rectangles,
        animationDuration,
        isAnimating
}) => {
    const disabledButton = rectangles.length === 0 || isAnimating;

    return (
        <div className="controls">
            <button disabled={isAnimating} onClick={addRandomRectangle}>Add Rectangle</button>
            <button disabled={disabledButton} onClick={clearRectangles}>
                Clear All Rectangles
            </button>
            <hr/>
            <div>
                <label htmlFor="animationDuration">Duration (s): </label>
                <input
                    id="animationDuration"
                    type="number"
                    value={animationDuration}
                    onChange={(e) => setAnimationDuration(Number(e.target.value))}
                    placeholder="Duration (s)"
                />
            </div>
            <button disabled={disabledButton} onClick={animate}>
                Play
            </button>
            <hr/>
            <button disabled={disabledButton} onClick={changeColors}>
                Change Colors
            </button>
            <button disabled={rectangles.length === 0} onClick={downloadSceneData}>
                Download JSON
            </button>
            <hr/>
            <div>
                <input
                    type="file"
                    id="fileInput"
                    style={{display: 'none'}}
                    accept=".json"
                    onChange={handleFileUpload}
                />
                <button disabled={disabledButton}
                        onClick={() => document.getElementById('fileInput')?.click()}>
                    Import Project (JSON)
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;
