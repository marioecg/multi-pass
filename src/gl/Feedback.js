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
        // Fullscreen quad where the feedback effects happen and accumulate over time
        let feedbackMaterial = new THREE.ShaderMaterial({
            vertexShader: baseVert,
            fragmentShader: fadeFrag,
            uniforms: {
                tDiffuse: { value: null },
            },
        })
        this.feedbackMesh = new THREE.Mesh(geometry, feedbackMaterial)

        // Fullscreen quad to render the result of the feedback loop
        let resultMaterial = new THREE.MeshBasicMaterial({ map: null })
        this.resultMesh = new THREE.Mesh(geometry, resultMaterial)

        // Fullscreen quad to copy the texture of a render target,
        // used to receive a texture and "plug" it to the feedback effect
        let copyMaterial = new THREE.ShaderMaterial({
            vertexShader: baseVert,
            fragmentShader: copyFrag,
            uniforms: {
                tDiffuse: { value: null },
            },
            transparent: true, // You need to set transparent to true for the effect to be noticable 🤔❔
        })
        this.copyMesh = new THREE.Mesh(geometry, copyMaterial)
    }

    passTexture(texture) {
        this.copyMesh.material.uniforms.tDiffuse.value = texture
    }

    render(renderer) {
        // Don't clear the contents of the canvas on each render
        // in order to achieve the effect, draw the new frame
        // on top of the previous one        
        renderer.autoClearColor = false

        this.feedbackMesh.material.uniforms.tDiffuse.value = this.targetRead.texture

        renderer.setRenderTarget(this.targetWrite)
         // This will contain the ping-pong accumulated texture
        renderer.render(this.feedbackMesh, camera)
         // Render on top the original scene (or texture) containing the objects
        renderer.render(this.copyMesh, camera)

        // Set the device screen as the framebuffer to render to
        renderer.setRenderTarget(null)
        this.resultMesh.material.map = this.targetWrite.texture
        renderer.render(this.resultMesh, camera)

        // Swap buffers
        let swap = this.targetRead
        this.targetRead = this.targetWrite
        this.targetWrite = swap
    }
}

export { Feedback }