import * as THREE from 'three'

import baseVert from './shaders/base.vert'
import fadeFrag from './shaders/fade.frag'
import copyFrag from './shaders/copy.frag'

import store from '../store'

let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)
let geometry = new THREE.PlaneGeometry(2, 2)

class Feedback {
    constructor() {
        this.createTargets()
        this.createMesh()
    }

    createTargets() {
        this.targetRead = new THREE.WebGLRenderTarget(
            store.width * store.pixelRatio,
            store.height * store.pixelRatio,
            {
                type: THREE.FloatType,
                samples: 8,
            }
        )
        this.targetWrite = new THREE.WebGLRenderTarget(
            store.width * store.pixelRatio,
            store.height * store.pixelRatio,
            {
                type: THREE.FloatType,
                samples: 8,
            }
        )
    }

    createMesh() {
        // Fullscreen quad where effects are applied in the feedback loop
        let feedbackMaterial = new THREE.ShaderMaterial({
            vertexShader: baseVert,
            fragmentShader: fadeFrag,
            uniforms: {
                tDiffuse: { value: null },
            },
        })
        this.feedbackMesh = new THREE.Mesh(geometry, feedbackMaterial)

        // Fullscreen quad where effects are applied in the feedback loop
        let resultMaterial = new THREE.MeshBasicMaterial({ map: null })
        this.resultMesh = new THREE.Mesh(geometry, resultMaterial)

        // Fullscreen to copy the texture of a render target
        let copyMaterial = new THREE.ShaderMaterial({
            vertexShader: baseVert,
            fragmentShader: copyFrag,
            uniforms: {
                tDiffuse: { value: null },
            },
            transparent: true,
        })
        this.copyMesh = new THREE.Mesh(geometry, copyMaterial)
    }

    passTexture(texture) {
        this.copyMesh.material.uniforms.tDiffuse.value = texture
    }

    render(renderer) {
        renderer.autoClearColor = false

        this.feedbackMesh.material.uniforms.tDiffuse.value = this.targetRead.texture

        renderer.setRenderTarget(this.targetWrite)
        renderer.render(this.feedbackMesh, camera)
        renderer.render(this.copyMesh, camera)

        renderer.setRenderTarget(null)
        this.resultMesh.material.map = this.targetWrite.texture
        renderer.render(this.resultMesh, camera)

        let swap = this.targetRead
        this.targetRead = this.targetWrite
        this.targetWrite = swap
    }
}

export { Feedback }