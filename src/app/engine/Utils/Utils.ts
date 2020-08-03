export class Utils {

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
}