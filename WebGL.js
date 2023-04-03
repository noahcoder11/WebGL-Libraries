class WebGL {
  constructor() {
    this.canvas = document.createElement("canvas")
  }

  initializeContext() {
    this.canvas.id = "webgl-canvas"
    this.ctx = this.canvas.getContext('webgl')

    if (!this.ctx) {
      alert('WebGL not supported')
      this.ctx = this.canvas.getContext('experimental-webgl')
    }

    document.body.appendChild(this.canvas)
  }

  fullScreen() {
    this.ctx.canvas.width = window.innerWidth
    this.ctx.canvas.height = window.innerHeight
    this.canvas.style.position = "absolute"
    this.canvas.style.left = "0px"
    this.canvas.style.top = "0px"
  }

  size(w, h) {
    this.ctx.canvas.width = w
    this.ctx.canvas.height = h
  }

  createShader(type, source) {
    let shader = this.ctx.createShader(type)
    this.ctx.shaderSource(shader, source)
    this.ctx.compileShader(shader)

    if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
      alert(`An error occurred compiling the shaders: ${this.ctx.getShaderInfoLog(shader)}`);
      this.ctx.deleteShader(shader);
      return null;
    }

    return shader
  }

  createProgram(vertexShader, fragmentShader) {
    let vs = this.createShader(this.ctx.VERTEX_SHADER, vertexShader)
    let fs = this.createShader(this.ctx.FRAGMENT_SHADER, fragmentShader)

    let shaderProgram = this.ctx.createProgram()
    this.ctx.attachShader(shaderProgram, vs)
    this.ctx.attachShader(shaderProgram, fs)
    this.ctx.linkProgram(shaderProgram)

    if (!this.ctx.getProgramParameter(shaderProgram, this.ctx.LINK_STATUS)) {
      alert(`Unable to initialize the shader program: ${this.ctx.getProgramInfoLog(shaderProgram)}`);
      return null;
    }

    return shaderProgram
  }

  createBuffer(bufferData, type, mode = this.ctx.STATIC_DRAW) {
    let buffer = this.ctx.createBuffer()
    this.ctx.bindBuffer(type, buffer)
    this.ctx.bufferData(type, bufferData, mode)

    return buffer
  }

  vertexAttrib(program, attrib, buffer, length) {
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buffer);

    let location = this.ctx.getAttribLocation(program, attrib);
    this.ctx.vertexAttribPointer(location, length, this.ctx.FLOAT, false, 0, 0);
    this.ctx.enableVertexAttribArray(location)

    return location
  }

  getUniform(program, u) {
    return this.ctx.getUniformLocation(program, u)
  }

  loadImageData(image) {
    var c = document.createElement('canvas')
    var ctx = c.getContext('2d')
    c.width = image.width
    c.height = image.height
    ctx.drawImage(image, 0, 0)
    data = ctx.getImageData(0, 0, c.width, c.height).data

    return data
  }

  loadTexture(dataOrURL, width, height) {
    try {
      let texture = this.ctx.createTexture()
      this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture)
      this.ctx.pixelStorei(this.ctx.UNPACK_ALIGNMENT, 1)

      if (width) {
        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, width, height, 0, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, dataOrURL)
      } else {
        let image = new Image()
        image.crossOrigin = ""
        
        image.onload = () => {
          this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture)
          this.ctx.pixelStorei(this.ctx.UNPACK_FLIP_Y_WEBGL, true)
          this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGB, this.ctx.RGB, this.ctx.UNSIGNED_BYTE, image);
        }

        image.src = dataOrURL
      }

      this.ctx.generateMipmap(this.ctx.TEXTURE_2D)
      this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.NEAREST)
      this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.NEAREST)
      this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE)
      this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE)
      return texture

    } catch (e) {
      console.log(e)
    }
  }
}
