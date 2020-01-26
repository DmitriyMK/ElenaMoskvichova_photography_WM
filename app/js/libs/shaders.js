/*
 * CREDITS:
 * - Fisheye shader: https://www.shadertoy.com/view/lttXD4
 * - Hover effect on the images: https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/
 * - A PEN BY Francesco Michelini  https://codepen.io/kekkorider/pen/GRKqEXy
 */
if (document.documentElement.clientWidth > 1024) {
class App {
  constructor({ images = [], texts = [] } = {}) {
    this.canvas = null
    this.engine = null
    this.scene = null
    this.camera = null

    this.images = images
    this.activeImageIndex = 0
    this.planesImg = new Array(this.images.length)
    this.planesImgBounds = new Array(this.images.length)

    this.texts = texts
    this.planesTexts = new Array(this.texts.length)
    this.planesTextsBounds = new Array(this.texts.length)

    this.fisheyePP = null
    this.fisheyeDistortion = { value: 0 }

    this.debug = false

    this.animateInDispFactorCallback = e => this.animateInDispFactor(e)
    this.animateOutDispFactorCallback = () => this.animateOutDispFactor()
  }

  init() {
    this.setup()
    this.setElementsBounds()
    this.createElements()
    this.setElementsStyle()
    this.addListeners()
    this.setFisheye()

    // console.log(this)
  }

  setup() {
    this.canvas = document.querySelector('#app')
    this.engine = new BABYLON.Engine(this.canvas, true, null, true)
    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = BABYLON.Color3.Black()

    // Lights
    const hemisphericLight = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(1, 1, 0), this.scene)

    // Camera
    this.camera = new BABYLON.ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), this.scene)
    this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA

    this.engine.runRenderLoop(() => this.scene.render())
  }

  createElements() {
    // Images

    BABYLON.Effect.ShadersStore['imagesVertexShader'] = `
     precision highp float;

     // Attributes
     attribute vec3 position;
     attribute vec3 normal;
     attribute vec2 uv;

     // Uniforms
     uniform mat4 worldViewProjection;

     // Varying
     varying vec2 vUV;

     void main(void) {
         vec3 pos = position;
         gl_Position = worldViewProjection * vec4(pos, 1.0);

         vUV = uv;
     }
    `
    BABYLON.Effect.ShadersStore['imagesFragmentShader'] = `
     precision highp float;

     uniform sampler2D u_mainTexture;
     uniform sampler2D u_secondaryTexture;
     uniform sampler2D u_displacementTexture;

     uniform float dispFactor;
     uniform float effectFactor;

     varying vec2 vUV;

     void main() {
       vec2 uv = vUV;

       vec4 disp = texture2D(u_displacementTexture, uv);

       vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r * effectFactor), uv.y);
       vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r * effectFactor), uv.y);

       vec4 _texture = texture2D(u_mainTexture, distortedPosition);
       vec4 _texture2 = texture2D(u_secondaryTexture, distortedPosition2);

       vec4 finalTexture = mix(_texture, _texture2, dispFactor);

       gl_FragColor = finalTexture;
     }
    `

    const displacementImage = new BABYLON.Texture('https://webgl-fisheye.netlify.com/displacement.jpg', this.scene, true)

    const baseMaterial = new BABYLON.ShaderMaterial(
      'DisplacementMaterial',
      this.scene,
      {
        vertex: 'images',
        fragment: 'images',
        attributes: ['position', 'normal', 'uv'],
        uniforms: ["worldViewProjection"]
      }
    )

    const baseMesh = new BABYLON.PlaneBuilder.CreatePlane(`BaseMesh`, {}, this.scene)
    const numImages = this.images.length

    for (let i = 0; i < numImages; i++) {
      this.images[i].classList.add('js-webgl-element-hidden')
      this.planesImg[i] = baseMesh.clone(`Image${i.toString().padStart(3, '0')}`)
      this.planesImg[i].material = baseMaterial.clone(`Image0${i}Material`)
      this.planesImg[i].doNotSyncBoundingInfo = true

      const mainTexture = new BABYLON.Texture(this.images[i].src.replace(window.location.href, ''), this.scene, true)
      const secondaryTexture = new BABYLON.Texture(this.images[i].src.replace(window.location.href, ''), this.scene, true)
      this.planesImg[i].material.setTexture('u_mainTexture', mainTexture)
      this.planesImg[i].material.setTexture('u_secondaryTexture', secondaryTexture)
      this.planesImg[i].material.setTexture('u_displacementTexture', displacementImage)
      this.planesImg[i].material.setFloat('dispFactor', 0)
      this.planesImg[i].material.setFloat('effectFactor', 0.5)
    }

    /*
     * Texts
     */
    // const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI")
    // const numTexts = this.texts.length

    // for (let i = 0; i < numTexts; i++) {
    //   this.texts[i].classList.add('js-webgl-element-hidden')
    //   this.planesTexts[i] = new BABYLON.GUI.TextBlock(`${this.texts[i].textContent.substring(0, 10)} ...`, this.texts[i].textContent)
    //   this.setTextStyle({ plane: this.planesTexts[i], index: i })

    //   gui.addControl(this.planesTexts[i])
    // }
  }

  setElementsBounds() {
    // Images
    let num = this.images.length
    for (let i = 0; i < num; i++) {
      const bounds = this.images[i].getBoundingClientRect()

      this.planesImgBounds[i] = {
        x: bounds.x,
        y: bounds.y + (window.scrollY || window.pageYOffset),
        width: bounds.width,
        height: bounds.height
      }
    }

    // Texts
    // num = this.texts.length
    // for (let i = 0; i < num; i++) {
    //   const bounds = this.texts[i].getBoundingClientRect()

    //   this.planesTextsBounds[i] = {
    //     x: bounds.x,
    //     y: bounds.y + (window.scrollY || window.pageYOffset),
    //     width: bounds.width,
    //     height: bounds.height
    //   }
    // }
  }

  setElementsStyle() {
    // Images
    let num = this.images.length
    for (let i = 0; i < num; i++) {
      this.planesImg[i].scaling.x = this.images[i].clientWidth
      this.planesImg[i].scaling.y = this.images[i].clientHeight
    }

    // Texts
    num = this.texts.length
    for (let i = 0; i < num; i++) {
      this.setTextStyle({ plane: this.planesTexts[i], index: i })
    }
  }

  setElementsPosition() {
    // Images
    let num = this.images.length
    for (let i = 0; i < num; i++) {
      this.planesImg[i].position.y = -this.planesImgBounds[i].height / 2 + this.canvas.clientHeight / 2 - this.planesImgBounds[i].y + (window.scrollY || window.pageYOffset)
      this.planesImg[i].position.x = this.planesImgBounds[i].width / 2 - this.canvas.clientWidth / 2 + this.planesImgBounds[i].x
    }

    // Texts
    // num = this.texts.length
    // for (let i = 0; i < num; i++) {
    //   this.planesTexts[i].top = this.planesTextsBounds[i].height / 2 - this.canvas.clientHeight / 2 + this.planesTextsBounds[i].y - (window.scrollY || window.pageYOffset)
    //   this.planesTexts[i].left = this.planesTextsBounds[i].width / 2 - this.canvas.clientWidth / 2 + this.planesTextsBounds[i].x
    // }
  }

  setTextStyle({ plane, index }) {
    const style = getComputedStyle(this.texts[index])

    plane.fontSize = style.fontSize
    plane.fontFamily = style.fontFamily
    plane.fontWeight = style.fontWeight
    plane.resizeToFit = true
    plane.textWrapping = true
    plane.widthInPixels = this.texts[index].clientWidth
    plane.heightInPixels = this.texts[index].clientHeight

    // Text alignment and positioning
    switch (style.textAlign) {
      case 'left':
      case 'start':
        plane.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT
        plane.leftInPixels = this.texts[index].clientWidth / 2
        break
      case 'right':
        plane.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_RIGHT
        plane.rightInPixels = -this.texts[index].clientWidth / 2
        break
      case 'center':
        plane.textHorizontalAlignment = BABYLON.GUI.TextBlock._HORIZONTAL_ALIGNMENT_CENTER
        break
    }
  }

  animateDispFactor({ target, to }) {
    const prop = { value: target.material._floats.dispFactor }

    TweenMax.fromTo(prop, 0.6,
      {
        value: target.material._floats.dispFactor
      },
      {
        value: to,
        onUpdate: () => {
          target.material.setFloat('dispFactor', prop.value)
        }
      })
  }

  animateInDispFactor(e) {
    this.activeImageIndex = this.images.indexOf(e.target)
    this.animateDispFactor({ target: this.planesImg[this.activeImageIndex], to: 1 })
  }

  animateOutDispFactor() {
    this.animateDispFactor({ target: this.planesImg[this.activeImageIndex], to: 0 })
  }

  animateFisheye({ value }) {
    TweenMax.to(this.fisheyeDistortion, 0.5, { value: value * 0.007 })
  }

  addListeners() {
    const numImages = this.images.length
    for (let i = 0; i < numImages; i++) {
      this.images[i].addEventListener('pointerenter', this.animateInDispFactorCallback, { passive: true })
      this.images[i].addEventListener('pointerleave', this.animateOutDispFactorCallback, { passive: true })
    }
  }

  removeListeners() {
    const numImages = this.images.length
    for (let i = 0; i < numImages; i++) {
      this.images[i].removeEventListener('pointerenter', this.animateInDispFactorCallback, { passive: true })
      this.images[i].removeEventListener('pointerleave', this.animateOutDispFactorCallback, { passive: true })
    }
  }

  setFisheye() {
    BABYLON.Effect.ShadersStore['fisheyeFragmentShader'] = `
     precision highp float;

     varying vec2 vUV;

     uniform sampler2D textureSampler;
     uniform vec2 u_resolution;
     uniform float u_distortion;

     // Forum post: http://www.html5gamedevs.com/topic/29295-fish-eye-and-reverse-fish-eye/?do=findComment&comment=168839
     // Playground: https://www.babylonjs-playground.com/#TRNYD#20
     void main() {
       vec2 uv = (gl_FragCoord.xy / u_resolution.xy) - vec2(0.5);
       float uva = atan(uv.x, uv.y);
       float uvd = sqrt(dot(uv, uv));
       float k = sin(u_distortion);
       uvd *= 1.0 + k*uvd*uvd;

       gl_FragColor = texture(textureSampler, vec2(0.5) + vec2(sin(uva), cos(uva))*uvd);

       // vec3 color = texture2D(textureSampler, vUV).xyz;
       // gl_FragColor = vec4(color, 1.0);
     }
    `

    this.fisheyePP = new BABYLON.PostProcess('fisheye', 'fisheye', ['u_resolution', 'u_distortion'], null, 1, this.camera, 0, this.engine);
    this.fisheyePP.onApply = effect => {
      effect.setFloat2('u_resolution', this.fisheyePP.width, this.fisheyePP.height)
    }

    this.fisheyePP.onBeforeRenderObservable.add(effect => effect.setFloat('u_distortion', this.fisheyeDistortion.value))
  }

  destroy() {
    this.removeListeners()
    this.engine.dispose()
  }
}

const app = new App({
  images: [...document.querySelectorAll('.js-webgl-image')],
  texts: [...document.querySelectorAll('.js-webgl-text')]
})

imagesLoaded('#wrapper', () => {
  document.querySelector('.load-screen').classList.add('hidden')

  app.init()

  const updateValues = ({ size, scroll }) => {
    if (size.changed) {
      app.engine.resize()
      app.setElementsBounds()
      app.setElementsStyle()
      app.setElementsPosition()
    }

    if (scroll.changed) {
      app.animateFisheye({ value: scroll.velocity.y })
      app.setElementsPosition()
    }
  }

  tornis.watchViewport(updateValues)
})

};