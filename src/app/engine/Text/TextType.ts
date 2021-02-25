import { InstancedMesh, Mesh } from "babylonjs";
import { FontType } from "./FontType";
import { GlyphMesh } from './GlyphMesh';

export enum Haling { LEFT, CENTER, RIGHT }
export enum Valing { TOP, FIRST_LINE, CENTER, BOTTOM }

export class TextType {

    GLYPH_COORDS_SCALE = 0.001;
    fontType: FontType;
    value: string;
    halign: Haling;
    valign: Valing;
    width: number;
    instances: {};
    rootMesh: Mesh;

    constructor(fontType: FontType, text: string, mesh: Mesh) {
        this.fontType = fontType;
        this.value = text;
        this.halign = Haling.LEFT
        this.valign = Valing.FIRST_LINE
        this.width = 0;
        this.instances = {};
        this.rootMesh = mesh;
        this.updateText(text, this.halign, this.valign);
    }

    updateText(text: string, ha: Haling, va: Valing) {
        this.value = text;
        this.halign = ha;
        this.valign = va;

        const instanceCounts = {};
        const pos = { x: 0, y: 0, z: 0 };

        this.width = 0;

        for (let i = 0; i < text.length; i++) {
            const ch1 = text[i];

            if (ch1 === "\n") {
                pos.x = 0;
                pos.y -= 1.1;
            }
            else {
                const ch2 = text[i + 1];
                let g: GlyphMesh | undefined = this.fontType.glyphs[ch1];

                if (!g) {
                    g = this.fontType.createGlyph(ch1);
                }

                if (g) {
                    if (g.mesh) {
                        instanceCounts[ch1] = instanceCounts[ch1] ? instanceCounts[ch1] + 1 : 1;
                        let inst: InstancedMesh;
                        g.mesh.material = this.rootMesh.material;
                        if (!this.instances[ch1]) {
                            inst = g.mesh.createInstance("glyph-inst: " + ch1);
                            this.instances[ch1] = [inst];
                        }
                        else if (instanceCounts[ch1] > this.instances[ch1].length) {
                            inst = g.mesh.createInstance("glyph-inst: " + ch1);
                            this.instances[ch1].push(inst);
                        }
                        else {
                            inst = this.instances[ch1][instanceCounts[ch1] - 1];
                            inst.setEnabled(true);
                        }


                        inst.setParent(this.rootMesh);
                        Object.assign(inst.position, pos);
                    }

                    let advance = g.advanceWidth;

                    if (advance) {
                        if (ch2 && this.fontType.glyphs[ch2]) {
                            const kern = this.fontType.font.getKerningValue(g.index, this.fontType.glyphs[ch2].index);

                            if (kern) {
                                advance += kern;
                            }
                        }

                        pos.x += advance * this.GLYPH_COORDS_SCALE;

                        if (pos.x > this.width) {
                            this.width = pos.x;
                        }
                    }
                }
            }
        }

        for (let ch in this.instances) {
            const start = instanceCounts[ch] ? instanceCounts[ch] : 0;

            for (let i = start; i < this.instances[ch].length; i++) {
                this.instances[ch][i].setEnabled(false);
            }
        }
    }

    dispose() {
        for (let i in this.instances) {
            for (let j in this.instances[i]) {
                this.instances[i][j].dispose();
            }
        }

        this.rootMesh.dispose();
    }
}