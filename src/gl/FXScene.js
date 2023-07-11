import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import store from '../store'

class FXScene {
    constructor(renderer) {
        this.renderer = renderer
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(45, store.width / store.height, 0.1, 100)
        this.camera.position.set(0, 0, 5)

        this.fbo = new THREE.WebGLRenderTarget(store.width * store.pixelRatio, store.height * store.pixelRatio, {
            type: THREE.FloatType,
            samples: 8,
        })

        this.clearColor = 0x000000

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true

        this.direction = new THREE.Vector3(
            Math.random() > 0.5 ? 1 : -1,
            Math.random() > 0.5 ? 1 : -1,
            Math.random() > 0.5 ? 1 : -1
        )
    }

    add(object) {
        this.scene.add(object)
    }

    update(t) {
        this.controls.update()

        let tScale = 0.5

        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                child.rotation.x = t * tScale * this.direction.x
                child.rotation.y = t * tScale * this.direction.y
                child.rotation.z = t * tScale * this.direction.z
            }
        })
    }

    render(rtt) {
        this.renderer.setClearColor(this.clearColor)

        if (rtt) {
            this.renderer.setRenderTarget(this.fbo)
            this.renderer.clear()
            this.renderer.render(this.scene, this.camera)
        } else {
            this.renderer.setRenderTarget(null)
            this.renderer.render(this.scene, this.camera)
        }
    }
}

export { FXScene }