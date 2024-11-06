import {create} from 'zustand'

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({products}),
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return { sucess: false, message: 'All fields are required' }
        }
        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        })
        const data = await res.json();
        set((state) => ({products: [...state.products, data.data]}));
        return { sucess: true, message: 'Product created' };
    },
    
    fetchProducts: async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        set({products: data.data});
    },

    deleteProduct: async (pid) => {
        const res = await fetch(`/api/products/${pid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.sucess) return { sucess: false, message: data.message};
        set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
        return { sucess: true, message: data.message};
    },
    updateProduct: async (pid, updatedProduct) => {
        const res = await fetch(`/api/products/${pid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await res.json();
        if (!data.sucess) return { sucess: false, message: data.message};
        set((state) => ({products: state.products.map((product) => (product._id === pid ? data.data : product))}));
        return { sucess: true, message: data.message};
    }
}));
