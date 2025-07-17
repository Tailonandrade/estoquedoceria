export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      materias_primas: {
        Row: {
          id: number
          nome: string
          quantidade: number
          unidade_id: number
          created_at: string
        }
        Insert: {
          id?: number
          nome: string
          quantidade: number
          unidade_id: number
          created_at?: string
        }
        Update: {
          id?: number
          nome?: string
          quantidade?: number
          unidade_id?: number
          created_at?: string
        }
      }

      produtos_finalizados: {
        Row: {
          id: number
          nome: string
          created_at: string
        }
        Insert: {
          id?: number
          nome: string
          created_at?: string
        }
        Update: {
          id?: number
          nome?: string
          created_at?: string
        }
      }

      composicoes: {
        Row: {
          id: number
          produto_finalizado_id: number
          materia_prima_id: number
          quantidade_utilizada: number
        }
        Insert: {
          id?: number
          produto_finalizado_id: number
          materia_prima_id: number
          quantidade_utilizada: number
        }
        Update: {
          id?: number
          produto_finalizado_id?: number
          materia_prima_id?: number
          quantidade_utilizada?: number
        }
      }

      saidas_estoque: {
        Row: {
          id: number
          materia_prima_id: number
          quantidade: number
          motivo: string
          created_at: string
        }
        Insert: {
          id?: number
          materia_prima_id: number
          quantidade: number
          motivo: string
          created_at?: string
        }
        Update: {
          id?: number
          materia_prima_id?: number
          quantidade?: number
          motivo?: string
          created_at?: string
        }
      }

      unidades_medida: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
      }
    }

    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
