export interface UF {
  id: number;
  nome: string;
  sigla: string;
}

export interface Municipio {
  id: number;
  nome: string;
}

export const ibgeService = {
  async buscarEstados(): Promise<UF[]> {
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar estados');
      }

      const data: UF[] = await response.json();
      return data.sort((a, b) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      throw error;
    }
  },

  async buscarMunicipios(ufId: number): Promise<Municipio[]> {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar municípios');
      }

      const data: Municipio[] = await response.json();
      return data.sort((a, b) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      throw error;
    }
  },
};
