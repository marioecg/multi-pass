import * as THREE from 'three'

import store from '../store'

class FXScene {
    constructor() {
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(45, store.width / store.height, 0.1, 100)

        this.fbo = new THREE.WebGLRenderTarget(store.width, store.height, {
            type: THREE.FloatType,
        })

        this.clearColor = 0x000000
    }

    add(object) {
        this.scene.add(object)
    }

    render(rtt) {
        renderer.setClearColor(this.clearColor)

        if (rtt) {
            renderer.setRenderTarget(this.fbo)
            renderer.clear()
            renderer.render(scene, camera)
        } else {
            renderer.setRenderTarget(null)
            renderer.render(scene, camera)
        }

    }
}

export { FXScene }