import { Container } from 'src/app/engine/common/Container';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { EngineService } from '../engine.service';
import { Mesh } from 'babylonjs';

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable({ providedIn: 'root' })

export class DataTreeContainer {
    dataChange = new BehaviorSubject<Container[]>([]);
    root: Container;

    constructor(public engineService: EngineService) {
        this.root = new Container();
        this.root.name = "VALHOLLRT_ROOT_CONTAINER"
    }

    updateNodeTree() { this.dataChange.next(this.root.children); }

    inserNewtItem(container: Container) {
        container.parent = this.root;
        this.root.children.push(container);
        this.updateNodeTree();
    }

    update(node: Container, name: string) { }

    moveContainer(from: Container, to: Container) {
        if (from.parent === to) return null;
        to.children.push(from); to.expandable = true;
        this.deleteNode(from);
        from.parent = to;
        this.updateNodeTree();
        return to;
    }

    above(from: Container, to: Container) {
        this.deleteNode(from);
        to.parent.children.push(from);
        from.parent = to.parent;
        this.updateNodeTree();
        return to;
    }

    below(from: Container, to: Container) {
        this.deleteNode(from);
        to.parent.children.push(from);
        from.parent = to.parent;
        this.updateNodeTree();
        return to;
    }

    deleteNode(nodeToDelete: Container) {
        let p: Container[];
        if (nodeToDelete.parent == null) this.root.children = this.root.children.filter(o => o.UUID !== nodeToDelete.UUID);
        else nodeToDelete.parent.children = nodeToDelete.parent.children.filter(o => o.UUID !== nodeToDelete.UUID);
    }

    deleteNodeAndChildren(node: Container) {
        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].children.length > 0) this.deleteNodeAndChildren(node.children[i]);
            else this.deleteContainer(node.children[i]);
        }
        this.deleteContainer(node);
    }

    deleteContainer(node: Container) {
        this.deleteNode(node);
        if (node.type instanceof Mesh) node.deleteMesh(this.engineService.getScene());
        else node.deleteLight(this.engineService.getScene());
        node = null;
        this.updateNodeTree();
    }
}
