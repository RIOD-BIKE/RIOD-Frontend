
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

export interface Biker {
    duration: number;
    userId: string;
}

export interface Cluster {
    geoCluster: GeoCluster;
    bearing: number;
    name: string;
    memberCount: number;
}



export class AssemblyPoint {
    name: string;
    potBikeTogether: Biker[] = [];

    constructor(name: string, potBiker: Biker[]) {
        this.name = name;
        this.potBikeTogether = potBiker;
    }
}

export interface IGeometry {
    type: string;
    coordinates: [number, number];
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
    available?: string;

}
export interface IGeoPointMarker {
  type: string;
  geometry: IGeometry;
  properties?: Array<any>;

}

export class GeoCluster implements IGeoJsonCluster {
  type = 'Feature';
  geometry: IGeometry;
  properties;
  direction;

  constructor(coordinates, properties? ) {
    this.geometry = {
      type: 'Point',
      coordinates,
    };
    this.properties = {count: properties[0]};
  }
}

export class GeoAssemblyPoint implements IGeoJsonAssemblyPoint {
    type = 'Feature';
    geometry: IGeometry;
    properties;

    constructor(coordinates, textField, iconName, properties?, available?) {
      this.geometry = {type: 'Point', coordinates, };
      const obj = [];
      available.forEach(x => {
          for (let i = 0; i < x.length; i++) {
           obj.push(x[i]);
        }

          switch (obj.length) {
        case 0: {
          this.properties = {title: properties[0], latitude: coordinates[0],
            longitude: coordinates[1], available_count: 0, textField, iconName};
          break;
        }
        case 1: {
          this.properties = {title: properties[0], latitude: coordinates[0], longitude: coordinates[1],
            available_1: obj[0], available_count: 1, textField, iconName};
          break;
        }
        case 2: {
          this.properties = {title: properties[0], latitude: coordinates[0], longitude: coordinates[1],
            available_1: obj[0], available_2: obj[1], available_count: 2, textField, iconName};
          break;
        }
        case 3: {
          this.properties = {title: properties[0], latitude: coordinates[0], longitude: coordinates[1],
            available_1: obj[0], available_2: obj[1], available_3: obj[2], available_count: 3, textField, iconName};
          break;
        }
        case 4: {
          this.properties = {title: properties[0], latitude: coordinates[0], longitude: coordinates[1],
            available_1: obj[0], available_2: obj[1], available_3: obj[2], available_4: obj[3], available_count: 4, textField, iconName};
          break;
        }
        case 5: {
          this.properties = {title: properties[0], latitude: coordinates[0], longitude: coordinates[1],
            available_1: obj[0], available_2: obj[1], available_3: obj[2], available_4: obj[3], available_5: obj[4],
            available_count: 5, textField, iconName};
          break;
        }
        case 6: {
          this.properties = {title: properties[0], latitude: coordinates[0], longitude: coordinates[1],
            available_1: obj[0], available_2: obj[1], available_3: obj[2], available_4: obj[3], available_5: obj[4],
            available_6: obj[5], available_count: 6, textField, iconName};
          break;
        }
        default: {
          this.properties = {title: properties[0], latitude: coordinates[0], longitude: coordinates[1], textField, iconName};
          break;
        }
      }
      });
    }
  }
export class GeoPointMarker implements IGeoPointMarker {
    type = 'Feature';
    geometry: IGeometry;
    properties;

    constructor(coordinates, properties? ) {
      this.geometry = {
        type: 'Point',
        coordinates,
      };
      this.properties = {};
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
export class PointMarker {
  type = 'FeatureCollection';
  constructor(public features: Array<GeoPointMarker>) {}
}

export class RoutingGeoAssemblyPoint {
  position: Position;
  name: string;
  available: Array<String>;
  textField = '';
  iconName = '';
  constructor(longitude: number, latitude: number, name: string, available: Array<string>, textField: string, iconName: string) {
    this.position = {
      longitude, latitude
    },
    this.name = name;
    this.available = available;
    this.textField = textField;
    this.iconName = iconName;
  }
}

export class PolygonAssemblyPoint {
  activated = false;
  name: string;
  distance: number;
  duration: number;
  polygon: any;
  constructor(name: string, distance: number, duration: number, polygon: any) {
    this.name = name;
    this.distance = distance;
    this.duration = duration;
    this.polygon = polygon;
  }
}
export interface MapboxOutput {
  attribution: string;
  features: Feature[];
  query: [];
}
export interface Feature {
  place_name: string;
  geometry: any;
  properties: any;
}

export class AssemblyPointReference {
  reference: string;
  name: string;
  constructor(name: string, reference: string) {
    this.reference = reference;
    this.name = name;
  }
}

export class iconShortcut {
  iconName: string;
  orderNumber: number;
  address: string;
  coords: number[];
  constructor(iName: string, oNumber: number, address: string, coords: number[]) {
    this.iconName = iName;
    this.orderNumber = oNumber;
    this.address = address;
    this.coords = coords;
  }
}

export class recentShortcut {
  iconName: string;
  city: string;
  street: string;
  address: string;
  coords: number[];
  constructor(iName: string, street: string, city: string, address: string, coords: number[]) {
    this.iconName = iName;
    this.city = city;
    this.street = street;
    this.address = address;
    this.coords = coords;
  }
}

export class miniShortcut {
  iconName: string;
  city: string;
  street: string;
  icon: iconShortcut;
  constructor(iName: string, street: string, city: string, icon: iconShortcut) {
    this.iconName = iName;
    this.city = city;
    this.street = street;
    this.icon = icon;
  }
}

export class riodMembersAtAP {
  duration: string;
  timestamp: string;
  constructor(duration: string, timestamp: string) {
    this.duration = duration;
    this.timestamp = timestamp;
  }
}


