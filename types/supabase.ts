export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      estoque: {
        Row: {
          id: string;
          nome: string;
          tipo: string;
          unidade: string;
          quantidade: number;
        };
        Insert: {
          id?: string;
          nome: string;
          tipo: string;
          unidade: string;
          quantidade: number;
        };
        Update: Partial<Omit<Database['public']['Tables']['estoque']['Insert'], 'id'>>;
      };
      produtos_finalizados: {
        Row: {
          id: string;
          nome: string;
        };
        Insert: {
          id?: string;
          nome: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['produtos_finalizados']['Insert'], 'id'>>;
      };
      composicoes: {
        Row: {
          id: string;
          produto_finalizado_id: string;
          insumo_id: string;
          quantidade: number;
        };
        Insert: {
          id?: string;
          produto_finalizado_id: string;
          insumo_id: string;
          quantidade: number;
        };
        Update: Partial<Omit<Database['public']['Tables']['composicoes']['Insert'], 'id'>>;
      };
    };
  };
};
