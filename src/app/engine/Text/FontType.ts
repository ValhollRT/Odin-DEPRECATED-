import { Mesh, Scene, StandardMaterial, VertexData } from "babylonjs";
import * as earcut from "earcut";
import * as opentype from "opentype.js";
import { Font, Glyph, Path, PathCommand } from "opentype.js";
import { EngineService } from "../../services/engine.service";
import { GlyphMesh } from './GlyphMesh';
import { PathBuilder } from "./PathBuilder";

export class FontType {
    GLYPH_COORDS_SCALE = 0.001;
    material: StandardMaterial;
    glyphsParent: Mesh; /* Maintain in a group all the characters created not reached by the user */
    glyphs: GlyphMesh[] = [];
    font: Font;
    fontURL: string;
    scene: Scene;

    constructor() { }

    async load(fontURL: string, es: EngineService, callback: (font: FontType) => void) {
        opentype.load(fontURL, (err, font) => {
            this.fontURL = fontURL;
            if (err) { console.error(err); return; }
            if (!font) { console.error("Could not load font from", this.fontURL); return; }

            let fontName = "TextMeshFont";

            if (font.names && font.names.fontFamily && font.names.fontFamily.en)
                fontName = font.names.fontFamily.en;

            this.font = font;
            this.scene = es.getScene();
            this.glyphsParent = new Mesh(fontName, this.scene);
            callback(this);

        });
    }

    createGlyph(ch: string): GlyphMesh {
        const glyph: Glyph = this.font.charToGlyph(ch);

        if (glyph && glyph.advanceWidth) {
            this.glyphs[ch] = {
                index: glyph.index,
                advanceWidth: glyph.advanceWidth
            };

            let commands: PathCommand[] = (<Path>glyph.path).commands;
            if (glyph.path && commands && commands.length) {
                const polys = [];
                (<any>commands).forEach(({ type, x, y, x1, y1, x2, y2 }) => {
                    switch (type) {
                        case 'M':
                            polys.push(new PathBuilder());
                            polys[polys.length - 1].moveTo({ x, y });
                            break;
                        case 'L':
                            polys[polys.length - 1].moveTo({ x, y });
                            break;
                        case 'C':
                            polys[polys.length - 1].cubicTo({ x, y }, { x: x1, y: y1 }, { x: x2, y: y2 });
                            break;
                        case 'Q':
                            polys[polys.length - 1].conicTo({ x, y }, { x: x1, y: y1 });
                            break;
                        case 'Z':
                            polys[polys.length - 1].close();
                            break;
                    }
                });

                // sort contours by descending area
                polys.sort((a, b) => Math.abs(b.area) - Math.abs(a.area));

                // classify contours to find holes and their 'parents'
                const root = [];

                for (let i = 0; i < polys.length; ++i) {
                    let parent = null;
                    for (let j = i - 1; j >= 0; --j) {
                        // a contour is a hole if it is inside its parent and has different winding
                        if (polys[j].inside(polys[i].points[0]) && polys[i].area * polys[j].area < 0) {
                            parent = polys[j];
                            break;
                        }
                    }
                    if (parent) {
                        parent.children.push(polys[i]);
                    } else {
                        root.push(polys[i]);
                    }
                }

                const totalPoints = polys.reduce((sum, p) => sum + p.points.length, 0);
                const vertexData = new Float32Array(totalPoints * 2);
                let vertexCount = 0;
                const indices = [];

                function process(poly) {
                    // construct input for earcut
                    const coords = [];
                    const holes = [];
                    poly.points.forEach(({ x, y }) => coords.push(x, y));
                    poly.children.forEach(child => {
                        // children's children are new, separate shapes
                        child.children.forEach(process);

                        holes.push(coords.length / 2);
                        child.points.forEach(({ x, y }) => coords.push(x, y));
                    });

                    // add vertex data
                    vertexData.set(coords, vertexCount * 2);
                    // add index data
                    earcut(coords, holes).forEach(i => indices.push(i + vertexCount));
                    vertexCount += coords.length / 2;
                }

                root.forEach(process);

                var meshdata = new VertexData();
                var vertices = [];
                var normals = [];

                for (let i = 0; i < vertexCount; i++) {
                    vertices.push(vertexData[i * 2] * this.GLYPH_COORDS_SCALE);
                    vertices.push(vertexData[i * 2 + 1] * this.GLYPH_COORDS_SCALE);
                    vertices.push(0);

                    normals.push(0);
                    normals.push(0);
                    normals.push(-1);
                }

                meshdata.positions = vertices;
                meshdata.indices = indices;
                meshdata.normals = normals;

                this.glyphs[ch].mesh = new Mesh("glyph #" + this.glyphs[ch].index + ": " + ch, this.scene);
                this.glyphs[ch].mesh.setParent(this.glyphsParent);

                if (this.material) {
                    this.glyphs[ch].mesh.material = this.material;
                }

                meshdata.applyToMesh(this.glyphs[ch].mesh);

                this.glyphs[ch].mesh.setEnabled(false);
            }
        }

        return this.glyphs[ch];
    }

    dispose() {
        for (let i in this.glyphs) {
            if (this.glyphs[i].mesh) {
                this.glyphs[i].mesh.dispose();
            }
        }

        this.glyphsParent.dispose();
    }

}
