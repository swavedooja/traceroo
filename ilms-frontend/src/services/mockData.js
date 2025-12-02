export const mockData = {
    materials: {
        list: [
            {
                material_code: 'MAT-001',
                material_description: 'High Grade Steel Coil',
                batch_number: 'BATCH-2023-001',
                manufacturing_date: '2023-11-01',
                expiry_date: '2024-11-01',
                status: 'Active',
            },
            {
                material_code: 'MAT-002',
                material_description: 'Industrial Plastic Pellets',
                batch_number: 'BATCH-2023-002',
                manufacturing_date: '2023-11-05',
                expiry_date: '2025-11-05',
                status: 'Active',
            },
            {
                material_code: 'MAT-003',
                material_description: 'Copper Wire Spool',
                batch_number: 'BATCH-2023-003',
                manufacturing_date: '2023-11-10',
                expiry_date: '2028-11-10',
                status: 'Quarantine',
            }
        ],
        details: (code) => ({
            material_code: code,
            material_description: 'Mock Material Description',
            batch_number: 'BATCH-MOCK-001',
            manufacturing_date: '2023-01-01',
            expiry_date: '2024-01-01',
            status: 'Active',
            specifications: {
                weight: '100kg',
                dimensions: '10x10x10',
            }
        }),
        images: [
            { id: 1, url: 'https://via.placeholder.com/300?text=Material+Image+1', type: 'material' },
            { id: 2, url: 'https://via.placeholder.com/300?text=Material+Image+2', type: 'material' }
        ],
        documents: [
            { id: 1, name: 'Safety_Sheet.pdf', url: '#', type: 'safety' },
            { id: 2, name: 'Spec_Sheet.pdf', url: '#', type: 'spec' }
        ]
    },
    packaging: {
        get: (id) => ({
            id: id || 'PKG-001',
            type: 'Pallet',
            status: 'In-Stock',
            items: [
                { id: 'BOX-001', type: 'Box', content: 'MAT-001' },
                { id: 'BOX-002', type: 'Box', content: 'MAT-001' }
            ],
            qr_code: 'https://via.placeholder.com/150?text=QR+Code'
        }),
        preview: (id) => ({
            id: id || 'PKG-001',
            preview_url: 'https://via.placeholder.com/400?text=Label+Preview'
        })
    },
    warehouses: {
        list: [
            { warehouse_code: 'WH-001', name: 'Central Distribution Hub', location: 'New York, USA', capacity: 10000 },
            { warehouse_code: 'WH-002', name: 'West Coast Facility', location: 'California, USA', capacity: 5000 },
            { warehouse_code: 'WH-003', name: 'European Depot', location: 'Berlin, Germany', capacity: 8000 }
        ],
        details: (code) => ({
            warehouse_code: code,
            name: 'Mock Warehouse',
            location: 'Mock Location',
            capacity: 1000,
            sections: ['A1', 'A2', 'B1']
        })
    },
    labelTemplates: {
        list: [
            { id: 1, name: 'Standard Pallet Label', dimensions: '4x6', format: 'ZPL' },
            { id: 2, name: 'Small Box Label', dimensions: '2x4', format: 'PDF' }
        ],
        details: (id) => ({
            id: id,
            name: 'Mock Template',
            content: 'Mock Template Content'
        })
    },
    inventory: {
        list: [
            { id: 1, material_code: 'MAT-001', quantity: 500, location: 'WH-001-A1' },
            { id: 2, material_code: 'MAT-002', quantity: 1200, location: 'WH-002-B1' }
        ]
    },
    trace: {
        history: (serial) => ({
            serial_number: serial,
            current_status: 'Delivered',
            timeline: [
                { date: '2023-11-01 08:00', status: 'Manufactured', location: 'Factory A' },
                { date: '2023-11-02 10:00', status: 'Quality Check Passed', location: 'Factory A' },
                { date: '2023-11-03 14:00', status: 'Shipped', location: 'Transit' },
                { date: '2023-11-05 09:00', status: 'Received', location: 'WH-001' },
                { date: '2023-11-10 16:00', status: 'Delivered', location: 'Customer Site' }
            ]
        })
    }
};
