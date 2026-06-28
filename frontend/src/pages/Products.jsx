import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiGrid } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import ChickenCutsVisualGuide from '../components/ChickenCutsVisualGuide';
import ChickenCutsBanner from '../components/ChickenCutsBanner';
import { productAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subCategory: searchParams.get('subCategory') || searchParams.get('cut') || '',
    freshnessTag: searchParams.get('freshnessTag') || '',
    organic: searchParams.get('organic') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCutsGuide, setShowCutsGuide] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const { data } = await productAPI.getAll(cleanFilters);
      setProducts(data.data || []);
      
      if (!data.data || data.data.length === 0) {
        toast('No products found matching your criteria', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    
    const newParams = new URLSearchParams();
    Object.entries({ ...filters, [key]: value })
      .filter(([_, v]) => v !== '')
      .forEach(([k, v]) => newParams.set(k, v));
    setSearchParams(newParams);
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'chicken-cuts', label: 'Chicken Cuts' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'live-chicken', label: 'Live Chicken' },
    { value: 'marinades', label: 'Marinades' },
    { value: 'ready-to-cook', label: 'Ready-to-Cook' },
    { value: 'organs', label: 'Organs' },
  ];

  const subCategories = [
    { value: '', label: 'All Cuts' },
    { value: 'cube-cut', label: 'Cube Cut' },
    { value: 'dragon-cut', label: 'Dragon Cut' },
    { value: 'butterfly-cut', label: 'Butterfly Cut' },
    { value: '65-piece', label: 'Chicken 65 Pieces' },
    { value: 'finger-cut', label: 'Finger Cut' },
    { value: 'julienne-cut', label: 'Julienne Cut' },
    { value: 'lollipop', label: 'Lollipop' },
    { value: 'breast', label: 'Breast' },
    { value: 'wings', label: 'Wings' },
    { value: 'legs', label: 'Legs' },
    { value: 'thighs-boneless', label: 'Thighs Boneless' },
    { value: 'curry-cut', label: 'Curry Cut (Boneless)' },
    { value: 'small-curry-cut', label: 'Small Curry Cut' },
    { value: 'big-curry-cut', label: 'Big Curry Cut' },
    { value: 'whole', label: 'Whole Chicken' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="text-sm text-gray-600 mt-1">
                Fresh chicken cuts, eggs, and more delivered to your doorstep
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* View Cuts Guide Button */}
              <button
                onClick={() => setShowCutsGuide(true)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg"
                title="View Chicken Cuts Guide"
              >
                <FiGrid className="w-5 h-5" />
                <span className="hidden sm:inline">Chicken Cuts Guide</span>
              </button>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 btn-outline"
              >
                <FiFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chicken Cuts Visual Guide Modal */}
      {showCutsGuide && (
        <ChickenCutsVisualGuide onClose={() => setShowCutsGuide(false)} />
      )}

      {/* Chicken Cuts Banner */}
      <ChickenCutsBanner onViewGuide={() => setShowCutsGuide(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Filters</h3>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SubCategory (only for chicken-cuts) */}
                {filters.category === 'chicken-cuts' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chicken Cut Type
                    </label>
                    <select
                      value={filters.subCategory}
                      onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                      className="input-field"
                    >
                      {subCategories.map((sub) => (
                        <option key={sub.value} value={sub.value}>
                          {sub.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Freshness */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Freshness
                  </label>
                  <select
                    value={filters.freshnessTag}
                    onChange={(e) => handleFilterChange('freshnessTag', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All</option>
                    <option value="fresh">Fresh</option>
                    <option value="frozen">Frozen</option>
                  </select>
                </div>

                {/* Organic */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.organic === 'true'}
                      onChange={(e) =>
                        handleFilterChange('organic', e.target.checked ? 'true' : '')
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Organic Only</span>
                  </label>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilters({
                      category: '',
                      subCategory: '',
                      freshnessTag: '',
                      organic: '',
                      minPrice: '',
                      maxPrice: '',
                      search: '',
                    });
                    setSearchParams({});
                  }}
                  className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <FiSearch className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try adjusting your filters or browse all products.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      category: '',
                      subCategory: '',
                      freshnessTag: '',
                      organic: '',
                      minPrice: '',
                      maxPrice: '',
                      search: '',
                    });
                    setSearchParams({});
                  }}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FiSearch className="w-4 h-4" />
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
