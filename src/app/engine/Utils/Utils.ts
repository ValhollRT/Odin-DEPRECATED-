import { Vector3 } from 'babylonjs';

export class Utils {
    static isEmptyArr(arr: any) {
        return Array.isArray(arr) && arr.length ? false : true;
    }

    public static generateUID(str: String): Number {
        var hash = 0;

        if (str.length == 0) return hash;

        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        return hash;
    }

    public static radiansToDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

    public static radiansToDegreesVector(v: Vector3): Vector3 {
        return new Vector3(this.radiansToDegrees(v.x), this.radiansToDegrees(v.y), this.radiansToDegrees(v.z))
    }

    public static degreeToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
    public static generatorUUID(): string {
        const isString = `${Utils.S4()}${Utils.S4()}-${Utils.S4()}-${Utils.S4()}-${Utils.S4()}-${Utils.S4()}${Utils.S4()}${Utils.S4()}`;
        return isString;
    }

    public static S4(): string {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    public static precision(num: number, n: number): number {
        return Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
    }

    public static precisionVector(num: Vector3, n: number): Vector3 {
        return new Vector3(this.precision(num.x, n), this.precision(num.y, n), this.precision(num.z, n));
    }
}