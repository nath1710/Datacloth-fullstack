import { faMagnifyingGlass, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import CreateProductModal from '../Product/CreateProductModal'

function ProductsFilters({ triggerRefresh, products, setFilteredProducts }) {
  const [searchField, setSearchField] = useState("")

  const filterProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/main/products?search=${searchField}`
      );

      if (!response.ok) throw new Error("Error while fetching products");

      const data = await response.json();
      setFilteredProducts(data.products);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      filterProducts();
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="">
      <div className="p-4 rounded-xl bg-[rgba(226,232,240,255)] flex flex-col gap-2">
        <button onClick={() => setModalOpen(true)} className="bg-[#74C0FC] p-2 rounded-lg">Add product&nbsp;&nbsp;<FontAwesomeIcon icon={faSquarePlus} /></button>
        <CreateProductModal isOpen={modalOpen} onClose={() => { setModalOpen(false); triggerRefresh() }} />
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm w-full max-w-md">
          <input
            type="text"
            placeholder="Search On This List"
            className="outline-none w-full text-gray-500 placeholder-gray-400 bg-transparent"
            onKeyDown={handleKeyDown} value={searchField} onChange={(e) => setSearchField(e.target.value)}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="cursor-pointer" onClick={filterProducts} />
        </div>
      </div>
    </div>
  )
}

export default ProductsFilters