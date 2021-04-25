import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { AppService } from 'src/app/services/index.service';
import { clearAllSelection } from 'src/app/store/actions';
import { EngineService } from '../../services/index.service';
import { Container } from '../../shared/container/container';
import { AppState } from '../../store/app.reducer';
import { PlugTransform } from '../plugs/plug-transform';

@Injectable({ providedIn: 'root' })
export class DataTreeContainer {
    dataChange = new BehaviorSubject<Container[]>([]);
    root: Container;

    constructor(public engineServ: EngineService,
        private appServ: AppService,
        public store: Store<AppState>,) { }

    initDataTreeNode() {
        this.root = new Container();
        this.root.setPlugTransform(new PlugTransform());
        this.root.name = "VALHOLLRT_ROOT_CONTAINER"

        this.store.select('engine').subscribe(en => {
            if (en.prevUuidCsSelected.length > 0) {
                en.prevUuidCsSelected.forEach(prevUuid => {
                    let c = this.appServ.uuidToContainer.get(prevUuid)
                    c.selected = false;
                });
            }

            if (en.uuidCsSelected.length > 0) {
                en.uuidCsSelected.forEach(uuid => {
                    let c = this.appServ.uuidToContainer.get(uuid)
                    c.selected = true;
                });
            }

            if (en.uuidCsSelected.length == 0 && en.prevUuidCsSelected.length == 0) {
                let c = this.appServ.uuidToContainer.forEach(c => c.selected = false);
            }

            this.updateTreeNode();
        });
    }

    updateTreeNode() { this.dataChange.next(this.root.children); }

    inserNewtItem(container: Container) {
        container.parent = this.root;
        this.root.children.push(container);
        this.updateTreeNode();
    }

    moveContainer(from: Container, to: Container) {
        if (from.parent === to) return null;
        to.children.push(from); to.expandable = true;
        this.deleteNode(from);

        from.setParent(to);

        this.updateTreeNode();
        return to;
    }

    above(from: Container, to: Container) {
        this.deleteNode(from);

        // get position target
        let targetIdx = to.parent.children.indexOf(to);
        to.parent.children.splice(targetIdx, 0, from);

        from.setParent(to.parent);

        this.updateTreeNode();
        return to;
    }

    below(from: Container, to: Container) {
        this.deleteNode(from);

        // get position target
        let targetIdx = to.parent.children.indexOf(to);
        to.parent.children.splice(targetIdx + 1, 0, from);

        from.setParent(to.parent);

        this.updateTreeNode();
        return to;
    }

    deleteNode(c: Container) {
        if (c.parent == (null || undefined)) this.root.children = this.root.children.filter(o => o.uuid !== c.uuid);
        else c.parent.children = c.parent.children.filter(o => o.uuid !== c.uuid);
    }

    deleteNodeAndChildren(node: Container) {
        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].children.length > 0) this.deleteNodeAndChildren(node.children[i]);
            else this.deleteContainer(node.children[i]);
        }
        this.deleteContainer(node);
    }

    deleteContainer(c: Container) {
        // TODO Move to app service
        c.plugs.forEach(p => p.dispose());
        this.appServ.uuidToContainer.delete(c.uuid);
        this.deleteNode(c);
        this.store.dispatch(clearAllSelection());

        c = null;
        this.updateTreeNode();
    }
}