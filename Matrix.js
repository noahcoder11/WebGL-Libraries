class Matrix {
  constructor(args){
    this.args = args || [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]
  }

  static multiply(mat1, mat2){
    var m1 = mat1.args
    var m2 = mat2.args
    
    return new Matrix([
		  m1[0][0]*m2[0][0]+m1[0][1]*m2[1][0]+m1[0][2]*m2[2][0]+m1[0][3]*m2[3][0], m1[0][0]*m2[0][1]+m1[0][1]*m2[1][1]+m1[0][2]*m2[2][1]+m1[0][3]*m2[3][1], m1[0][0]*m2[0][2]+m1[0][1]*m2[1][2]+m1[0][2]*m2[2][2]+m1[0][3]*m2[3][2], m1[0][0]*m2[0][3]+m1[0][1]*m2[1][3]+m1[0][2]*m2[2][3]+m1[0][3]*m2[3][3],
		  m1[1][0]*m2[0][0]+m1[1][1]*m2[1][0]+m1[1][2]*m2[2][0]+m1[1][3]*m2[3][0], m1[1][0]*m2[0][1]+m1[1][1]*m2[1][1]+m1[1][2]*m2[2][1]+m1[1][3]*m2[3][1], m1[1][0]*m2[0][2]+m1[1][1]*m2[1][2]+m1[1][2]*m2[2][2]+m1[1][3]*m2[3][2], m1[1][0]*m2[0][3]+m1[1][1]*m2[1][3]+m1[1][2]*m2[2][3]+m1[1][3]*m2[3][3],
		  m1[2][0]*m2[0][0]+m1[2][1]*m2[1][0]+m1[2][2]*m2[2][0]+m1[2][3]*m2[3][0], m1[2][0]*m2[0][1]+m1[2][1]*m2[1][1]+m1[2][2]*m2[2][1]+m1[2][3]*m2[3][1], m1[2][0]*m2[0][2]+m1[2][1]*m2[1][2]+m1[2][2]*m2[2][2]+m1[2][3]*m2[3][2], m1[2][0]*m2[0][3]+m1[2][1]*m2[1][3]+m1[2][2]*m2[2][3]+m1[2][3]*m2[3][3],
		  m1[3][0]*m2[0][0]+m1[3][1]*m2[1][0]+m1[3][2]*m2[2][0]+m1[3][3]*m2[3][0], m1[3][0]*m2[0][1]+m1[3][1]*m2[1][1]+m1[3][2]*m2[2][1]+m1[3][3]*m2[3][1], m1[3][0]*m2[0][2]+m1[3][1]*m2[1][2]+m1[3][2]*m2[2][2]+m1[3][3]*m2[3][2], m1[3][0]*m2[0][3]+m1[3][1]*m2[1][3]+m1[3][2]*m2[2][3]+m1[3][3]*m2[3][3]
	  ])
  }
  
  static translation(vector){
    let out = new Matrix()
    
    out.args = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        vector.x, vector.y, vector.z, 1
    ]

    return out
  }

  static translate(m, vector){
    let out = m.clone()

    out.args[12] = vector.x
    out.args[13] = vector.y
    out.args[14] = vector.z

    return out
  }

  static rotateZ(mat, angle) {
    let out = mat.clone()
    var m = mat.args
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    out.args[0] = c * m[0] - s * m[1];
    out.args[4] = c * m[4] - s * m[5];
    out.args[8] = c * m[8] - s * m[9];

    out.args[1] = c * m[1] + s * mv0;
    out.args[5] = c * m[5] + s * mv4;
    out.args[9] = c * m[9] + s * mv8;

    return out
  }
  
  static rotateX(mat, angle) {
    let out = mat.clone()
    var m = mat.args
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];

    out.args[1] = m[1] * c - m[2] * s;
    out.args[5] = m[5] * c - m[6] * s;
    out.args[9] = m[9] * c - m[10] * s;

    out.args[2] = m[2] * c + mv1 * s;
    out.args[6] = m[6] * c + mv5 * s;
    out.args[10] = m[10] * c + mv9 * s;
    
    return out
  }
  
  static rotateY(mat, angle) {
    let out = mat.clone()
    var m = mat.args
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];

    out.args[0] = c * m[0] + s * m[2];
    out.args[4] = c * m[4] + s * m[6];
    out.args[8] = c * m[8] + s * m[10];

    out.args[2] = c * m[2] - s * mv0;
    out.args[6] = c * m[6] - s * mv4;
    out.args[10] = c * m[10] - s * mv8;

    return out
  }

  static rotate(mat, vector){
    let out = mat.clone()
    out = Matrix.rotateX(out, vector.x)
    out = Matrix.rotateY(out, vector.y)
    out = Matrix.rotateZ(out, vector.z)
    return out
  }

  static rotation(vector) {
    var out = new Matrix()
    out.args = [
        Math.cos(vector.y)*Math.cos(vector.z), Math.cos(vector.y)*Math.sin(vector.z), Math.sin(vector.y), 0,
        Math.sin(vector.x)*-Math.sin(vector.y)*Math.cos(vector.z)+Math.cos(vector.x)*-Math.sin(vector.z), Math.sin(vector.x)*-Math.sin(vector.y)*Math.sin(vector.z)+Math.cos(vector.x)*Math.cos(vector.z), Math.sin(vector.x)*Math.cos(vector.y), 0,
        Math.cos(vector.x)*-Math.sin(vector.y)*Math.cos(vector.z)+(-Math.sin(vector.x)*-Math.sin(vector.z)), Math.cos(vector.x)*-Math.sin(vector.y)*Math.sin(vector.z)-Math.sin(vector.x)*Math.cos(vector.z), Math.cos(vector.x)*Math.cos(vector.y), 0,
        0, 0, 0, 1
    ]

    return out
  }

  static clone(matrix){
    return new Matrix(matrix.args)
  }

  static projection(FOV, a, zMin, zMax){
    var ang = Math.tan((FOV * .5) * Math.PI / 180)
    
    return new Matrix([
      0.5 / ang, 0, 0, 0,
      0, 0.5 * a / ang, 0, 0,
      0, 0, -(zMax + zMin) / (zMax - zMin), -1,
      0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
    ])
  }
  
  translate(vector){
    Matrix.translate(this, vector)
  }
  
  rotate(vector){
    Matrix.rotate(this, vector)
  }
  
  clone(){
    return Matrix.clone(this)
  }
}
