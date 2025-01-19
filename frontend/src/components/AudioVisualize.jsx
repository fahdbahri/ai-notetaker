import { useEffect, useRef } from 'react'

export function AudioVisualizer({ isRecording }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          if (isRecording) {
            for (let i = 0; i < 100; i++) {
              const height = Math.random() * 50
              ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'
              ctx.fillRect(i * 5, canvas.height - height, 3, height)
            }
          }
          requestAnimationFrame(animate)
        }
        animate()
      }
    }
  }, [isRecording])

  return <canvas ref={canvasRef} width="800" height="100" className="w-full" />
}

