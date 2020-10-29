import { Component, OnInit, Input } from '@angular/core';
import { RoutingUserService } from 'src/app/services/routing-user/routing-user.service';
import { MapIntegrationService } from 'src/app/services/map-integration/map-integration.service';

@Component({
  selector: 'ride-map-assembly',
  templateUrl: './ride-map-assembly.component.html',
  styleUrls: ['./ride-map-assembly.component.scss'],
})
export class RideMapAssemblyComponent implements OnInit {

  @Input() assemblyIcon:boolean=false;
  @Input() finishIcon:boolean=true;
  @Input() bikeDisplay:boolean=true;
  @Input() timeToPoint:number=null;
  @Input() bikersAtAP:number=null;

  constructor(private routingUserService:RoutingUserService,private mapIntegration:MapIntegrationService) { }

  ngOnInit() {
   this.mapIntegration.checkGPSChangeRoutingPosition().then(x=>{
   });
  }

  stopRoute(){
  }

}
