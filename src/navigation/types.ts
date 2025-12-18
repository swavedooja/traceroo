import type { Asset, Consignment } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  ScanToPack: undefined;
  ScanToView: undefined;
  ScanToTagLocation: undefined;
  ScanToTagUser: undefined;
  AssetDetails: { assetId: string };
  ConsignmentDetails: { consignmentId: string };
  CreateConsignment: undefined;
  ExceptionReport: undefined;
};

export type MainTabParamList = {
  ScanHub: undefined;
  Assets: undefined;
  Consignments: undefined;
  Labels: undefined;
  Admin: undefined;
  MyAssets: undefined;
  MyConsignments: undefined;
};

export type ScanStackParamList = {
  ScanHub: undefined;
  ScanToPack: undefined;
  ScanToView: undefined;
  ScanToTagLocation: undefined;
  ScanToTagUser: undefined;
  AssetDetails: { assetId: string };
};

export type AssetStackParamList = {
  AssetsList: undefined;
  AssetDetails: { assetId: string };
};

export type ConsignmentStackParamList = {
  ConsignmentsList: undefined;
  ConsignmentDetails: { consignmentId: string };
  CreateConsignment: undefined;
};

export type AdminStackParamList = {
  AdminHome: undefined;
  UsersManagement: undefined;
  LocationsManagement: undefined;
  DevicesManagement: undefined;
  LabelTemplates: undefined;
  PackingTemplates: undefined;
};