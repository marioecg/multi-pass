import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
        // this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)
        this.camera.position.z = 5

        // Scene
        this.scene = new THREE.Scene()

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true

        // Clock
        this.clock = new THREE.Clock()

        this.init()
    }

    init() {
        this.createMesh()
        this.addEvents()
    }

    createMesh() {
        let geometry = new THREE.PlaneGeometry(2, 2)
        let material = new THREE.MeshNormalMaterial()

        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)
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
        this.controls.update()

        this.renderer.render(this.scene, this.camera)
    }
}

export { Sketch }
