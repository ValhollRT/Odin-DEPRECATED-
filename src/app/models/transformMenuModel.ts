import { Point3D } from './point3D';
import { Point2D } from './point2D';
import { Quaternion } from './Quaternion';

export interface TransformMenu {
    position: Point3D;
    rotation: Point3D;
    scaling: Point3D;
    center: Point3D;
    screenPosition: Point2D;
}

