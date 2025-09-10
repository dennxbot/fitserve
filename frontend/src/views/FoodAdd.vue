<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Enhanced Header with Animation -->
      <div class="mb-8 animate-fadeIn">
        <button
          @click="$router.go(-1)"
          class="group mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
        >
          <svg class="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Food List
        </button>
        
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Create Custom Food
              </h1>
              <p class="mt-2 text-lg text-gray-600">Add your own food with custom nutritional information</p>
            </div>
            <div class="hidden sm:block">
              <div class="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl">
                <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Progress Steps -->
          <div class="mt-6 flex items-center justify-between">
            <div class="flex items-center">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300', 
                           currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500']">
                1
              </div>
              <span class="ml-2 text-sm font-medium text-gray-700">Basic Info</span>
            </div>
            <div class="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
              <div :class="['h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500',
                           currentStep >= 2 ? 'w-full' : 'w-0']"></div>
            </div>
            <div class="flex items-center">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                           currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500']">
                2
              </div>
              <span class="ml-2 text-sm font-medium text-gray-700">Nutrition</span>
            </div>
            <div class="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
              <div :class="['h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500',
                           currentStep >= 3 ? 'w-full' : 'w-0']"></div>
            </div>
            <div class="flex items-center">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                           currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500']">
                3
              </div>
              <span class="ml-2 text-sm font-medium text-gray-700">Serving</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Form with Animations -->
      <form @submit.prevent="createFood" class="space-y-6">
        <transition name="slide-fade" mode="out-in">
          <div key="form-content">
            <!-- Basic Information Section -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
              <div class="flex items-center mb-6">
                <div class="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Basic Information</h3>
                  <p class="text-sm text-gray-500">Tell us about your food item</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="col-span-2">
                  <label for="name" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <span>Food Name</span>
                    <span class="ml-1 text-red-500">*</span>
                    <div class="group relative inline-block ml-2">
                      <svg class="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg py-2 px-3 w-48 bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                        Enter a descriptive name for your food item
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div class="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </label>
                  <div class="relative">
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      @focus="currentStep = 1"
                      class="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="e.g., Homemade Chicken Salad"
                      required
                    />
                    <div v-if="form.name" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label for="brand" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <span>Brand</span>
                    <span class="ml-2 text-xs text-gray-400">(Optional)</span>
                  </label>
                  <input
                    id="brand"
                    v-model="form.brand"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Homemade"
                  />
                </div>
                
                <div>
                  <label for="category" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <span>Category</span>
                    <span class="ml-1 text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      id="category"
                      v-model="form.category"
                      @focus="currentStep = 1"
                      class="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="Fruit">🍎 Fruit</option>
                      <option value="Vegetable">🥕 Vegetable</option>
                      <option value="Grain">🌾 Grain</option>
                      <option value="Protein">🥩 Protein</option>
                      <option value="Dairy">🥛 Dairy</option>
                      <option value="Snack">🍿 Snack</option>
                      <option value="Beverage">🥤 Beverage</option>
                      <option value="Meal">🍱 Meal</option>
                      <option value="Other">📦 Other</option>
                    </select>
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div class="col-span-2">
                  <label for="barcode" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <span>Barcode</span>
                    <span class="ml-2 text-xs text-gray-400">(Optional)</span>
                  </label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <input
                      id="barcode"
                      v-model="form.barcode"
                      type="text"
                      class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="1234567890123"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Nutritional Information Section -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
              <div class="flex items-center mb-6">
                <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Nutritional Information</h3>
                  <p class="text-sm text-gray-500">Per serving size values</p>
                </div>
              </div>
              
              <!-- Macronutrients - Primary Section -->
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Macronutrients</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <!-- Calories -->
                  <div class="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <label for="calories" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <span class="text-orange-600">🔥</span>
                      <span class="ml-2">Calories</span>
                      <span class="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id="calories"
                      v-model.number="form.calories"
                      type="number"
                      step="0.1"
                      min="0"
                      @focus="currentStep = 2"
                      class="w-full px-3 py-2 bg-white border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-0 transition-all duration-200 text-gray-900"
                      placeholder="0"
                      required
                    />
                    <p class="text-xs text-gray-500 mt-1">kcal</p>
                  </div>
                  
                  <!-- Protein -->
                  <div class="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                    <label for="protein" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <span class="text-red-600">💪</span>
                      <span class="ml-2">Protein</span>
                      <span class="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id="protein"
                      v-model.number="form.protein"
                      type="number"
                      step="0.1"
                      min="0"
                      @focus="currentStep = 2"
                      class="w-full px-3 py-2 bg-white border-2 border-red-200 rounded-lg focus:border-red-400 focus:ring-0 transition-all duration-200 text-gray-900"
                      placeholder="0"
                      required
                    />
                    <p class="text-xs text-gray-500 mt-1">grams</p>
                  </div>
                  
                  <!-- Carbohydrates -->
                  <div class="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
                    <label for="carbs" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <span class="text-yellow-600">🌾</span>
                      <span class="ml-2">Carbohydrates</span>
                      <span class="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id="carbs"
                      v-model.number="form.carbs"
                      type="number"
                      step="0.1"
                      min="0"
                      @focus="currentStep = 2"
                      class="w-full px-3 py-2 bg-white border-2 border-yellow-200 rounded-lg focus:border-yellow-400 focus:ring-0 transition-all duration-200 text-gray-900"
                      placeholder="0"
                      required
                    />
                    <p class="text-xs text-gray-500 mt-1">grams</p>
                  </div>
                  
                  <!-- Fat -->
                  <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <label for="fat" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <span class="text-green-600">🥑</span>
                      <span class="ml-2">Fat</span>
                      <span class="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id="fat"
                      v-model.number="form.fat"
                      type="number"
                      step="0.1"
                      min="0"
                      @focus="currentStep = 2"
                      class="w-full px-3 py-2 bg-white border-2 border-green-200 rounded-lg focus:border-green-400 focus:ring-0 transition-all duration-200 text-gray-900"
                      placeholder="0"
                      required
                    />
                    <p class="text-xs text-gray-500 mt-1">grams</p>
                  </div>
                </div>
              </div>
              
              <!-- Micronutrients - Optional Section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Additional Nutrients (Optional)</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                  <!-- Fiber -->
                  <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <label for="fiber" class="flex items-center text-xs font-semibold text-gray-600 mb-1">
                      <span>🌿 Fiber</span>
                    </label>
                    <input
                      id="fiber"
                      v-model.number="form.fiber"
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm focus:border-purple-400 focus:ring-0 transition-all duration-200"
                      placeholder="0"
                    />
                    <p class="text-xs text-gray-400 mt-0.5">grams</p>
                  </div>
                  
                  <!-- Sugar -->
                  <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <label for="sugar" class="flex items-center text-xs font-semibold text-gray-600 mb-1">
                      <span>🍭 Sugar</span>
                    </label>
                    <input
                      id="sugar"
                      v-model.number="form.sugar"
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm focus:border-purple-400 focus:ring-0 transition-all duration-200"
                      placeholder="0"
                    />
                    <p class="text-xs text-gray-400 mt-0.5">grams</p>
                  </div>
                  
                  <!-- Sodium -->
                  <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <label for="sodium" class="flex items-center text-xs font-semibold text-gray-600 mb-1">
                      <span>🧂 Sodium</span>
                    </label>
                    <input
                      id="sodium"
                      v-model.number="form.sodium"
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm focus:border-purple-400 focus:ring-0 transition-all duration-200"
                      placeholder="0"
                    />
                    <p class="text-xs text-gray-400 mt-0.5">mg</p>
                  </div>
                  
                  <!-- Cholesterol -->
                  <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <label for="cholesterol" class="flex items-center text-xs font-semibold text-gray-600 mb-1">
                      <span>💛 Cholesterol</span>
                    </label>
                    <input
                      id="cholesterol"
                      v-model.number="form.cholesterol"
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm focus:border-purple-400 focus:ring-0 transition-all duration-200"
                      placeholder="0"
                    />
                    <p class="text-xs text-gray-400 mt-0.5">mg</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Serving Information Section -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
              <div class="flex items-center mb-6">
                <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Serving Information</h3>
                  <p class="text-sm text-gray-500">Define your serving size</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="serving_size" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <span>🔢 Serving Size</span>
                    <span class="ml-1 text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="serving_size"
                      v-model.number="form.servingSize"
                      type="number"
                      step="1"
                      min="1"
                      @focus="currentStep = 3"
                      class="w-full px-4 py-3 pr-16 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 text-gray-900"
                      placeholder="100"
                      required
                    />
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      grams
                    </div>
                  </div>
                </div>
                
                <div>
                  <label for="serving_unit" class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <span>📏 Serving Unit</span>
                    <span class="ml-1 text-red-500">*</span>
                  </label>
                  <select
                    id="serving_unit"
                    v-model="form.servingUnit"
                    @focus="currentStep = 3"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                    required
                  >
                    <option value="g">g (grams)</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tbsp (tablespoon)</option>
                    <option value="tsp">tsp (teaspoon)</option>
                    <option value="oz">oz (ounce)</option>
                    <option value="piece">piece</option>
                    <option value="slice">slice</option>
                    <option value="serving">serving</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Enhanced Preview Section -->
            <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-2xl font-bold">Nutrition Summary</h3>
                  <p class="text-purple-100">Per {{ form.servingSize || 100 }}{{ form.servingUnit || 'g' }} serving</p>
                </div>
                <div class="p-3 bg-white bg-opacity-20 rounded-xl">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div class="text-3xl font-bold mb-1">{{ form.calories || 0 }}</div>
                  <div class="text-purple-100 text-sm uppercase tracking-wider">Calories</div>
                </div>
                <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div class="text-3xl font-bold mb-1">{{ form.protein || 0 }}<span class="text-lg">g</span></div>
                  <div class="text-purple-100 text-sm uppercase tracking-wider">Protein</div>
                </div>
                <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div class="text-3xl font-bold mb-1">{{ form.carbs || 0 }}<span class="text-lg">g</span></div>
                  <div class="text-purple-100 text-sm uppercase tracking-wider">Carbs</div>
                </div>
                <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div class="text-3xl font-bold mb-1">{{ form.fat || 0 }}<span class="text-lg">g</span></div>
                  <div class="text-purple-100 text-sm uppercase tracking-wider">Fat</div>
                </div>
              </div>
              
              <!-- Additional nutrients if provided -->
              <div v-if="form.fiber || form.sugar || form.sodium || form.cholesterol" class="mt-4 pt-4 border-t border-white border-opacity-20">
                <p class="text-xs uppercase tracking-wider text-purple-100 mb-2">Additional Nutrients</p>
                <div class="flex flex-wrap gap-2">
                  <span v-if="form.fiber" class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    Fiber: {{ form.fiber }}g
                  </span>
                  <span v-if="form.sugar" class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    Sugar: {{ form.sugar }}g
                  </span>
                  <span v-if="form.sodium" class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    Sodium: {{ form.sodium }}mg
                  </span>
                  <span v-if="form.cholesterol" class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    Cholesterol: {{ form.cholesterol }}mg
                  </span>
                </div>
              </div>
            </div>

            <!-- Error Display -->
            <transition name="slide-fade">
              <div v-if="foodStore.error" class="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-semibold text-red-800">Error creating food</h3>
                    <p class="text-sm text-red-700 mt-1">{{ foodStore.error }}</p>
                  </div>
                  <div class="ml-auto pl-3">
                    <button
                      @click="foodStore.clearError()"
                      class="inline-flex text-red-400 hover:text-red-500 focus:outline-none"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Success Message -->
            <transition name="slide-fade">
              <div v-if="showSuccess" class="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-semibold text-green-800">Food created successfully!</p>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Enhanced Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                @click="handleCancel"
                class="group flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <div class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </div>
              </button>
              
              <button
                type="submit"
                :disabled="foodStore.loading || !isFormValid"
                class="group flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02]"
              >
                <div v-if="foodStore.loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Food...</span>
                </div>
                <div v-else class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Food</span>
                </div>
              </button>
            </div>
          </div>
        </transition>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Animation classes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFoodStore } from '@/stores/food'

