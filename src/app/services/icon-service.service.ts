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
  
  constructor() { }
}
