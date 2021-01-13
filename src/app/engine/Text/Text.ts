import { Mesh, Scene, VertexData } from "babylonjs";
import { Font } from "./Font";

export class Text {

    GLYPH_COORDS_SCALE = 0.001;
    font: Font;
    text: string;
    width: number;
    instances: {};
    rootNode: Mesh;

    constructor(font: Font, text: string, mesh: Mesh) {
        this.font = font;
        this.text = text;
        this.width = 0;
        this.instances = {};
        this.rootNode = mesh;

        this.updateText(text);
    }

    updateText(text) {
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
                let g = this.font.glyphs[ch1];

                if (!g) {
                    g = this.font.createGlyph(ch1);
                }

                if (g) {
                    if (g.mesh) {
                        instanceCounts[ch1] = instanceCounts[ch1] ? instanceCounts[ch1] + 1 : 1;
                        let inst;

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

                        // inst.setParent(this.rootNode);
                        Object.assign(inst.position, pos);
                    }

                    let advance = g.advanceWidth;

                    if (advance) {
                        if (ch2 && this.font.glyphs[ch2]) {
                            const kern = this.font.font.getKerningValue(g.index, this.font.glyphs[ch2].index);

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

        this.rootNode.dispose();
    }
}