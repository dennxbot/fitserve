<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center mb-4">
          <router-link
            to="/progress"
            class="btn btn-ghost mr-4"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Progress
          </router-link>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Weight Entries</h1>
        <p class="mt-2 text-gray-600">Manage your weight tracking history</p>
      </div>

      <!-- Actions -->
      <div class="mb-6 flex flex-wrap gap-4">
        <button
          @click="showAddWeight = true"
          class="btn btn-primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Weight Entry
        </button>
        
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Sort by:</label>
          <select v-model="sortBy" class="input w-auto">
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="weight-desc">Weight (Highest)</option>
            <option value="weight-asc">Weight (Lowest)</option>
          </select>
        </div>
        
        <button
          @click="refreshData"
          class="btn btn-ghost"
          :disabled="progressStore.loading"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="progressStore.loading" class="text-center py-8">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-600">Loading weight entries...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="progressStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700">{{ progressStore.error }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedEntries.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-5v.01M12 2l-3 3h6l-3-3z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No weight entries yet</h3>
        <p class="text-gray-600 mb-4">Start tracking your progress by adding your first weight entry.</p>
        <button @click="showAddWeight = true" class="btn btn-primary">
          Add Your First Entry
        </button>
      </div>

      <!-- Weight Entries List -->
      <div v-else class="space-y-4">
        <div
          v-for="entry in sortedEntries"
          :key="entry.id"
          class="card hover:shadow-md transition-shadow"
        >
          <div class="card-content">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ entry.weight }} kg</div>
                    <div class="text-sm text-gray-600">{{ formatDate(entry.recordedAt) }}</div>
                  </div>
                  
                  <div v-if="getWeightChange(entry)" class="flex items-center">
                    <div class="flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="{
                      'bg-green-100 text-green-800': getWeightChange(entry)! < 0,
                      'bg-red-100 text-red-800': getWeightChange(entry)! > 0,
                      'bg-gray-100 text-gray-800': getWeightChange(entry)! === 0
                    }">
                      <svg v-if="getWeightChange(entry)! < 0" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <svg v-else-if="getWeightChange(entry)! > 0" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      {{ getWeightChange(entry)! > 0 ? '+' : '' }}{{ getWeightChange(entry) }} kg
                    </div>
                  </div>
                </div>
                
                <div v-if="entry.notes" class="mt-2 text-sm text-gray-600">
                  {{ entry.notes }}
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  @click="editEntry(entry)"
                  class="btn btn-sm btn-ghost"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  @click="deleteEntry(entry.id)"
                  class="btn btn-sm btn-ghost text-red-600 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Weight Modal -->
    <div v-if="showAddWeight || editingEntry" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            {{ editingEntry ? 'Edit Weight Entry' : 'Add Weight Entry' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
            <input
              v-model.number="weightForm.weight"
              type="number"
              step="0.1"
              min="1"
              max="500"
              class="input w-full"
              placeholder="70.5"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              v-model="weightForm.date"
              type="date"
              class="input w-full"
              :max="today"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              v-model="weightForm.notes"
              rows="3"
              class="input w-full resize-none"
              placeholder="How are you feeling? Any observations?"
            ></textarea>
          </div>
          
          <div v-if="progressStore.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-sm text-red-700">{{ progressStore.error }}</p>
          </div>
          
          <div class="flex space-x-3">
            <button type="button" @click="closeModal" class="btn btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary flex-1" :disabled="progressStore.loading">
              <span v-if="progressStore.loading">
                {{ editingEntry ? 'Updating...' : 'Adding...' }}
              </span>
              <span v-else>
                {{ editingEntry ? 'Update Entry' : 'Add Entry' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import type { WeightEntry } from '@/types'

const progressStore = useProgressStore()

const showAddWeight = ref(false)
const editingEntry = ref<WeightEntry | null>(null)
const sortBy = ref('date-desc')

const weightForm = ref({
  weight: 0,
  date: new Date().toISOString().split('T')[0],
  notes: ''
})

const today = new Date().toISOString().split('T')[0]

const sortedEntries = computed(() => {
  const entries = [...progressStore.weightEntries]
  
  switch (sortBy.value) {
    case 'date-asc':
      return entries.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    case 'date-desc':
      return entries.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
    case 'weight-asc':
      return entries.sort((a, b) => a.weight - b.weight)
    case 'weight-desc':
      return entries.sort((a, b) => b.weight - a.weight)
    default:
      return entries
  }
})

const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const getWeightChange = (entry: WeightEntry): number | null => {
  const entries = sortedEntries.value
  const currentIndex = entries.findIndex(e => e.id === entry.id)
  
  if (currentIndex === -1 || currentIndex === entries.length - 1) return null
  
  const previousEntry = entries[currentIndex + 1]
  return Math.round((entry.weight - previousEntry.weight) * 10) / 10
}

const editEntry = (entry: WeightEntry) => {
  editingEntry.value = entry
  weightForm.value = {
    weight: entry.weight,
    date: entry.recordedAt ? new Date(entry.recordedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notes: entry.notes || ''
  }
}

const deleteEntry = async (entryId: string) => {
  if (confirm('Are you sure you want to delete this weight entry?')) {
    try {
      await progressStore.deleteWeightEntry(entryId)
      await refreshData()
    } catch (error) {
      console.error('Failed to delete weight entry:', error)
    }
  }
}

const closeModal = () => {
  showAddWeight.value = false
  editingEntry.value = null
  weightForm.value = {
    weight: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  }
  progressStore.clearError()
}

const submitForm = async () => {
  try {
    if (editingEntry.value) {
      await progressStore.updateWeightEntry(editingEntry.value.id, {
        weight: weightForm.value.weight,
        date: weightForm.value.date,
        notes: weightForm.value.notes.trim() || undefined
      })
    } else {
      await progressStore.addWeightEntry({
        weight: weightForm.value.weight,
        date: weightForm.value.date,
        notes: weightForm.value.notes.trim() || undefined
      })
    }
    
    closeModal()
    await refreshData()
  } catch (error) {
    console.error('Failed to save weight entry:', error)
  }
}

const refreshData = async () => {
  await Promise.all([
    progressStore.fetchWeightEntries(),
    progressStore.getProgressStats()
  ])
}

onMounted(async () => {
  await refreshData()
})
</script>