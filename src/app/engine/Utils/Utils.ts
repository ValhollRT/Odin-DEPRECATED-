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

}