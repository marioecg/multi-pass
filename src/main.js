import './style.css'

import { Sketch } from './gl/Sketch'
import store from './store'

let sk = new Sketch({
    el: document.querySelector('#app'),
    width: store.width,
    height: store.height,
})