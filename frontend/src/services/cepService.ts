interface CEPResponse {
  logradouro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

interface EnderecoData {
  endereco: string;
  cidade: string;
  estado: string;
}

export const buscarCepIBGE = async (cep: string): Promise<EnderecoData | null> => {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return null;
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data: CEPResponse = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      endereco: data.logradouro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};
