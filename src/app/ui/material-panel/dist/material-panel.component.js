"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MaterialPanelComponent = void 0;
var core_1 = require("@angular/core");
var babylonjs_1 = require("babylonjs");
var operators_1 = require("rxjs/operators");
var MaterialPanelComponent = /** @class */ (function () {
    function MaterialPanelComponent(engineService) {
        var _this = this;
        this.engineService = engineService;
        this.engineService.getCurrentMeshSelected()
            .pipe(operators_1.filter(function (mesh) { return mesh !== null && mesh !== undefined; }))
            .pipe(operators_1.distinctUntilChanged())
            .subscribe(function (m) {
            _this.currentMesh = m;
            console.log(m.material);
        });
    }
    MaterialPanelComponent.prototype.ngOnInit = function () { };
    MaterialPanelComponent.prototype.hexToRgb = function (value, attribute) {
        if (attribute === "AMBIENTCOLOR") {
            this.currentMesh.material.ambientColor = babylonjs_1.Color3.FromHexString(value);
        }
        if (attribute === "DIFFUSECOLOR") {
            this.currentMesh.material.diffuseColor = babylonjs_1.Color3.FromHexString(value);
        }
        if (attribute === "EMISSIVECOLOR") {
            this.currentMesh.material.emissiveColor = babylonjs_1.Color3.FromHexString(value);
        }
        if (attribute === "SPECULARCOLOR") {
            this.currentMesh.material.specularColor = babylonjs_1.Color3.FromHexString(value);
        }
    };
    MaterialPanelComponent = __decorate([
        core_1.Component({
            selector: 'material-panel',
            templateUrl: './material-panel.component.html',
            styleUrls: ['./material-panel.component.scss']
        })
    ], MaterialPanelComponent);
    return MaterialPanelComponent;
}());
exports.MaterialPanelComponent = MaterialPanelComponent;
