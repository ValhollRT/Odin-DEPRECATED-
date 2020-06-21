import { Mesh, Material } from 'babylonjs';
import { Utils } from '../Utils/Utils'
export class Geometry {

    public UID: Number;
    public babylonMesh: Mesh;

    constructor(_uid?: Number) {
        if (_uid === null) _uid = Utils.generateUID(_uid.toString());
        this.UID = _uid;
    }

}
