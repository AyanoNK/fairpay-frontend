interface IProductPicker {
  product: Product;
  quantity: number;
  disableDecrease: boolean;
  handleRemoveProduct(id: number): void;
  handleAddProduct(id: number): void;
}

export default function ProductPicker({
  product,
  quantity,
  disableDecrease,
  handleRemoveProduct,
  handleAddProduct,
}: IProductPicker) {
  return (
    <div
      className="grid grid-cols-2 col-span-2 md:col-span-1"
      key={product.name}
    >
      <div
        className={`col-span-2 flex flex-col items-center justify-center rounded border p-3  text-center `}
      >
        <h3 className="text-xl font-bold">{product.name}</h3>
        <span className="text-md font-regular">{product.description}</span>
        <span className="text-md font-regular">{quantity}</span>
      </div>
      <button
        className="col-span-1 p-1 rounded border"
        onClick={() => handleRemoveProduct(product.id)}
        disabled={disableDecrease}
      >
        -
      </button>
      <button
        className="col-span-1 p-1 rounded border"
        onClick={() => handleAddProduct(product.id)}
      >
        +
      </button>
    </div>
  );
}
