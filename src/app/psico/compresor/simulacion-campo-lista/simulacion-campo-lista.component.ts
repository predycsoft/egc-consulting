import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogSimCampoComponent } from '../dialog-sim-campo/dialog-sim-campo.component';
import { SimulacionCampoDialogResultadosComponent } from '../simulacion-campo-dialog-resultados/simulacion-campo-dialog-resultados.component';

interface param {
  nombre: string;
  var: string;
  max: number;
  min: number;
}


@Component({
  selector: 'simulacion-campo-lista',
  templateUrl: './simulacion-campo-lista.component.html',
  styleUrls: ['./simulacion-campo-lista.component.css']
})
export class SimulacionCampoListaComponent implements OnInit {

  params: param[] = [
    { nombre: 'Fecha y hora.', var: 'fecha', min: null, max: null },
    { nombre: 'Simulacion', var: 'fecha', min: null, max: null },
    { nombre: 'Mezcla', var: 'mezcla', min: null, max: null },
    { nombre: 'Q', var: 'q', min: null, max: null },
    { nombre: 'RPM', var: 'rpm', min: null, max: null },
    { nombre: 'Psucc.', var: 'psuc', min: null, max: null },
    { nombre: 'Pdesc.', var: 'pdesc', min: null, max: null },
    { nombre: 'Tsucc.', var: 'tsuc', min: null, max: null },
    { nombre: 'Tdesc.', var: 'tdesc', min: null, max: null },

    { nombre: 'Pot.', var: 'pot', min: null, max: null },
    { nombre: 'ΣPot.', var: 'potSum', min: null, max: null },
    // Coeficientes adimensionales
    { nombre: 'Q/N', var: 'cabP', min: null, max: null },
    { nombre: 'Coef. Cab. Poli', var: 'cabP', min: null, max: null },
    { nombre: 'Efic. Poli', var: 'efiP', min: null, max: null },
  ]
  
  proyectoId: string;
  trenTag: string;

  constructor(public dialog:MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.proyectoId = params.id
      this.route.params.subscribe( params => {
        this.trenTag = params.trenTag
      })
    })
  }

  actualMin;
  actualMax;
  selectedParam;
  iParam;

  clickParam(param, i){
    this.selectedParam = param  
    this.iParam = i
    this.actualMin = this.params[this.iParam].min 
    this.actualMax = this.params[this.iParam].max 
  }

  aplicarFiltro($event: any) {
    $event.stopPropagation();
    //Another instructions
    this.params[this.iParam].min = this.actualMin;
    this.params[this.iParam].max = this.actualMax;
  }

  borrarFiltro($event: any) {
    $event.stopPropagation();
    //Another instructions
    this.params[this.iParam].min = null;
    this.params[this.iParam].max = null;
    this.actualMin = null;
    this.actualMax = null;
  }

  openDialogResultados(){
    const dialogRef = this.dialog.open(SimulacionCampoDialogResultadosComponent);
  }

  nuevaSimCampo(){
    const dialogRef = this.dialog.open(DialogSimCampoComponent);
  }

}
