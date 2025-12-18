# TraceRoo - Track & Trace Mobile Application

A comprehensive React Native/Expo mobile application for end-to-end tracking and tracing of packaged goods with offline-first SQLite database, QR code scanning, and role-based access control.

## Features

- **Role-Based Access Control**: 5 user roles (Administrator, Packing Team, Logistics Team, Goods Handling Team, Customer)
- **QR Code Scanning**: 4 scan modes (Pack, View, Tag Location, Tag User)
- **Asset Lifecycle Management**: Track assets from creation to disposal
- **Consignment Management**: Create and track shipments
- **Offline-First**: SQLite database for offline operation
- **Audit Trails**: Complete history tracking for ownership, location, and status changes
- **Label Generation**: PDF label generation (coming soon)
- **Device Registration**: Secure device-based authentication

## Tech Stack

- **Framework**: React Native with Expo SDK
- **Database**: SQLite (expo-sqlite)
- **Navigation**: React Navigation
- **State Management**: Zustand
- **UI Components**: React Native Paper
- **Camera/Scanning**: expo-camera, expo-barcode-scanner
- **PDF Generation**: expo-print

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- Scan the QR code with Expo Go app (iOS/Android)
- Or press `a` for Android emulator
- Or press `i` for iOS simulator (macOS only)

## Default Credentials

- **Username**: admin
- **Password**: admin123
- **Role**: Administrator

## Database Schema

The application uses 14 tables:

### Master Data
- Users
- LocationTypes
- Locations
- Devices
- LabelTemplates
- PackingTemplates
- AssetTypes

### Transactional Data
- Assets
- Consignments
- ConsignmentAssets
- OwnershipHistory
- LocationHistory
- AssetStatusHistory

## User Roles & Permissions

### Administrator
- Full access to all features
- Manage users, locations, devices, templates
- View and modify all assets and consignments

### Packing Team
- Generate labels
- Perform packing operations
- Scan assets to view details

### Logistics Team
- Create and manage consignments
- Update consignment status
- Scan assets to view details

### Goods Handling Team
- Scan assets to view details
- Update asset location
- Manage storage

### Customer
- Read-only access
- View owned assets and consignments
- Confirm delivery

## Core Workflows

### 1. Login & Device Resolution
- User logs in with credentials
- System verifies device registration
- Active location assigned from device

### 2. Scan Hub (4 Modes)

#### Scan to Pack
- Select packing template
- Guided step-by-step workflow
- Real-time item list with remove option

#### Scan to View
- Camera-based QR scanning
- View complete asset details and history

#### Scan to Tag Location
- Scan asset → Select location
- Update location with audit trail

#### Scan to Tag User
- Scan asset → Select user
- Transfer ownership with audit trail

### 3. Asset Lifecycle Management
- Status changes: in_stock → scrapped/damaged/expired
- Reason capture for all status changes
- Complete audit trail

### 4. Consignment Management
- Create consignments
- Add/remove assets
- Status tracking: planned → in-transit → delivered
- Customer delivery confirmation

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Screen components
├── navigation/       # Navigation setup
├── database/         # SQLite schema & initialization
├── services/         # Business logic & DB operations
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── constants/        # App constants & theme
```

## Color Scheme

Professional blue, black, and white theme:
- Primary: #1E3A8A (Deep Blue)
- Secondary: #3B82F6 (Bright Blue)
- Tertiary: #60A5FA (Light Blue)
- Background: #FFFFFF (White)
- Surface: #F8FAFC (Light Gray)

## Development Notes

### Device Registration
Before using the app, devices must be registered by an administrator:
1. Get device identifier
2. Create device record in Devices table
3. Assign location to device

### First-Time Setup
On first launch, the app automatically:
- Creates database tables
- Seeds default admin user
- Creates default asset types
- Creates default location type and location

## Future Enhancements

- [ ] Server synchronization
- [ ] PDF label generation
- [ ] Advanced reporting
- [ ] Batch operations
- [ ] Export functionality
- [ ] Push notifications

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact your system administrator.