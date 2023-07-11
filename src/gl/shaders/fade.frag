uniform sampler2D tDiffuse;

varying vec2 vUv;

void main () {
    vec2 uv = vUv;
    uv -= 0.5;
    uv *= 0.995;
    uv += 0.5;
    vec4 texel = texture2D(tDiffuse, uv);
    
    vec4 fadeColor = vec4(0.0, 0.0, 0.0, 1.0);
    
    gl_FragColor = mix(texel, fadeColor, 0.05);
}