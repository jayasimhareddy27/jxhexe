import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import {  fetchAIdataforDocument,fetchDocumentById, saveDocumentById } from './thunks';
import { clExtractionPhases } from '../../../../public/staticfiles/prompts/coverletter/index'; // CL Config
import { resumeextractionPhases} from '../../../../public/staticfiles/prompts/resume/index'; // CV Config

// Helper to get initial data for reset logic
const getPhaseInitialData = (phaseKey, type) => {
  const source = type === 'resume' ? resumeextractionPhases : clExtractionPhases;
  const phase = source.find(p => p.key === phaseKey);
  return phase ? phase.initial : null;
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setEditorMode: (state, action) => {
      state.activeId = action.payload.id;
      state.type = action.payload.type; // 'resume' or 'coverletter'
    },
    
    moveSection: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const order = state.formDataMap.designConfig.order;
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= order.length || toIndex >= order.length) return;

      const [moved] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, moved);
    },

    selectContainer: (state, action) => {
      state.formDataMap.designConfig.selectedContainer = action.payload;
    },

    clearSelectedContainer: (state) => {
      state.formDataMap.designConfig.selectedContainer = null;
    },

    updatePhase: (state, action) => {
      const { phaseKey, data } = action.payload;
      if (phaseKey === "designConfig") {
        state.formDataMap.designConfig = {
          ...state.formDataMap.designConfig,
          ...data
        };
      } else {
        state.formDataMap[phaseKey] = data;
      }
    },

    resetPhase: (state, action) => {
      const phaseKey = action.payload;
      const initialData = getPhaseInitialData(phaseKey, state.type);
      if (initialData !== null) {
        state.formDataMap[phaseKey] = initialData;
      }
    },

    addPhaseItem: (state, action) => {
      const { phaseKey, newItem } = action.payload;
      const current = state.formDataMap[phaseKey] || [];
      if (Array.isArray(current)) {
        state.formDataMap[phaseKey] = [...current, newItem];
      }
    },

    removePhaseItem: (state, action) => {
      const { phaseKey, index } = action.payload;
      const current = state.formDataMap[phaseKey] || [];
      if (Array.isArray(current)) {
        state.formDataMap[phaseKey] = current.filter((_, i) => i !== index);
      }
    },

    updateContainerStyle: (state, action) => {
      const { id, style } = action.payload;
      const containers = state.formDataMap.designConfig.containers;
      containers[id] = {
        ...(containers[id] || {}),
        style: {
          ...(containers[id]?.style || {}),
          ...style,
        },
      };
    },

    updateDesignConfig: (state, action) => {
      const { layout, containers, visibility } = action.payload;
      state.formDataMap.designConfig = {
        ...state.formDataMap.designConfig,
        layout: layout ?? state.formDataMap.designConfig?.layout ?? 'primary',
        containers: {
          ...state.formDataMap.designConfig?.containers,
          ...containers
        },
        visibility: {
          ...state.formDataMap.designConfig?.visibility,
          ...visibility
        }
      };
    }
  },

  extraReducers: (builder) => {
    builder
      // --- Unified Fetch (Resume or Cover Letter) ---
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.activeId = action.payload._id;
        state.type = action.payload.type; // Set during thunk execution

        const payloadData = action.payload || {};
        state.formDataMap = {
          ...payloadData,
          designConfig: {
            ...payloadData?.designConfig,
            layout: payloadData?.designConfig?.layout || 'primary',
            containers: payloadData?.designConfig?.containers || {},
            visibility: payloadData?.designConfig?.visibility || {},
            selectedContainer: null 
          }
        };      
      })

      // --- Unified Save ---
      .addCase(saveDocumentById.fulfilled, (state, action) => {
        const payloadData = action.payload || {};
        state.formDataMap = {
          ...payloadData,
          designConfig: {
            ...payloadData?.designConfig,
            layout: payloadData?.designConfig?.layout || 'primary',
            containers: payloadData?.designConfig?.containers || {},
            visibility: payloadData?.designConfig?.visibility || {}
          }
        };
      })

  }
});

export const {
  setEditorMode,
  selectContainer,
  clearSelectedContainer,
  updatePhase,
  resetPhase,
  addPhaseItem,
  removePhaseItem,
  updateContainerStyle,
  moveSection,
  updateDesignConfig,
} = editorSlice.actions;

export default editorSlice.reducer;