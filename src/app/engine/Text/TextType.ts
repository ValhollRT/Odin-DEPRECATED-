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
    letterSpacing: number;
    lineHeight: number;
    width: number;
    instances: {};
    rootMesh: Mesh;

    constructor(fontType: FontType, text: string, mesh: Mesh) {
        this.fontType = fontType;
        this.value = text;
        this.halign = Haling.LEFT
        this.valign = Valing.FIRST_LINE
        this.width = 0;
        this.letterSpacing = 0;
        this.lineHeight = 0;
        this.instances = {};
        this.rootMesh = mesh;
        this.updateText();
    }

    updateText() {
        let text = this.value;
        let ha = this.halign;
        let va = this.valign;
        this.width = 0;

        //Set the start height of the text depending of the number of rows and Vertical Align
        let g: GlyphMesh | undefined = this.fontType.glyphs['Á'];
        if (!g) g = this.fontType.createGlyph('Á');
        let sizeLetter = (g.mesh.getBoundingInfo().boundingBox.extendSize.y * 2) + this.lineHeight;
        let numberRows = text.split('\n').length;
        let startYValign = va == Valing.FIRST_LINE ? 0 :
            va == Valing.TOP ? -sizeLetter :
                va == Valing.BOTTOM ? sizeLetter * (numberRows - 1) : (sizeLetter * numberRows) / 2;

        const instanceCounts = {};
        let pos = { x: 0, y: startYValign, z: 0 };
        let textSplitteByLines = text.split('\n');

        for (let j = 0; j < textSplitteByLines.length; j++) {

            // Set pos X
            let totalWidthX = 0;
            for (let h = 0; h < textSplitteByLines[j].length; h++) {
                const ch = textSplitteByLines[j][h];
                const nextCh = textSplitteByLines[j][h + 1];
                let g: GlyphMesh | undefined = this.fontType.glyphs[ch];
                if (!g) g = this.fontType.createGlyph(ch);
                totalWidthX += g.advanceWidth * this.GLYPH_COORDS_SCALE;
                if (nextCh && this.fontType.glyphs[nextCh]) {
                    let kern = this.fontType.font.getKerningValue(g.index, this.fontType.glyphs[nextCh].index);
                    totalWidthX += kern * this.GLYPH_COORDS_SCALE;
                }
                totalWidthX += this.letterSpacing;
            }
            pos.x = ha == Haling.LEFT ? 0 : ha == Haling.RIGHT ? -totalWidthX : -(totalWidthX / 2);

            // Set pos Y
            if (j == 0 && va == Valing.CENTER) pos.y -= sizeLetter;
            if (j > 0) pos.y -= sizeLetter;

            for (let i = 0; i < textSplitteByLines[j].length; i++) {
                const ch1 = textSplitteByLines[j][i];
                const ch2 = textSplitteByLines[j][i + 1];

                let g: GlyphMesh | undefined = this.fontType.glyphs[ch1];

                if (!g) { g = this.fontType.createGlyph(ch1); }

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
                            if (kern) { advance += kern; }
                        }

                        pos.x += advance * this.GLYPH_COORDS_SCALE + this.letterSpacing;
                        if (pos.x > this.width) { this.width = pos.x }
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