import * as THREE from 'three'

import baseVert from './shaders/base.vert'
import baseFrag from './shaders/base.frag'

class Sketch {
    constructor({
        el = document.body,
        width = 500,
        height = 500,
    }) {
        this.container = el
        this.width = width
        this.height = height

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
        })
        this.renderer.setSize(width, height)
        this.renderer.setClearColor(0xffffff, 1.0)
        this.container.appendChild(this.renderer.domElement)

        // Camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)

        // Clock
        this.clock = new THREE.Clock()

        this.init()
    }

    init() {
        this.createQuad() // fullscreen quad to show final texture(s)
        this.addEvents()
    }

    createQuad() {
        let geometry = new THREE.PlaneGeometry(2, 2)
        let material = new THREE.ShaderMaterial({
            vertexShader: baseVert,
            fragmentShader: baseFrag,
        })

        this.quad = new THREE.Mesh(geometry, material)
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
        this.renderer.setRenderTarget(null)
        this.renderer.clear()
        this.renderer.render(this.quad, this.camera) // straight render the mesh instead of a scene
    }
}

export { Sketch }
