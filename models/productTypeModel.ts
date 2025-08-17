export interface ProductTypesModel {
    limit:         number;
    offset:        number;
    count:         number;
    product_types: ProductTypeModel[];
}

export interface ProductTypeModel {
    id:         string;
    created_at: Date;
    updated_at: Date;
    value:      string;
}
