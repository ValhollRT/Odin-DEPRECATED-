import { Utils } from '../Utils/Utils';
import { Geometry, Material } from 'babylonjs';

export class Node {

    public UID: Number;
    public date: Number;
    public geometry: Geometry;
    public material: Material;

    constructor(private _uid?: Number, private _date?: Number) {

        if (_date === null) _date = Date.now();
        if (_uid === null) _uid = Utils.generateUID(_date.toString());
        this.UID = _uid;
        this.date = _date;

    }

}