const router = useRouter()
const foodStore = useFoodStore()

const currentStep = ref(1)
const showSuccess = ref(false)

const form = ref({
  name: '',
  brand: '',
  category: '',
  barcode: '',
  servingSize: 100,
  servingUnit: 'g',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
  cholesterol: 0
})

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' &&
         form.value.category.trim() !== '' &&
         form.value.servingSize > 0 &&
         form.value.servingUnit.trim() !== '' &&
         form.value.calories >= 0 &&
         form.value.protein >= 0 &&
         form.value.carbs >= 0 &&
         form.value.fat >= 0
})

const handleCancel = () => {
  router.push('/food')
}

const createFood = async () => {
  if (!isFormValid.value) return
  
  try {
    // Clean up form data - match backend expectations
    const foodData = {
      name: form.value.name.trim(),
      brand: form.value.brand.trim() || undefined,
      category: form.value.category,
      barcode: form.value.barcode.trim() || undefined,
      servingSize: form.value.servingSize,
      servingUnit: form.value.servingUnit.trim(),
      calories: form.value.calories,
      protein: form.value.protein,
      carbs: form.value.carbs,
      fat: form.value.fat,
      fiber: form.value.fiber || undefined,
      sugar: form.value.sugar || undefined,
      sodium: form.value.sodium || undefined,
      cholesterol: form.value.cholesterol || undefined
    }
    
    const result = await foodStore.createFood(foodData)
    
    if (result.success) {
      // Show success message briefly before navigating
      showSuccess.value = true
      setTimeout(() => {
        router.push('/food')
      }, 1500)
    }
  } catch (error) {
    console.error('Failed to create food:', error)
  }
}
</script>