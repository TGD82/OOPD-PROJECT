// Ground Class
export class Ground {
  constructor(y, width, height) {
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getY() {
    return this.y;
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
}