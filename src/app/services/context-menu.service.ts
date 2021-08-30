import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu';


@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  constructor() { }

  // context menu function

  @ViewChild('trigger')
  contextMenu: MatMenuTrigger;
  

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
}

