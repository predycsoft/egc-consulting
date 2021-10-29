import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulacion-campo-dialog-resultados',
  templateUrl: './simulacion-campo-dialog-resultados.component.html',
  styleUrls: ['./simulacion-campo-dialog-resultados.component.css']
})
export class SimulacionCampoDialogResultadosComponent implements OnInit {

  outParams: string[] = ['Temp. Succión [ºF]', 'Temp. Descarga [ºF]', 'Temp. Isentrópica [ºF]', 'Presión Succión [psia]', 
  'Presión Descarga [psia]', 'Presión Isentrópica [psia]', 'Densidad Succión [g/cm3]', 'Densidad Descarga [lbm/pie3]', 
  'Densidad Isentrópica [lbm/pie3]', 'Volumen Succión [pie3/lbm]', 'Volumen Descarga [pie3/lbm]', 'Volumen isentrópico [pie3/lbm]', 
  'Entalpía Succión [Cal/g]', 'Entalpía Descarga [BTU/lbm]', 'Entalpía Isentrópica [BTU/lbm]', 'Entropía Succión [BTU/lbmol°R]',
  'Entropía Descarga [BTU/lbmol°R]', 'Entropía Isentrópica [BTU/lbmol°R]', 'Calidad Succión ', 'Calidad Descarga', 'Calidad isentrópica',
  'Fac. Comp. Succión ', 'Fac. Comp. Desc. ', 'Fac. Comp. Isent.', 'Peso molecular [lbm/lbmol]']

  outParams1: string[] = ['Flujo Másico', 'Potencia Gas', 'Eficiencia Politrópica', 'Coef. de Flujo Q/N', 'Coef.Head Politrópico' , 'Coeficiente Work Input',
   'Trabajo Politrópico' ,'Relación de Compresión','Relación de Volumen','Volumen ACFM']


  constructor() { }

  ngOnInit(): void {
    console.log(this.outParams)
  }

}
