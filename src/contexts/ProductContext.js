import React, { createContext, useContext, useMemo, useState } from 'react';

const ProductContext = createContext({});

export function ProductProvider({ children }) {
  const [createdProducts, setCreatedProducts] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState({});
  const [deletedProductIds, setDeletedProductIds] = useState([]);
  const [version, setVersion] = useState(0);

  function addLocalProduct(product) {
    setCreatedProducts((current) => [product, ...current]);
    setVersion((current) => current + 1);
  }

  function updateLocalProduct(product) {
    setUpdatedProducts((current) => ({
      ...current,
      [product.id]: product,
    }));

    setCreatedProducts((current) =>
      current.map((item) => (item.id === product.id ? product : item))
    );

    setVersion((current) => current + 1);
  }

  function deleteLocalProduct(productId) {
    setDeletedProductIds((current) => [...current, productId]);

    setCreatedProducts((current) =>
      current.filter((item) => item.id !== productId)
    );

    setVersion((current) => current + 1);
  }

  function applyLocalChanges(apiProducts = [], filters = {}) {
    const search = filters.search?.trim().toLowerCase();
    const category = filters.category;

    const visibleCreatedProducts = createdProducts.filter((product) => {
      const matchesSearch = search
        ? product.title?.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search)
        : true;

      const matchesCategory = category
        ? product.category === category
        : true;

      return matchesSearch && matchesCategory;
    });

    const mergedApiProducts = apiProducts
      .filter((product) => !deletedProductIds.includes(product.id))
      .map((product) => updatedProducts[product.id] || product);

    const createdIds = visibleCreatedProducts.map((item) => item.id);

    return [
      ...visibleCreatedProducts,
      ...mergedApiProducts.filter((item) => !createdIds.includes(item.id)),
    ];
  }

  const value = useMemo(
    () => ({
      version,
      addLocalProduct,
      updateLocalProduct,
      deleteLocalProduct,
      applyLocalChanges,
    }),
    [version, createdProducts, updatedProducts, deletedProductIds]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductsStore() {
  return useContext(ProductContext);
}