import productsModel from './models/products.model.js'
import mongoose from 'mongoose'

export default class Products {
    constructor() {

    }

    get = async () => {
        let products = await productsModel.find().lean()
        return products
    }
    addProduct = async (prodData) => {
        try
        {
            let prodCreate = await productsModel.create(prodData);
            return prodCreate
        }catch(error){
            console.error('Error al crear producto:', error);
            return 'Error al crear producto';
        }      
    }
    updateProduct = async (prodId, prodData) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(prodId)) {
                return 'ID de producto no válido';
            }
            let updatedProduct = await productsModel.updateOne({ _id: new mongoose.Types.ObjectId(prodId) }, { $set: prodData });
            return updatedProduct
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            return 'Error al actualizar producto';
        }
    }
    deleteProduct = async (productId) => {
        try {
            // Verificar  el ID 
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return 'ID de producto no válido';
            }
    
            // Eliminar  producto utilizando el ID
            let deletedProduct = await productsModel.deleteOne({ _id: new mongoose.Types.ObjectId(productId) });
            return deletedProduct
        } catch (error) {
            console.error('Error no se puede eliminar producto:', error);
            return 'Error al eliminar producto';
        }
    };
    getProductById = async (id) => { 
        try {
            // Al obtener datos de la base de datos con Mongoose, los objetos retornados a menudo incluyen propiedades innecesarias específicas de Mongoose.
            //El método lean() de Mongoose elimina estas propiedades, dejando solo los datos esenciales en formato JSON puro."

            const prod = await productsModel.findById(id).lean();    
            if (prod === null) {
                return 'Producto no encontrado';
            }   
            return prod;
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            return 'Error al obtener el producto';
        }
    }
    
    getProductOwnerById = async (productId) => {
        try {
            const product = await productsModel.findById(productId).lean();
            if (!product) {
                return 'Producto no encontrado';
            }
    
            //  ID del owner del producto
            const ownerId = product.owner;
            
            if (ownerId) {
                return {owner : ownerId}
            } else {
                return 'Owner no encontrado';
            }
        } catch (error) {
            console.error('Error al acceder al owner del producto:', error);
            return 'Error al acceder al owner del producto';
        }
    };
}