import * as THREE from 'three'

import baseVert from './shaders/base.vert'
import outputFrag from './shaders/output.frag'

import { FXScene } from './FXScene'
import { Feedback } from './Feedback'

import store from '../store'

class Sketch {
    constructor({ el = document.body, width = 500, height = 500 }) {
        // Dom and bounds
        this.container = el
        this.width = width
        this.height = height

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            // antialias: true,
            // alpha: true,
        })
        this.renderer.setSize(width, height)
        // If you want to see the feedback effect work
        // set the color alpha to 0
        this.renderer.setClearColor(0xffffff, 0)
        this.container.appendChild(this.renderer.domElement)

        // Camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)

        // Clock
        this.clock = new THREE.Clock()

        this.init()
    }

    init() {
        this.createScenes()
        this.createQuad()
        this.createFx()
        this.addEvents()
    }

    createScenes() {
        // Creates two scenes to be rendered in different FBOs
        this.scene1 = new FXScene(this.renderer)
        this.scene2 = new FXScene(this.renderer)

        let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
        box.scale.setScalar(1.25)
        let ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshNormalMaterial())

        this.scene1.add(box)
        this.scene2.add(ico)
    }

    createQuad() {
        // Fullscreen quad that contains the textures from the two scenes
        let geometry = new THREE.PlaneGeometry(2, 2)
        let material = new THREE.ShaderMaterial({
            vertexShader: baseVert,
            fragmentShader: outputFrag,
            uniforms: {
                tDiffuse1: { value: null },
                tDiffuse2: { value: null },
            }
        })

        this.quad = new THREE.Mesh(geometry, material)
    }

    createFx() {
        // Render target to store the texture that contains the scene to post-process
        // (the quad with the two FX Scenes)
        this.target = new THREE.WebGLRenderTarget(
            store.width * store.pixelRatio,
            store.height * store.pixelRatio,
            {
                type: THREE.FloatType,
                samples: 8,
            }
        )

        // Instantiate feedback class
        this.feedback = new Feedback()
    }    

    addEvents() {
        window.addEventListener('resize', this.resize.bind(this))
        this.renderer.setAnimationLoop(this.render.bind(this))
    }

    resize() {
        this.renderer.setSize(this.width, this.height)
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
    }

    render() {
        let time = this.clock.getElapsedTime()

        // Render and update each FX Scene to its FBO
        // then pass the FBO textures to the quad material
        this.scene1.clearColor = 0xc9ada7
        this.scene1.render(true)
        this.scene1.update(time)
        this.quad.material.uniforms.tDiffuse1.value = this.scene1.fbo.texture

        this.scene2.clearColor = 0xf2e9e4
        this.scene2.render(true)
        this.scene2.update(time)
        this.quad.material.uniforms.tDiffuse2.value = this.scene2.fbo.texture

        // // Uncomment the next lines to see the quad with the two scenes
        // // and don't render anything else after this
        // this.renderer.setRenderTarget(null)
        // this.renderer.clear()
        // this.renderer.render(this.quad, this.camera) // straight render the mesh instead of a scene

        // Render the quad with the scenes to another render target
        this.renderer.setRenderTarget(this.target)
        this.renderer.render(this.quad, this.camera)

        // Pass the target texture to apply the effect and render the feedback
        this.feedback.passTexture(this.target.texture)
        this.feedback.render(this.renderer)
    }
}

export { Sketch }