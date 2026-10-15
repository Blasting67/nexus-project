import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface CleverkorMascot3DProps {
  className?: string
  height?: string
  /** true mientras el usuario lo tiene agarrado: deja de saludar, patalea y pone cara de susto */
  grabbed?: boolean
  /** Cada vez que este número aumenta, Kor saluda (útil cuando otro elemento captura el clic) */
  waveTrigger?: number
}

export const CleverkorMascot3D: React.FC<CleverkorMascot3DProps> = ({
  className = '',
  height = '480px',
  grabbed = false,
  waveTrigger = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isWaving, setIsWaving] = useState(false)
  const isWavingRef = useRef(false)
  isWavingRef.current = isWaving
  const grabbedRef = useRef(false)
  grabbedRef.current = grabbed

  // Saludo disparado desde afuera (toque sin arrastre)
  useEffect(() => {
    if (waveTrigger > 0 && !grabbedRef.current) setIsWaving(true)
  }, [waveTrigger])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()

    let width = container.clientWidth || 460
    let containerHeight = container.clientHeight || 480

    const camera = new THREE.PerspectiveCamera(34, width / containerHeight, 0.1, 100)

    const updateCamera = (w: number, h: number) => {
      const aspect = w / h
      const fitH = 4.4
      const fitW = 3.6
      const vFovRad = (camera.fov * Math.PI) / 180
      const distH = (fitH / 2) / Math.tan(vFovRad / 2)
      const distW = (fitW / 2) / (Math.tan(vFovRad / 2) * aspect)
      const cameraZ = Math.max(distH, distW, 6.8)
      camera.position.set(0, -0.15, cameraZ)
      camera.aspect = aspect
      camera.updateProjectionMatrix()
    }

    updateCamera(width, containerHeight)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, containerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
    keyLight.position.set(4, 5, 4)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.9)
    fillLight.position.set(-4, 1, 3)
    scene.add(fillLight)

    const characterGroup = new THREE.Group()
    scene.add(characterGroup)

    const headGroup = new THREE.Group()
    headGroup.position.set(0, 0.48, 0)
    characterGroup.add(headGroup)

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
      metalness: 0.0,
    })

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.0,
    })

    const cyanAccentMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    })

    const faceCanvas = document.createElement('canvas')
    faceCanvas.width = 1024
    faceCanvas.height = 1024
    const ctx = faceCanvas.getContext('2d')!
    const faceTexture = new THREE.CanvasTexture(faceCanvas)
    faceTexture.colorSpace = THREE.SRGBColorSpace

    // blinkFactor: parpadeo normal. scared: cara de susto (ojos enormes, cejas, boca abierta).
    // jx/jy: temblor de las pupilas cuando está asustado.
    const renderFace = (blinkFactor = 1, scared = false, jx = 0, jy = 0) => {
      ctx.fillStyle = '#0b101d'
      ctx.fillRect(0, 0, 1024, 1024)

      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 32
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (scared) {
        // Cejas preocupadas (extremos internos hacia arriba)
        ctx.lineWidth = 26
        ctx.beginPath()
        ctx.moveTo(235, 305)
        ctx.lineTo(410, 245)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(790, 305)
        ctx.lineTo(615, 245)
        ctx.stroke()

        // Ojos muy abiertos con pupilas temblando
        const eyes: [number, number][] = [
          [335, 445],
          [690, 445],
        ]
        eyes.forEach(([ex, ey]) => {
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.ellipse(ex, ey, 92, 115, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#0b101d'
          ctx.beginPath()
          ctx.arc(ex + jx, ey + jy, 26, 0, Math.PI * 2)
          ctx.fill()
        })

        // Boca abierta de susto
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.ellipse(512, 625, 62, 80, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#0b101d'
        ctx.beginPath()
        ctx.ellipse(512, 638, 38, 55, 0, 0, Math.PI * 2)
        ctx.fill()

        // Gota de sudor
        ctx.fillStyle = '#38bdf8'
        ctx.beginPath()
        ctx.moveTo(865, 300)
        ctx.quadraticCurveTo(905, 375, 865, 410)
        ctx.quadraticCurveTo(825, 375, 865, 300)
        ctx.fill()

        faceTexture.needsUpdate = true
        return
      }

      const leftH = 150 * blinkFactor
      if (leftH > 16) {
        ctx.save()
        ctx.translate(330, 455)
        ctx.rotate(-0.08)
        ctx.beginPath()
        ctx.ellipse(0, 0, 68, leftH, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      } else {
        ctx.beginPath()
        ctx.moveTo(260, 455)
        ctx.lineTo(400, 455)
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.moveTo(615, 395)
      ctx.lineTo(720, 455)
      ctx.lineTo(615, 515)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(512, 530, 95, 0.12 * Math.PI, 0.88 * Math.PI, false)
      ctx.closePath()
      ctx.fill()

      faceTexture.needsUpdate = true
    }

    renderFace()

    const helmetGeo = new THREE.SphereGeometry(1.0, 40, 40)
    const helmet = new THREE.Mesh(helmetGeo, whiteMat)
    helmet.scale.set(1.16, 0.96, 1.0)
    headGroup.add(helmet)

    const visorGeo = new THREE.SphereGeometry(0.88, 40, 40)
    const vPos = visorGeo.attributes.position
    const vUvs = visorGeo.attributes.uv
    for (let i = 0; i < vPos.count; i++) {
      const vx = vPos.getX(i)
      const vy = vPos.getY(i)
      vUvs.setXY(i, (vx / 0.88) * 0.46 + 0.5, (vy / 0.88) * 0.46 + 0.5)
    }
    vUvs.needsUpdate = true

    const visorMat = new THREE.MeshBasicMaterial({
      map: faceTexture,
    })
    const visor = new THREE.Mesh(visorGeo, visorMat)
    visor.position.set(0, -0.02, 0.38)
    visor.scale.set(1.10, 0.90, 0.82)
    headGroup.add(visor)

    const rimGeo = new THREE.TorusGeometry(0.85, 0.08, 20, 48)
    const rim = new THREE.Mesh(rimGeo, darkMat)
    rim.position.set(0, -0.02, 0.44)
    rim.scale.set(1.12, 0.92, 0.4)
    headGroup.add(rim)

    const leftEarGroup = new THREE.Group()
    leftEarGroup.position.set(-1.18, 0.02, 0.05)
    headGroup.add(leftEarGroup)

    const rightEarGroup = new THREE.Group()
    rightEarGroup.position.set(1.18, 0.02, 0.05)
    headGroup.add(rightEarGroup)

    const earOuterGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.16, 24)
    const leftEarOuter = new THREE.Mesh(earOuterGeo, darkMat)
    leftEarOuter.rotation.z = Math.PI / 2
    leftEarGroup.add(leftEarOuter)

    const leftEarInner = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 24), whiteMat)
    leftEarInner.rotation.z = Math.PI / 2
    leftEarGroup.add(leftEarInner)

    const rightEarOuter = new THREE.Mesh(earOuterGeo, darkMat)
    rightEarOuter.rotation.z = Math.PI / 2
    rightEarGroup.add(rightEarOuter)

    const rightEarInner = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 24), whiteMat)
    rightEarInner.rotation.z = Math.PI / 2
    rightEarGroup.add(rightEarInner)

    const antennaGeo = new THREE.CapsuleGeometry(0.07, 0.44, 16, 16)
    const leftAntenna = new THREE.Mesh(antennaGeo, darkMat)
    leftAntenna.position.set(-1.02, 0.70, 0.04)
    leftAntenna.rotation.z = 0.12
    headGroup.add(leftAntenna)

    const rightAntenna = new THREE.Mesh(antennaGeo, darkMat)
    rightAntenna.position.set(1.02, 0.70, 0.04)
    rightAntenna.rotation.z = -0.12
    headGroup.add(rightAntenna)

    const micCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.16, -0.08, 0.15),
      new THREE.Vector3(0.98, -0.30, 0.55),
      new THREE.Vector3(0.72, -0.40, 0.82),
      new THREE.Vector3(0.44, -0.36, 0.88),
    ])
    const micTubeGeo = new THREE.TubeGeometry(micCurve, 24, 0.035, 12, false)
    const micTube = new THREE.Mesh(micTubeGeo, darkMat)
    headGroup.add(micTube)

    const micTip = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.09, 12, 12), darkMat)
    micTip.position.set(0.44, -0.36, 0.88)
    micTip.rotation.y = Math.PI / 3
    headGroup.add(micTip)

    const micLed = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), cyanAccentMat)
    micLed.position.set(0.41, -0.36, 0.91)
    headGroup.add(micLed)

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.44, 0.18, 24), darkMat)
    neck.position.set(0, -0.40, 0)
    characterGroup.add(neck)

    const bodyGroup = new THREE.Group()
    bodyGroup.position.set(0, -0.92, 0)
    characterGroup.add(bodyGroup)

    const torsoGeo = new THREE.SphereGeometry(0.68, 32, 32)
    const torso = new THREE.Mesh(torsoGeo, whiteMat)
    torso.scale.set(0.98, 0.90, 0.82)
    bodyGroup.add(torso)

    const chestBadgeCanvas = document.createElement('canvas')
    chestBadgeCanvas.width = 256
    chestBadgeCanvas.height = 180
    const bctx = chestBadgeCanvas.getContext('2d')!
    bctx.fillStyle = '#0f172a'
    bctx.beginPath()
    bctx.roundRect(16, 16, 224, 148, 28)
    bctx.fill()
    bctx.strokeStyle = '#38bdf8'
    bctx.lineWidth = 18
    bctx.lineCap = 'round'
    bctx.lineJoin = 'round'
    bctx.beginPath()
    bctx.moveTo(90, 48)
    bctx.lineTo(90, 132)
    bctx.moveTo(165, 54)
    bctx.lineTo(95, 90)
    bctx.lineTo(168, 126)
    bctx.stroke()
    const chestTexture = new THREE.CanvasTexture(chestBadgeCanvas)
    chestTexture.colorSpace = THREE.SRGBColorSpace
    const chestDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.28),
      new THREE.MeshBasicMaterial({ map: chestTexture, transparent: true })
    )
    chestDisplay.position.set(0, 0.05, 0.54)
    bodyGroup.add(chestDisplay)

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.045, 16, 36), darkMat)
    belt.rotation.x = Math.PI / 2
    belt.position.set(0, -0.42, 0)
    bodyGroup.add(belt)

    const leftArmGroup = new THREE.Group()
    leftArmGroup.position.set(-0.62, 0.16, 0.05)
    bodyGroup.add(leftArmGroup)

    const armGeo = new THREE.CapsuleGeometry(0.13, 0.30, 16, 16)
    const leftArmMesh = new THREE.Mesh(armGeo, whiteMat)
    leftArmMesh.position.set(-0.16, 0.12, 0.1)
    leftArmMesh.rotation.z = -0.55
    leftArmMesh.rotation.x = 0.35
    leftArmGroup.add(leftArmMesh)

    const leftGlove = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), whiteMat)
    leftGlove.position.set(-0.28, 0.34, 0.18)
    leftArmGroup.add(leftGlove)

    const leftThumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.08, 12, 12), whiteMat)
    leftThumb.position.set(-0.2, 0.40, 0.22)
    leftThumb.rotation.z = -0.4
    leftArmGroup.add(leftThumb)

    const leftCuff = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 12, 20), darkMat)
    leftCuff.position.set(-0.24, 0.24, 0.15)
    leftCuff.rotation.z = -0.55
    leftArmGroup.add(leftCuff)

    const rightArmGroup = new THREE.Group()
    rightArmGroup.position.set(0.62, 0.16, 0.05)
    bodyGroup.add(rightArmGroup)

    const rightArmMesh = new THREE.Mesh(armGeo, whiteMat)
    rightArmMesh.position.set(0.14, -0.12, 0.08)
    rightArmMesh.rotation.z = 0.4
    rightArmMesh.rotation.x = -0.15
    rightArmGroup.add(rightArmMesh)

    const rightGlove = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), whiteMat)
    rightGlove.position.set(0.24, -0.32, 0.16)
    rightArmGroup.add(rightGlove)

    const rightThumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.08, 12, 12), whiteMat)
    rightThumb.position.set(0.16, -0.34, 0.24)
    rightThumb.rotation.z = 0.4
    rightArmGroup.add(rightThumb)

    const rightCuff = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 12, 20), darkMat)
    rightCuff.position.set(0.20, -0.22, 0.12)
    rightCuff.rotation.z = 0.4
    rightArmGroup.add(rightCuff)

    const legGeo = new THREE.CapsuleGeometry(0.14, 0.24, 16, 16)
    const bootGeo = new THREE.SphereGeometry(0.20, 20, 20)

    const leftLegGroup = new THREE.Group()
    leftLegGroup.position.set(-0.28, -0.58, 0.02)
    bodyGroup.add(leftLegGroup)

    const leftLegMesh = new THREE.Mesh(legGeo, whiteMat)
    leftLegMesh.position.set(0, -0.12, 0)
    leftLegGroup.add(leftLegMesh)

    const leftBoot = new THREE.Mesh(bootGeo, darkMat)
    leftBoot.position.set(0, -0.26, 0.08)
    leftBoot.scale.set(0.9, 0.72, 1.3)
    leftLegGroup.add(leftBoot)

    const rightLegGroup = new THREE.Group()
    rightLegGroup.position.set(0.28, -0.58, 0.02)
    bodyGroup.add(rightLegGroup)

    const rightLegMesh = new THREE.Mesh(legGeo, whiteMat)
    rightLegMesh.position.set(0, -0.12, 0)
    rightLegGroup.add(rightLegMesh)

    const rightBoot = new THREE.Mesh(bootGeo, darkMat)
    rightBoot.position.set(0, -0.26, 0.08)
    rightBoot.scale.set(0.9, 0.72, 1.3)
    rightLegGroup.add(rightBoot)

    const shadowGeo = new THREE.CircleGeometry(0.95, 32)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.12,
    })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.set(0, -1.9, 0)
    characterGroup.add(shadowMesh)

    const targetRotation = { x: 0, y: 0 }
    const currentRotation = { x: 0, y: 0 }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotation.y = Math.max(-0.45, Math.min(0.45, x * 0.45))
      targetRotation.x = Math.max(-0.25, Math.min(0.25, -y * 0.25))
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animationFrameId: number
    let clock = new THREE.Clock()
    let lastBlink = 0
    let blinkDuration = 0.15
    let isBlinking = false
    let waveStartTime = 0

    // Nivel de pánico 0..1 (sube suave al ser agarrado y baja al soltarlo)
    let panic = 0
    let faceScared = false
    let lastFaceJitter = 0

    const lerp = THREE.MathUtils.lerp

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const delta = Math.min(clock.getDelta(), 0.05)
      const time = clock.getElapsedTime()

      // --- Pánico ---
      panic = THREE.MathUtils.damp(panic, grabbedRef.current ? 1 : 0, 10, delta)
      if (panic < 0.001) panic = 0
      const p = panic
      const scaredNow = p > 0.5

      const bobOffset = Math.sin(time * 2.2) * 0.12
      const swayOffset = Math.cos(time * 1.6) * 0.04
      characterGroup.position.set(
        swayOffset * (1 - p) + Math.sin(time * 26) * 0.03 * p,
        bobOffset * (1 - p) + Math.sin(time * 31) * 0.03 * p,
        0
      )

      shadowMesh.scale.setScalar((1 - bobOffset * 1.2) * (1 - 0.3 * p))
      shadowMesh.material.opacity = (0.12 - bobOffset * 0.3) * (1 - 0.5 * p)

      currentRotation.x = THREE.MathUtils.damp(currentRotation.x, targetRotation.x, 4.0, delta)
      currentRotation.y = THREE.MathUtils.damp(currentRotation.y, targetRotation.y, 4.0, delta)

      // Mientras lo agarran deja de mirar al cursor y se retuerce
      characterGroup.rotation.y = currentRotation.y * 0.5 * (1 - p)
      characterGroup.rotation.x = currentRotation.x * 0.4 * (1 - p)
      characterGroup.rotation.z = Math.sin(time * 1.8) * 0.03 * (1 - p) + Math.sin(time * 18) * 0.1 * p

      headGroup.rotation.y =
        (currentRotation.y * 0.9 + Math.sin(time * 1.5) * 0.02) * (1 - p) + Math.sin(time * 22) * 0.25 * p
      headGroup.rotation.x = (currentRotation.x * 0.8 + Math.cos(time * 1.2) * 0.02) * (1 - p) + 0.08 * p
      headGroup.rotation.z = Math.sin(time * 26) * 0.1 * p

      const squash = 1 + Math.sin(time * 2.2) * 0.03 + Math.sin(time * 20) * 0.05 * p
      torso.scale.set(0.98, 0.90 * squash, 0.82)

      // Antenas que se agitan
      leftAntenna.rotation.z = 0.12 + Math.sin(time * 21) * 0.45 * p
      rightAntenna.rotation.z = -0.12 + Math.sin(time * 21 + 1.2) * 0.45 * p

      // --- Saludo (se cancela si lo agarran) ---
      if (grabbedRef.current) {
        waveStartTime = 0
        if (isWavingRef.current) setIsWaving(false)
      }

      if (isWavingRef.current && !grabbedRef.current) {
        if (waveStartTime === 0) waveStartTime = time
        const waveTime = time - waveStartTime
        leftArmGroup.rotation.z = Math.sin(waveTime * 12) * 0.4 - 0.2
        leftArmGroup.rotation.x = 0.3 + Math.cos(waveTime * 8) * 0.15
        if (waveTime > 2.2) {
          setIsWaving(false)
          waveStartTime = 0
        }
      } else {
        const armBreath = Math.sin(time * 2.2) * 0.08
        leftArmGroup.rotation.z = THREE.MathUtils.damp(leftArmGroup.rotation.z, -0.05 + armBreath, 3.0, delta)
        leftArmGroup.rotation.x = THREE.MathUtils.damp(leftArmGroup.rotation.x, 0.05, 3.0, delta)
      }

      rightArmGroup.rotation.z = THREE.MathUtils.damp(rightArmGroup.rotation.z, 0.05 - Math.sin(time * 2.2) * 0.08, 3.0, delta)
      rightArmGroup.rotation.x = THREE.MathUtils.damp(rightArmGroup.rotation.x, 0.05, 3.0, delta)

      leftLegGroup.rotation.x = Math.sin(time * 2.0) * 0.08
      rightLegGroup.rotation.x = -Math.sin(time * 2.0) * 0.08

      // --- Forcejeo: brazos y piernas pataleando ---
      if (p > 0) {
        leftArmGroup.rotation.z = lerp(leftArmGroup.rotation.z, -0.4 + Math.sin(time * 19) * 0.8, p)
        leftArmGroup.rotation.x = lerp(leftArmGroup.rotation.x, 0.3 + Math.cos(time * 15) * 0.5, p)
        rightArmGroup.rotation.z = lerp(rightArmGroup.rotation.z, 0.7 + Math.sin(time * 18 + 1.3) * 0.8, p)
        rightArmGroup.rotation.x = lerp(rightArmGroup.rotation.x, Math.sin(time * 14 + 0.6) * 0.6, p)

        leftLegGroup.rotation.x = lerp(leftLegGroup.rotation.x, Math.sin(time * 17) * 0.9, p)
        rightLegGroup.rotation.x = lerp(rightLegGroup.rotation.x, -Math.sin(time * 17) * 0.9, p)
        leftLegGroup.rotation.z = lerp(leftLegGroup.rotation.z, -0.25 + Math.sin(time * 13) * 0.2, p)
        rightLegGroup.rotation.z = lerp(rightLegGroup.rotation.z, 0.25 - Math.sin(time * 13) * 0.2, p)
      } else {
        leftLegGroup.rotation.z = THREE.MathUtils.damp(leftLegGroup.rotation.z, 0, 6.0, delta)
        rightLegGroup.rotation.z = THREE.MathUtils.damp(rightLegGroup.rotation.z, 0, 6.0, delta)
      }

      // LED del micrófono: rojo cuando está asustado
      cyanAccentMat.color.setHex(scaredNow ? 0xef4444 : 0x38bdf8)

      // --- Cara ---
      if (scaredNow) {
        isBlinking = false
        if (!faceScared || time - lastFaceJitter > 0.07) {
          faceScared = true
          lastFaceJitter = time
          renderFace(1, true, (Math.random() - 0.5) * 26, (Math.random() - 0.5) * 20)
        }
      } else if (faceScared) {
        faceScared = false
        renderFace(1)
        lastBlink = time
      }

      if (!scaredNow && !faceScared) {
        if (time - lastBlink > 3.6) {
          isBlinking = true
          lastBlink = time
        }

        if (isBlinking) {
          const blinkProgress = (time - lastBlink) / blinkDuration
          if (blinkProgress >= 1) {
            isBlinking = false
            renderFace(1)
          } else {
            const factor = Math.abs(Math.sin(blinkProgress * Math.PI - Math.PI / 2))
            renderFace(factor)
          }
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nw = entry.contentRect.width || container.clientWidth || 460
        const nh = entry.contentRect.height || container.clientHeight || 480
        if (nw > 0 && nh > 0) {
          updateCamera(nw, nh)
          renderer.setSize(nw, nh)
        }
      }
    })
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
      faceTexture.dispose()
      chestTexture.dispose()
      whiteMat.dispose()
      darkMat.dispose()
      cyanAccentMat.dispose()
      visorMat.dispose()
      shadowMat.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onClick={() => {
        if (!grabbedRef.current) setIsWaving(true)
      }}
      className={`w-full h-full relative cursor-pointer select-none flex items-center justify-center overflow-visible ${className}`}
      style={{ height }}
      title="Haz clic para saludar a Kor"
    />
  )
}