import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Container } from 'src/app/engine/common/Container';
import { EngineService } from 'src/app/engine/engine.service';
import { DataTreeContainer } from '../../engine/common/DataTreeNodeContainer';
import { filter, take } from 'rxjs/operators';
import { Mesh } from 'babylonjs/Meshes/mesh';
import { Light } from 'babylonjs';
import { LogService } from 'src/app/services/log.service';
import { select, Store } from '@ngrx/store';
import { clearSelection, oneSelection } from 'src/app/engine/engine.action';
import { AppState } from 'src/app/app.reducer';

export class ContainerFlatTreeNode {
  name: string;
  UUID: string;
  level: number;
  expandable: boolean;
  selected: boolean;
  hidden: boolean;
  locked: boolean;
}

@Component({
  selector: 'tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent {
  flatNodeMap = new Map<ContainerFlatTreeNode, Container>();
  nestedNodeMap = new Map<Container, ContainerFlatTreeNode>();
  nestedMeshMap = new Map<Mesh | Light, ContainerFlatTreeNode>();
  selectedParent: ContainerFlatTreeNode | null = null;
  lastSelectedTreeNode: ContainerFlatTreeNode | null = null;

  treeControl: FlatTreeControl<ContainerFlatTreeNode>;
  treeFlattener: MatTreeFlattener<Container, ContainerFlatTreeNode>;
  dataSource: MatTreeFlatDataSource<Container, ContainerFlatTreeNode>;
  checklistSelection = new SelectionModel<ContainerFlatTreeNode>(true);

  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: string;
  @ViewChild('emptyItem') emptyItem: ElementRef;

  isReadOnly: boolean = true;

  constructor(
    private store: Store<AppState>,
    public dataTree: DataTreeContainer,
    private es: EngineService, public logService: LogService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ContainerFlatTreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    dataTree.dataChange.subscribe(data => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });

    es.newContainer$
      .pipe(filter((cont: Container) => cont != undefined))
      .subscribe(c => {
        dataTree.inserNewtItem(c);
      });
  }

  getLevel = (node: ContainerFlatTreeNode) => node.level;
  isExpandable = (node: ContainerFlatTreeNode) => node.expandable;
  getChildren = (node: Container): Container[] => node.children;
  hasChild = (_: number, _nodeData: ContainerFlatTreeNode) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: ContainerFlatTreeNode) => _nodeData.name === '';

  transformer = (node: Container, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode
      : new ContainerFlatTreeNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.UUID = node.UUID;
    flatNode.selected = node.selected;
    flatNode.hidden = node.hidden;
    flatNode.expandable = (node.children && node.children.length > 0);
    this.flatNodeMap.set(flatNode, node);
    this.nestedMeshMap.set(node.get(), flatNode);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  handleDragStart(event, node) {
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node) {
    event.preventDefault();

    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  handleDrop(event, node) {
    event.preventDefault();
    if (node !== this.dragNode) {
      let newItem: Container;
      if (this.dragNodeExpandOverArea === 'above') {
        newItem = this.dataTree.above(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      } else if (this.dragNodeExpandOverArea === 'below') {
        newItem = this.dataTree.below(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      } else {
        newItem = this.dataTree.moveContainer(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      }
      this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  handleDragEnd(event) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  clickNodeContainer(event, node: ContainerFlatTreeNode, emit: boolean = true) {
    event.preventDefault();
    let containersSelected: Container = this.flatNodeMap.get(node);
    this.logService.log(node, "container clicked", "TreeNodeComponent");
    if (containersSelected.selected) return;
    this.store.dispatch(oneSelection({ UUID: containersSelected.UUID }));
  }

  setContainerName(event, node) { node.name = this.flatNodeMap.get(node).name = event; }

  clickHideNode(event, node: ContainerFlatTreeNode) {
    let container: Container = this.flatNodeMap.get(node);
    if (!container.hidden) {
      container.hide();
      node.hidden = true;
    } else {
      container.unHide();
      node.hidden = false;
    }
  }

  clickLockNode(event, node: ContainerFlatTreeNode) {
    let container: Container = this.flatNodeMap.get(node);
    if (!container.locked) {
      container.lock();
      node.locked = true;
    } else {
      container.unlock();
      node.locked = false;
    }
  }

  clickDeleteNode(event) {
    if (!this.es.nothingSelected()) {
      this.dataTree.deleteNodeAndChildren(this.es.getFirstSelected());
      this.store.dispatch(clearSelection());
    }
  }
}

