import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ViewChild } from '@angular/core'
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

// Expansion panel
import { MatAccordion } from '@angular/material/expansion';

// snackbar
import {MatSnackBar} from '@angular/material/snack-bar';

// typehead
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

// tree declarations

const TREE_DATA: ExampleFlatNode[] = [
  { name: 'Fruit', expandable: true, level: 0, number: 1 },
  { name: 'Apple', expandable: false, level: 1, number: 2 },
  { name: 'Peach', expandable: true, level: 1, number: 3 },
  { name: 'Banana', expandable: false, level: 2, number: 4 },
  { name: 'Fruit', expandable: true, level: 1, number: 2 },
  { name: 'Apple', expandable: true, level: 2, number: 3 },
  { name: 'Peach', expandable: true, level: 3, number: 4 },
  { name: 'Banana', expandable: false, level: 4, number: 5 },

];

interface ExampleFlatNode {
  number: number;
  expandable: boolean;
  name: string;
  level: number;
  isExpanded?: boolean;
}


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

 
  // rating
  currentRate: number = 3;

  // Tree functions

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  dataSource = new ArrayDataSource(TREE_DATA);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  getParentNode(node: ExampleFlatNode) {
    const nodeIndex = TREE_DATA.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (TREE_DATA[i].level === node.level - 1) {
        return TREE_DATA[i];
      }
    }

    return null;
  }

  shouldRender(node: ExampleFlatNode) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }

  // tree functions end here

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  colorMode: boolean;
  food: string;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // context menu function

  @ViewChild('trigger')
  contextMenu3: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu3.menu.focusFirstItem('mouse');
    this.contextMenu3.openMenu();
  }

  // theme mode functions
  changeColorMode() {
    if (this.colorMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  // Expansion panel
  @ViewChild(MatAccordion) accordion: MatAccordion;

  // Snackbar
  openSnackBar() {
    this._snackBar.open('mensaje de entrada', 'descartar',{
      panelClass: ['snackbar'],
      // snack.afterDismissed().subscribe(() => {})
      // onAction().subscribe(() => {})
    });
  }
 
  //typehead


  public typeheadInput: any;

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 0 ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    ) 
}

// typehead var
const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];