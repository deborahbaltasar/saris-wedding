import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Plus, Minus, X, ExternalLink, Gift, Filter, Check, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './ui/pagination';
import { useCart } from './CartContext';
import { translateDepartment } from '../utils/department';

type SortOption = 'alphabetical' | 'price-high' | 'price-low';
type Department = string;

interface GiftRegistrySectionProps {
  onOpenCart?: () => void;
}

export function GiftRegistrySection({ onOpenCart }: GiftRegistrySectionProps) {
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical');
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('all');
  // const [minPrice, setMinPrice] = useState<number>(0);
  // const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    giftItems,
    selectedItems,
    addToCart,
    removeFromCart,
    clearCart,
    getItemQuantity,
    totalItems,
    totalPrice
  } = useCart();

  const availableItems = giftItems.filter(item => !item.purchased);
  
  // Get unique departments and sort them alphabetically
  const departments = ['all', ...Array.from(new Set(availableItems.map(item => item.department))).sort()];
  
  // Filter and sort items
  const getFilteredAndSortedItems = () => {
    let filtered = availableItems;
    
    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(item => item.department === selectedDepartment);
    }
    
    // Sort items
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        default:
          return 0;
      }
    });
    
    return sorted;
  };

  const filteredItems = getFilteredAndSortedItems();

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: 'alphabetical', label: 'Ordem Alfabética' },
    { value: 'price-high', label: 'Maior Preço' },
    { value: 'price-low', label: 'Menor Preço' }
  ];

  return (
    <section id="gifts" className="py-12 bg-gradient-to-b from-sage-light/10 to-cream/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-romantic text-4xl md:text-5xl text-sage-dark mb-6">
            Lista de presentes
          </h2>
          <div className="w-24 h-1 bg-sage-dark mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            A sua presença é o maior presente, mas se desejar nos ajudar a começar nossa nova vida juntos, preparamos uma seleção de itens que significam muito para nós.
          </p>

          {/* Cart Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCart}
            className="inline-flex items-center px-6 py-3 bg-sage-dark text-background rounded-full hover:bg-sage-medium transition-colors relative"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>View Selected ({totalItems})</span>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        {/* Filter and Sort Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Filter className="h-5 w-5 text-sage-medium mr-2" />
            <span className="text-sage-dark font-medium">Filtros e Ordenação</span>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Sort and Department Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Sort Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-sage-dark">Ordenar por:</label>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value as SortOption);
                      handleFilterChange();
                    }}
                    className="w-full px-4 py-3 bg-background/80 border-2 border-sage-light rounded-xl text-sage-dark focus:border-sage-medium focus:outline-none appearance-none cursor-pointer"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sage-medium pointer-events-none" />
                </div>
              </div>

              {/* Department Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-sage-dark">Departamento:</label>
                <div className="relative">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value as Department);
                      handleFilterChange();
                    }}
                    className="w-full px-4 py-3 bg-background/80 border-2 border-sage-light rounded-xl text-sage-dark focus:border-sage-medium focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="all">Todos os Departamentos</option>
                    {departments.filter(dept => dept !== 'all').map((department) => (
                      <option key={department} value={department as string}>
                        {translateDepartment(department as string)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sage-medium pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedDepartment !== 'all' || sortOption !== 'alphabetical') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSortOption('alphabetical');
                    setSelectedDepartment('all');
                    handleFilterChange();
                  }}
                  className="px-6 py-2 bg-sage-light/20 text-sage-dark rounded-lg hover:bg-sage-light/30 transition-colors"
                >
                  Limpar Filtros
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* No Results Message */}
          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-8 p-6 bg-sage-light/10 rounded-xl"
            >
              <Gift className="h-12 w-12 text-sage-light mx-auto mb-3" />
              <h3 className="font-medium text-sage-dark mb-2">Nenhum presente encontrado</h3>
              <p className="text-foreground/70">Tente ajustar os filtros para ver mais opções</p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-sage-medium">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} de {filteredItems.length} {filteredItems.length === 1 ? 'presente' : 'presentes'}
              {selectedDepartment !== 'all' && (
                <span className="font-medium text-sage-dark">
                  {' '}em {translateDepartment(selectedDepartment)}
                </span>
              )}
            </p>
          </motion.div>
        )}

        {/* Gift Items Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {currentItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sage-light/30 group h-[420px] flex flex-col"
              >
                <div className="relative mb-4 overflow-hidden rounded-xl flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col flex-grow">
                  <h3 className="font-medium text-sage-dark mb-2 min-h-12 flex items-start leading-tight">{item.name}</h3>
                  <p className="text-sm text-foreground/70 mb-3 line-clamp-2 flex-shrink-0">{item.description}</p>

                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <span className="text-lg font-semibold text-sage-dark">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</span>
                    <span className="text-sm text-sage-medium">{translateDepartment(item.department)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 text-sm text-sage-dark border border-sage-light rounded-lg hover:bg-sage-light/10 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </motion.a>

                    {getItemQuantity(item.id) === 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item.id)}
                        className="flex items-center px-4 py-2 bg-sage-dark text-background rounded-lg hover:bg-sage-medium transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </motion.button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 bg-sage-light rounded-full flex items-center justify-center text-sage-dark hover:bg-sage-medium hover:text-background transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </motion.button>
                        <span className="w-8 text-center font-medium text-sage-dark">
                          {getItemQuantity(item.id)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToCart(item.id)}
                          className="w-8 h-8 bg-sage-dark rounded-full flex items-center justify-center text-background hover:bg-sage-medium transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-sage-light/10'} transition-colors`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer transition-colors ${currentPage === page
                          ? 'bg-sage-dark text-background hover:bg-sage-medium'
                          : 'hover:bg-sage-light/10 text-sage-dark'
                        }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-sage-light/10'} transition-colors`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}


        {/* Additional Registry Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-sage-light/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-romantic text-2xl text-sage-dark mb-4">
              Obrigado pela sua generosidade.
            </h3>
            <p className="text-foreground/80 leading-relaxed">
Somos imensamente gratos pelo seu amor e apoio enquanto iniciamos este novo capítulo juntos. Se preferir oferecer um presente em dinheiro, também criamos uma vaquinha para nossa lua de mel dos sonhos.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
