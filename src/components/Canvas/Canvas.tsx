import React, {useRef, useEffect, useState, useCallback} from 'react';
import ControlPanel from "../ControlPanel/ControlPanel";
import {Rectangle} from "./CanvasTypes";

const getRandomColor = () => `#${Math.random().toString(16).slice(2, 8)}`;

const handleAddRandomRectangle = (canvas: HTMLCanvasElement): Rectangle => {
    const maxWidth = canvas.width;
    const maxHeight = canvas.height;
    const width = Math.round(Math.random() * 100 + 20);
    const height = Math.round(Math.random() * 100 + 20);
    const x = Math.round(Math.random() * (maxWidth - width));
    const y = Math.round(Math.random() * (maxHeight - height));
    const color = getRandomColor();
    const rotation = Math.random() * 2 * Math.PI;

    return { x, y, width, height, color, rotation };
};

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rectangles, setRectangles] = useState<Rectangle[]>([]);
    const [animationDuration, setAnimationDuration] = useState<number>(2);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    useEffect(() => {
        draw();
    }, [rectangles, isAnimating]);

    const addRandomRectangle = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setRectangles(currentRectangles => [...currentRectangles, handleAddRandomRectangle(canvas)]);
    };


    const changeColors = () => {
        const newRectangles = rectangles.map(rect => ({
            ...rect,
            color: getRandomColor(),
        }));
        setRectangles(newRectangles);
    };

    const downloadSceneData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rectangles));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "scene_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const animate = () => {
        let start: number | undefined;
        const animateStep = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const canvas = canvasRef.current;

            if (canvas && canvas.getContext) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const globalRotation = (Math.PI * 2 * progress) / (animationDuration * 1000);

                    rectangles.forEach((rect) => {
                        ctx.save();
                        ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
                        ctx.rotate(globalRotation + rect.rotation);
                        ctx.fillStyle = rect.color;
                        ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
                        ctx.restore();
                    });

                    if (progress < animationDuration * 1000) {
                        requestAnimationFrame(animateStep);
                    } else {
                        setIsAnimating(false);
                    }
                }
            }
        };
        setIsAnimating(true);
        requestAnimationFrame(animateStep);
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || isAnimating) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rectangles.forEach(rect => {
            ctx.save();
            ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
            ctx.rotate(rect.rotation);
            ctx.fillStyle = rect.color;
            ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
            ctx.restore();
        });
    }, [rectangles, isAnimating]);


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();

        if (event.target.files?.length) {
            const file = event.target.files[0];

            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = e => {
                const content = e.target?.result;

                try {
                    const jsonData = JSON.parse(content as string);
                    setRectangles(jsonData);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };
        }
    };

    const clearRectangles = () => {
        setRectangles([]);
    };

    return (
        <>
            <div className="canvas-container">
                <canvas ref={canvasRef} width={600} height={400}/>
            </div>
            <ControlPanel
                addRandomRectangle={addRandomRectangle}
                clearRectangles={clearRectangles}
                animate={animate}
                changeColors={changeColors}
                downloadSceneData={downloadSceneData}
                setAnimationDuration={setAnimationDuration}
                handleFileUpload={handleFileUpload}
                rectangles={rectangles}
                animationDuration={animationDuration}
                isAnimating={isAnimating}
            />
        </>
    );
};

export default Canvas;
