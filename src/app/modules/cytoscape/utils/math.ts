export interface Point {
  x: number;
  y: number;
}

type Vector = Point;

export const squaredDistance = (p0: Point, p1: Point) => {
  return Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2);
};

// http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/index.htm
export const angleBetweenVectors = (v1: Vector, v2: Vector) => {
  return Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
};

export const normalize = (v1: Vector): Vector => {
  const norm = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  return {
    x: v1.x / norm,
    y: v1.y / norm,
  };
};
