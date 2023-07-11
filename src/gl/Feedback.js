import * as THREE from 'three'

let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)
let geometry = new THREE.PlaneGeometry(2, 2)

class Feedback {
    constructor() {
        this.createQuads()
    }

    createQuads() {
        this.feedback
    }
}

export { Feedback }