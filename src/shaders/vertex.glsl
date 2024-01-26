uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec4 uCorners;

varying float pulse;
varying vec2 vUv;
varying vec2 vSize;

void main(){
    float PI = 3.1415926;
    vUv = uv;
    float sine = sin(PI * uProgress);
    // float waves = sine * 0.1 * sin(5. * length(uv) + 10. * uProgress);
    vec4 defaultStates = modelMatrix * vec4(position, 1.0);
    vec4 fullScreenStates = vec4(position, 1.0);
    fullScreenStates.x *= uResolution.x; 
    fullScreenStates.y *= uResolution.y;
    fullScreenStates.z += uCorners.x;
    float cornersProgress = mix(
        mix(uCorners.z, uCorners.w, uv.x),
        mix(uCorners.x, uCorners.y, uv.x),
        uv.y
    );

    vec4 finalStates = mix(defaultStates, fullScreenStates, cornersProgress);

    vSize = mix(uQuadSize, uResolution, cornersProgress);

    // vec3 newPosition = position;
    // newPosition.z += 0.05*sin(length(position) * 30. + uTime);
    // pulse = 20. * newPosition.z;
    
    gl_Position = projectionMatrix * viewMatrix * finalStates;
}