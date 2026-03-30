import { create } from 'zustand'

interface OrderState {
  templateId: string | null
  imageUrls: string[]
  titleText: string
  subtitleText: string
  setTemplate: (id: string) => void
  setImages: (urls: string[]) => void
  setText: (title: string, subtitle: string) => void
  reset: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  templateId: null,
  imageUrls: [],
  titleText: '',
  subtitleText: '',
  setTemplate: (id) => set({ templateId: id }),
  setImages: (urls) => set({ imageUrls: urls }),
  setText: (title, subtitle) => set({ titleText: title, subtitleText: subtitle }),
  reset: () => set({ templateId: null, imageUrls: [], titleText: '', subtitleText: '' })
}))
