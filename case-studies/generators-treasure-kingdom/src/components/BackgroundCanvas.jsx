import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Clouds
    const clouds = Array.from({ length: 7 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.4),
      size: 40 + Math.random() * 60,
      speed: 0.15 + Math.random() * 0.25,
      opacity: 0.08 + Math.random() * 0.12
    }));

    // Birds
    const birds = Array.from({ length: 5 }, () => ({
      x: Math.random() * width,
      y: 50 + Math.random() * (height * 0.3),
      size: 8 + Math.random() * 8,
      speed: 0.8 + Math.random() * 0.8,
      wingOffset: Math.random() * 10
    }));

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Draw Clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > width + 150) cloud.x = -150;

        ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.size * 0.5, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Birds
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      birds.forEach((b) => {
        b.x += b.speed;
        if (b.x > width + 50) b.x = -50;

        const wingY = Math.sin(tick * 0.1 + b.wingOffset) * 6;
        ctx.beginPath();
        ctx.moveTo(b.x - b.size, b.y + wingY);
        ctx.quadraticCurveTo(b.x, b.y - wingY, b.x + b.size, b.y + wingY);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
