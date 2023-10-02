import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

const URL = 'http://localhost:3000/products';
const URLcat = 'http://localhost:3000/categories';

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    
    constructor(private http: HttpClient) { }
    //GET ALL
    get_products(): Observable<Product[]> {
        return this.http.get<Product[]>(URL);
    }

    //GET ONE
    get_product(slug: String): Observable<Product> {
    return this.http.get<Product>(`${URL}/${slug}`);
    }

    //CREATE
    create_product(product: Product): Observable<Product[]> {
    return this.http.post<Product[]>(URL, product);
    }

    //UPDATE ONE
    update_product(product: Product, slug: String): Observable<Product[]> {
    return this.http.put<Product[]>(`${URL}/${slug}`, product);
    }

    //DELETE ONE
    delete_product(slug: String): Observable<Product[]> {
    return this.http.delete<Product[]>(`${URL}/${slug}`);
    }
    //DELETE ALL
    delete_all_products(): Observable<Product[]> {
    return this.http.delete<Product[]>(`${URL}`);
    }

    getProductsByCategory(slug: String): Observable<Product[]> {
        return this.http.get<Product[]>(`${URLcat}/${slug}`);
        }
    // get_products_from_category(slug: String, params: any): Observable<{products: Product[], product_count: number}> {
    //     return this.apiService.get_products('products/category/', slug, new HttpParams({fromObject:params}));
    //   }
    
}