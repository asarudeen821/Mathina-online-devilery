import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiGrid } from 'react-icons/fi';
import { productAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'chicken-cuts',
    subCategory: '',
    price: '',
    stock: '',
    freshnessTag: 'fresh',
    halalCertified: true,
    organic: false,
    antibioticFree: false,
    isFeatured: false,
    imageUrl: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll({ limit: 100 });
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'chicken-cuts',
        subCategory: product.subCategory || '',
        price: product.price || '',
        stock: product.stock || '',
        freshnessTag: product.freshnessTag || 'fresh',
        halalCertified: product.halalCertified !== undefined ? product.halalCertified : true,
        organic: product.organic || false,
        antibioticFree: product.antibioticFree || false,
        isFeatured: product.isFeatured || false,
        imageUrl: product.images?.[0]?.url || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: 'chicken-cuts',
        subCategory: '',
        price: '',
        stock: '',
        freshnessTag: 'fresh',
        halalCertified: true,
        organic: false,
        antibioticFree: false,
        isFeatured: false,
        imageUrl: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        freshnessTag: formData.freshnessTag,
        halalCertified: Boolean(formData.halalCertified),
        organic: Boolean(formData.organic),
        antibioticFree: Boolean(formData.antibioticFree),
        isFeatured: Boolean(formData.isFeatured),
      };

      if (formData.category === 'chicken-cuts' && formData.subCategory) {
        payload.subCategory = formData.subCategory;
      }
      if (formData.imageUrl && formData.imageUrl.trim()) {
        payload.images = [{ url: formData.imageUrl.trim() }];
      } else if (editingProduct?.images?.length > 0) {
        payload.images = editingProduct.images;
      }

      let savedProduct;
      if (editingProduct) {
        const res = await productAPI.update(editingProduct._id, payload);
        savedProduct = res?.data?.data || payload;
        toast.success('Product updated successfully');
      } else {
        const res = await productAPI.create(payload);
        savedProduct = res?.data?.data || payload;
        toast.success('Product created successfully');
      }
      setShowModal(false);
      fetchProducts();

      // Broadcast update across customer pages and open tabs
      window.dispatchEvent(
        new CustomEvent('shop-products-updated', {
          detail: { product: savedProduct, action: editingProduct ? 'update' : 'create' },
        })
      );
      localStorage.setItem('mathina_shop_updated', Date.now().toString());
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();

      // Broadcast deletion across customer pages
      window.dispatchEvent(
        new CustomEvent('shop-products-updated', {
          detail: { id, action: 'delete' },
        })
      );
      localStorage.setItem('mathina_shop_updated', Date.now().toString());
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleGenerateQR = async (id) => {
    try {
      await productAPI.generateQR(id);
      toast.success('QR code generated successfully');
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
            <FiPlus />
            <span>Add Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const thumb = product.images?.[0]?.url || '/images/products/chicken-breast-boneless.png';
                  return (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={thumb}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                            onError={(e) => { e.target.src = '/images/products/chicken-breast-boneless.png'; }}
                          />
                          <div>
                            <div className="text-sm font-bold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                            {product.subCategory && (
                              <span className="text-[10px] text-primary-600 font-semibold bg-primary-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                {product.subCategory}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${product.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {product.isFeatured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {product.freshnessTag === 'fresh' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Fresh
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Frozen
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleGenerateQR(product._id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Generate QR Code"
                        >
                          <FiGrid className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={3}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
                      >
                        <option value="chicken-cuts">Chicken Cuts</option>
                        <option value="eggs">Eggs</option>
                        <option value="live-chicken">Live Chicken</option>
                        <option value="marinades">Marinades</option>
                        <option value="ready-to-cook">Ready-to-Cook</option>
                        <option value="organs">Organs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  {formData.category === 'chicken-cuts' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cut Type (SubCategory)
                      </label>
                      <select
                        value={formData.subCategory || ''}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        className="input-field"
                      >
                        <option value="">General / Counter Cut</option>
                        <option value="curry-cut">Curry Cut (Classic Bone-in)</option>
                        <option value="small-curry-cut">Small Curry Cut</option>
                        <option value="big-curry-cut">Big Curry Cut / Biryani Cut</option>
                        <option value="cube-cut">Cube Cut (Boneless)</option>
                        <option value="dragon-cut">Dragon Cut</option>
                        <option value="butterfly-cut">Butterfly Cut</option>
                        <option value="65-piece">Chicken 65 Pieces</option>
                        <option value="finger-cut">Finger Cut</option>
                        <option value="julienne-cut">Julienne Cut</option>
                        <option value="lollipop">Chicken Lollipop</option>
                        <option value="wings">Chicken Wings</option>
                        <option value="legs">Drumsticks / Legs</option>
                        <option value="breast">Boneless Breast</option>
                        <option value="whole">Whole Chicken</option>
                        <option value="thighs-boneless">Boneless Thighs</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="e.g. /images/products/chicken-breast-boneless.png"
                      className="input-field"
                    />
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1 text-xs">
                      {[
                        { label: 'Boneless Breast', url: '/images/products/chicken-breast-boneless.png' },
                        { label: 'Diced Cubes', url: '/images/products/chicken-breast-diced.png' },
                        { label: 'Drumsticks', url: '/images/products/chicken-drumsticks-raw.png' },
                        { label: 'Butterfly', url: '/images/products/chicken-breast-butterfly.png' },
                        { label: 'Strips', url: '/images/products/chicken-breast-strips.png' },
                        { label: 'Lollipop', url: '/images/products/chicken-lollipop-drumstick.png' },
                        { label: 'Marinated', url: '/images/products/chicken-leg-marinated.png' },
                        { label: 'Whole', url: '/images/products/whole-chicken-seasoned.png' },
                      ].map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded whitespace-nowrap text-[11px] font-medium"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Freshness
                      </label>
                      <select
                        value={formData.freshnessTag}
                        onChange={(e) => setFormData({ ...formData, freshnessTag: e.target.value })}
                        className="input-field"
                      >
                        <option value="fresh">Fresh</option>
                        <option value="frozen">Frozen</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.halalCertified}
                        onChange={(e) => setFormData({ ...formData, halalCertified: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Halal Certified</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.organic}
                        onChange={(e) => setFormData({ ...formData, organic: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Organic</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.antibioticFree}
                        onChange={(e) => setFormData({ ...formData, antibioticFree: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Antibiotic-Free</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button type="submit" className="btn-primary flex-1">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
