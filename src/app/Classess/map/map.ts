
import { Time } from '@angular/common';

export class Map {
    type: string;
    coordinates: number[];
}

export interface Position {
    latitude: number;
    longitude: number;
}

export class PositionI {
    position: Position;
    constructor( long: number, lat: number) {
       this.position = {longitude: long, latitude: lat};
    }
}

export class RouteCl {
    position: Position;
    name: string;
    timestamp: Time;
    //     ///             /// DATATYPE NOT FINAL! --> Maybe Firestore Timestamp to rxjs Timestamp conversion? | Feature Discussion
    constructor( long: number, lat: number, name: string) {
        this.position = {longitude: long, latitude: lat};
        this.name = name;
        // this.timestamp = timestamp;
     }
}


export interface AssemblyPoint {
    position: Position;
    name: string;
    maxMember: number;
    potMemberCount: number;
}

export interface Cluster {
    geoCluster: GeoCluster;
    bearing: number;
    name: string;
    memberCount: number;
    // memberList: any;        // Need in for interface for Members <- Datatype for Members
}


export class User {
    private position: Position;
    private name: string;
    constructor(name: string, longitude: number, latitude: number) {
        this.position = {longitude, latitude};
        this.name = name;
    }
}

export class AssemblyPoint {
    private assemblyPoint: AssemblyPoint;
    constructor(name: string, longitude: number , latitude: number, maxMember: number, potMemberCount: number) {
        this.assemblyPoint.position = {longitude, latitude};
        this.assemblyPoint.maxMember = maxMember;
        this.assemblyPoint.name = name;
        this.assemblyPoint.potMemberCount = potMemberCount;
    }
}

export interface IGeometry {
    type: string;
    coordinates: [number,number];
}

export interface IGeoJsonCluster {
    type: string;
    geometry: IGeometry;
    properties?: Array<string>;
    members?: Array<string>;
}

export interface IGeoJsonAssemblyPoint {
    type: string;
    geometry: IGeometry;
    properties?: Array<any>;
    direction: string;
}

export class GeoCluster implements IGeoJsonCluster {
    //Variable Definition for Cluster
  type = 'Feature';
  geometry: IGeometry;
  properties;
  direction;

  constructor(coordinates,properties? ) {
    this.geometry = {
      type: 'Point',
      // coordinates: coordinates
      coordinates,
    };
    properties = properties;
    console.log(properties);
  }
}


export class GeoAssemblyPoint implements IGeoJsonAssemblyPoint {
    type = 'Feature';
    geometry: IGeometry;
    properties;
    direction;

    constructor(coordinates, properties? ) {
      this.geometry = {
        type: 'Point',
        // coordinates: coordinates,
        coordinates,
      };

      this.properties = {name:properties[0].name, longitude: coordinates[0], latitude: coordinates[1]};


    }
  }




export class ClusterCollection {
  type = 'FeatureCollection';
  constructor(public features: Array<GeoCluster>) {}
}

export class AssemblyPointCollection {
    type = 'FeatureCollection';
    constructor(public features: Array<GeoAssemblyPoint>) {}
}


export class RoutingGeoAssemblyPoint {
  position: Position;
  name: string;
  constructor(longitude: number, latitude: number, name: string){
    this.position = {
      longitude, latitude
    },
    this.name = name;
  }

}

