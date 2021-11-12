import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconServiceService {

  logo: string = "assets/images/design/logo.svg"
  defaultUserImage: string = "assets/images/design/default-user-image.svg";
  compresorMiniIcon: string = "assets/images/icons/compresorMini.svg"
  turbinaMiniIcon: string = "assets/images/icons/turbinaMini.svg"
  trenMiniIcon: string = "assets/images/icons/trenMini.svg"
  instalacionMiniIcon: string = "assets/images/icons/instalacionMini.svg"

  // 
  compresorIcon: string = "assets/images/icons/compresor.svg"
  turbinaIcon: string = "assets/images/icons/turbina.svg"

  // 
  inlineExample: string = "assets/images/icons/inlineExample.svg"
  doubleSuctionExample: string = "assets/images/icons/doubleSuctionExample.svg"
  doubleDischargeExample: string = "assets/images/icons/doubleDischargeExample.svg"
  b2bExample: string = "assets/images/icons/b2bExample.svg"
  streamlineExample: string = "assets/images/icons/streamlineExample.svg"

  // 
  inline: string = "assets/images/icons/inline.svg"
  doubleSuction: string = "assets/images/icons/doubleSuction.svg"
  doubleDischarge: string = "assets/images/icons/doubleDischarge.svg"
  b2b: string = "assets/images/icons/b2b.svg"
  streamline: string = "assets/images/icons/streamline.svg"

  ruedaRueda: string = "assets/images/icons/ruedaRueda.svg"
  pruebaEfic: string = "assets/images/icons/pruebaEfic.svg"
  campo: string = "assets/images/icons/campo.svg"



  constructor() { }
}
