import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import EditProductModal from '../Product/EditProductModal';

function ProductsListCard({ product, triggerRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);

  const deleteProduct = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/main/products/" + product.id, {
        method: 'DELETE'
      });
      triggerRefresh();
      if (!response.ok) throw new Error("Error while deleting product");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl shadow-sm border bg-white w-full max-w-5xl mx-auto gap-4">
      <EditProductModal product={product} isOpen={modalOpen} onClose={() => { setModalOpen(false); triggerRefresh(); }} />
      
      {/* Product Image and Basic Info */}
      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 text-center sm:text-left w-full sm:w-auto">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 rounded-xl object-cover border border-gray-100"
        />
        <div className="mt-4 sm:mt-0 h-24 flex flex-col justify-around">
          <h3 className="text-xl font-semibold">{product.name}</h3>

          <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500">
            <div>Creation date <span className="font-bold text-black block sm:inline">{product.creation_date}</span></div>
            <div>Category <span className="font-bold text-black block sm:inline">{product.category}</span></div>
            <div>Price <span className="font-bold text-black block sm:inline">${product.price}</span></div>
            <div>Stock <span className="font-bold text-black block sm:inline">{product.stock}</span></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto space-x-4">
        <FontAwesomeIcon icon={faPen} onClick={() => setModalOpen(true)} className="border rounded-lg p-2 hover:bg-gray-200 cursor-pointer" />
        <FontAwesomeIcon icon={faTrash} onClick={deleteProduct} className="border rounded-lg p-2 hover:bg-red-500 cursor-pointer" />
      </div>
    </div>
  );
}

export default ProductsListCard;
