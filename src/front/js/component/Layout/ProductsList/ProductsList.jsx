import React, { useEffect, useState } from 'react'
import ProductsListCard from '../../ProductsListCard/ProductsListCard';
import ProductsFilters from '../../Filters/ProductsFilters';

// const products = [
//   {
//     id: 1,
//     name: "Yellow Coat",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://i5.walmartimages.com/seo/TAGOLD-Raincoat-Women-Winter-Jacket-Womens-Plus-Size-Hooded-Trench-Coats-Women-Solid-Rain-Jacket-Outdoor-Windproof-Top-Lined-Windbreaker-Travel-Yello_73e01008-3221-4631-8da8-7cb67269cb2a.1e1faa72451c0ad0af84ab81b9d20e93.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
//   },
//   {
//     id: 2,
//     name: "White Shirt",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://cafe24img.poxo.com/scause/web/product/big/202402/5eafbb04b2b89c6f7787f571997924e5.jpg"
//   },
//   {
//     id: 3,
//     name: "Blue Jean",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://www.shutterstock.com/image-photo/fashion-trendy-womens-jeans-isolated-600nw-2466839305.jpg"
//   },
//   {
//     id: 4,
//     name: "Yellow Coat",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://i5.walmartimages.com/seo/TAGOLD-Raincoat-Women-Winter-Jacket-Womens-Plus-Size-Hooded-Trench-Coats-Women-Solid-Rain-Jacket-Outdoor-Windproof-Top-Lined-Windbreaker-Travel-Yello_73e01008-3221-4631-8da8-7cb67269cb2a.1e1faa72451c0ad0af84ab81b9d20e93.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
//   },
//   {
//     id: 5,
//     name: "White Shirt",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://cafe24img.poxo.com/scause/web/product/big/202402/5eafbb04b2b89c6f7787f571997924e5.jpg"
//   },
//   {
//     id: 6,
//     name: "Blue Jean",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://www.shutterstock.com/image-photo/fashion-trendy-womens-jeans-isolated-600nw-2466839305.jpg"
//   },
//   {
//     id: 7,
//     name: "Yellow Coat",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://i5.walmartimages.com/seo/TAGOLD-Raincoat-Women-Winter-Jacket-Womens-Plus-Size-Hooded-Trench-Coats-Women-Solid-Rain-Jacket-Outdoor-Windproof-Top-Lined-Windbreaker-Travel-Yello_73e01008-3221-4631-8da8-7cb67269cb2a.1e1faa72451c0ad0af84ab81b9d20e93.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
//   },
//   {
//     id: 8,
//     name: "White Shirt",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://cafe24img.poxo.com/scause/web/product/big/202402/5eafbb04b2b89c6f7787f571997924e5.jpg"
//   },
//   {
//     id: 9,
//     name: "Blue Jean",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://www.shutterstock.com/image-photo/fashion-trendy-womens-jeans-isolated-600nw-2466839305.jpg"
//   },
//   {
//     id: 10,
//     name: "Yellow Coat",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://i5.walmartimages.com/seo/TAGOLD-Raincoat-Women-Winter-Jacket-Womens-Plus-Size-Hooded-Trench-Coats-Women-Solid-Rain-Jacket-Outdoor-Windproof-Top-Lined-Windbreaker-Travel-Yello_73e01008-3221-4631-8da8-7cb67269cb2a.1e1faa72451c0ad0af84ab81b9d20e93.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
//   },
//   {
//     id: 11,
//     name: "White Shirt",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://cafe24img.poxo.com/scause/web/product/big/202402/5eafbb04b2b89c6f7787f571997924e5.jpg"
//   },
//   {
//     id: 12,
//     name: "Blue Jean",
//     creationDate: "20h:46m:30s",
//     category: "Bank Offer",
//     price: "149",
//     stock: 45,
//     image: "https://www.shutterstock.com/image-photo/fashion-trendy-womens-jeans-isolated-600nw-2466839305.jpg"
//   },
// ];

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/main/products?page=${currentPage}`
      );

      if (!response.ok) throw new Error("Error while fetching products");

      const data = await response.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error) {
      console.error(error.message);
    }
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, refreshTrigger]);

  const [totalPages, setTotalPages] = useState(1);

  return (
    <div className="pt-[115px] flex flex-col items-center pb-10">
      <div>
        <p className="text-3xl pb-3">Products List</p>
        <div className="flex flex-col lg:flex-row gap-3">
          <ProductsFilters
            triggerRefresh={triggerRefresh}
            products={products}
            setFilteredProducts={setFilteredProducts}
          />
          <div className="bg-[rgba(226,232,240,255)] flex flex-col gap-1 p-4 rounded-xl">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductsListCard
                  key={product.id}
                  product={product}
                  triggerRefresh={triggerRefresh}
                />
              ))
            ) : (
              <p>No products were found</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsList;