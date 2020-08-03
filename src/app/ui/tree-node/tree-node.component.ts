import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Container } from 'src/app/engine/common/Container';
import { EngineService } from 'src/app/engine/engine.service';
import { DataTreeContainer } from '../../engine/common/DataTreeNodeContainer';
import { filter } from 'rxjs/operators';

export class ContainerFlatTreeNode {
  name: string;
  UUID: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent {
  flatNodeMap = new Map<ContainerFlatTreeNode, Container>();
  nestedNodeMap = new Map<Container, ContainerFlatTreeNode>();
  selectedParent: ContainerFlatTreeNode | null = null;

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

  constructor(public dataTree: DataTreeContainer, private engineService: EngineService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ContainerFlatTreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    dataTree.dataChange.subscribe(data => {
      this.dataSource.data = [];
      this.dataSource.data = data;
    });

    engineService.newContainer$
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
    flatNode.UUID = node.UUID;
    flatNode.level = level;
    flatNode.expandable = (node.children && node.children.length > 0);
    this.flatNodeMap.set(flatNode, node);
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
}